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