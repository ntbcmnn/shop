import mysql from "mysql2/promise";
import type {RowDataPacket} from "mysql2";

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

export interface Subcategory {
    id: number;
    category_id: number;
    name: string;
}

export interface NewSubcategoryInput extends Omit<Subcategory, "id"> {
}

export async function getAll(): Promise<Subcategory[]> {
    const [rows] = await pool.query<(RowDataPacket & Subcategory)[]>(
        "SELECT * FROM subcategories ORDER BY id DESC"
    );
    return rows;
}

export async function getById(id: number): Promise<Subcategory | null> {
    const [rows] = await pool.query<(RowDataPacket & Subcategory)[]>(
        "SELECT * FROM subcategories WHERE id = ?",
        [id]
    );
    return rows[0] ?? null;
}

export async function create(data: NewSubcategoryInput): Promise<number> {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        `INSERT INTO subcategories (name, category_id)
         VALUES (?, ?)`,
        [data.name, data.category_id]
    );
    return result.insertId;
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
