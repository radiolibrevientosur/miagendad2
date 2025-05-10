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

  -- Insert new user profile with retry logic
  BEGIN
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
  EXCEPTION WHEN unique_violation THEN
    -- Add random suffix and try one more time
    username_val := username_val || '_' || SUBSTRING(NEW.id::text, 1, 5);
    
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
  END;

  -- Create extended profile
  INSERT INTO public.user_profiles (
    id,
    name,
    bio,
    extended_bio,
    avatar_url,
    cover_image_url,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    name_val,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
  );

  -- Create social links entry
  INSERT INTO public.social_links (
    user_id,
    instagram,
    twitter,
    facebook,
    website,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error details
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
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
CREATE UNIQUE INDEX IF NOT EXISTS unique_username ON public.users(username);

-- Ensure RLS is enabled and create policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Update or create RLS policies
DO $$ 
BEGIN
  -- Users table policies
  DROP POLICY IF EXISTS "Lectura pública" ON public.users;
  DROP POLICY IF EXISTS "Actualización propio perfil" ON public.users;
  
  CREATE POLICY "Lectura pública"
    ON public.users FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Actualización propio perfil"
    ON public.users FOR UPDATE
    TO public
    USING (auth.uid() = id);

  -- User profiles policies
  DROP POLICY IF EXISTS "User profiles are viewable by everyone" ON public.user_profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

  CREATE POLICY "User profiles are viewable by everyone"
    ON public.user_profiles FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    TO public
    USING (auth.uid() = id);

  -- Social links policies
  DROP POLICY IF EXISTS "Users manage their own social links" ON public.social_links;

  CREATE POLICY "Users manage their own social links"
    ON public.social_links FOR ALL
    TO public
    USING (auth.uid() = user_id);
END $$;