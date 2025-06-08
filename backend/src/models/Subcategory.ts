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

export interface Category {
    id: number;
    name: string;
    photo: string;
}

export interface Subcategory {
    id: number;
    name: string;
    category: Category;
}

export interface NewSubcategoryInput {
    name: string;
    category_id: number;
}

export async function getAll(): Promise<Subcategory[]> {
    const [rows] = await pool.query<RowDataPacket[] & Subcategory[]>(
        `SELECT
             s.id as id,
             s.name as name,
             c.id as category_id,
             c.name as category_name,
             c.photo as category_photo
         FROM subcategories s
                  JOIN categories c ON s.category_id = c.id
         ORDER BY s.id DESC`
    );

    return rows.map(row => ({
        id: row.id,
        name: row.name,
        category: {
            id: row.category_id,
            name: row.category_name,
            photo: row.category_photo,
        }
    }));
}

export async function getById(id: number): Promise<Subcategory | null> {
    const [rows] = await pool.query<RowDataPacket[] & Subcategory[]>(
        `SELECT
             s.id as id,
             s.name as name,
             c.id as category_id,
             c.name as category_name,
             c.photo as category_photo
         FROM subcategories s
                  JOIN categories c ON s.category_id = c.id
         WHERE s.id = ?`,
        [id]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
        id: row.id,
        name: row.name,
        category: {
            id: row.category_id,
            name: row.category_name,
            photo: row.category_photo,
        }
    };
}

export async function create(data: NewSubcategoryInput): Promise<Subcategory> {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        `INSERT INTO subcategories (name, category_id)
         VALUES (?, ?)`,
        [data.name, data.category_id]
    );

    const insertId = result.insertId;

    const newSubcategory = await getById(insertId);
    if (!newSubcategory) throw new Error("Ошибка при создании подкатегории");
    return newSubcategory;
}

export async function update(id: number, data: Partial<NewSubcategoryInput>): Promise<boolean> {
    const fields = Object.keys(data);
    if (!fields.length) return false;

    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => (data as any)[f]);
    values.push(id);

    const [result] = await pool.execute<mysql.ResultSetHeader>(
        `UPDATE subcategories
         SET ${setClause}
         WHERE id = ?`,
        values
    );
    return result.affectedRows > 0;
}

export async function remove(id: number): Promise<boolean> {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        "DELETE FROM subcategories WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
}