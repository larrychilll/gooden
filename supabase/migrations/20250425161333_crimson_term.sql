/*
  # Add book name to chapters table

  1. Changes
    - Add `book_name` column to chapters table
    - Make it NOT NULL
    - Add trigger to automatically populate book_name from books table
*/

-- Add book_name column
ALTER TABLE chapters 
ADD COLUMN book_name text NOT NULL DEFAULT '';

-- Create function to update book_name
CREATE OR REPLACE FUNCTION update_chapter_book_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.book_name := (SELECT title FROM books WHERE id = NEW.book_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER set_chapter_book_name
BEFORE INSERT OR UPDATE ON chapters
FOR EACH ROW
EXECUTE FUNCTION update_chapter_book_name();

-- Update existing chapters with book names
UPDATE chapters c
SET book_name = b.title
FROM books b
WHERE c.book_id = b.id;