-- =========================================
-- Job Board Database Initialization
-- =========================================

-- 1️⃣ Drop existing database (for fresh start)
DROP DATABASE IF EXISTS job_board;

-- 2️⃣ Create Database
CREATE DATABASE IF NOT EXISTS job_board;
USE job_board;

-- 3️⃣ Enable Event Scheduler for automatic deactivation
SET GLOBAL event_scheduler = ON;

-- =========================================
-- 4️⃣ Users Table (Applicants, Employers, Admins)
-- =========================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employer', 'applicant') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active','banned','inactive') DEFAULT 'active'
);

-- Event: Automatically deactivate users inactive for 15 days
CREATE EVENT IF NOT EXISTS deactivate_inactive_users
ON SCHEDULE EVERY 1 DAY
DO
  UPDATE users
  SET status = 'inactive'
  WHERE last_login < NOW() - INTERVAL 15 DAY
    AND status = 'active';

-- =========================================
-- 5️⃣ Applicant Profiles
-- =========================================
CREATE TABLE applicant_profiles (
    user_id INT PRIMARY KEY,
    phone VARCHAR(50),
    resume TEXT,
    linkedin VARCHAR(255),
    skills TEXT,
    experience_years INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
-- 6️⃣ Company Profiles
-- =========================================
CREATE TABLE company_profiles (
    user_id INT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    industry VARCHAR(100),
    location VARCHAR(100),
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
-- 7️⃣ Job Categories
-- =========================================
CREATE TABLE job_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- =========================================
-- 8️⃣ Advertisements / Job Posts
-- =========================================
CREATE TABLE advertisements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100),
    salary_range VARCHAR(100),
    employment_type ENUM('full-time', 'part-time', 'contract', 'internship') DEFAULT 'full-time',
    experience_level ENUM('junior','mid','senior','lead') DEFAULT 'junior',
    remote_type ENUM('remote','hybrid','on-site') DEFAULT 'on-site',
    company_id INT NOT NULL,
    category_id INT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES company_profiles(user_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES job_categories(id)
);

-- =========================================
-- 9️⃣ Applications
-- =========================================
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    advertisement_id INT NOT NULL,
    applicant_id INT NOT NULL,
    cover_letter TEXT,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'reviewed', 'rejected', 'accepted') DEFAULT 'pending',
    FOREIGN KEY (advertisement_id) REFERENCES advertisements(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
-- 10️⃣ Skills Table (Normalize skills)
-- =========================================
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE applicant_skills (
    applicant_id INT,
    skill_id INT,
    PRIMARY KEY(applicant_id, skill_id),
    FOREIGN KEY(applicant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE job_skills (
    advertisement_id INT,
    skill_id INT,
    PRIMARY KEY(advertisement_id, skill_id),
    FOREIGN KEY(advertisement_id) REFERENCES advertisements(id) ON DELETE CASCADE,
    FOREIGN KEY(skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- =========================================
-- 11️⃣ Email Logs
-- =========================================
CREATE TABLE email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    subject TEXT,
    body TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    application_id INT,
    status ENUM('sent','failed') DEFAULT 'sent',
    email_type ENUM('confirmation','rejection','offer','reminder') DEFAULT 'confirmation',
    FOREIGN KEY (application_id) REFERENCES applications(id)
);
