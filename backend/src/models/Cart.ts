import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";

export const pool = mysql.createPool({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root_password",
    database: "shop_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export interface Cart {
    id: number;
    user_id: number;
    created_at: Date;
}

export interface NewCartInput {
    user_id: number;
}

export async function createCart(data: NewCartInput): Promise<number> {
    const { user_id } = data;
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        "INSERT INTO carts (user_id) VALUES (?)",
        [user_id]
    );
    return result.insertId;
}

export async function getCartById(id: number): Promise<Cart | null> {
    const [rows] = await pool.query<(RowDataPacket & Cart)[]>(
        "SELECT * FROM carts WHERE id = ?",
        [id]
    );
    return rows[0] ?? null;
}

export async function getUserCart(userId: number): Promise<Cart | null> {
    const [rows] = await pool.query<(RowDataPacket & Cart)[]>(
        "SELECT * FROM carts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        [userId]
    );
    return rows[0] ?? null;
}

export async function deleteCart(cartId: number): Promise<boolean> {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        "DELETE FROM carts WHERE id = ?",
        [cartId]
    );
    return result.affectedRows > 0;
}