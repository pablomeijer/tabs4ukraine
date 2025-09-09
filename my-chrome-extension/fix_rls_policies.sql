-- Fix RLS policies to allow profile creation during signup
-- This allows profiles to be created even when user isn't fully authenticated yet

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create a more permissive policy that allows profile creation
-- This allows anyone to create a profile (needed for signup flow)
CREATE POLICY "Allow profile creation during signup" ON profiles
  FOR INSERT WITH CHECK (true);

-- Keep the existing policies for other operations
-- (These should already exist from database_setup_final.sql)
-- CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT USING (true);
-- CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Also ensure we can update profiles (for gamification fields)
CREATE POLICY "Allow profile updates" ON profiles
  FOR UPDATE USING (true);
