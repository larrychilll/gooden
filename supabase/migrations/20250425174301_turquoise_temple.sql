/*
  # Simplify schema and improve data structure
  
  1. Changes
    - Remove redundant title fields
    - Make cover_image and affiliate_url nullable
    - Add indexes for faster queries
    - Create view for chapter details with book info
*/

-- Drop existing view if exists
DROP VIEW IF EXISTS chapter_details;

-- Modify books table
ALTER TABLE books
ALTER COLUMN cover_image DROP NOT NULL,
ALTER COLUMN affiliate_url DROP NOT NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category_id);
CREATE INDEX IF NOT EXISTS idx_chapters_book_order ON chapters(book_id, "order");

-- Create view for chapter details
CREATE OR REPLACE VIEW chapter_details AS
SELECT 
  c.*,
  b.title as book_title,
  b.title_ch as book_title_ch,
  b.author as book_author,
  b.cover_image as book_cover_image,
  b.category_id as book_category_id
FROM chapters c
JOIN books b ON c.book_id = b.id;