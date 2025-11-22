-- Add rejection_reason column to articles table
ALTER TABLE articles ADD COLUMN rejection_reason TEXT NULL AFTER status;

-- Add rejection_reason column to cultures table
ALTER TABLE cultures ADD COLUMN rejection_reason TEXT NULL AFTER status;

-- Add rejection_reason column to quizzes table
ALTER TABLE quizzes ADD COLUMN rejection_reason TEXT NULL AFTER status;
