/*
  # Fix User Registration and Database Configuration

  1. Changes
    - Fix handle_new_user trigger function
    - Add proper error handling
    - Ensure idempotent operations
    - Add proper constraints and validations
*/

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create or replace the handle_new_user function with proper error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_val TEXT;
  name_val TEXT;
BEGIN
  -- Get username from metadata or generate from email
  username_val := COALESCE(
    (NEW.raw_user_meta_data->>'username')::TEXT,
    REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g')
  );
  
  -- Get name from metadata or use username
  name_val := COALESCE(
    (NEW.raw_user_meta_data->>'name')::TEXT,
    username_val
  );

  -- Ensure username is unique by appending numbers if needed
  WHILE EXISTS (SELECT 1 FROM public.users WHERE username = username_val) LOOP
    username_val := username_val || floor(random() * 1000)::TEXT;
  END LOOP;

  -- Insert new user profile
  INSERT INTO public.users (
    id,
    username,
    full_name,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    username_val,
    name_val,
    NULL,
    NOW(),
    NOW()
  );

  -- Create extended profile
  INSERT INTO public.user_profiles (
    id,
    name,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    name_val,
    NOW(),
    NOW()
  );

  -- Create social links entry
  INSERT INTO public.social_links (
    user_id,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Log error and try one more time with random suffix
    username_val := username_val || floor(random() * 9999)::TEXT;
    
    INSERT INTO public.users (
      id,
      username,
      full_name,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      username_val,
      name_val,
      NOW(),
      NOW()
    );
    
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating user profile: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Add constraints to users table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'username_length'
  ) THEN
    ALTER TABLE public.users
    ADD CONSTRAINT username_length
    CHECK (char_length(username) >= 3);
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'username_format'
  ) THEN
    ALTER TABLE public.users
    ADD CONSTRAINT username_format
    CHECK (username ~ '^[a-zA-Z0-9_]+$');
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Update or create RLS policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read all profiles" ON public.users;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
  
  CREATE POLICY "Users can read all profiles"
    ON public.users FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);
END $$;