-- SQL Migration to add learner_id, learner_name, and sound_play_count columns to notifications table
-- Run this script in your Supabase SQL Editor to add the missing columns

-- Add learner_id column to notifications table (foreign key to learners table)
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS learner_id UUID REFERENCES learners (id) ON DELETE SET NULL;

-- Add learner_name column to notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS learner_name TEXT;

-- Add sound_play_count column to notifications table
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS sound_play_count INTEGER DEFAULT 0 CHECK (sound_play_count >= 0);

-- Add index for better query performance on learner_id
CREATE INDEX IF NOT EXISTS idx_notifications_learner_id ON notifications (learner_id);

-- Add index for better query performance on learner_name (for text search)
CREATE INDEX IF NOT EXISTS idx_notifications_learner_name ON notifications (learner_name);

-- Update existing rows to have default values (optional)
-- UPDATE notifications SET sound_play_count = 0 WHERE sound_play_count IS NULL;

-- Add comments to document the columns
COMMENT ON COLUMN notifications.learner_id IS 'Reference to the learner this notification is about (optional)';

COMMENT ON COLUMN notifications.learner_name IS 'Name of the learner this notification is about (optional)';

COMMENT ON COLUMN notifications.sound_play_count IS 'Number of times the notification sound has been played (for reminder system)';

-- Verify the columns were added
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE
    table_name = 'notifications'
ORDER BY ordinal_position;