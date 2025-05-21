-- SQL para el backend de Supabase: Gestión Cultural

-- 1. Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL CHECK (username ~ '^@[a-zA-Z0-9_]{3,30}$'),
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  extended_bio TEXT,
  website TEXT,
  social_links JSONB,
  portfolio JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de eventos culturales
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  location_url TEXT,
  category TEXT NOT NULL,
  event_type TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  cost_type TEXT NOT NULL,
  cost_amount DECIMAL,
  image_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de cumpleaños de artistas
CREATE TABLE IF NOT EXISTS birthdays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  role TEXT,
  discipline TEXT,
  trajectory TEXT,
  contact_info JSONB,
  image_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de tareas culturales
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  assigned_to UUID REFERENCES users(id),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  checklist JSONB,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de contactos
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  discipline TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  facebook TEXT,
  image_url TEXT,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla de artículos de prensa
CREATE TABLE IF NOT EXISTS press_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT,
  content TEXT,
  summary TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  category TEXT,
  tags TEXT[],
  image_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabla de posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  content TEXT,
  media_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabla de reacciones
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES users(id),
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, user_id, reaction_type)
);

-- 9. Tabla de comentarios
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabla de colaboraciones
CREATE TABLE IF NOT EXISTS collaborations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creation_id UUID,
  user_id UUID REFERENCES users(id),
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(creation_id, user_id)
);

-- 11. Tabla de follows
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES users(id),
  following_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- 12. Políticas de seguridad (RLS)
-- Usuarios
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read all profiles" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Eventos
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read events" ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create events" ON events FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own events" ON events FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Cumpleaños
ALTER TABLE birthdays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read birthdays" ON birthdays FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create birthdays" ON birthdays FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own birthdays" ON birthdays FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Tareas
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read tasks" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create tasks" ON tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Contactos
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read contacts" ON contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create contacts" ON contacts FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own contacts" ON contacts FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Artículos de prensa
ALTER TABLE press_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read press articles" ON press_articles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create press articles" ON press_articles FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own press articles" ON press_articles FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read posts" ON posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Reacciones
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read reactions" ON reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create reactions" ON reactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Comentarios
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comments" ON comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Colaboraciones
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read collaborations" ON collaborations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create collaborations" ON collaborations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Follows
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read follows" ON follows FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can follow" ON follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
