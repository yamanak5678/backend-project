import {
    getAllEmployees as getAllEmployeesRepository,
    getEmployeeById as getEmployeeByIdRepository,
    getEmployeeByUserId as getEmployeeByUserIdRepository,
    createEmployee as createEmployeeRepository,
    updateEmployee as updateEmployeeRepository,
    deleteEmployee as deleteEmployeeRepository,
    updateEmployeeByUserId as updateEmployeeByUserIdRepository,
    getCurrentEmployeeStatus as getCurrentEmployeeStatusRepository,
    createEmployeeStatus as createEmployeeStatusRepository,
    getAllEmployeeStatuses as getAllEmployeeStatusesRepository,
    getEmployeeStatuses as getEmployeeStatusesRepository,
    deleteEmployeeStatus as deleteEmployeeStatusRepository,
    deleteEmployeeStatusForEmployee as deleteEmployeeStatusForEmployeeRepository,
    updateEmployeeStatus as updateEmployeeStatusRepository,
    updateEmployeeStatusById as updateEmployeeStatusByIdRepository
} from "../repositories/employee.repository.js";

export const getAllEmployees = async () => {
    const employees = await getAllEmployeesRepository();

    return employees;
};

export const getEmployeeById = async (id: number) => {
    const employee = await getEmployeeByIdRepository(id);

    return employee;
};

export const createEmployee = async (employee: {
    userId: number;
    phone: string;
    department: string;
    position: string;
    joiningDate: string;
}) => {
    const newEmployee = await createEmployeeRepository(employee);

    return newEmployee;
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
    const updatedEmployee = await updateEmployeeRepository(
        id,
        employee
    );

    return updatedEmployee;
};
// DELETE employee
export const deleteEmployee = async (id: number) => {
    const deletedEmployee = await deleteEmployeeRepository(id);

    return deletedEmployee;
};
// Toggle employee status
export const toggleEmployeeStatus = async (employeeId: number) => {

    const currentStatus =
        await getCurrentEmployeeStatusRepository(employeeId);

    let newStatus: string;

    if (!currentStatus) {
        newStatus = "Active";
    } else if (currentStatus.Status === "Active") {
        newStatus = "Inactive";
    } else {
        newStatus = "Active";
    }

    const description =
        `Employee status changed to ${newStatus}`;

    const status = await createEmployeeStatusRepository(
        employeeId,
        newStatus,
        description
    );

    return status;
};
// Get all employee statuses
export const getAllEmployeeStatuses = async () => {
    const statuses = await getAllEmployeeStatusesRepository();

    return statuses;
};
// Get statuses for a specific employee
export const getEmployeeStatuses = async (employeeId: number) => {
    const statuses = await getEmployeeStatusesRepository(employeeId);

    return statuses;
};
// Delete specific employee status
export const deleteEmployeeStatus = async (statusId: number) => {
    const deletedStatus =
        await deleteEmployeeStatusRepository(statusId);

    return deletedStatus;
};
export const getEmployeeByUserId = async (
    userId: number
) => {

    const employee = await getEmployeeByUserIdRepository(userId);

    return employee;
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

    const updatedEmployee =
        await updateEmployeeByUserIdRepository(
            userId,
            employee
        );

    return updatedEmployee;
};
export const getMyCurrentStatus = async (
    userId: number
) => {
    const employee = await getEmployeeByUserIdRepository(userId);

    if (!employee) {
        return null;
    }

    const status = await getCurrentEmployeeStatusRepository(
        Number(employee.EmployeeId)
    );

    return status;
};
export const updateMyStatus = async (
    userId: number,
    status: string,
    description: string
) => {
    const employee = await getEmployeeByUserIdRepository(userId);

    if (!employee) {
        return null;
    }

    const updatedStatus = await createEmployeeStatusRepository(
        Number(employee.EmployeeId),
        status,
        description
    );

    return updatedStatus;
};
export const updateEmployeeStatus = async (
    userId: number,
    statusId: number,
    status: string,
    description: string
) => {
    const employee = await getEmployeeByUserIdRepository(userId);

    if (!employee) {
        return null;
    }

    const updatedStatus = await updateEmployeeStatusRepository(
        statusId,
        Number(employee.EmployeeId),
        status,
        description
    );

    return updatedStatus;
};
   export const deleteMyStatus = async (
    userId: number,
    statusId: number
) => {
    const employee = await getEmployeeByUserIdRepository(userId);

    if (!employee) {
        return null;
    }

    const deletedStatus = await deleteEmployeeStatusForEmployeeRepository(
        statusId,
        Number(employee.EmployeeId)
    );

    return deletedStatus;
};
export const createAdminEmployeeStatus = async (
    employeeId: number,
    status: string,
    description: string
) => createEmployeeStatusRepository(employeeId, status, description);

export const updateAdminEmployeeStatus = async (
    statusId: number,
    status: string,
    description: string
) => updateEmployeeStatusByIdRepository(statusId, status, description);
