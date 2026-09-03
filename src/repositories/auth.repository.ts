import { poolPromise } from "../config/database.js";

export const getUserByEmail = async (email: string) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("Email", email)
        .query(`
            SELECT *
            FROM Users
            WHERE Email = @Email
        `);

    return result.recordset[0];
};
export const updateUserPassword = async (
    userId: number,
    passwordHash: string
) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("UserId", userId)
        .input("PasswordHash", passwordHash)
        .query(`
            UPDATE Users
            SET PasswordHash = @PasswordHash
            WHERE UserId = @UserId;

            SELECT UserId, Name, Email, Role
            FROM Users
            WHERE UserId = @UserId;
        `);

    return result.recordset[0];
};
export const getUserByUserId = async (
    userId: number
) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("UserId", userId)
        .query(`
            SELECT *
            FROM Users
            WHERE UserId = @UserId
        `);

    return result.recordset[0];
};