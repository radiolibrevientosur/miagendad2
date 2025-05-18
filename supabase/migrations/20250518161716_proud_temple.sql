/*
  # Cultural Management Schema

  1. New Tables
    - cultural_events
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - title (text)
      - description (text)
      - date (timestamptz)
      - location (text)
      - location_url (text)
      - category (text)
      - event_type (text)
      - target_audience (text)
      - cost_type (text)
      - cost_amount (numeric)
      - image_url (text)
      - created_at (timestamptz)

    - birthdays
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - name (text)
      - birth_date (date)
      - role (text)
      - discipline (text)
      - trajectory (text)
      - email (text)
      - phone (text)
      - image_url (text)
      - created_at (timestamptz)

    - tasks
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - title (text)
      - description (text)
      - status (text)
      - priority (text)
      - assigned_to (text)
      - due_date (timestamptz)
      - created_at (timestamptz)

    - task_checklist
      - id (uuid, primary key)
      - task_id (uuid, references tasks)
      - description (text)
      - completed (boolean)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Cultural Events Table
CREATE TABLE cultural_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  location text NOT NULL,
  location_url text,
  category text NOT NULL,
  event_type text NOT NULL,
  target_audience text NOT NULL,
  cost_type text NOT NULL,
  cost_amount numeric,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Birthdays Table
CREATE TABLE birthdays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  birth_date date NOT NULL,
  role text NOT NULL,
  discipline text NOT NULL,
  trajectory text,
  email text NOT NULL,
  phone text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks Table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL,
  priority text NOT NULL,
  assigned_to text NOT NULL,
  due_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Task Checklist Table
CREATE TABLE task_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  description text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cultural_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE birthdays ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_checklist ENABLE ROW LEVEL SECURITY;

-- Policies for cultural_events
CREATE POLICY "Users can view their own events"
  ON cultural_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events"
  ON cultural_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON cultural_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON cultural_events FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for birthdays
CREATE POLICY "Users can view their own birthdays"
  ON birthdays FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own birthdays"
  ON birthdays FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own birthdays"
  ON birthdays FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own birthdays"
  ON birthdays FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for task_checklist
CREATE POLICY "Users can view their own task checklist items"
  ON task_checklist FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM tasks
    WHERE tasks.id = task_checklist.task_id
    AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own task checklist items"
  ON task_checklist FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM tasks
    WHERE tasks.id = task_checklist.task_id
    AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own task checklist items"
  ON task_checklist FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM tasks
    WHERE tasks.id = task_checklist.task_id
    AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own task checklist items"
  ON task_checklist FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM tasks
    WHERE tasks.id = task_checklist.task_id
    AND tasks.user_id = auth.uid()
  ));

-- Create indexes
CREATE INDEX idx_cultural_events_user_id ON cultural_events(user_id);
CREATE INDEX idx_cultural_events_date ON cultural_events(date);
CREATE INDEX idx_birthdays_user_id ON birthdays(user_id);
CREATE INDEX idx_birthdays_birth_date ON birthdays(birth_date);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_task_checklist_task_id ON task_checklist(task_id);