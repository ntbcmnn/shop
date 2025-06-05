import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import type { RowDataPacket } from "mysql2";

const SALT_WORK_FACTOR = 10;

const pool = mysql.createPool({
    host: 'localhost',
    port:  3307,
    user: 'root',
    password:  'root_password',
    database: 'shop_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string | null;
    password: string;
    token: string;
    created_at: Date;
    role: string;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const [rows] = await pool.query<(RowDataPacket & User)[]>("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
};

export const findUserByToken = async (token: string): Promise<User | null> => {
    const [rows] = await pool.query<(RowDataPacket & User)[]>("SELECT * FROM users WHERE token = ?", [token]);
    return rows[0] || null;
};

export const createUser = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    role: 'USER' | 'ADMIN',
    phone?: string,
): Promise<User> => {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = randomUUID();

    const [result] = await pool.query(
        "INSERT INTO users (email, password, first_name, last_name, phone, token, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [email, hashedPassword, first_name, last_name, phone || null, token, role]
    );


    const insertId = (result as mysql.ResultSetHeader).insertId;
    return {
        id: insertId,
        email,
        first_name,
        last_name,
        phone: phone || null,
        role,
        password: hashedPassword,
        token,
        created_at: new Date()
    };
};

export const checkPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

export const generateNewToken = async (userId: number): Promise<string> => {
    const token = randomUUID();
    await pool.query("UPDATE users SET token = ? WHERE id = ?", [token, userId]);
    return token;
};
