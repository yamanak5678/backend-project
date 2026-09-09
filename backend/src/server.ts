import app from "./app.js";
import { poolPromise } from "./config/database.js";
import { startStatusReportCron } from "./jobs/report.cron.js";

const PORT = 5000;

async function startServer() {
    try {
        // Connect to SQL Server database
        await poolPromise;

        console.log("✅ Database connected successfully");

        // Start hourly report cron job
        startStatusReportCron();

        // Start Express server
        app.listen(PORT, () => {
            console.log(
                `✅ Server running on http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "❌ Database connection failed:",
            error
        );

        process.exit(1);
    }
}

startServer();