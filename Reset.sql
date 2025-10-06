-- =========================================
-- Job Board Database Reset
-- =========================================

-- Use the database
USE job_board;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate all tables in correct order
TRUNCATE TABLE email_logs;
TRUNCATE TABLE job_skills;
TRUNCATE TABLE applicant_skills;
TRUNCATE TABLE applications;
TRUNCATE TABLE advertisements;
TRUNCATE TABLE job_categories;
TRUNCATE TABLE company_profiles;
TRUNCATE TABLE applicant_profiles;
TRUNCATE TABLE users;
TRUNCATE TABLE skills;

-- Enable foreign key checks again
SET FOREIGN_KEY_CHECKS = 1;

-- Optional: Reset AUTO_INCREMENT counters (usually done automatically with TRUNCATE)
-- ALTER TABLE users AUTO_INCREMENT = 1;
-- ALTER TABLE advertisements AUTO_INCREMENT = 1;
-- ALTER TABLE applications AUTO_INCREMENT = 1;
-- ALTER TABLE job_categories AUTO_INCREMENT = 1;
-- ALTER TABLE email_logs AUTO_INCREMENT = 1;

