const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const { tokenMiddleware } = require("./middleware/auth.middleware");
const authRoutes = require("./routes/auth.routes");
const paymentRoutes = require("./routes/payment.routes");
const projectRoutes = require("./routes/project.routes");
const userRoutes = require("./routes/user.routes");
const paymentPlanRoutes = require("./routes/payment_plan.routes");
const rateListRoutes = require("./routes/rate_list.routes");
const drawingRoutes = require("./routes/drawing.routes");
const materialRoutes = require("./routes/material.routes");
const labourBillRoutes = require("./routes/labourBill.routes");
const labourPaymentRoutes = require("./routes/labourPayment.routes");
const projectSupervisorRoutes = require("./routes/projectSupervisor.routes");
const clientRoutes = require("./routes/Client.routes");

const dailyReportRoutes = require("./routes/dailyReport.routes");
const materialTrackingRoutes = require("./routes/materialTrackingEntry.routes");

const app = express();

// Configure CORS properly for credentials
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://construction-management-system-cms-1.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};// For legacy browser support


// Middleware
app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(tokenMiddleware); // Add the token middleware

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Test route is working" });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/payment-plans", paymentPlanRoutes);
app.use("/api/v1/rate-lists", rateListRoutes);
app.use("/api/v1/drawings", drawingRoutes);
app.use("/api/v1/materials", materialRoutes);
app.use("/api/v1/labour-bills", labourBillRoutes);
app.use("/api/v1/labour-payments", labourPaymentRoutes);
app.use("/api/v1/project-supervisors", projectSupervisorRoutes);
app.use("/api/v1/clients", clientRoutes);
//added route
app.use("/api/v1/dailyReports", dailyReportRoutes);
app.use("/api/v1/material-tracking", materialTrackingRoutes);



// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Construction Management API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the server at: http://localhost:${PORT}/test`);
});