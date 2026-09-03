import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
    login as loginService,
    refreshToken as refreshTokenService,
    logout as logoutService,
    changePassword as changePasswordService,
} from "../services/auth.service.js";


export const loginController = async (
    req: Request,
    res: Response
) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await loginService(email, password);

        res.json(result);

    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "Invalid email or password"
        ) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.status(500).json({
            message: "Login failed"
        });
    }
};
export const refreshTokenController = async (
    req: Request,
    res: Response
) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token is required"
            });
        }

        const result = await refreshTokenService(refreshToken);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
};
export const logoutController = async (
    req: Request,
    res: Response
) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token is required"
            });
        }

        const result = await logoutService(refreshToken);

        return res.json(result);

    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "Invalid refresh token"
        ) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        return res.status(500).json({
            message: "Logout failed"
        });
    }
};
// CHANGE logged-in user's password

export const changePasswordController = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters"
            });
        }

        const result = await changePasswordService(
            req.user.userId,
            currentPassword,
            newPassword
        );

        return res.json({
            message: "Password changed successfully",
            user: result
        });

    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "Current password is incorrect"
        ) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        if (
            error instanceof Error &&
            error.message === "User not found"
        ) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(500).json({
            message: "Failed to change password"
        });
    }
};