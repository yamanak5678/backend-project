import cron from "node-cron";

import { generateStatusReportService } from "../services/report.service.js";

export const startStatusReportCron = (): void => {
    cron.schedule("0 * * * *", async () => {
        try {
            console.log("⏰ Generating hourly status report...");

            const filePath = await generateStatusReportService();

            console.log(`✅ Status report generated: ${filePath}`);
        } catch (error) {
            console.error("❌ Failed to generate status report:", error);
        }
    });

    console.log("⏰ Hourly status report cron job started");
};