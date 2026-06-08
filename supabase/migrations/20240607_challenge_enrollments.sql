-- Challenge Enrollments Table
CREATE TABLE IF NOT EXISTS challenge_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id VARCHAR(255) NOT NULL,
    challenge_title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'enrolled',
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE challenge_enrollments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE challenge_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for challenge_enrollments
DROP POLICY IF EXISTS "Users can view their own challenge enrollments" ON challenge_enrollments;
CREATE POLICY "Users can view their own challenge enrollments"
  ON challenge_enrollments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own challenge enrollments" ON challenge_enrollments;
CREATE POLICY "Users can insert their own challenge enrollments"
  ON challenge_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own challenge enrollments" ON challenge_enrollments;
CREATE POLICY "Users can update their own challenge enrollments"
  ON challenge_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own challenge enrollments" ON challenge_enrollments;
CREATE POLICY "Users can delete their own challenge enrollments"
  ON challenge_enrollments FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_challenge_enrollments_user ON challenge_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_enrollments_challenge ON challenge_enrollments(challenge_id);
