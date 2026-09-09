import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const sql = require("mssql/msnodesqlv8");

const config = {
    server: "localhost\\SQLEXPRESS",
    database: "EmployeeManagementDB",
    driver: "ODBC Driver 18 for SQL Server",

    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

export const poolPromise = sql.connect(config);

poolPromise
    .then(() => {
        console.log("✅ Database connected successfully");
    })
    .catch((error: unknown) => {
        console.error("❌ Database connection failed:");
        console.error(error);
    });