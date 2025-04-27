/*
  # Update schema to remove duplicate title fields

  1. Changes
    - Remove title_en from books table (using just title for English)
    - Remove title_en from chapters table (using just title for English)
    - Keep title_ch for Chinese translations

  2. Security
    - Maintain existing RLS policies
    - Preserve all existing security settings
*/

DO $$ 
BEGIN
  -- Drop existing tables if they exist
  DROP TABLE IF EXISTS chapter_questions CASCADE;
  DROP TABLE IF EXISTS chapter_content CASCADE;
  DROP TABLE IF EXISTS chapters CASCADE;
  DROP TABLE IF EXISTS books CASCADE;

  -- Books table
  CREATE TABLE books (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    title_ch text NOT NULL,
    author text NOT NULL,
    cover_image text NOT NULL,
    category_id text NOT NULL,
    description text NOT NULL,
    slug text UNIQUE NOT NULL,
    affiliate_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Chapters table
  CREATE TABLE chapters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id uuid REFERENCES books(id) ON DELETE CASCADE,
    title text NOT NULL,
    title_ch text NOT NULL,
    slug text NOT NULL,
    "order" integer NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(book_id, slug),
    UNIQUE(book_id, "order")
  );

  -- Chapter content table
  CREATE TABLE chapter_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id uuid REFERENCES chapters(id) ON DELETE CASCADE,
    summary_en text NOT NULL,
    summary_ch text NOT NULL,
    vocabulary jsonb NOT NULL DEFAULT '[]',
    key_points jsonb NOT NULL DEFAULT '[]',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(chapter_id)
  );

  -- Chapter questions table
  CREATE TABLE chapter_questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id uuid REFERENCES chapters(id) ON DELETE CASCADE,
    question text NOT NULL,
    options jsonb NOT NULL,
    correct_answer integer NOT NULL,
    explanation_en text NOT NULL,
    explanation_ch text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Enable RLS
  ALTER TABLE books ENABLE ROW LEVEL SECURITY;
  ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
  ALTER TABLE chapter_content ENABLE ROW LEVEL SECURITY;
  ALTER TABLE chapter_questions ENABLE ROW LEVEL SECURITY;

  -- Create policies
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
END $$;