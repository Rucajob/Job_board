-- =========================================
-- Job Board Database Initialization
-- =========================================

-- 1️⃣ Create Database
CREATE DATABASE IF NOT EXISTS job_board;
USE job_board;

-- 2️⃣ Users Table
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

-- 3️⃣ Applicant Profiles Table
CREATE TABLE applicant_profiles (
    user_id INT PRIMARY KEY,
    phone VARCHAR(50),
    resume TEXT,
    linkedin VARCHAR(255),
    skills TEXT,
    experience_years INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4️⃣ Company Profiles Table
CREATE TABLE company_profiles (
    user_id INT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    industry VARCHAR(100),
    location VARCHAR(100),
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5️⃣ Job Categories Table
CREATE TABLE job_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 6️⃣ Advertisements Table
CREATE TABLE advertisements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100),
    salary_range VARCHAR(100),
    employment_type ENUM('full-time', 'part-time', 'contract', 'internship') DEFAULT 'full-time',
    company_id INT NOT NULL,
    category_id INT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES company_profiles(user_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES job_categories(id)
);

-- 7️⃣ Applications Table
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

-- 8️⃣ Email Logs Table
CREATE TABLE email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    subject TEXT,
    body TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    application_id INT,
    FOREIGN KEY (application_id) REFERENCES applications(id)
);

-- 9️⃣ Event: Deactivate inactive users after 15 days
SET GLOBAL event_scheduler = ON;

CREATE EVENT deactivate_inactive_users
ON SCHEDULE EVERY 1 DAY
DO
  UPDATE users
  SET status = 'inactive'
  WHERE last_login < NOW() - INTERVAL 15 DAY
    AND status = 'active';
