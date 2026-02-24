-- SQL Migration to add avg_score column to learners table
-- Run this script in your Supabase SQL Editor to add the missing column

-- Add avg_score column to learners table
ALTER TABLE learners
ADD COLUMN IF NOT EXISTS avg_score DECIMAL(5, 2) DEFAULT 0.0 CHECK (
    avg_score >= 0
    AND avg_score <= 100
);

-- Update existing rows to have a default value (optional)
-- UPDATE learners SET avg_score = 0.0 WHERE avg_score IS NULL;

-- Add comment to document the column
COMMENT ON COLUMN learners.avg_score IS 'Average percentage score (0-100) for the learner';

-- Verify the column was added
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE
    table_name = 'learners'
    AND column_name = 'avg_score';