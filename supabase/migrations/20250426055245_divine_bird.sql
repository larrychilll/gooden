/*
  # Add site settings table for global configurations
  
  1. New Table
    - `site_settings`
      - Stores global site configuration
      - Initially includes AdSense toggle
      
  2. Security
    - Enable RLS
    - Only authenticated users can manage settings
    - Public can read settings
*/

CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to site settings"
  ON site_settings FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY "Allow authenticated users to manage site settings"
  ON site_settings FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial settings
INSERT INTO site_settings (key, value)
VALUES ('adsense', '{"enabled": true}'::jsonb);