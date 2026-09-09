import express from "express";

import employeeRoutes from "./routes/employee.routes.js";
import authRoutes from "./routes/auth.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();

const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.1.3:3000",
]);

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.has(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
    }

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());

app.use("/api/v1", employeeRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin/reports", reportRoutes);

app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        message: "API is healthy",
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "Employee Management API is running",
    });
});

export default app;
