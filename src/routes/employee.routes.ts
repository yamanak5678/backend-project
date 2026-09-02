import express from "express";

import {
    getAllEmployees,
    getEmployeeByIdController,
    createEmployeeController,
    updateEmployeeController,
    deleteEmployeeController,
    toggleEmployeeStatusController,
    getAllEmployeeStatusesController,
    getEmployeeStatusesController,
    deleteEmployeeStatusController,
    getMyProfileController,
    updateMyProfileController
} from "../controllers/employee.controller.js";

// 🔐 Middleware imports
import {
    authenticateToken
} from "../middleware/auth.middleware.js";

import {
    requireAdmin
} from "../middleware/admin.middleware.js";

const router = express.Router();


// GET all employees
router.get(
    "/employees",
    authenticateToken,
    requireAdmin,
    getAllEmployees
);

// Get logged-in user's profile
router.get(
    "/employees/me",
    authenticateToken,
    getMyProfileController
);

// GET employee by ID
router.get(
    "/employees/:id",
    authenticateToken,
    requireAdmin,
    getEmployeeByIdController
);

// Update logged-in user's profile
router.put(
    "/employees/me",
    authenticateToken,
    updateMyProfileController
);

// CREATE employee
router.post(
    "/employees",
    authenticateToken,
    requireAdmin,
    createEmployeeController
);


// UPDATE employee
router.put(
    "/employees/:id",
    authenticateToken,
    requireAdmin,
    updateEmployeeController
);


// DELETE employee
router.delete(
    "/employees/:id",
    authenticateToken,
    requireAdmin,
    deleteEmployeeController
);


// GET all employee statuses
router.get(
    "/statuses",
    authenticateToken,
    requireAdmin,
    getAllEmployeeStatusesController
);


// TOGGLE employee status
router.patch(
    "/employees/:id/status",
    authenticateToken,
    requireAdmin,
    toggleEmployeeStatusController
);


// GET statuses for specific employee
router.get(
    "/employees/:id/statuses",
    authenticateToken,
    requireAdmin,
    getEmployeeStatusesController
);


// DELETE specific employee status
router.delete(
    "/statuses/:statusId",
    authenticateToken,
    requireAdmin,
    deleteEmployeeStatusController
);


export default router;