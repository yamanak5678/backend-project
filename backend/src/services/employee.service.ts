import bcrypt from "bcryptjs";

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
    return await getAllEmployeesRepository();
};

export const getEmployeeById = async (id: number) => {
    return await getEmployeeByIdRepository(id);
};

// CREATE EMPLOYEE
export const createEmployee = async (employee: {
    name: string;
    email: string;
    password: string;
    phone: string;
    department: string;
    position: string;
    joiningDate: string;
    status: string;
}) => {
    const passwordHash = await bcrypt.hash(
        employee.password,
        10
    );

    return await createEmployeeRepository({
        name: employee.name,
        email: employee.email,
        passwordHash,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        joiningDate: employee.joiningDate,
        status: employee.status
    });
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
    return await updateEmployeeRepository(id, employee);
};

export const deleteEmployee = async (id: number) => {
    return await deleteEmployeeRepository(id);
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

    return await createEmployeeStatusRepository(
        employeeId,
        newStatus,
        description
    );
};

export const getAllEmployeeStatuses = async () => {
    return await getAllEmployeeStatusesRepository();
};

export const getEmployeeStatuses = async (employeeId: number) => {
    return await getEmployeeStatusesRepository(employeeId);
};

export const deleteEmployeeStatus = async (statusId: number) => {
    return await deleteEmployeeStatusRepository(statusId);
};

export const getEmployeeByUserId = async (userId: number) => {
    return await getEmployeeByUserIdRepository(userId);
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
    return await updateEmployeeByUserIdRepository(
        userId,
        employee
    );
};

export const getMyCurrentStatus = async (userId: number) => {
    const employee =
        await getEmployeeByUserIdRepository(userId);

    if (!employee) {
        return null;
    }

    return await getCurrentEmployeeStatusRepository(
        Number(employee.EmployeeId)
    );
};

export const updateMyStatus = async (
    userId: number,
    status: string,
    description: string
) => {
    const employee =
        await getEmployeeByUserIdRepository(userId);

    if (!employee) {
        return null;
    }

    return await createEmployeeStatusRepository(
        Number(employee.EmployeeId),
        status,
        description
    );
};

export const updateEmployeeStatus = async (
    userId: number,
    statusId: number,
    status: string,
    description: string
) => {
    const employee =
        await getEmployeeByUserIdRepository(userId);

    if (!employee) {
        return null;
    }

    return await updateEmployeeStatusRepository(
        statusId,
        Number(employee.EmployeeId),
        status,
        description
    );
};

export const deleteMyStatus = async (
    userId: number,
    statusId: number
) => {
    const employee =
        await getEmployeeByUserIdRepository(userId);

    if (!employee) {
        return null;
    }

    return await deleteEmployeeStatusForEmployeeRepository(
        statusId,
        Number(employee.EmployeeId)
    );
};

export const createAdminEmployeeStatus = async (
    employeeId: number,
    status: string,
    description: string
) =>
    createEmployeeStatusRepository(
        employeeId,
        status,
        description
    );

export const updateAdminEmployeeStatus = async (
    statusId: number,
    status: string,
    description: string
) =>
    updateEmployeeStatusByIdRepository(
        statusId,
        status,
        description
    );