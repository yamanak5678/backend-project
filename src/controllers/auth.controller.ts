import type { Request, Response } from "express";

import {
    login as loginService,
    refreshToken as refreshTokenService,
    logout as logoutService
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