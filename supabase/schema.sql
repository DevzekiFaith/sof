-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'premium')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  theme TEXT DEFAULT 'dark',
  offline_settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gamification stats table
CREATE TABLE IF NOT EXISTS gamification_stats (
  user_id UUID REFERENCES profiles(id) PRIMARY KEY,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_active_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  achievement_id TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  xp_reward INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Friends table
CREATE TABLE IF NOT EXISTS friends (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Course progress table
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Daily stats table
CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  time_spent_minutes INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('friend_request', 'achievement', 'course_complete', 'streak', 'system')),
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Podcast playback state table
CREATE TABLE IF NOT EXISTS podcast_playback_state (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  current_edu_cast_id TEXT,
  current_position INTEGER DEFAULT 0,
  is_playing BOOLEAN DEFAULT false,
  playback_speed REAL DEFAULT 1.0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning history table
CREATE TABLE IF NOT EXISTS learning_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  module_index INTEGER,
  time_spent INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON friends(friend_id);
CREATE INDEX IF NOT EXISTS idx_friends_status ON friends(status);
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_id ON daily_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_learning_history_user_id ON learning_history(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_history_course_id ON learning_history(course_id);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_playback_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Profiles: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Gamification stats: Users can view their own stats
DROP POLICY IF EXISTS "Users can view own gamification stats" ON gamification_stats;
CREATE POLICY "Users can view own gamification stats" ON gamification_stats
  FOR SELECT USING (auth.uid() = user_id);

-- Gamification stats: Users can update their own stats
DROP POLICY IF EXISTS "Users can update own gamification stats" ON gamification_stats;
CREATE POLICY "Users can update own gamification stats" ON gamification_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Achievements: Users can view their own achievements
DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;
CREATE POLICY "Users can view own achievements" ON achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Friends: Users can view their own friends
DROP POLICY IF EXISTS "Users can view own friends" ON friends;
CREATE POLICY "Users can view own friends" ON friends
  FOR SELECT USING (auth.uid() = user_id);

-- Friends: Users can manage their own friendships
DROP POLICY IF EXISTS "Users can manage own friendships" ON friends;
CREATE POLICY "Users can manage own friendships" ON friends
  FOR ALL USING (auth.uid() = user_id);

-- Course progress: Users can view their own progress
DROP POLICY IF EXISTS "Users can view own course progress" ON course_progress;
CREATE POLICY "Users can view own course progress" ON course_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Course progress: Users can update their own progress
DROP POLICY IF EXISTS "Users can update own course progress" ON course_progress;
CREATE POLICY "Users can update own course progress" ON course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own course progress update" ON course_progress;
CREATE POLICY "Users can update own course progress update" ON course_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Daily stats: Users can view their own stats
DROP POLICY IF EXISTS "Users can view own daily stats" ON daily_stats;
CREATE POLICY "Users can view own daily stats" ON daily_stats
  FOR SELECT USING (auth.uid() = user_id);

-- Daily stats: Users can update their own stats
DROP POLICY IF EXISTS "Users can update own daily stats" ON daily_stats;
CREATE POLICY "Users can update own daily stats" ON daily_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own daily stats update" ON daily_stats;
CREATE POLICY "Users can update own daily stats update" ON daily_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Notifications: Users can view their own notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Notifications: Users can update their own notifications
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Notifications: System can create notifications for users
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Podcast playback state: Users can view their own state
DROP POLICY IF EXISTS "Users can view own podcast state" ON podcast_playback_state;
CREATE POLICY "Users can view own podcast state" ON podcast_playback_state
  FOR SELECT USING (auth.uid() = user_id);

-- Podcast playback state: Users can update their own state
DROP POLICY IF EXISTS "Users can update own podcast state" ON podcast_playback_state;
CREATE POLICY "Users can update own podcast state" ON podcast_playback_state
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own podcast state update" ON podcast_playback_state
  FOR UPDATE USING (auth.uid() = user_id);

-- Learning history: Users can view their own history
DROP POLICY IF EXISTS "Users can view own learning history" ON learning_history;
CREATE POLICY "Users can view own learning history" ON learning_history
  FOR SELECT USING (auth.uid() = user_id);

-- Learning history: Users can add their own history
DROP POLICY IF EXISTS "Users can add own learning history" ON learning_history;
CREATE POLICY "Users can add own learning history" ON learning_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name')
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.gamification_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Leaderboard view (for global leaderboard)
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY gs.total_xp DESC) as rank,
  p.id as user_id,
  p.name,
  p.avatar_url as avatar,
  gs.level,
  gs.total_xp,
  gs.streak_days as streak
FROM profiles p
JOIN gamification_stats gs ON p.id = gs.user_id
ORDER BY gs.total_xp DESC
LIMIT 100;

-- Weekly leaderboard view
CREATE OR REPLACE VIEW weekly_leaderboard_view AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(ds.xp_earned), 0) DESC) as rank,
  p.id as user_id,
  p.name,
  p.avatar_url as avatar,
  gs.level,
  COALESCE(SUM(ds.xp_earned), 0) as total_xp,
  gs.streak_days as streak
FROM profiles p
JOIN gamification_stats gs ON p.id = gs.user_id
LEFT JOIN daily_stats ds ON p.id = ds.user_id AND ds.date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY p.id, p.name, p.avatar_url, gs.level, gs.streak_days
ORDER BY total_xp DESC
LIMIT 100;

-- Enable Realtime for notifications (after tables are created)
-- Note: These may fail if tables are already in the publication, which is fine
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'friends'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE friends;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'podcast_playback_state'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE podcast_playback_state;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'learning_history'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE learning_history;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error adding tables to realtime publication (may already exist): %', SQLERRM;
END $$;
