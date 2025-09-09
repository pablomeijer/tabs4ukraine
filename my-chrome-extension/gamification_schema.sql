-- Gamification Database Schema for Tabs4Palestine
-- This extends the existing database with gamification features

-- Users table (extends existing profiles)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_raised DECIMAL(10,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rank INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tier VARCHAR(20) DEFAULT 'beginner';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invite_code VARCHAR(10) UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity_date DATE DEFAULT CURRENT_DATE;

-- Friends table
CREATE TABLE IF NOT EXISTS friends (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, friend_id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_type VARCHAR(50) NOT NULL,
  badge_name VARCHAR(100) NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_type)
);

-- Badge definitions table
CREATE TABLE IF NOT EXISTS badge_definitions (
  id SERIAL PRIMARY KEY,
  badge_type VARCHAR(50) UNIQUE NOT NULL,
  badge_name VARCHAR(100) NOT NULL,
  badge_description TEXT,
  badge_icon VARCHAR(20),
  requirement_type VARCHAR(50), -- tabs_opened, amount_raised, friends_invited, streak_days
  requirement_value DECIMAL(10,2),
  tier VARCHAR(20)
);

-- Community stats table
CREATE TABLE IF NOT EXISTS community_stats (
  id SERIAL PRIMARY KEY,
  stat_date DATE DEFAULT CURRENT_DATE,
  total_users INTEGER DEFAULT 0,
  total_raised DECIMAL(12,2) DEFAULT 0,
  total_tabs_opened INTEGER DEFAULT 0,
  total_sponsored_clicks INTEGER DEFAULT 0,
  monthly_raised DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(stat_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_total_raised ON profiles(total_raised DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_rank ON profiles(rank);
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles(tier);
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON friends(friend_id);
CREATE INDEX IF NOT EXISTS idx_friends_status ON friends(status);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_badge_type ON achievements(badge_type);
CREATE INDEX IF NOT EXISTS idx_community_stats_date ON community_stats(stat_date);

-- Row Level Security (RLS)
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Friends policies
CREATE POLICY "Users can view their own friends" ON friends
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can add friends" ON friends
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update friend status" ON friends
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Achievements policies
CREATE POLICY "Users can view their own achievements" ON achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements" ON achievements
  FOR INSERT WITH CHECK (true);

-- Badge definitions policies
CREATE POLICY "Anyone can view badge definitions" ON badge_definitions
  FOR SELECT USING (true);

-- Community stats policies
CREATE POLICY "Anyone can view community stats" ON community_stats
  FOR SELECT USING (true);

CREATE POLICY "System can insert community stats" ON community_stats
  FOR INSERT WITH CHECK (true);

-- Functions for gamification
-- Function to calculate user rank
CREATE OR REPLACE FUNCTION calculate_user_rank()
RETURNS TRIGGER AS $$
BEGIN
  -- Update ranks based on total_raised
  WITH ranked_users AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY total_raised DESC) as new_rank
    FROM profiles
    WHERE total_raised > 0
  )
  UPDATE profiles 
  SET rank = ranked_users.new_rank
  FROM ranked_users
  WHERE profiles.id = ranked_users.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update ranks when total_raised changes
DROP TRIGGER IF EXISTS update_user_rank ON profiles;
CREATE TRIGGER update_user_rank
  AFTER UPDATE OF total_raised ON profiles
  FOR EACH STATEMENT
  EXECUTE FUNCTION calculate_user_rank();

-- Function to calculate user tier
CREATE OR REPLACE FUNCTION calculate_user_tier(total_raised DECIMAL)
RETURNS VARCHAR AS $$
BEGIN
  IF total_raised >= 100 THEN
    RETURN 'champion';
  ELSIF total_raised >= 10 THEN
    RETURN 'advocate';
  ELSIF total_raised >= 1 THEN
    RETURN 'supporter';
  ELSE
    RETURN 'beginner';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update user tier
CREATE OR REPLACE FUNCTION update_user_tier()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tier = calculate_user_tier(NEW.total_raised);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update tier when total_raised changes
DROP TRIGGER IF EXISTS update_user_tier_trigger ON profiles;
CREATE TRIGGER update_user_tier_trigger
  BEFORE UPDATE OF total_raised ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_tier();

-- Function to generate invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS VARCHAR AS $$
DECLARE
  code VARCHAR(10);
  exists_count INTEGER;
BEGIN
  LOOP
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    SELECT COUNT(*) INTO exists_count FROM profiles WHERE invite_code = code;
    IF exists_count = 0 THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to update daily streak
CREATE OR REPLACE FUNCTION update_daily_streak(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_streak INTEGER;
  last_activity DATE;
BEGIN
  SELECT daily_streak, last_activity_date INTO current_streak, last_activity
  FROM profiles WHERE id = user_id;
  
  IF last_activity = CURRENT_DATE THEN
    -- Already updated today
    RETURN current_streak;
  ELSIF last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    UPDATE profiles SET daily_streak = current_streak + 1, last_activity_date = CURRENT_DATE WHERE id = user_id;
    RETURN current_streak + 1;
  ELSE
    -- Streak broken, reset to 1
    UPDATE profiles SET daily_streak = 1, last_activity_date = CURRENT_DATE WHERE id = user_id;
    RETURN 1;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Insert default badge definitions
INSERT INTO badge_definitions (badge_type, badge_name, badge_description, badge_icon, requirement_type, requirement_value, tier) VALUES
('first_dollar', 'First Dollar', 'Raised your first dollar for Palestine', '💰', 'amount_raised', 1.00, 'beginner'),
('hundred_tabs', 'Century Tabs', 'Opened 100 tabs', '📊', 'tabs_opened', 100, 'beginner'),
('daily_streak_7', 'Week Warrior', '7-day browsing streak', '🔥', 'streak_days', 7, 'supporter'),
('daily_streak_30', 'Month Master', '30-day browsing streak', '⭐', 'streak_days', 30, 'advocate'),
('ten_dollars', 'Ten Dollar Hero', 'Raised $10 for Palestine', '💎', 'amount_raised', 10.00, 'supporter'),
('hundred_dollars', 'Century Champion', 'Raised $100 for Palestine', '👑', 'amount_raised', 100.00, 'champion'),
('friend_inviter', 'Social Butterfly', 'Invited 3 friends', '🦋', 'friends_invited', 3, 'supporter'),
('community_builder', 'Community Builder', 'Invited 10 friends', '🏗️', 'friends_invited', 10, 'advocate')
ON CONFLICT (badge_type) DO NOTHING;

-- Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
