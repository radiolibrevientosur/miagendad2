/*
  # Initial Schema Setup for Cultural Social Network

  1. New Tables
    - users
      - id (uuid, primary key)
      - username (text, unique, @pattern)
      - email (text, unique)
      - full_name (text)
      - bio (text)
      - avatar_url (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - creations
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - title (text)
      - description (text)
      - category (text)
      - media_urls (text[])
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - reactions
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - creation_id (uuid, references creations)
      - type (text)
      - created_at (timestamptz)

    - comments
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - creation_id (uuid, references creations)
      - content (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - collaborations
      - id (uuid, primary key)
      - creation_id (uuid, references creations)
      - user_id (uuid, references users)
      - role (text)
      - created_at (timestamptz)

    - follows
      - id (uuid, primary key)
      - follower_id (uuid, references users)
      - following_id (uuid, references users)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Set up policies for secure access
    - Create necessary indexes
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username text UNIQUE NOT NULL CHECK (username ~ '^@[a-zA-Z0-9_]{3,30}$'),
  email text UNIQUE NOT NULL,
  full_name text,
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Creations table
CREATE TABLE creations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  media_urls text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reactions table
CREATE TABLE reactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  creation_id uuid REFERENCES creations(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, creation_id, type)
);

-- Comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  creation_id uuid REFERENCES creations(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Collaborations table
CREATE TABLE collaborations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  creation_id uuid REFERENCES creations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(creation_id, user_id)
);

-- Follows table
CREATE TABLE follows (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX users_username_idx ON users USING btree (username);
CREATE INDEX creations_user_id_idx ON creations USING btree (user_id);
CREATE INDEX creations_category_idx ON creations USING btree (category);
CREATE INDEX reactions_creation_id_idx ON reactions USING btree (creation_id);
CREATE INDEX comments_creation_id_idx ON comments USING btree (creation_id);
CREATE INDEX follows_follower_id_idx ON follows USING btree (follower_id);
CREATE INDEX follows_following_id_idx ON follows USING btree (following_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_creations_updated_at
  BEFORE UPDATE ON creations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();