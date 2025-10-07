-- =========================================
-- Job Board Test Database
-- =========================================

-- 1️⃣ Create Database
CREATE DATABASE IF NOT EXISTS job_board;
USE job_board;

-- =========================================
-- 2️⃣ Companies Table
-- =========================================
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255) UNIQUE,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    INDEX idx_name(name)
);

-- Sample companies
INSERT INTO companies (name, website, email, phone) VALUES
('TechCorp', 'https://techcorp.com', 'contact@techcorp.com', '123-456-7890'),
('Designify', 'https://designify.com', 'hr@designify.com', '555-987-6543');

-- =========================================
-- 3️⃣ Users Table
-- =========================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employer', 'applicant') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'banned', 'inactive') DEFAULT 'active',
    INDEX idx_role(role)
);

-- Sample users
INSERT INTO users (full_name, email, password, role) VALUES
('Alice Johnson', 'alice@example.com', 'hashed_password1', 'applicant'),
('Bob Admin', 'admin@example.com', 'hashed_password2', 'admin');

-- =========================================
-- 4️⃣ Jobs Table
-- =========================================
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    short_description TEXT,
    full_description TEXT,
    salary VARCHAR(100),
    location VARCHAR(100),
    working_hours VARCHAR(50),
    date_posted DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_title(title),
    INDEX idx_location(location),
    UNIQUE KEY unique_job (company_id, title, location)
);

-- Sample jobs
INSERT INTO jobs (company_id, title, short_description, full_description, salary, location, working_hours) VALUES
(1, 'Frontend Developer', 'Build amazing web interfaces', 'Work with HTML, CSS, JS, React', '$50k-$70k', 'New York, NY', 'Full-time'),
(2, 'UI/UX Designer', 'Design user-friendly apps', 'Focus on user experience and visuals', '$45k-$65k', 'San Francisco, CA', 'Full-time');

-- =========================================
-- 5️⃣ Applications Table
-- =========================================
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending','reviewed','accepted','rejected') DEFAULT 'pending',
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, user_id),
    INDEX idx_status(status)
);

-- Sample applications
INSERT INTO applications (job_id, user_id, message) VALUES
(1, 1, 'I am very interested in this role and have experience with React.'),
(2, 1, 'I love design and user experience and would love to join your team.');
