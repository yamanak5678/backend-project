import express from "express";

import {
    loginController,
    refreshTokenController,
    logoutController
} from "../controllers/auth.controller.js";

const router = express.Router();


// Login
router.post("/login", loginController);


// Refresh access token
router.post("/refresh", refreshTokenController);


// Logout
router.post("/logout", logoutController);


export default router;