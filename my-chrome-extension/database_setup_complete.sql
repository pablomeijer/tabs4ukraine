-- Complete Database Setup for Tabs4Palestine Extension
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
-- This table stores user profile information
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    username TEXT,
    ad_count INTEGER DEFAULT 1,
    total_donations DECIMAL(10,2) DEFAULT 0,
    sponsored_donations DECIMAL(10,2) DEFAULT 0,
    total_raised DECIMAL(10,2) DEFAULT 0,
    rank INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'bronze',
    invite_code TEXT UNIQUE,
    daily_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TAB_OPENS TABLE
-- This table tracks when users open new tabs
CREATE TABLE IF NOT EXISTS tab_opens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Can be UUID for logged users or anonymous ID
    ad_count INTEGER NOT NULL,
    donation_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SPONSORED_CLICKS TABLE
-- This table tracks clicks on sponsored shortcuts
CREATE TABLE IF NOT EXISTS sponsored_clicks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Can be UUID for logged users or anonymous ID
    shortcut_name TEXT NOT NULL,
    shortcut_url TEXT NOT NULL,
    donation_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ACHIEVEMENTS TABLE
-- This table stores user achievements/badges
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_type TEXT NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_type)
);

-- 5. COMMUNITY_STATS TABLE
-- This table stores daily community statistics
CREATE TABLE IF NOT EXISTS community_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    stat_date DATE NOT NULL UNIQUE,
    total_users INTEGER DEFAULT 0,
    total_raised DECIMAL(10,2) DEFAULT 0,
    total_tabs_opened INTEGER DEFAULT 0,
    total_sponsored_clicks INTEGER DEFAULT 0,
    monthly_raised DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tab_opens_user_id ON tab_opens(user_id);
CREATE INDEX IF NOT EXISTS idx_tab_opens_created_at ON tab_opens(created_at);
CREATE INDEX IF NOT EXISTS idx_sponsored_clicks_user_id ON sponsored_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_sponsored_clicks_created_at ON sponsored_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_total_raised ON profiles(total_raised);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tab_opens ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsored_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Tab opens policies (allow anonymous users to insert)
CREATE POLICY "Anyone can insert tab opens" ON tab_opens
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own tab opens" ON tab_opens
    FOR SELECT USING (user_id = auth.uid()::text OR user_id LIKE 'anonymous_%');

-- Sponsored clicks policies (allow anonymous users to insert)
CREATE POLICY "Anyone can insert sponsored clicks" ON sponsored_clicks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own sponsored clicks" ON sponsored_clicks
    FOR SELECT USING (user_id = auth.uid()::text OR user_id LIKE 'anonymous_%');

-- Achievements policies
CREATE POLICY "Users can view their own achievements" ON achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Community stats policies (read-only for everyone)
CREATE POLICY "Anyone can view community stats" ON community_stats
    FOR SELECT USING (true);

CREATE POLICY "Only service role can modify community stats" ON community_stats
    FOR ALL USING (auth.role() = 'service_role');

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION create_user_profile(
    user_id UUID,
    user_email TEXT,
    user_username TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    -- Insert profile if it doesn't exist
    INSERT INTO profiles (id, email, username, ad_count, total_donations, sponsored_donations, total_raised, invite_code)
    VALUES (
        user_id,
        user_email,
        COALESCE(user_username, split_part(user_email, '@', 1)),
        1,
        0,
        0,
        0,
        upper(substring(md5(random()::text) from 1 for 8))
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Return success
    result := json_build_object(
        'success', true,
        'message', 'Profile created successfully'
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object(
            'success', false,
            'message', SQLERRM
        );
        RETURN result;
END;
$$;

-- Function to update daily streak
CREATE OR REPLACE FUNCTION update_daily_streak(user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    last_activity DATE;
    current_streak INTEGER;
BEGIN
    -- Get the last activity date from tab_opens
    SELECT MAX(created_at::DATE) INTO last_activity
    FROM tab_opens
    WHERE tab_opens.user_id = user_id::TEXT;
    
    -- If no activity found, set streak to 0
    IF last_activity IS NULL THEN
        current_streak := 0;
    ELSE
        -- Calculate streak based on consecutive days
        current_streak := (
            SELECT COUNT(*)::INTEGER
            FROM generate_series(
                GREATEST(last_activity - INTERVAL '30 days', CURRENT_DATE - INTERVAL '30 days'),
                last_activity,
                INTERVAL '1 day'
            ) AS day
            WHERE day::DATE IN (
                SELECT DISTINCT created_at::DATE
                FROM tab_opens
                WHERE tab_opens.user_id = user_id::TEXT
                AND created_at::DATE >= day::DATE
            )
            ORDER BY day DESC
            LIMIT 1
        );
    END IF;
    
    -- Update the user's streak
    UPDATE profiles
    SET daily_streak = current_streak,
        updated_at = NOW()
    WHERE id = user_id;
    
    RETURN current_streak;
END;
$$;

-- Function to update user ranks and tiers
CREATE OR REPLACE FUNCTION update_user_ranks()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update ranks based on total_raised (descending order)
    WITH ranked_users AS (
        SELECT id, total_raised,
               ROW_NUMBER() OVER (ORDER BY total_raised DESC) as new_rank
        FROM profiles
        WHERE total_raised > 0
    )
    UPDATE profiles
    SET rank = ranked_users.new_rank,
        tier = CASE
            WHEN ranked_users.total_raised >= 1000 THEN 'diamond'
            WHEN ranked_users.total_raised >= 500 THEN 'platinum'
            WHEN ranked_users.total_raised >= 100 THEN 'gold'
            WHEN ranked_users.total_raised >= 50 THEN 'silver'
            ELSE 'bronze'
        END,
        updated_at = NOW()
    FROM ranked_users
    WHERE profiles.id = ranked_users.id;
END;
$$;

-- Trigger to automatically update ranks when total_raised changes
CREATE OR REPLACE FUNCTION trigger_update_ranks()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only update if total_raised changed
    IF OLD.total_raised IS DISTINCT FROM NEW.total_raised THEN
        PERFORM update_user_ranks();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_ranks_trigger
    AFTER UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_ranks();

-- Insert some sample data (optional)
-- You can remove this section if you don't want sample data

-- Insert a sample community stat
INSERT INTO community_stats (stat_date, total_users, total_raised, total_tabs_opened, total_sponsored_clicks, monthly_raised)
VALUES (CURRENT_DATE, 0, 0, 0, 0, 0)
ON CONFLICT (stat_date) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
