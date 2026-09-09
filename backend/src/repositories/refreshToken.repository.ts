import { poolPromise } from "../config/database.js";

export const saveRefreshToken = async (
    userId: number,
    token: string,
    expiresAt: string
) => {

    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("UserId", userId)
        .input("Token", token)
        .input("ExpiresAt", expiresAt)
        .query(`
            INSERT INTO RefreshTokens
                (UserId, Token, ExpiresAt)
            OUTPUT INSERTED.*
            VALUES
                (@UserId, @Token, @ExpiresAt)
        `);

    return result.recordset[0];
};
export const deleteRefreshToken = async (
    token: string
) => {

    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("Token", token)
        .query(`
            DELETE FROM RefreshTokens
            WHERE Token = @Token
        `);

    return result.rowsAffected[0];
};

export const hasValidRefreshToken = async (token: string) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("Token", token)
        .query(`
            SELECT TOP 1 Token
            FROM RefreshTokens
            WHERE Token = @Token AND ExpiresAt > GETDATE()
        `);

    return Boolean(result.recordset[0]);
};
