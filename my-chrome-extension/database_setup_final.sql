-- Complete database reset and setup for Tabs4Palestine donation tracking
-- Run these commands in your Supabase SQL editor

-- Drop existing tables if they exist (this will remove all data!)
DROP TABLE IF EXISTS sponsored_clicks CASCADE;
DROP TABLE IF EXISTS tab_opens CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create tab_opens table to track individual tab opens (supports anonymous users)
CREATE TABLE tab_opens (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  ad_count INTEGER NOT NULL DEFAULT 1,
  donation_amount DECIMAL(10,4) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sponsored_clicks table to track sponsored shortcut clicks
CREATE TABLE sponsored_clicks (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  shortcut_name TEXT NOT NULL,
  shortcut_url TEXT NOT NULL,
  donation_amount DECIMAL(10,4) NOT NULL DEFAULT 0.50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT,
  ad_count INTEGER NOT NULL DEFAULT 1,
  total_donations DECIMAL(10,2) NOT NULL DEFAULT 0,
  sponsored_donations DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_tab_opens_user_id ON tab_opens(user_id);
CREATE INDEX idx_tab_opens_created_at ON tab_opens(created_at);
CREATE INDEX idx_sponsored_clicks_user_id ON sponsored_clicks(user_id);
CREATE INDEX idx_sponsored_clicks_created_at ON sponsored_clicks(created_at);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Enable Row Level Security (RLS)
ALTER TABLE tab_opens ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsored_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for tab_opens table (allow anonymous inserts)
CREATE POLICY "Anyone can insert tab opens" ON tab_opens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view tab opens" ON tab_opens
  FOR SELECT USING (true);

-- Create policies for sponsored_clicks table
CREATE POLICY "Anyone can insert sponsored clicks" ON sponsored_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view sponsored clicks" ON sponsored_clicks
  FOR SELECT USING (true);

-- Create policies for profiles table
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to calculate total donations (including sponsored clicks)
CREATE OR REPLACE FUNCTION calculate_total_donations()
RETURNS DECIMAL(10,2) AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(donation_amount) FROM tab_opens) + 
    (SELECT SUM(donation_amount) FROM sponsored_clicks), 
    0
  );
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON tab_opens TO anon, authenticated;
GRANT ALL ON sponsored_clicks TO anon, authenticated;
GRANT ALL ON profiles TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE tab_opens_id_seq TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE sponsored_clicks_id_seq TO anon, authenticated;
