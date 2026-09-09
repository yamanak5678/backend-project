import ExcelJS from "exceljs";
import path from "path";

export const generateStatusExcel = async (
    statuses: any[],
    filePath: string
): Promise<void> => {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Employee Statuses");

    worksheet.columns = [
        { header: "Status ID", key: "StatusId", width: 12 },
        { header: "Employee ID", key: "EmployeeId", width: 15 },
        { header: "Status", key: "Status", width: 20 },
        { header: "Start Time", key: "StartTime", width: 25 },
        { header: "End Time", key: "EndTime", width: 25 },
    ];

    statuses.forEach((status) => {
        worksheet.addRow({
            StatusId: status.StatusId,
            EmployeeId: status.EmployeeId,
            Status: status.Status,
            StartTime: status.StartTime,
            EndTime: status.EndTime,
        });
    });

    await workbook.xlsx.writeFile(path.resolve(filePath));
};