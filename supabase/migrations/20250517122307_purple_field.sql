/*
  # Add Posts Table Structure

  1. New Table
    - posts
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - content (text)
      - media_urls (text array, optional)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS
    - Set up policies for secure access
    - Create necessary indexes
*/

CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  media_urls text[] NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_posts_user ON posts USING btree (user_id);
CREATE INDEX idx_posts_created_at ON posts USING btree (created_at DESC);

-- Create policies
CREATE POLICY "Public read access"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "User insert access"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Update posts propios"
  ON posts FOR UPDATE
  TO public
  USING (uid() = user_id)
  WITH CHECK (uid() = user_id);

CREATE POLICY "Borrar posts propios"
  ON posts FOR DELETE
  TO public
  USING (uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER posts_updated_trigger
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_post_timestamp();