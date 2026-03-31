const db = require('../config/db');

exports.getAllDailyReports = async (req, res) => {
    try {
        const { project_id } = req.query;
        let rows;
        if (project_id) {
            [rows] = await db.query('SELECT * FROM DailyReport WHERE project_id = ? ORDER BY date DESC', [project_id]);
        } else {
            [rows] = await db.query('SELECT * FROM DailyReport ORDER BY date DESC');
        }
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// mock to fetch daily reports
// exports.getAllDailyReports = async (req, res) => {
//     res.status(200).json([
//         { id: 1, project_id: 1, material_id: null, material_dr_number: "DR001", particulars: "Cement", date: "2026-03-16", amount: 5000, paid: 3000, balance: 2000, units: "Bags", quantity: 50, received_quantity: 50, consumed_quantity: 10, remarks: "Site A" },
//         { id: 2, project_id: 1, material_id: null, material_dr_number: "DR002", particulars: "Steel", date: "2026-03-17", amount: 8000, paid: 8000, balance: 0, units: "Kg", quantity: 100, received_quantity: 100, consumed_quantity: 20, remarks: "Site B" }
//     ]);
// };

exports.getDailyReportById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM DailyReport WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'DailyReport not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createDailyReport = async (req, res) => {
    try {
        const {
            project_id, material_id, material_dr_number, particulars, date,
            amount, paid, balance, units, quantity, remarks
        } = req.body;
        const [result] = await db.query(
            'INSERT INTO DailyReport (project_id, material_id, material_dr_number, particulars, date, amount, paid, balance, units, quantity, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [project_id, material_id, material_dr_number, particulars, date, amount, paid, balance, units, quantity, remarks]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateDailyReport = async (req, res) => {
    try {
        const {
            project_id, material_id, material_dr_number, particulars, date,
            amount, paid, balance, units, quantity, remarks
        } = req.body;
        const [result] = await db.query(
            'UPDATE DailyReport SET project_id=?, material_id=?, material_dr_number=?, particulars=?, date=?, amount=?, paid=?, balance=?, units=?, quantity=?, remarks=? WHERE id=?',
            [project_id, material_id, material_dr_number, particulars, date, amount, paid, balance, units, quantity, remarks, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'DailyReport not found' });
        res.json({ message: 'DailyReport updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteDailyReport = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM DailyReport WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'DailyReport not found' });
        res.json({ message: 'DailyReport deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};