/*
  # Smart Habit Tracker Schema

  1. New Tables
    - `habits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text)
      - `frequency` (enum: daily, weekly, monthly)
      - `target` (integer)
      - `current_streak` (integer)
      - `best_streak` (integer)
      - `color` (text)
      - `icon` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `reminder_time` (time)
      - `active` (boolean)

    - `habit_logs`
      - `id` (uuid, primary key)
      - `habit_id` (uuid, references habits)
      - `completed_at` (timestamptz)
      - `notes` (text)

    - `ai_insights`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `habit_id` (uuid, references habits)
      - `insight_type` (text)
      - `content` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading insights
*/

-- Create custom types
CREATE TYPE frequency_type AS ENUM ('daily', 'weekly', 'monthly');

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text,
  frequency frequency_type NOT NULL DEFAULT 'daily',
  target integer NOT NULL DEFAULT 1,
  current_streak integer NOT NULL DEFAULT 0,
  best_streak integer NOT NULL DEFAULT 0,
  color text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  reminder_time time,
  active boolean NOT NULL DEFAULT true
);

-- Create habit logs table
CREATE TABLE IF NOT EXISTS habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits ON DELETE CASCADE NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  notes text
);

-- Create AI insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  habit_id uuid REFERENCES habits ON DELETE CASCADE,
  insight_type text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Habits policies
CREATE POLICY "Users can create their own habits"
  ON habits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own habits"
  ON habits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
  ON habits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
  ON habits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Habit logs policies
CREATE POLICY "Users can create logs for their habits"
  ON habit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_logs.habit_id
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view logs for their habits"
  ON habit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_logs.habit_id
      AND habits.user_id = auth.uid()
    )
  );

-- AI insights policies
CREATE POLICY "Users can view their own insights"
  ON ai_insights
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON habits(user_id);
CREATE INDEX IF NOT EXISTS habit_logs_habit_id_idx ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS habit_logs_completed_at_idx ON habit_logs(completed_at);
CREATE INDEX IF NOT EXISTS ai_insights_user_id_idx ON ai_insights(user_id);
CREATE INDEX IF NOT EXISTS ai_insights_habit_id_idx ON ai_insights(habit_id);