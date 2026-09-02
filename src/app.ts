import express from "express";

import employeeRoutes from "./routes/employee.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/api/v1/admin", employeeRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Employee Management API is running"
    });
});

export default app;