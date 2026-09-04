import app from "./app.js";
import { poolPromise } from "./config/database.js";
import { startStatusReportCron } from "./jobs/report.cron.js";

const PORT = 5000;

async function startServer() {
    try {
        await poolPromise;

        console.log("Database connected successfully");

        startStatusReportCron();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

startServer();