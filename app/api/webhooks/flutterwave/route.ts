import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../lib/supabaseServer";
import { CURRENCY_CONFIG } from "../../../../lib/config";

export async function POST(request: NextRequest) {
  try {
    const supabaseServer = getSupabaseServer();
    const signature = request.headers.get("verif-hash");
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;

    // 1. Signature check if FLUTTERWAVE_SECRET_HASH is configured
    if (secretHash && signature !== secretHash) {
      console.error("[Flutterwave Webhook] Signature verification failed.");
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await request.json();
    const { event, data } = payload;

    // Flutterwave sends multiple events, we only care about completion
    if (event !== "charge.completed") {
      return NextResponse.json({ status: "ignored", event });
    }

    const transactionId = data.id;
    const txRef = data.tx_ref;
    const flwStatus = data.status;

    if (!transactionId || flwStatus !== "successful") {
      console.warn(`[Flutterwave Webhook] Transaction ${transactionId} is not successful (status: ${flwStatus})`);
      return NextResponse.json({ status: "ignored_unsuccessful", statusText: flwStatus });
    }

    // 2. Double verify with Flutterwave API (highly secure)
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (secretKey) {
      const verifyUrl = `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`;
      try {
        const verifyRes = await fetch(verifyUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
        });

        if (!verifyRes.ok) {
          throw new Error(`Verification API responded with status ${verifyRes.status}`);
        }

        const verifyData = await verifyRes.json();
        if (
          verifyData.status !== "success" ||
          verifyData.data.status !== "successful" ||
          verifyData.data.amount !== data.amount ||
          verifyData.data.currency !== data.currency
        ) {
          console.error("[Flutterwave Webhook] Server-to-server transaction verification failed:", verifyData);
          return new Response("Verification failed", { status: 400 });
        }
        console.log("[Flutterwave Webhook] Server-to-server validation succeeded for transaction ID:", transactionId);
      } catch (err) {
        console.error("[Flutterwave Webhook] Exception during verify API check:", err);
        return new Response("Internal verification error", { status: 500 });
      }
    } else {
      console.warn("[Flutterwave Webhook] FLUTTERWAVE_SECRET_KEY is missing. Skipping server-to-server verification.");
    }

    // 3. Extract custom metadata passed from checkout
    const meta = data.meta || {};
    const userId = meta.userId;
    const cartItemsRaw = meta.cartItems;

    if (!userId || !cartItemsRaw) {
      console.error("[Flutterwave Webhook] Missing userId or cartItems in metadata:", meta);
      return new Response("Missing metadata", { status: 400 });
    }

    let cartItems = [];
    try {
      cartItems = JSON.parse(cartItemsRaw);
    } catch (e) {
      console.error("[Flutterwave Webhook] Failed to parse cart items JSON:", e);
      return new Response("Invalid metadata format", { status: 400 });
    }

    // 4. Idempotency Check: Check if transaction is already recorded
    const { data: existingPurchase, error: checkError } = await supabaseServer
      .from("course_purchases")
      .select("id")
      .eq("transaction_id", String(transactionId))
      .maybeSingle();

    if (checkError) {
      console.error("[Flutterwave Webhook] Error checking existing purchase:", checkError);
      return new Response("Database query error", { status: 500 });
    }

    if (existingPurchase) {
      console.log(`[Flutterwave Webhook] Transaction ${transactionId} already processed. Skipping duplicates.`);
      return NextResponse.json({ status: "already_processed", transactionId });
    }

    // 5. Fulfill purchases
    const giftItems = cartItems.filter((item: any) => item.isGift);
    const nonGiftItems = cartItems.filter((item: any) => !item.isGift);

    // Insert gift orders
    if (giftItems.length > 0) {
      const giftPurchases = giftItems.map((item: any) => {
        const basePrice = item.priceUSD || 14;
        const itemAmount = data.currency === "NGN"
          ? basePrice * CURRENCY_CONFIG.NGN_TO_USD_RATE
          : data.currency === "EUR"
          ? basePrice * CURRENCY_CONFIG.EUR_TO_USD_RATE
          : data.currency === "GBP"
          ? basePrice * CURRENCY_CONFIG.GBP_TO_USD_RATE
          : basePrice;

        return {
          purchaser_id: userId,
          recipient_email: item.recipientEmail || "",
          recipient_name: item.recipientName || "",
          course_id: item.id,
          amount: parseFloat(itemAmount.toFixed(2)),
          currency: data.currency,
          status: "completed",
          gift_message: item.giftMessage || "",
        };
      });

      const { error: giftError } = await supabaseServer.from("gift_orders").insert(giftPurchases);
      if (giftError) {
        console.error("[Flutterwave Webhook] Error saving gift orders:", giftError);
        return new Response("Gift order insertion error", { status: 500 });
      }
      console.log(`[Flutterwave Webhook] Saved ${giftPurchases.length} gift orders successfully.`);
    }

    // Insert course purchases
    if (nonGiftItems.length > 0) {
      const purchasesToInsert = nonGiftItems.map((item: any) => {
        const basePrice = item.priceUSD || 14;
        const itemAmount = data.currency === "NGN"
          ? basePrice * CURRENCY_CONFIG.NGN_TO_USD_RATE
          : data.currency === "EUR"
          ? basePrice * CURRENCY_CONFIG.EUR_TO_USD_RATE
          : data.currency === "GBP"
          ? basePrice * CURRENCY_CONFIG.GBP_TO_USD_RATE
          : basePrice;

        return {
          user_id: userId,
          course_id: item.id,
          course_title: item.title,
          amount: parseFloat(itemAmount.toFixed(2)),
          currency: data.currency,
          payment_method: "flutterwave",
          transaction_id: String(transactionId),
          status: "completed",
          purchased_at: new Date().toISOString(),
        };
      });

      const { error: insertError } = await supabaseServer.from("course_purchases").insert(purchasesToInsert);
      if (insertError) {
        console.error("[Flutterwave Webhook] Error inserting course purchases:", insertError);
        return new Response("Course purchase insertion error", { status: 500 });
      }
      console.log(`[Flutterwave Webhook] Saved ${purchasesToInsert.length} course purchases successfully.`);

      // Load existing user profile to fetch preferences
      const { data: userProfile, error: profileError } = await supabaseServer
        .from("profiles")
        .select("preferences")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.warn("[Flutterwave Webhook] Failed to fetch user profile for preferences update:", profileError);
      } else {
        const currentPrefs = userProfile?.preferences || {};
        const currentOwned = Array.isArray(currentPrefs.ownedCourseIds) ? currentPrefs.ownedCourseIds : [];
        
        // Merge new owned course IDs
        const newOwned = [...currentOwned];
        for (const item of nonGiftItems) {
          if (!newOwned.includes(item.id)) {
            newOwned.push(item.id);
          }
        }

        // Update preferences in Supabase
        const { error: prefError } = await supabaseServer
          .from("profiles")
          .update({
            preferences: { ...currentPrefs, ownedCourseIds: newOwned }
          } as any)
          .eq("id", userId);

        if (prefError) {
          console.warn("[Flutterwave Webhook] Failed to update owned courses in user preferences:", prefError);
        } else {
          console.log("[Flutterwave Webhook] Updated user ownedCourseIds preferences:", newOwned);
        }
      }
    }

    return NextResponse.json({ status: "success", transactionId });
  } catch (err: any) {
    console.error("[Flutterwave Webhook] Internal Server Error:", err);
    return new Response(`Server error: ${err.message}`, { status: 500 });
  }
}
