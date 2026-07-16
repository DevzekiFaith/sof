import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseServer();
    const { error } = await supabaseAdmin.from('newsletter_subscribers').insert({ email });

    if (error) {
      // 23505 is Supabase's unique constraint violation (already subscribed)
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already subscribed' }, { status: 200 });
      }
      console.error('API Subscription database error:', error.message, 'Code:', error.code);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('API Subscription handler error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
