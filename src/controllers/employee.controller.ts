import type { Request, Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
    getAllEmployees as getAllEmployeesService,
    getEmployeeById as getEmployeeByIdService,
    getEmployeeByUserId as getEmployeeByUserIdService,
    createEmployee as createEmployeeService,
    updateEmployee as updateEmployeeService,
    deleteEmployee as deleteEmployeeService,
    toggleEmployeeStatus as toggleEmployeeStatusService,
    getAllEmployeeStatuses as getAllEmployeeStatusesService,
    getEmployeeStatuses as getEmployeeStatusesService,
    deleteEmployeeStatus as deleteEmployeeStatusService,
    updateEmployeeByUserId as updateEmployeeByUserIdService,
    getMyCurrentStatus as getMyCurrentStatusService
} from "../services/employee.service.js";
import {
    validateEmployee,
    validateUpdateEmployee
} from "../validations/employee.validation.js";

// GET all employees
export const getAllEmployees = async (
    req: Request,
    res: Response
) => {
    try {
        const employees = await getAllEmployeesService();

        res.json(employees);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch employees"
        });
    }
};


// GET employee by ID
export const getEmployeeByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const employee = await getEmployeeByIdService(id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json(employee);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch employee"
        });
    }
};
// CREATE employee
export const createEmployeeController = async (
    req: Request,
    res: Response
) => {
    try {
        const errors = validateEmployee(req.body);

        if (errors.length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors
            });
        }

        const newEmployee = await createEmployeeService(req.body);

        res.status(201).json(newEmployee);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create employee"
        });
    }
};
// UPDATE employee
export const updateEmployeeController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        // Validate update data
        const errors = validateUpdateEmployee(req.body);(req.body);

        if (errors.length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors
            });
        }

        const updatedEmployee = await updateEmployeeService(
            id,
            req.body
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json(updatedEmployee);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update employee"
        });
    }
};
// DELETE employee
export const deleteEmployeeController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const deletedEmployee = await deleteEmployeeService(id);

        if (!deletedEmployee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({
            message: "Employee deleted successfully",
            employee: deletedEmployee
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete employee"
        });
    }
};
// PATCH employee status
export const toggleEmployeeStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const employee = await getEmployeeByIdService(id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const status = await toggleEmployeeStatusService(id);

        res.json(status);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update employee status"
        });
    }
};
// GET all employee statuses
export const getAllEmployeeStatusesController = async (
    req: Request,
    res: Response
) => {
    try {
        const statuses = await getAllEmployeeStatusesService();

        res.json(statuses);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch employee statuses"
        });
    }
};
// GET statuses for specific employee
export const getEmployeeStatusesController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const employee = await getEmployeeByIdService(id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const statuses = await getEmployeeStatusesService(id);

        res.json(statuses);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch employee statuses"
        });
    }
};
// DELETE specific employee status
export const deleteEmployeeStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const statusId = Number(req.params.statusId);

        const deletedStatus =
            await deleteEmployeeStatusService(statusId);

        if (!deletedStatus) {
            return res.status(404).json({
                message: "Status not found"
            });
        }

        res.json({
            message: "Employee status deleted successfully",
            status: deletedStatus
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete employee status"
        });
    }
};
export const getMyProfileController = async (
    req: AuthRequest,
    res: Response
) => {
    try {

        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const employee = await getEmployeeByUserIdService(
            req.user.userId
        );

        if (!employee) {
            return res.status(404).json({
                message: "Employee profile not found"
            });
        }

        return res.json(employee);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to get profile"
        });
    }
};
export const getMyCurrentStatusController = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const status = await getMyCurrentStatusService(
            req.user.userId
        );

        if (!status) {
            return res.status(404).json({
                message: "Employee status not found"
            });
        }

        return res.json(status);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to get employee status"
        });
    }
};

export const updateMyProfileController = async (
    req: AuthRequest,
    res: Response
) => {
    try {

        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const {
            phone,
            department,
            position,
            joiningDate
        } = req.body;

        if (
            !phone ||
            !department ||
            !position ||
            !joiningDate
        ) {
            return res.status(400).json({
                message:
                    "Phone, department, position and joiningDate are required"
            });
        }

        const updatedEmployee =
            await updateEmployeeByUserIdService(
                req.user.userId,
                {
                    phone,
                    department,
                    position,
                    joiningDate
                }
            );

        if (!updatedEmployee) {
            return res.status(404).json({
                message: "Employee profile not found"
            });
        }

        return res.json(updatedEmployee);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to update profile"
        });
    }
};