import type { Request, Response } from "express";
import { generateStatusReportService } from "../services/report.service.js";

export const downloadStatusReportController = async (
    req: Request,
    res: Response
) => {
    try {
        const filePath = await generateStatusReportService();

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
