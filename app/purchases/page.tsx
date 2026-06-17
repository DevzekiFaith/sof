"use client";

import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { supabase } from "../../lib/supabase";
import { Download, Calendar, DollarSign, FileText } from "lucide-react";
import { getCourseById } from "../data/courses";

interface Purchase {
  id: string;
  course_id: string;
  course_title: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string;
  status: string;
  purchased_at: string;
}

export default function PurchaseHistoryPage() {
  const { currentUser } = useUser();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchPurchases = async () => {
      const { data, error } = await supabase
        .from('course_purchases')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('purchased_at', { ascending: false });

      if (error) {
        setPurchases([]);
      } else {
        setPurchases(data || []);
      }
      setLoading(false);
    };

    fetchPurchases();
  }, [currentUser]);

  const generateReceipt = (purchase: Purchase) => {
    const course = getCourseById(purchase.course_id);
    const logoBase64 = "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";
    const receiptContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${purchase.transaction_id}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 40px;
      background: #f5f5f5;
    }
    .receipt {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #1ed760;
      padding-bottom: 20px;
    }
    .logo {
      width: 150px;
      height: auto;
      margin-bottom: 10px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #121212;
      margin: 0;
    }
    .subtitle {
      color: #666;
      margin-top: 5px;
    }
    .section {
      margin: 20px 0;
    }
    .section-title {
      font-weight: bold;
      color: #1ed760;
      margin-bottom: 10px;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 1px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .label {
      color: #666;
    }
    .value {
      font-weight: 600;
      color: #121212;
    }
    .total {
      font-size: 24px;
      color: #1ed760;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #1ed760;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <img src="data:image/png;base64,${logoBase64}" alt="Origin Logo" class="logo" />
      <h1 class="title">ORIGIN</h1>
      <p class="subtitle">Formation for Life</p>
    </div>

    <div class="section">
      <div class="section-title">Transaction Details</div>
      <div class="row">
        <span class="label">Transaction ID</span>
        <span class="value">${purchase.transaction_id}</span>
      </div>
      <div class="row">
        <span class="label">Date</span>
        <span class="value">${new Date(purchase.purchased_at).toLocaleDateString()}</span>
      </div>
      <div class="row">
        <span class="label">Status</span>
        <span class="value" style="color: #1ed760;">${purchase.status.toUpperCase()}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Purchase Details</div>
      <div class="row">
        <span class="label">Course</span>
        <span class="value">${purchase.course_title}</span>
      </div>
      <div class="row">
        <span class="label">Amount</span>
        <span class="value total">${purchase.currency === 'NGN' ? '₦' : '$'}${purchase.amount.toFixed(2)}</span>
      </div>
      <div class="row">
        <span class="label">Payment Method</span>
        <span class="value">${purchase.payment_method}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Customer Information</div>
      <div class="row">
        <span class="label">Name</span>
        <span class="value">${currentUser?.name || 'N/A'}</span>
      </div>
      <div class="row">
        <span class="label">Email</span>
        <span class="value">${currentUser?.email || 'N/A'}</span>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for your purchase!</p>
      <p>Lifetime access to this course.</p>
      <p>© ${new Date().getFullYear()} Origin — Formation for Life</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${purchase.transaction_id}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <p className="text-white">Please sign in to view your purchase history.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ed760]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl font-black mb-8">Purchase History</h1>

        {purchases.length === 0 ? (
          <div className="bg-[#181818] rounded-xl p-8 border border-[#282828]">
            <p className="text-[#b3b3b3]">No purchases yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="bg-[#181818] rounded-xl p-6 border border-[#282828] hover:border-[#1ed760] transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{purchase.course_title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-[#b3b3b3]">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{purchase.currency === 'NGN' ? '₦' : '$'}{purchase.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(purchase.purchased_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{purchase.transaction_id}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => generateReceipt(purchase)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1ed760] hover:bg-[#1ed760]/80 text-black font-bold rounded-full transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
