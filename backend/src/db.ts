import sql from "mssql/msnodesqlv8";

const config: sql.config = {
    server: "localhost",
    database: "EmployeeManagementDB",

    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

export const poolPromise = sql.connect(config);