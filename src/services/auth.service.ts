import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
    getUserByEmail as getUserByEmailRepository
} from "../repositories/auth.repository.js";

import {
    saveRefreshToken,
    deleteRefreshToken
} from "../repositories/refreshToken.repository.js";

const JWT_SECRET = "my_secret_key";

export const login = async (
    email: string,
    password: string
) => {

    // Find user
    const user = await getUserByEmailRepository(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.PasswordHash
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    // Create access token
    const accessToken = jwt.sign(
        {
            userId: user.UserId,
            role: user.Role
        },
        JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );

    // Create refresh token
   const refreshToken = jwt.sign(
    {
        userId: user.UserId
    },
    JWT_SECRET,
    {
        expiresIn: "7d"
    }
);

const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
).toISOString();

await saveRefreshToken(
    Number(user.UserId),
    refreshToken,
    expiresAt
);

    return {
        accessToken,
        refreshToken,
        user: {
            userId: user.UserId,
            name: user.Name,
            email: user.Email,
            role: user.Role
        }
    };
};
export const refreshToken = async (
    refreshToken: string
) => {

    const decoded = jwt.verify(
        refreshToken,
        JWT_SECRET
    ) as {
        userId: number;
    };

    const accessToken = jwt.sign(
        {
            userId: decoded.userId
        },
        JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );

    return {
        accessToken
    };
};
export const logout = async (
    refreshToken: string
) => {

    const deletedRows = await deleteRefreshToken(
        refreshToken
    );

    if (deletedRows === 0) {
        throw new Error("Invalid refresh token");
    }

    return {
        message: "Logout successful"
    };
};