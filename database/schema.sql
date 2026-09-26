CREATE DATABASE IF NOT EXISTS college_it_asset_management;

USE college_it_asset_management;

-- =========================================
-- DEPARTMENTS
-- =========================================
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_code VARCHAR(20) NOT NULL UNIQUE,
    department_name VARCHAR(100) NOT NULL
);

-- =========================================
-- LOCATIONS
-- =========================================
CREATE TABLE locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    location_name VARCHAR(100) NOT NULL,

    FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);

-- =========================================
-- USERS
-- =========================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    department_id INT,

    FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);

-- =========================================
-- ASSETS
-- =========================================
CREATE TABLE assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_code VARCHAR(50) NOT NULL UNIQUE,
    asset_name VARCHAR(150) NOT NULL,

    asset_type ENUM(
        'PC',
        'LAPTOP',
        'PROJECTOR',
        'PRINTER'
    ) NOT NULL,

    brand VARCHAR(100),
    model VARCHAR(100),

    department_id INT,
    location_id INT,

    status ENUM(
        'AVAILABLE',
        'RESERVED',
        'IN_USE',
        'UNDER_REPAIR',
        'RETIRED'
    ) NOT NULL DEFAULT 'AVAILABLE',

    is_borrowable BOOLEAN NOT NULL DEFAULT FALSE,
    requires_approval BOOLEAN NOT NULL DEFAULT FALSE,

    purchase_date DATE,

    FOREIGN KEY (department_id)
        REFERENCES departments(department_id),

    FOREIGN KEY (location_id)
        REFERENCES locations(location_id)
);

-- =========================================
-- REQUESTS
-- =========================================
CREATE TABLE requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,

    asset_id INT NOT NULL,
    user_id INT NOT NULL,

    request_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    purpose VARCHAR(255),

    status ENUM(
        'PENDING',
        'CONFIRMED',
        'REJECTED',
        'CANCELLED',
        'COMPLETED',
        'EXPIRED'
    ) NOT NULL DEFAULT 'PENDING',

    reservation_pin VARCHAR(20),

    reserved_at DATETIME,
    reservation_expires_at DATETIME,

    issued_at DATETIME,
    expected_return_at DATETIME,
    returned_at DATETIME,

    approved_by INT,
    approved_date DATETIME,

    FOREIGN KEY (asset_id)
        REFERENCES assets(asset_id),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    FOREIGN KEY (approved_by)
        REFERENCES users(user_id)
);

-- =========================================
-- REPAIRS
-- =========================================
CREATE TABLE repairs (
    repair_id INT AUTO_INCREMENT PRIMARY KEY,

    asset_id INT NOT NULL,
    reported_by INT NOT NULL,

    issue TEXT NOT NULL,

    reported_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    status ENUM(
        'REPORTED',
        'UNDER_REPAIR',
        'RESOLVED'
    ) NOT NULL DEFAULT 'REPORTED',

    resolution TEXT,
    resolved_date DATETIME,

    FOREIGN KEY (asset_id)
        REFERENCES assets(asset_id),

    FOREIGN KEY (reported_by)
        REFERENCES users(user_id)
);

-- =========================================
-- SCHEDULED LAB / RESOURCE RESERVATIONS
-- =========================================
CREATE TABLE scheduled_reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,

    location_id INT NOT NULL,
    reserved_by INT NOT NULL,

    reservation_date DATE NOT NULL,

    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    purpose VARCHAR(255) NOT NULL,

    status ENUM(
        'SCHEDULED',
        'CANCELLED',
        'COMPLETED'
    ) NOT NULL DEFAULT 'SCHEDULED',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (location_id)
        REFERENCES locations(location_id),

    FOREIGN KEY (reserved_by)
        REFERENCES users(user_id),

    CHECK (end_time > start_time)
);