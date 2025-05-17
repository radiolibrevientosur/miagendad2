/*
  # Security Policies for Cultural Social Network

  1. Users Policies
    - Users can read public profiles
    - Users can only update their own profile
    - Users can only delete their own profile

  2. Creations Policies
    - Anyone can read public creations
    - Only authors and collaborators can update
    - Only authors can delete
    - Only authenticated users can create

  3. Reactions and Comments
    - Anyone can read
    - Only authenticated users can create
    - Users can only update/delete their own

  4. Collaborations
    - Authors can manage collaborations
    - Collaborators can read their assignments
*/

-- Users policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON users FOR DELETE
  USING (auth.uid() = id);

-- Creations policies
CREATE POLICY "Creations are viewable by everyone"
  ON creations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create creations"
  ON creations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authors and collaborators can update creations"
  ON creations FOR UPDATE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM collaborations
      WHERE creation_id = creations.id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Only authors can delete creations"
  ON creations FOR DELETE
  USING (auth.uid() = user_id);

-- Reactions policies
CREATE POLICY "Anyone can view reactions"
  ON reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add reactions"
  ON reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions"
  ON reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Collaborations policies
CREATE POLICY "Anyone can view collaborations"
  ON collaborations FOR SELECT
  USING (true);

CREATE POLICY "Creation authors can manage collaborations"
  ON collaborations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM creations
      WHERE id = collaborations.creation_id
      AND user_id = auth.uid()
    )
  );

-- Follows policies
CREATE POLICY "Anyone can view follows"
  ON follows FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can follow others"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);