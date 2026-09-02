import { poolPromise } from "../config/database.js";

export const getAllEmployees = async () => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .query("SELECT * FROM Employees");

    return result.recordset;
};

export const getEmployeeById = async (id: number) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("EmployeeId", id)
        .query("SELECT * FROM Employees WHERE EmployeeId = @EmployeeId");

    return result.recordset[0];
};
export const createEmployee = async (employee: {
    userId: number;
    phone: string;
    department: string;
    position: string;
    joiningDate: string;
}) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("UserId", employee.userId)
        .input("Phone", employee.phone)
        .input("Department", employee.department)
        .input("Position", employee.position)
        .input("JoiningDate", employee.joiningDate)
        .query(`
            INSERT INTO Employees
                (UserId, Phone, Department, Position, JoiningDate)
            OUTPUT INSERTED.*
            VALUES
                (@UserId, @Phone, @Department, @Position, @JoiningDate)
        `);

    return result.recordset[0];
};

export const updateEmployee = async (
    id: number,
    employee: {
        phone: string;
        department: string;
        position: string;
        joiningDate: string;
    }
) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("EmployeeId", id)
        .input("Phone", employee.phone)
        .input("Department", employee.department)
        .input("Position", employee.position)
        .input("JoiningDate", employee.joiningDate)
        .query(`
            UPDATE Employees
            SET
                Phone = @Phone,
                Department = @Department,
                Position = @Position,
                JoiningDate = @JoiningDate,
                UpdatedAt = GETDATE()
            OUTPUT INSERTED.*
            WHERE EmployeeId = @EmployeeId
        `);

    return result.recordset[0];
};
export const deleteEmployee = async (id: number) => {
    const pool = await poolPromise;

    const transaction = pool.transaction();

    try {
        await transaction.begin();

        // 1. Delete employee status records
        await transaction
            .request()
            .input("EmployeeId", id)
            .query(`
                DELETE FROM EmployeeStatuses
                WHERE EmployeeId = @EmployeeId
            `);

        // 2. Delete employee
        const result = await transaction
            .request()
            .input("EmployeeId", id)
            .query(`
                DELETE FROM Employees
                OUTPUT DELETED.*
                WHERE EmployeeId = @EmployeeId
            `);

        await transaction.commit();

        return result.recordset[0];

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
// Get latest status of an employee
export const getCurrentEmployeeStatus = async (employeeId: number) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("EmployeeId", employeeId)
        .query(`
            SELECT TOP 1 *
            FROM EmployeeStatuses
            WHERE EmployeeId = @EmployeeId
            ORDER BY StatusId DESC
        `);

    return result.recordset[0];
};


// Create new employee status
export const createEmployeeStatus = async (
    employeeId: number,
    status: string,
    description: string
) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("EmployeeId", employeeId)
        .input("Status", status)
        .input("Description", description)
        .query(`
            INSERT INTO EmployeeStatuses
                (EmployeeId, Status, Description)
            OUTPUT INSERTED.*
            VALUES
                (@EmployeeId, @Status, @Description)
        `);

    return result.recordset[0];
};
// Get all employee statuses
export const getAllEmployeeStatuses = async () => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .query(`
            SELECT *
            FROM EmployeeStatuses
            ORDER BY StatusId DESC
        `);

    return result.recordset;
};
// Get all statuses for a specific employee
export const getEmployeeStatuses = async (employeeId: number) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("EmployeeId", employeeId)
        .query(`
            SELECT *
            FROM EmployeeStatuses
            WHERE EmployeeId = @EmployeeId
            ORDER BY StatusId DESC
        `);

    return result.recordset;
};
// Delete specific employee status
export const deleteEmployeeStatus = async (statusId: number) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("StatusId", statusId)
        .query(`
            DELETE FROM EmployeeStatuses
            OUTPUT DELETED.*
            WHERE StatusId = @StatusId
        `);

    return result.recordset[0];
};
export const getEmployeeByUserId = async (
    userId: number
) => {

    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("UserId", userId)
        .query(`
            SELECT *
            FROM Employees
            WHERE UserId = @UserId
        `);

    return result.recordset[0];
};
export const updateEmployeeByUserId = async (
    userId: number,
    employee: {
        phone: string;
        department: string;
        position: string;
        joiningDate: string;
    }
) => {

    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("UserId", userId)
        .input("Phone", employee.phone)
        .input("Department", employee.department)
        .input("Position", employee.position)
        .input("JoiningDate", employee.joiningDate)
        .query(`
            UPDATE Employees
            SET
                Phone = @Phone,
                Department = @Department,
                Position = @Position,
                JoiningDate = @JoiningDate,
                UpdatedAt = GETDATE()
            OUTPUT INSERTED.*
            WHERE UserId = @UserId
        `);

    return result.recordset[0];
};