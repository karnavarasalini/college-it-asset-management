USE college_it_asset_management;

-- =========================================
-- DEPARTMENTS
-- =========================================

INSERT INTO departments
(department_code, department_name)
VALUES
('ISE', 'Information Science and Engineering'),
('CSE', 'Computer Science and Engineering'),
('ECE', 'Electronics and Communication Engineering'),
('ADMIN', 'Administration');

-- =========================================
-- LOCATIONS
-- =========================================

INSERT INTO locations
(department_id, location_name)
VALUES
(1, 'ISE Lab 1'),
(1, 'ISE Lab 2'),
(1, 'ISE Department Office'),
(2, 'CSE Lab 1'),
(4, 'Central Library');

-- =========================================
-- USERS
-- =========================================

INSERT INTO users
(name, email, password, role, department_id)
VALUES
('System Admin', 'admin@college.edu', 'admin123', 'ADMIN', 4),
('Student One', 'student1@college.edu', 'student123', 'USER', 1),
('Student Two', 'student2@college.edu', 'student123', 'USER', 1),
('Faculty One', 'faculty1@college.edu', 'faculty123', 'USER', 1);

-- =========================================
-- LAB DESKTOP PCS
-- =========================================

INSERT INTO assets
(
    asset_code,
    asset_name,
    asset_type,
    brand,
    model,
    department_id,
    location_id,
    status,
    is_borrowable,
    requires_approval,
    purchase_date
)
VALUES
(
    'PC-ISE-001',
    'Lab Desktop PC 01',
    'PC',
    'Dell',
    'OptiPlex',
    1,
    1,
    'AVAILABLE',
    FALSE,
    FALSE,
    '2025-01-15'
),
(
    'PC-ISE-002',
    'Lab Desktop PC 02',
    'PC',
    'HP',
    'ProDesk',
    1,
    1,
    'AVAILABLE',
    FALSE,
    FALSE,
    '2025-01-15'
),
(
    'PC-ISE-003',
    'Lab Desktop PC 03',
    'PC',
    'Dell',
    'OptiPlex',
    1,
    2,
    'AVAILABLE',
    FALSE,
    FALSE,
    '2025-01-15'
);

-- =========================================
-- BORROWABLE LAPTOPS
-- =========================================

INSERT INTO assets
(
    asset_code,
    asset_name,
    asset_type,
    brand,
    model,
    department_id,
    location_id,
    status,
    is_borrowable,
    requires_approval,
    purchase_date
)
VALUES
(
    'LAP-001',
    'Library Laptop 01',
    'LAPTOP',
    'Dell',
    'Inspiron',
    4,
    5,
    'AVAILABLE',
    TRUE,
    FALSE,
    '2025-02-10'
),
(
    'LAP-002',
    'Library Laptop 02',
    'LAPTOP',
    'HP',
    'Pavilion',
    4,
    5,
    'AVAILABLE',
    TRUE,
    FALSE,
    '2025-02-10'
);

-- =========================================
-- PROJECTORS
-- =========================================

INSERT INTO assets
(
    asset_code,
    asset_name,
    asset_type,
    brand,
    model,
    department_id,
    location_id,
    status,
    is_borrowable,
    requires_approval,
    purchase_date
)
VALUES
(
    'PROJ-001',
    'Portable Projector 01',
    'PROJECTOR',
    'Epson',
    'EB-X06',
    1,
    3,
    'AVAILABLE',
    TRUE,
    FALSE,
    '2025-03-20'
);

-- =========================================
-- PRINTER
-- =========================================

INSERT INTO assets
(
    asset_code,
    asset_name,
    asset_type,
    brand,
    model,
    department_id,
    location_id,
    status,
    is_borrowable,
    requires_approval,
    purchase_date
)
VALUES
(
    'PRN-001',
    'Department Printer',
    'PRINTER',
    'HP',
    'LaserJet',
    1,
    3,
    'AVAILABLE',
    FALSE,
    FALSE,
    '2025-04-05'
);

-- =========================================
-- SAMPLE LAB RESERVATION
-- =========================================

INSERT INTO scheduled_reservations
(
    location_id,
    reserved_by,
    reservation_date,
    start_time,
    end_time,
    purpose,
    status
)
VALUES
(
    2,
    1,
    '2026-09-26',
    '10:00:00',
    '12:00:00',
    'Semester Examination',
    'SCHEDULED'
);