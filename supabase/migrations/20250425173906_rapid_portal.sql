/*
  # Replace book_name column with a view
  
  1. Changes
    - Drop book_name column and trigger
    - Create view for chapter details including book name
    
  2. Benefits
    - Simpler schema
    - Always in sync with books table
    - No triggers needed
    - Better separation of concerns
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS set_chapter_book_name ON chapters;
DROP FUNCTION IF EXISTS update_chapter_book_name();

-- Drop book_name column
ALTER TABLE chapters 
DROP COLUMN IF EXISTS book_name;

-- Create view for chapter details
CREATE OR REPLACE VIEW chapter_details AS
SELECT 
  c.*,
  b.title as book_name,
  b.title_ch as book_name_ch
FROM chapters c
JOIN books b ON c.book_id = b.id;