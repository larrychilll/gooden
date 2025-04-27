/*
  # Enhance chapter content schema

  1. Changes
    - Add status field to track content generation
    - Add audio URL fields for pronunciation
    - Add difficulty level for vocabulary
    - Add tags for better categorization
    - Add last studied timestamp for user tracking

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to chapter_content
ALTER TABLE chapter_content
ADD COLUMN status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
ADD COLUMN audio_url_en text,
ADD COLUMN audio_url_ch text,
ADD COLUMN tags text[] DEFAULT '{}',
ADD COLUMN last_studied_at timestamptz;

-- Add vocabulary difficulty level to the vocabulary JSONB schema
COMMENT ON COLUMN chapter_content.vocabulary IS 'Array of vocabulary items with structure:
{
  "word": "string",
  "translation": "string",
  "pronunciation": "string",
  "difficulty": "beginner|intermediate|advanced",
  "context": {
    "en": "string",
    "ch": "string"
  },
  "examples": [
    {
      "en": "string",
      "ch": "string"
    }
  ]
}';

-- Add structure documentation for key_points
COMMENT ON COLUMN chapter_content.key_points IS 'Array of key points with structure:
{
  "en": "string",
  "ch": "string",
  "importance": 1-5,
  "related_concepts": ["string"]
}';

-- Create index for faster status queries
CREATE INDEX idx_chapter_content_status ON chapter_content(status);

-- Create index for tags search
CREATE INDEX idx_chapter_content_tags ON chapter_content USING gin(tags);