/*
  # Schema Update for Cultural Management App

  1. Changes
    - Add safety checks for existing policies
    - Ensure idempotent table creation
    - Maintain all existing functionality
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Users policies
  DROP POLICY IF EXISTS "Users can read all profiles" ON public.users;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
  
  -- Events policies
  DROP POLICY IF EXISTS "Anyone can read events" ON public.events;
  DROP POLICY IF EXISTS "Users can create events" ON public.events;
  DROP POLICY IF EXISTS "Users can update own events" ON public.events;
  DROP POLICY IF EXISTS "Users can delete own events" ON public.events;
  
  -- Birthdays policies
  DROP POLICY IF EXISTS "Anyone can read birthdays" ON public.birthdays;
  DROP POLICY IF EXISTS "Users can create birthdays" ON public.birthdays;
  DROP POLICY IF EXISTS "Users can update own birthdays" ON public.birthdays;
  DROP POLICY IF EXISTS "Users can delete own birthdays" ON public.birthdays;
  
  -- Tasks policies
  DROP POLICY IF EXISTS "Users can read assigned tasks" ON public.tasks;
  DROP POLICY IF EXISTS "Users can create tasks" ON public.tasks;
  DROP POLICY IF EXISTS "Users can update own or assigned tasks" ON public.tasks;
  DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
  
  -- Contacts policies
  DROP POLICY IF EXISTS "Users can read own contacts" ON public.contacts;
  DROP POLICY IF EXISTS "Users can create contacts" ON public.contacts;
  DROP POLICY IF EXISTS "Users can update own contacts" ON public.contacts;
  DROP POLICY IF EXISTS "Users can delete own contacts" ON public.contacts;
  
  -- Press Articles policies
  DROP POLICY IF EXISTS "Anyone can read press articles" ON public.press_articles;
  DROP POLICY IF EXISTS "Users can create press articles" ON public.press_articles;
  DROP POLICY IF EXISTS "Users can update own press articles" ON public.press_articles;
  DROP POLICY IF EXISTS "Users can delete own press articles" ON public.press_articles;
  
  -- Posts policies
  DROP POLICY IF EXISTS "Anyone can read posts" ON public.posts;
  DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
  DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
  DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
  
  -- Reactions policies
  DROP POLICY IF EXISTS "Anyone can read reactions" ON public.reactions;
  DROP POLICY IF EXISTS "Users can create reactions" ON public.reactions;
  DROP POLICY IF EXISTS "Users can delete own reactions" ON public.reactions;
  
  -- Comments policies
  DROP POLICY IF EXISTS "Anyone can read comments" ON public.comments;
  DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
  DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
  DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
  
  -- Media policies
  DROP POLICY IF EXISTS "Anyone can read media" ON public.media;
  DROP POLICY IF EXISTS "Users can create media" ON public.media;
  DROP POLICY IF EXISTS "Users can delete own media" ON public.media;
  
  -- Tags policies
  DROP POLICY IF EXISTS "Anyone can read tags" ON public.tags;
  DROP POLICY IF EXISTS "Users can create tags" ON public.tags;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create tables
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  extended_bio TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  portfolio JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  location_url TEXT,
  category TEXT NOT NULL,
  event_type TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  cost_type TEXT NOT NULL,
  cost_amount DECIMAL,
  responsible_person JSONB NOT NULL,
  technical_requirements TEXT[],
  image_url TEXT,
  tags TEXT[],
  recurrence JSONB,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.birthdays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  role TEXT NOT NULL,
  discipline TEXT NOT NULL,
  trajectory TEXT,
  contact_info JSONB NOT NULL,
  image_url TEXT,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  assigned_to UUID REFERENCES public.users(id),
  due_date TIMESTAMPTZ NOT NULL,
  checklist JSONB DEFAULT '[]'::jsonb,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  discipline TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  facebook TEXT,
  notes TEXT,
  image_url TEXT,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.press_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  image_url TEXT,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  media JSONB DEFAULT '[]'::jsonb,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  reaction_type TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(entity_type, entity_id, user_id, reaction_type)
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  thumbnail_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthdays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all profiles" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Anyone can read events" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create events" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON public.events FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON public.events FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read birthdays" ON public.birthdays FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create birthdays" ON public.birthdays FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own birthdays" ON public.birthdays FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own birthdays" ON public.birthdays FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can read assigned tasks" ON public.tasks FOR SELECT TO authenticated USING (auth.uid() = user_id OR auth.uid() = assigned_to);
CREATE POLICY "Users can create tasks" ON public.tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own or assigned tasks" ON public.tasks FOR UPDATE TO authenticated USING (auth.uid() = user_id OR auth.uid() = assigned_to);
CREATE POLICY "Users can delete own tasks" ON public.tasks FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can read own contacts" ON public.contacts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create contacts" ON public.contacts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contacts" ON public.contacts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contacts" ON public.contacts FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read press articles" ON public.press_articles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create press articles" ON public.press_articles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own press articles" ON public.press_articles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own press articles" ON public.press_articles FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read posts" ON public.posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read reactions" ON public.reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create reactions" ON public.reactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON public.reactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read comments" ON public.comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read media" ON public.media FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create media" ON public.media FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own media" ON public.media FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read tags" ON public.tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create tags" ON public.tags FOR INSERT TO authenticated WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS events_user_id_idx ON public.events(user_id);
CREATE INDEX IF NOT EXISTS events_date_idx ON public.events(date);
CREATE INDEX IF NOT EXISTS birthdays_birth_date_idx ON public.birthdays(birth_date);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_assigned_to_idx ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS reactions_entity_idx ON public.reactions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS comments_entity_idx ON public.comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS media_entity_idx ON public.media(entity_type, entity_id);