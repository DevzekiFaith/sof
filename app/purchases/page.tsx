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
    const logoBase64 = "iVBORw0KGgoAAAANSUhEUgAAAG8AAABgCAYAAAATkyy1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAABRNSURBVHhe7V1rcF3Vdf7O1b1Xjyu/JAcwsi0Zu5aLLePMYEJxeUyH1AFjYzMlpO3QTAoNEJ4JM52ETHmUkmQ6GQLjuJR6kjZDmpbJgB88gnlMHAI1Txewha1gbGPZ2Ma2LGw9LN0r7f7Ya+2z9zrn3JekY6mj78zxuWvvb6+zz1nru2vfh669uro6hXGMSDKhwgGg+NUmJZZWImJW30KkyUMlF9Uj2bUR5UUqzrNqI8WpyW1z+AElv/f6N6F4tBv/W8NCAVOo35/DkUUpG22/3592hH88uY1zW/452Rcc/h8j8y+Pj2NkwVuo8A/r8A/wKMP9P4yB0QG/tP7u6G9i8IDgV4j3/Q/b/w/iA6A/jP5t+2lH5rT5N6B+O9K/fXk+jJp/QPD0w02Fru86+0Y712n2jfa5fJ//3x6b/2a/HsdY5yEaJ0cweKDTB4U+KExm33Y9H0z6t2H22fLp22DXZgG/+mifP62M2gEwPvL2p+C4rG83/W9t92G/2+Zc69+u5cOD6fXZt0+aR+AHz/79X/yvjA8P+D67x1r35tH+qYd74e/3p3H2vU3H3pGHB/zP26j75uV3nrbzH4KHD6bXeZ+2D+/bMflk3j7pG+V65D39XqXhOPr1YtQED/SUD/qUD4x5O332aTPw/w128B+2/R7p77Z91j2C/+y2fdoP2s2p2+74f2/PZt83H32efYvY9m1DzzP/G2w/Zf8q6J2a/+y52cprnJ3uB9G3/d12R+vD4IH73f5tO+9uO9eZt3/2Gf0Zbfb9oD/zF31C/X2jYwP1f0aV2Q0/hQ7CjI56pBcOIPHlKUhMqQzclIAtbh7f0oBNCigvUnG+8kLbpQ39XmX21YPIvnwAg4fcP30uJjDFcBgjHjyZ8aD4V5pSe/PpaKlvwuzqKZicrMTkZDr05DzkOWkK5iHP9mafW7v7sbV7N7ae2IHNx2+BvMbWjb43Hrn/QsVrDF3XQkUqXgsqzzQisbgBiS9PQWJqRWDwKluQZRJMuyvOfg/w35l77x58564DGPjvX/P/2T9PGzTAST3IuW5x0/iWBmya1YDVc8eQd24mlWnbW6R6Gj7/0P+8Q/NPOzKnzfe5W/t527H5Mv/K9sX+7Vw52tZ+kLbgX0b1xH8z/t9bE/63Z/x3l7a7522f67Z227m47Rz5YNuZ519Tff+K/DNP22/gB0X25fM22uYmXlG4bW/tX758O/g/bxT/5502W/iP7B+w5Wjb9hbp9922vQz/2W37dICeZ/5323kP+59v+z2w2/Yy3OGSSTQ/1E842D3Z9x3d611r/3y7dJ/e/W0/b6P2k3a8j+x1sWvy/bpv+7vtr/T7t9/h2mGg+g84/D9G5Rle4b8m2b1P3mUqT+500/N93UjK9t/79n30A6T2779t2u2/pvyYv/k7d92f7XwX/T/yv2b9t5e679/W3nfVd2z68U5D/kP+U/+pT8x/a7t/v7511n9/0o+u6d7u/+pP/1z/d72s2p/+qR/+2v0z2R/fXg3s+2y0bX/xP3/6L4O2P4vF9H/e2n8P/xH/Z7x7V90/b9v45+x/x06f/Y71x4L/94g/f2P8O/+tT+Y2j4v4x1BqUYTjGIj9WkCK6/5hK34F9yW+Rk+L9sHMNwDIX/B1n/A6D3b09rAAAAAElFTkSuQmCC";
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
      border-bottom: 2px solid #60a5fa;
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
      color: #60a5fa;
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
      color: #60a5fa;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #60a5fa;
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
        <span class="value" style="color: #60a5fa;">${purchase.status.toUpperCase()}</span>
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#60a5fa]" />
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
                className="bg-[#181818] rounded-xl p-6 border border-[#282828] hover:border-[#60a5fa] transition-colors"
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
                    className="flex items-center gap-2 px-4 py-2 bg-[#60a5fa] hover:bg-[#60a5fa]/80 text-black font-bold rounded-full transition-colors"
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
