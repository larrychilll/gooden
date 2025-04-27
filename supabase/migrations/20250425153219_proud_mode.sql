/*
  # Update schema for book content management

  1. Changes
    - Make affiliate_url nullable
    - Add safe policy creation
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Books policies
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to books'
  ) THEN
    DROP POLICY "Allow public read access to books" ON books;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to manage books'
  ) THEN
    DROP POLICY "Allow authenticated users to manage books" ON books;
  END IF;

  -- Chapters policies
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to chapters'
  ) THEN
    DROP POLICY "Allow public read access to chapters" ON chapters;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to manage chapters'
  ) THEN
    DROP POLICY "Allow authenticated users to manage chapters" ON chapters;
  END IF;

  -- Chapter content policies
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to chapter content'
  ) THEN
    DROP POLICY "Allow public read access to chapter content" ON chapter_content;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to manage chapter content'
  ) THEN
    DROP POLICY "Allow authenticated users to manage chapter content" ON chapter_content;
  END IF;

  -- Chapter questions policies
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to chapter questions'
  ) THEN
    DROP POLICY "Allow public read access to chapter questions" ON chapter_questions;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to manage chapter questions'
  ) THEN
    DROP POLICY "Allow authenticated users to manage chapter questions" ON chapter_questions;
  END IF;
END $$;

-- Update books table to make affiliate_url nullable
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' AND column_name = 'affiliate_url'
  ) THEN
    ALTER TABLE books ALTER COLUMN affiliate_url DROP NOT NULL;
  END IF;
END $$;

-- Recreate policies
CREATE POLICY "Allow public read access to books"
  ON books FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY "Allow authenticated users to manage books"
  ON books FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to chapters"
  ON chapters FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY "Allow authenticated users to manage chapters"
  ON chapters FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to chapter content"
  ON chapter_content FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY "Allow authenticated users to manage chapter content"
  ON chapter_content FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to chapter questions"
  ON chapter_questions FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY "Allow authenticated users to manage chapter questions"
  ON chapter_questions FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);