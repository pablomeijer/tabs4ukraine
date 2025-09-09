-- Create a function to create user profiles without requiring authentication
-- This function can be called during signup when the user isn't fully authenticated yet

CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_username TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Insert the profile
  INSERT INTO profiles (
    id,
    email,
    username,
    ad_count,
    total_donations,
    sponsored_donations
  ) VALUES (
    user_id,
    user_email,
    COALESCE(user_username, split_part(user_email, '@', 1)),
    1,
    0,
    0
  );
  
  -- Return success
  result := json_build_object(
    'success', true,
    'message', 'Profile created successfully'
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return error
    result := json_build_object(
      'success', false,
      'message', SQLERRM
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION create_user_profile(UUID, TEXT, TEXT) TO anon, authenticated;
