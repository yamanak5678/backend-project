import path from "path";
import fs from "fs/promises";

import { getAllEmployeeStatuses } from "../repositories/employee.repository.js";
import { generateStatusExcel } from "../utils/excel.generator.js";

export const generateStatusReportService = async (): Promise<string> => {
    const statuses = await getAllEmployeeStatuses();

    const reportsDir = path.resolve("reports");

    await fs.mkdir(reportsDir, { recursive: true });

    const filePath = path.join(
        reportsDir,
        "employee-status-report.xlsx"
    );

    await generateStatusExcel(statuses, filePath);

    return filePath;
};