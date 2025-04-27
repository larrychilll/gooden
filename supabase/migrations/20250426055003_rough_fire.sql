/*
  # Add AdSense management tables

  1. New Tables
    - `ad_placements`
      - Defines where ads can appear
      - Stores ad unit codes and settings
    - `ad_stats`
      - Tracks ad performance
      - Stores daily metrics

  2. Security
    - Enable RLS
    - Only authenticated users can manage ads
*/

-- Ad placements table
CREATE TABLE ad_placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  ad_client text NOT NULL,
  ad_slot text NOT NULL,
  format text NOT NULL CHECK (format IN ('auto', 'horizontal', 'vertical', 'rectangle')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ad statistics table
CREATE TABLE ad_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placement_id uuid REFERENCES ad_placements(id) ON DELETE CASCADE,
  date date NOT NULL,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  revenue numeric(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(placement_id, date)
);

-- Enable RLS
ALTER TABLE ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to manage ad placements"
  ON ad_placements FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage ad stats"
  ON ad_stats FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_ad_stats_date ON ad_stats(date);
CREATE INDEX idx_ad_stats_placement ON ad_stats(placement_id);