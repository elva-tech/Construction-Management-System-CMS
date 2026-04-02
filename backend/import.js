const mysql = require('mysql2/promise');

const config = {
  host: 'hopper.proxy.rlwy.net',
  port: 10344,
  user: 'root',
  password: 'uIOQoHcztrYtWCOrJKXWelcoSTxeKvuz',
  database: 'railway',
  ssl: { rejectUnauthorized: false }
};

const queries = [
  `SET FOREIGN_KEY_CHECKS = 0`,
  `TRUNCATE TABLE MaterialTrackingEntry`,
  `TRUNCATE TABLE DailyReport`,
  `TRUNCATE TABLE Drawing`,
  `TRUNCATE TABLE LabourBill`,
  `TRUNCATE TABLE LabourPayment`,
  `TRUNCATE TABLE Payment`,
  `TRUNCATE TABLE Payment_plan`,
  `TRUNCATE TABLE ProjectSupervisor`,
  `TRUNCATE TABLE RateList`,
  `TRUNCATE TABLE Material`,
  `TRUNCATE TABLE Project`,
  `TRUNCATE TABLE Client`,
  `TRUNCATE TABLE User`,
  `SET FOREIGN_KEY_CHECKS = 1`,

  `INSERT INTO User (id, username, password) VALUES ('admin-001', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')`,

  `INSERT INTO Client (id, client_name, project_no, labour_contractor, address, total_budget, created_on) VALUES
    (1,'Mr. Rajesh Kumar','#MC001','Suresh Construction','Whitefield, Bangalore','1500000','2026-03-22 15:40:19'),
    (2,'Mrs. Priya Sharma','#MC002','Ramesh Builders','Electronic City, Bangalore','1800000','2026-03-22 15:40:19'),
    (3,'Mr. Anil Reddy','#MC003','Krishna Constructions','Hosur Road, Bangalore','1700000','2026-03-22 15:40:19')`,

  `INSERT INTO Project (id, name, client_id, labour_contractor, address, total_budget, status, start_date, end_date, budget_spent, completion_percentage, created_by, created_on, updated_by, updated_on, admin_id) VALUES
    (1,'Residential Complex','admin-001','Suresh Construction','Whitefield, Bangalore',1500000.00,'Active','2025-01-01','2025-06-30',975000.00,65.00,'admin-001','2026-03-22 15:27:29','admin-001','2026-03-22 15:27:29','admin-001'),
    (2,'Commercial Tower','admin-001','Ramesh Builders','Electronic City, Bangalore',1800000.00,'Active','2024-12-15','2025-08-15',720000.00,40.00,'admin-001','2026-03-22 15:27:29','admin-001','2026-03-22 15:27:29','admin-001'),
    (3,'Hospital Building','admin-001','Krishna Constructions','Hosur Road, Bangalore',1700000.00,'Completed','2024-10-15','2024-12-15',1700000.00,100.00,'admin-001','2026-03-22 15:27:29','admin-001','2026-03-22 15:27:29','admin-001')`,

  `INSERT INTO Material (id, project_id, particulars, unit) VALUES
    (1,1,'Steel','kg'),(2,1,'Cement','bags'),(3,2,'Bricks','nos'),(4,2,'Sand','tons'),(5,3,'Tiles','sqft'),(6,3,'Paint','ltrs')`,

  `INSERT INTO Payment (id, project_id, particulars, date, amount, paid_through, remarks) VALUES
    (1,1,'Installment 1','2026-03-17',200000.00,'Cash','First installment'),
    (2,1,'Installment 2','2026-03-18',150000.00,'Bank Transfer','Second installment'),
    (3,2,'Installment 1','2026-02-10',300000.00,'Bank Transfer','First installment'),
    (4,2,'Installment 2','2026-03-05',200000.00,'Cash','Second installment'),
    (5,3,'Installment 1','2026-01-20',500000.00,'Cheque','First installment'),
    (6,3,'Installment 2','2026-02-05',400000.00,'Bank Transfer','Second installment')`,

  `INSERT INTO Payment_plan (id, project_id, particulars, date, amount) VALUES
    (1,1,'Phase 1','2026-03-20',300000.00),(2,1,'Phase 2','2026-04-20',500000.00),
    (3,2,'Phase 1','2026-03-15',400000.00),(4,2,'Phase 2','2026-05-15',600000.00),
    (5,3,'Phase 1','2026-02-01',500000.00),(6,3,'Phase 2','2026-04-01',700000.00)`,

  `INSERT INTO RateList (id, project_id, head_mason_rate, mason_rate, m_helper_rate, w_helper_rate, column_barbending_rate) VALUES
    (1,1,800.00,800.00,600.00,400.00,500.00),(2,2,800.00,800.00,600.00,400.00,500.00)`,

  `INSERT INTO LabourBill (id, project_id, date, bar_bender, head_mason, mason, m_helper, w_helper, total, extra_payment, remarks) VALUES
    (1,1,'2026-03-17','General Work',2,3,4,2,11,0.00,'Week 1'),
    (2,1,'2026-03-18','Column Work',1,2,3,1,7,500.00,'Week 2')`,

  `INSERT INTO LabourPayment (id, project_id, particulars, date, net_amount, extra, labour_amount, cumulative_amount) VALUES
    (1,1,'Week 1','2026-03-17',5000.00,0.00,5000.00,5000.00),
    (2,1,'Week 2','2026-03-18',7000.00,500.00,7500.00,12500.00),
    (3,2,'Week 1','2026-02-10',4500.00,0.00,4500.00,4500.00),
    (4,2,'Week 2','2026-03-05',7000.00,500.00,7500.00,12000.00),
    (5,3,'Week 1','2026-01-20',4000.00,0.00,4000.00,4000.00),
    (6,3,'Week 2','2026-02-05',5000.00,300.00,5300.00,9300.00)`,

  `INSERT INTO MaterialTrackingEntry (id, material_id, date, received_quantity, consumed_quantity) VALUES
    (1,1,'2026-03-17',100.00,40.00),(2,1,'2026-03-18',50.00,10.00),
    (3,2,'2026-03-17',200.00,80.00),(4,3,'2026-02-10',500.00,100.00),
    (5,4,'2026-02-15',20.00,5.00),(6,5,'2026-01-20',300.00,80.00),(7,6,'2026-02-05',100.00,20.00)`,

  `INSERT INTO DailyReport (id, project_id, material_id, material_dr_number, particulars, date, amount, paid, balance, units, quantity, remarks) VALUES
    (1,1,1,'DR001','Steel','2026-03-17',50000.00,30000.00,20000.00,'kg',100.00,'First delivery'),
    (2,1,2,'DR002','Cement','2026-03-18',25000.00,25000.00,0.00,'bags',200.00,'Full payment'),
    (3,1,NULL,'DR003','Cement','2026-03-22',25000.00,1000.00,24000.00,'kg',10.00,'good'),
    (4,1,1,'DR003','Steel','2026-01-15',30000.00,20000.00,10000.00,'kg',50.00,'January delivery'),
    (5,1,2,'DR004','Cement','2026-02-10',15000.00,15000.00,0.00,'bags',100.00,'February delivery'),
    (6,2,NULL,'DR010','Bricks','2026-02-10',40000.00,30000.00,10000.00,'nos',500.00,'First batch'),
    (7,2,NULL,'DR011','Sand','2026-02-15',18000.00,18000.00,0.00,'tons',20.00,'Full payment'),
    (8,2,NULL,'DR012','Bricks','2026-03-05',35000.00,20000.00,15000.00,'nos',400.00,'Second batch'),
    (9,3,NULL,'DR020','Tiles','2026-01-20',60000.00,60000.00,0.00,'sqft',300.00,'Full payment'),
    (10,3,NULL,'DR021','Paint','2026-02-05',25000.00,15000.00,10000.00,'ltrs',100.00,'Partial payment'),
    (11,3,NULL,'DR022','Tiles','2026-03-01',45000.00,30000.00,15000.00,'sqft',200.00,'Second batch'),
    (12,2,NULL,'DR013','Bricks','2026-04-01',35000.00,1.00,34999.00,'1kg',2.00,'ok')`,

  `INSERT INTO Drawing (id, project_id, particulars, file_url, status) VALUES
    (2,1,'Plinth Beam Plan',NULL,'Approved'),
    (3,1,'Site Diagram',NULL,'Rejected'),
    (4,1,'Blue Print',NULL,'Submitted'),
    (6,2,'Floor Plan',NULL,'Approved'),
    (7,2,'Elevation View',NULL,'Submitted'),
    (8,3,'Site Layout',NULL,'Approved'),
    (9,3,'Structural Plan',NULL,'Rejected'),
    (10,2,'cvcv',NULL,'Rejected')`,

  `SET FOREIGN_KEY_CHECKS = 1`
];

async function run() {
  const conn = await mysql.createConnection(config);
  console.log('Connected to Railway MySQL');
  for (const q of queries) {
    try {
      await conn.execute(q);
      console.log('OK:', q.substring(0, 50));
    } catch (e) {
      console.error('FAIL:', q.substring(0, 50), '|', e.message);
    }
  }
  await conn.end();
  console.log('Done!');
}

run();
