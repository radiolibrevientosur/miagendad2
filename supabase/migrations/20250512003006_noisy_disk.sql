/*
  # Storage Configuration
  
  1. Create buckets for:
    - avatars: User profile pictures
    - creations_media: Media files for creations
    - posts: General post attachments
    
  2. Set up public access policies
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('creations_media', 'creations_media', true),
  ('posts', 'posts', true);

-- Set up storage policies
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Creations media policies
CREATE POLICY "Creation media is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'creations_media');

CREATE POLICY "Authenticated users can upload creation media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'creations_media' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can manage own creation media"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'creations_media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Posts policies
CREATE POLICY "Posts are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'posts');

CREATE POLICY "Authenticated users can upload posts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'posts' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can manage own posts"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'posts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );