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
    createAdminEmployeeStatusController,
    updateAdminEmployeeStatusController,
    getMyProfileController,
    getMyCurrentStatusController,
    updateMyProfileController,
    createMyStatusController,
    getMyStatusHistoryController,
    updateMyStatusByIdController,
    deleteMyStatusController,
    
} from "../controllers/employee.controller.js";

import {
    authenticateToken
} from "../middleware/auth.middleware.js";

import {
    requireAdmin
} from "../middleware/admin.middleware.js";

import { changePasswordController } 
from "../controllers/auth.controller.js";

const router = express.Router();


// ===============================
// ADMIN - EMPLOYEE MANAGEMENT
// ===============================

// GET all employees
router.get(
    "/admin/employees",
    authenticateToken,
    requireAdmin,
    getAllEmployees
);

// GET employee by ID
router.get(
    "/admin/employees/:id",
    authenticateToken,
    requireAdmin,
    getEmployeeByIdController
);

// CREATE employee
router.post(
    "/admin/employees",
    authenticateToken,
    requireAdmin,
    createEmployeeController
);

// UPDATE employee
router.put(
    "/admin/employees/:id",
    authenticateToken,
    requireAdmin,
    updateEmployeeController
);

// GET logged-in user's latest status
router.get(
    "/employees/me/status",
    authenticateToken,
    getMyCurrentStatusController
);

router.post(
    "/admin/statuses",
    authenticateToken,
    requireAdmin,
    createAdminEmployeeStatusController
);

router.patch(
    "/admin/statuses/:statusId",
    authenticateToken,
    requireAdmin,
    updateAdminEmployeeStatusController
);

// DELETE employee
router.delete(
    "/admin/employees/:id",
    authenticateToken,
    requireAdmin,
    deleteEmployeeController
);

// TOGGLE employee status
router.patch(
    "/admin/employees/:id/status",
    authenticateToken,
    requireAdmin,
    toggleEmployeeStatusController
);


// ===============================
// ADMIN - STATUS OVERSIGHT
// ===============================

// GET all employee statuses
router.get(
    "/admin/statuses",
    authenticateToken,
    requireAdmin,
    getAllEmployeeStatusesController
);

// GET statuses for specific employee
router.get(
    "/admin/employees/:id/statuses",
    authenticateToken,
    requireAdmin,
    getEmployeeStatusesController
);

// DELETE specific status
router.delete(
    "/admin/statuses/:statusId",
    authenticateToken,
    requireAdmin,
    deleteEmployeeStatusController
);


// ===============================
// EMPLOYEE - PROFILE
// ===============================

// GET own profile
router.get(
    "/employees/me",
    authenticateToken,
    getMyProfileController
);

// UPDATE own profile
router.put(
    "/employees/me",
    authenticateToken,
    updateMyProfileController
);


// ===============================
// EMPLOYEE - STATUS
// ===============================
// POST new status
router.post(
    "/employees/me/statuses",
    authenticateToken,
    createMyStatusController
);

// GET own status history
router.get(
    "/employees/me/statuses",
    authenticateToken,
    getMyStatusHistoryController
);

// UPDATE own status
router.patch(
    "/employees/me/statuses/:statusId",
    authenticateToken,
    updateMyStatusByIdController
);
router.delete(
    "/employees/me/statuses/:statusId",
    authenticateToken,
    deleteMyStatusController
);

// CHANGE PASSWORD

router.patch(
    "/employees/me/password",
    authenticateToken,
    changePasswordController
);
export default router;
