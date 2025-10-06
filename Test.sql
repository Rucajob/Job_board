-- 1️⃣ Create the database
CREATE DATABASE IF NOT EXISTS job_board;
USE job_board;

-- 2️⃣ Companies table
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    email VARCHAR(100),
    phone VARCHAR(20)
);

-- Sample companies
INSERT INTO companies (name, website, email, phone) VALUES
('TechCorp', 'https://techcorp.com', 'contact@techcorp.com', '123-456-7890'),
('Designify', 'https://designify.com', 'hr@designify.com', '555-987-6543');

-- 3️⃣ Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sample users
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Alice Johnson', 'alice@example.com', '111-222-3333', 'hashed_password1', 'user'),
('Bob Admin', 'admin@example.com', '999-888-7777', 'hashed_password2', 'admin');

-- 4️⃣ Jobs table
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
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Sample jobs
INSERT INTO jobs (company_id, title, short_description, full_description, salary, location, working_hours) VALUES
(1, 'Frontend Developer', 'Build amazing web interfaces', 'Work with HTML, CSS, JS, React', '$50k-$70k', 'New York, NY', 'Full-time'),
(2, 'UI/UX Designer', 'Design user-friendly apps', 'Focus on user experience and visuals', '$45k-$65k', 'San Francisco, CA', 'Full-time');

-- 5️⃣ Applications table
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending','reviewed','accepted','rejected') DEFAULT 'pending',
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample applications
INSERT INTO applications (job_id, user_id, message) VALUES
(1, 1, 'I am very interested in this role and have experience with React.'),
(2, 1, 'I love design and user experience and would love to join your team.');

-- ✅ Done! Database ready for frontend testing.
