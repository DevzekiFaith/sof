-- Course Purchases Table
CREATE TABLE IF NOT EXISTS course_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id VARCHAR(255) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'completed',
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    receipt_url TEXT
);

-- Enable RLS
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_purchases
DROP POLICY IF EXISTS "Users can view their own course purchases" ON course_purchases;
CREATE POLICY "Users can view their own course purchases"
  ON course_purchases FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own course purchases" ON course_purchases;
CREATE POLICY "Users can insert their own course purchases"
  ON course_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_course_purchases_user ON course_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_course ON course_purchases(course_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_transaction ON course_purchases(transaction_id);
