import mysql from "mysql2/promise";
import type {RowDataPacket} from 'mysql2';
import {createUploader} from '../multer';

export const upload = createUploader('products');

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

export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    subcategory_id: number;
    image_url: string | null;
}

export interface NewProductInput
    extends Omit<Product, "id"> {
}

export async function getAll(): Promise<Product[]> {
    const [rows] = await pool.query<(RowDataPacket & Product)[]>(
        "SELECT * FROM products ORDER BY id DESC"
    );
    return rows;
}

export async function getById(id: number): Promise<Product | null> {
    const [rows] = await pool.query<(RowDataPacket & Product)[]>(
        "SELECT * FROM products WHERE id = ?",
        [id]
    );
    return rows[0] ?? null;
}

export async function create(data: NewProductInput): Promise<number> {
    const {name, description, price, subcategory_id, image_url} = data;
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        `INSERT INTO products
             (name, description, price, subcategory_id, image_url)
         VALUES (?, ?, ?, ?, ?)`,
        [name, description, price, subcategory_id, image_url],
    );
    console.log(result)
    return result.insertId;

}

export async function update(
    id: number,
    data: Partial<NewProductInput>,
): Promise<boolean> {
    const fields = Object.keys(data);
    if (!fields.length) return false;

    const setClause = fields.map((f) => `${f} = ?`).join(', ');
    const values = fields.map((f) => (data as any)[f]);
    values.push(id);

    const [result] = await pool.execute<mysql.ResultSetHeader>(
        `UPDATE products
         SET ${setClause}
         WHERE id = ?`,
        values,
    );
    return result.affectedRows > 0;
}

export async function remove(id: number): Promise<boolean> {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        "DELETE FROM products WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
}
