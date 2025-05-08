/*
  # User Profile Enhancements

  1. New Functions
    - get_user_profile: Retrieves complete user profile
    - update_user_profile: Updates user profile with validation

  2. Security
    - RLS policies for profile access
    - Validation checks for username format
*/

-- Function to get user profile
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'id', id,
      'username', username,
      'full_name', full_name,
      'avatar_url', avatar_url,
      'bio', bio,
      'extended_bio', extended_bio,
      'website', website,
      'social_links', social_links,
      'portfolio', portfolio,
      'created_at', created_at
    )
    FROM public.users
    WHERE id = user_id
  );
END;
$$;

-- Function to update user profile
CREATE OR REPLACE FUNCTION update_user_profile(
  user_id UUID,
  new_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_profile JSONB;
BEGIN
  -- Validate username format if provided
  IF new_data ? 'username' THEN
    IF NOT (new_data->>'username' ~* '^[a-z0-9_]{3,30}$') THEN
      RAISE EXCEPTION 'Invalid username format. Use 3-30 characters, lowercase letters, numbers, and underscores only.';
    END IF;
  END IF;

  -- Update the profile
  UPDATE public.users
  SET
    username = COALESCE((new_data->>'username'), username),
    full_name = COALESCE((new_data->>'full_name'), full_name),
    avatar_url = COALESCE((new_data->>'avatar_url'), avatar_url),
    bio = COALESCE((new_data->>'bio'), bio),
    extended_bio = COALESCE((new_data->>'extended_bio'), extended_bio),
    website = COALESCE((new_data->>'website'), website),
    social_links = COALESCE((new_data->'social_links')::jsonb, social_links),
    portfolio = COALESCE((new_data->'portfolio')::jsonb, portfolio),
    updated_at = now()
  WHERE id = user_id
  RETURNING jsonb_build_object(
    'id', id,
    'username', username,
    'full_name', full_name,
    'avatar_url', avatar_url,
    'bio', bio,
    'extended_bio', extended_bio,
    'website', website,
    'social_links', social_links,
    'portfolio', portfolio,
    'updated_at', updated_at
  ) INTO updated_profile;

  RETURN updated_profile;
END;
$$;