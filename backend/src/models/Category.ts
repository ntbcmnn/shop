import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
import path from "path";
import * as fs from "node:fs";
import multer from "multer";

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

export interface Category {
    id: number;
    name: string;
    photo: string | null;
}

export interface NewCategoryInput extends Omit<Category, "id"> {}

const uploadDir = path.join(process.cwd(), "public", "uploads", "categories");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export async function getAll(): Promise<Category[]> {
    const [rows] = await pool.query<(RowDataPacket & Category)[]>(
        "SELECT * FROM categories ORDER BY id DESC"
    );
    return rows;
}

export async function getById(id: number): Promise<Category | null> {
    const [rows] = await pool.query<(RowDataPacket & Category)[]>(
        "SELECT * FROM categories WHERE id = ?",
        [id]
    );
    return rows[0] ?? null;
}

export async function create(data: NewCategoryInput): Promise<number> {
    const { name, photo } = data;
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        `INSERT INTO categories (name, photo)
         VALUES (?, ?)`,
        [name, photo]
    );
    return result.insertId;
}

export async function update(
    id: number,
    data: Partial<NewCategoryInput>
): Promise<boolean> {
    const fields = Object.keys(data);
    if (!fields.length) return false;

    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => (data as any)[f]);
    values.push(id);

    const [result] = await pool.execute<mysql.ResultSetHeader>(
        `UPDATE categories SET ${setClause} WHERE id = ?`,
        values
    );
    return result.affectedRows > 0;
}

export async function remove(id: number): Promise<boolean> {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        "DELETE FROM categories WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
}
