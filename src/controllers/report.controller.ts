import type { Request, Response } from "express";
import fs from "fs";

export const downloadStatusReportController = async (
    req: Request,
    res: Response
) => {
    try {
        const filePath = "reports/employee-status-report.xlsx";

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                message: "Status report not found"
            });
        }

        return res.download(
            filePath,
            "employee-status-report.xlsx",
            (error) => {
                if (error) {
                    console.error(error);
                }
            }
        );
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to download status report"
        });
    }
};