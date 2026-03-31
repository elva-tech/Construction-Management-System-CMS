const pool = require('../config/db');

// Create a new client
const createClient = async (req, res) => {
    try {
        const { clientName, projectNo, labourContractor, address, totalBudget, projects } = req.body;
        if (!clientName) {
            return res.status(400).json({ success: false, message: 'Missing required field: clientName' });
        }
        const query = `INSERT INTO Client (client_name, project_no, labour_contractor, address, total_budget) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [clientName, projectNo || null, labourContractor || null, address || null, totalBudget || null]);
        res.status(201).json({ success: true, message: 'Client created successfully', data: { id: result.insertId, clientName, projectNo, labourContractor, address, totalBudget } });
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ success: false, message: 'Error creating client', error: error.message });
    }
};

// mock to create client
// const createClient = async (req, res) => {
//     const { clientName, projectNo, labourContractor, address, totalBudget, projects } = req.body;
//     res.status(201).json({
//         success: true,
//         message: 'Client created successfully',
//         data: {
//             id: Date.now(),
//             clientName,
//             projectNo: projectNo || '',
//             labourContractor: labourContractor || '',
//             address: address || '',
//             totalBudget: totalBudget || '',
//             projects: projects || []
//         }
//     });
// };

// Get all clients
const getAllClients = async (req, res) => {
    try {
        const query = `SELECT * FROM Client ORDER BY client_name ASC`;
        const [clients] = await pool.execute(query);
        res.status(200).json({ success: true, data: clients });
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ success: false, message: 'Error fetching clients', error: error.message });
    }
};

// mock to fetch clients
// const getAllClients = async (req, res) => {
//     res.status(200).json({
//         success: true,
//         data: [
//             {
//                 id: 1,
//                 clientName: "Mr. Rajesh Kumar",
//                 projectNo: "#MC001",
//                 labourContractor: "Suresh Construction",
//                 address: "Whitefield, Bangalore",
//                 totalBudget: "1500000",
//                 projects: ["Residential Complex"]
//             },
//             {
//                 id: 2,
//                 clientName: "Mrs. Priya Sharma",
//                 projectNo: "#MC002",
//                 labourContractor: "Ramesh Builders",
//                 address: "Electronic City, Bangalore",
//                 totalBudget: "1800000",
//                 projects: ["Commercial Tower"]
//             },
//             {
//                 id: 3,
//                 clientName: "Mr. Anil Reddy",
//                 projectNo: "#MC003",
//                 labourContractor: "Krishna Constructions",
//                 address: "Hosur Road, Bangalore",
//                 totalBudget: "1700000",
//                 projects: ["Hospital Building"]
//             }
//         ]
//     });
// };

// Update a client
const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientName, projectNo, labourContractor, address, totalBudget } = req.body;
        const [existing] = await pool.execute('SELECT * FROM Client WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ success: false, message: 'Client not found' });
        const query = `UPDATE Client SET client_name=?, project_no=?, labour_contractor=?, address=?, total_budget=? WHERE id=?`;
        await pool.execute(query, [clientName, projectNo || null, labourContractor || null, address || null, totalBudget || null, id]);
        res.status(200).json({ success: true, message: 'Client updated successfully', data: { id: parseInt(id) } });
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ success: false, message: 'Error updating client', error: error.message });
    }
};

// mock to update client
// const updateClient = async (req, res) => {
//     const { id } = req.params;
//     res.status(200).json({ success: true, message: 'Client updated successfully', data: { id: parseInt(id) } });
// };

module.exports = { createClient, getAllClients, updateClient };