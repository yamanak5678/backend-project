    import { poolPromise } from "../config/database.js";

    export const getAllEmployees = async () => {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .query(`
                SELECT e.*, u.Name, u.Email
                FROM Employees e
                INNER JOIN Users u ON u.UserId = e.UserId
                ORDER BY e.EmployeeId DESC
            `);

        return result.recordset;
    };

    export const getEmployeeById = async (id: number) => {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("EmployeeId", id)
            .query(`
                SELECT e.*, u.Name, u.Email
                FROM Employees e
                INNER JOIN Users u ON u.UserId = e.UserId
                WHERE e.EmployeeId = @EmployeeId
            `);

        return result.recordset[0];
    };
 export const createEmployee = async (employee: {
    name: string;
    email: string;
    passwordHash: string;
    phone: string;
    department: string;
    position: string;
    joiningDate: string;
    status: string;
}) => {
    const pool = await poolPromise;

    const transaction = pool.transaction();

    try {
        await transaction.begin();

        // 1. Check duplicate email
        const existingUser = await transaction
            .request()
            .input("Email", employee.email)
            .query(`
                SELECT UserId
                FROM Users
                WHERE Email = @Email
            `);

        if (existingUser.recordset.length > 0) {
            throw new Error("EMAIL_ALREADY_EXISTS");
        }

        // 2. Create User
        const userResult = await transaction
            .request()
            .input("Name", employee.name)
            .input("Email", employee.email)
            .input("PasswordHash", employee.passwordHash)
            .query(`
                INSERT INTO Users
                    (Name, Email, PasswordHash, Role)
                OUTPUT INSERTED.UserId
                VALUES
                    (@Name, @Email, @PasswordHash, 'Employee')
            `);

        const userId = userResult.recordset[0].UserId;

        // 3. Create Employee
        const employeeResult = await transaction
            .request()
            .input("UserId", userId)
            .input("Phone", employee.phone)
            .input("Department", employee.department)
            .input("Position", employee.position)
            .input("JoiningDate", employee.joiningDate)
            .query(`
                INSERT INTO Employees
                    (UserId, Phone, Department, Position, JoiningDate)
                OUTPUT INSERTED.EmployeeId
                VALUES
                    (@UserId, @Phone, @Department, @Position, @JoiningDate)
            `);

        const employeeId =
            employeeResult.recordset[0].EmployeeId;

        // 4. Create initial status
        await transaction
            .request()
            .input("EmployeeId", employeeId)
            .input("Status", employee.status)
            .input(
                "Description",
                `Employee created with status ${employee.status}`
            )
            .query(`
                INSERT INTO EmployeeStatuses
                    (EmployeeId, Status, Description)
                VALUES
                    (@EmployeeId, @Status, @Description)
            `);

        await transaction.commit();

        // 5. Return complete employee
        const result = await pool
            .request()
            .input("EmployeeId", employeeId)
            .query(`
                SELECT
                    e.*,
                    u.Name,
                    u.Email,
                    u.Role
                FROM Employees e
                INNER JOIN Users u
                    ON u.UserId = e.UserId
                WHERE e.EmployeeId = @EmployeeId
            `);

        return result.recordset[0];

    } catch (error) {
        try {
            await transaction.rollback();
        } catch {
            // Transaction already rolled back
        }

        throw error;
    }
};

   export const updateEmployee = async (
    id: number,
    employee: {
        name: string;
        email: string;
        phone: string;
        department: string;
        position: string;
        joiningDate: string;
    }
) => {
    const pool = await poolPromise;

    const transaction = pool.transaction();

    try {
        await transaction.begin();

        // First get UserId for this Employee
        const employeeResult = await transaction
            .request()
            .input("EmployeeId", id)
            .query(`
                SELECT UserId
                FROM Employees
                WHERE EmployeeId = @EmployeeId
            `);

        const existingEmployee = employeeResult.recordset[0];

        if (!existingEmployee) {
            await transaction.rollback();
            return null;
        }

        const userId = existingEmployee.UserId;

        // Update Users table
        await transaction
            .request()
            .input("UserId", userId)
            .input("Name", employee.name)
            .input("Email", employee.email)
            .query(`
                UPDATE Users
                SET
                    Name = @Name,
                    Email = @Email
                WHERE UserId = @UserId
            `);

        // Update Employees table
        const result = await transaction
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
                WHERE EmployeeId = @EmployeeId
            `);

        await transaction.commit();

        // Return complete updated employee
        const updatedResult = await pool
            .request()
            .input("EmployeeId", id)
            .query(`
                SELECT e.*, u.Name, u.Email
                FROM Employees e
                INNER JOIN Users u ON u.UserId = e.UserId
                WHERE e.EmployeeId = @EmployeeId
            `);

        return updatedResult.recordset[0];

    } catch (error) {
        try {
            await transaction.rollback();
        } catch {
            // Transaction already rolled back
        }

        throw error;
    }
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
                SELECT e.*, u.Name, u.Email
                FROM Employees e
                INNER JOIN Users u ON u.UserId = e.UserId
                WHERE e.UserId = @UserId
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
    export const updateEmployeeStatus = async (
    statusId: number,
    employeeId: number,
    status: string,
    description: string
) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("StatusId", statusId)
        .input("EmployeeId", employeeId)
        .input("Status", status)
        .input("Description", description)
        .query(`
            UPDATE EmployeeStatuses
            SET
                Status = @Status,
                Description = @Description,
                UpdatedAt = GETDATE()
            OUTPUT INSERTED.*
            WHERE StatusId = @StatusId
              AND EmployeeId = @EmployeeId
        `);

    return result.recordset[0];
};

export const updateEmployeeStatusById = async (
    statusId: number,
    status: string,
    description: string
) => {
    const pool = await poolPromise;
    const result = await pool
        .request()
        .input("StatusId", statusId)
        .input("Status", status)
        .input("Description", description)
        .query(`
            UPDATE EmployeeStatuses
            SET Status = @Status, Description = @Description, UpdatedAt = GETDATE()
            OUTPUT INSERTED.*
            WHERE StatusId = @StatusId
        `);
    return result.recordset[0];
};

export const deleteEmployeeStatusForEmployee = async (
    statusId: number,
    employeeId: number
) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("StatusId", statusId)
        .input("EmployeeId", employeeId)
        .query(`
            DELETE FROM EmployeeStatuses
            OUTPUT DELETED.*
            WHERE StatusId = @StatusId AND EmployeeId = @EmployeeId
        `);

    return result.recordset[0];
};
