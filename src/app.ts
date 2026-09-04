import express from "express";

import employeeRoutes from "./routes/employee.routes.js";
import authRoutes from "./routes/auth.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();

app.use(express.json());

app.use("/api/v1", employeeRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin/reports", reportRoutes);

// Health Check
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        message: "API is healthy"
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "Employee Management API is running"
    });
});

export default app;