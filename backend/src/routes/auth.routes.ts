import express from "express";

import {
    loginController,
    refreshTokenController,
    logoutController,
    changePasswordController,
} from "../controllers/auth.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();


// Login
router.post("/login", loginController);




// Refresh access token
router.post("/refresh", refreshTokenController);


// Logout
router.post("/logout", logoutController);

// Change logged-in user's password
router.put(
    "/change-password",
    authenticateToken,
    changePasswordController
);

export default router; 