CREATE DATABASE employee;
use employee;
select * from employees;
ALTER TABLE employees MODIFY COLUMN id INT AUTO_INCREMENT;
-- Create organizations table
CREATE TABLE organizations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE,
    description TEXT,
    address VARCHAR(500),
    contact_email VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table (no role column)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    organization_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Create the employees table with all required columns
CREATE TABLE employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    organization_id BIGINT,
    user_id BIGINT,
    employee_code VARCHAR(50),
    department VARCHAR(100),
    position VARCHAR(100),
    hire_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_organization_id (organization_id),
    INDEX idx_user_id (user_id),
    INDEX idx_employee_code (employee_code),
    INDEX idx_email (email)
);

-- Add foreign key constraints (after creating organizations and users tables)
ALTER TABLE employees 
ADD CONSTRAINT fk_employees_organization 
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE employees 
ADD CONSTRAINT fk_employees_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
select * from users;
SELECT username, password_hash FROM users WHERE username = 'sai';
SELECT * FROM organizations	;
