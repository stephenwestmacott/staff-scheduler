-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  role ENUM('server', 'cook', 'manager'),
  phone VARCHAR(20)
);

-- Create shifts table
CREATE TABLE IF NOT EXISTS shifts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day DATE,
  start_time TIME,
  end_time TIME,
  role_required ENUM('server', 'cook', 'manager')
);

-- Create assignment table
CREATE TABLE IF NOT EXISTS staff_shifts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT,
  shift_id INT,
  FOREIGN KEY (staff_id) REFERENCES staff(id),
  FOREIGN KEY (shift_id) REFERENCES shifts(id)
);

-- Insert sample staff
INSERT INTO staff (name, role, phone) VALUES
('Alice Smith', 'server', '306-555-1234'),
('Bob Johnson', 'cook', '306-555-5678'),
('Carol Lee', 'manager', '306-555-9012');

-- Insert sample shifts
INSERT INTO shifts (day, start_time, end_time, role_required) VALUES
('2025-07-19', '11:00:00', '15:00:00', 'server'),
('2025-07-19', '16:00:00', '20:00:00', 'cook'),
('2025-07-20', '09:00:00', '17:00:00', 'manager');

-- Assign shifts to staff
INSERT INTO staff_shifts (staff_id, shift_id) VALUES
(1, 1), -- Alice assigned to first shift
(2, 2), -- Bob assigned to second
(3, 3); -- Carol assigned to third
