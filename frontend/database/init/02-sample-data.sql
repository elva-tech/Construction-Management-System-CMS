-- Sample data for CMS Database
USE cms_database;

-- Insert sample users (these will sync with Keycloak)
INSERT INTO users (id, username, email, first_name, last_name, role, phone, address) VALUES
('admin-001', 'admin', 'admin@cms.com', 'System', 'Administrator', 'admin', '+91-9876543210', 'Admin Office'),
('super-001', 'supervisor', 'supervisor@cms.com', 'Project', 'Supervisor', 'supervisor', '+91-9876543211', 'Site Office'),
('client-001', 'client', 'client@cms.com', 'Project', 'Client', 'client', '+91-9876543212', 'Client Office');

-- Insert sample projects
INSERT INTO projects (id, name, description, location, status, start_date, end_date, budget, budget_spent, completion_percentage, created_by) VALUES
('proj-001', 'Residential Complex - Phase 1', 'Construction of 50 residential units with modern amenities', 'Bangalore, Karnataka', 'active', '2024-01-15', '2024-12-30', 25000000.00, 11250000.00, 45.0, 'admin-001'),
('proj-002', 'Commercial Tower', 'High-rise commercial building with office spaces', 'Mumbai, Maharashtra', 'active', '2024-03-10', '2025-04-15', 58000000.00, 17400000.00, 30.0, 'admin-001'),
('proj-003', 'Highway Extension', 'Extension of existing highway with 4-lane configuration', 'Delhi NCR', 'active', '2024-05-05', '2025-06-20', 122000000.00, 12200000.00, 10.0, 'admin-001'),
('proj-004', 'Hospital Building', 'Multi-specialty hospital with 200 beds', 'Chennai, Tamil Nadu', 'completed', '2023-12-12', '2024-11-25', 37000000.00, 37000000.00, 100.0, 'admin-001');

-- Assign users to projects
INSERT INTO project_assignments (id, project_id, user_id, role, assigned_by) VALUES
('assign-001', 'proj-001', 'super-001', 'supervisor', 'admin-001'),
('assign-002', 'proj-001', 'client-001', 'client', 'admin-001'),
('assign-003', 'proj-002', 'super-001', 'supervisor', 'admin-001'),
('assign-004', 'proj-003', 'super-001', 'supervisor', 'admin-001');

-- Insert sample materials
INSERT INTO materials (id, name, description, unit, category, supplier, unit_price) VALUES
('mat-001', 'Cement', 'OPC 53 Grade Cement', 'Bags', 'Construction', 'UltraTech', 450.00),
('mat-002', 'Sand', 'River Sand for Construction', 'Trip', 'Construction', 'Local Supplier', 6000.00),
('mat-003', 'Steel Bars', 'TMT Steel Bars 12mm', 'Kg', 'Construction', 'Tata Steel', 65.00),
('mat-004', 'Bricks', 'Red Clay Bricks', 'Pieces', 'Construction', 'Local Supplier', 8.50),
('mat-005', 'Concrete', 'Ready Mix Concrete M25', 'Cubic Meter', 'Construction', 'ACC', 4500.00);

-- Insert sample material transactions
INSERT INTO material_transactions (id, project_id, material_id, transaction_type, quantity, unit_price, total_amount, transaction_date, remarks, created_by) VALUES
('trans-001', 'proj-001', 'mat-001', 'received', 100.00, 450.00, 45000.00, '2024-01-01', 'Initial cement stock received', 'super-001'),
('trans-002', 'proj-001', 'mat-001', 'consumed', 25.00, 450.00, 11250.00, '2024-01-05', 'Used for foundation work', 'super-001'),
('trans-003', 'proj-001', 'mat-002', 'received', 3.00, 6000.00, 18000.00, '2024-01-02', 'River sand for construction', 'super-001'),
('trans-004', 'proj-001', 'mat-003', 'received', 500.00, 65.00, 32500.00, '2024-01-03', 'TMT bars for reinforcement', 'super-001'),
('trans-005', 'proj-001', 'mat-003', 'consumed', 150.00, 65.00, 9750.00, '2024-01-08', 'Used in foundation reinforcement', 'super-001');

-- Insert sample financial transactions
INSERT INTO financial_transactions (id, project_id, transaction_type, amount, description, transaction_date, payment_method, reference_number, status, created_by) VALUES
('fin-001', 'proj-001', 'payment_received', 5000000.00, 'Initial project advance payment', '2024-01-10', 'Bank Transfer', 'TXN001', 'completed', 'admin-001'),
('fin-002', 'proj-001', 'payment_made', 2250000.00, 'Payment to material suppliers', '2024-01-15', 'Bank Transfer', 'PAY001', 'completed', 'admin-001'),
('fin-003', 'proj-001', 'expense', 150000.00, 'Equipment rental charges', '2024-01-20', 'Cash', 'EXP001', 'completed', 'super-001'),
('fin-004', 'proj-002', 'payment_received', 8000000.00, 'First milestone payment', '2024-03-15', 'Bank Transfer', 'TXN002', 'completed', 'admin-001');

-- Insert sample daily reports
INSERT INTO daily_reports (id, project_id, report_date, weather_conditions, work_description, progress_notes, issues_faced, workers_present, created_by) VALUES
('rep-001', 'proj-001', '2024-01-15', 'Clear and sunny', 'Foundation excavation completed', 'Excavation work finished as per schedule', 'Minor delay due to equipment maintenance', 25, 'super-001'),
('rep-002', 'proj-001', '2024-01-16', 'Partly cloudy', 'Foundation reinforcement started', 'Steel bar placement in progress', 'None', 30, 'super-001'),
('rep-003', 'proj-001', '2024-01-17', 'Light rain', 'Concrete pouring for foundation', 'Foundation concrete work completed', 'Rain caused 2-hour delay', 28, 'super-001');

-- Insert sample drawings
INSERT INTO drawings (id, project_id, name, description, file_path, file_type, file_size, version, status, uploaded_by) VALUES
('draw-001', 'proj-001', 'Site Plan', 'Overall site layout and planning', '/uploads/drawings/site-plan-v1.pdf', 'application/pdf', 2048576, '1.0', 'approved', 'super-001'),
('draw-002', 'proj-001', 'Foundation Plan', 'Foundation layout and specifications', '/uploads/drawings/foundation-plan-v1.pdf', 'application/pdf', 1536000, '1.0', 'approved', 'super-001'),
('draw-003', 'proj-002', 'Architectural Plan', 'Building architectural drawings', '/uploads/drawings/arch-plan-v1.pdf', 'application/pdf', 3072000, '1.0', 'submitted', 'super-001');
