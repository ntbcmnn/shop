import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
import { createUploader } from "../multer";

export const upload = createUploader("products");

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
    subcategory_id: number | null;
    image_url: string | null;
    stock: boolean;
    discount: number;
}

export interface ProductWithSubCategory extends Product {
    subCategory: {
        id: number;
        name: string;
    } | null;
}

export interface NewProductInput extends Omit<Product, "id"> {}

export async function getAll(): Promise<ProductWithSubCategory[]> {
    const [rows] = await pool.query<any[]>(
        `SELECT p.*, s.id as subCategory_id, s.name as subCategory_name
         FROM products p
                  LEFT JOIN subcategories s ON p.subcategory_id = s.id
         ORDER BY p.id DESC`
    );

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        subcategory_id: row.subcategory_id,
        image_url: row.image_url,
        stock: row.stock === 1,
        discount: row.discount,
        subCategory: row.subCategory_id
            ? {
                id: row.subCategory_id,
                name: row.subCategory_name,
            }
            : null,
    }));
}

export type ProductWithSubCategoryLimit = {
    id: number;
    name: string;
    description: string;
    price: number;
    subcategory_id: number | null;
    image_url: string;
    stock: boolean;
    discount: number;
    subCategory: {
        id: number;
        name: string;
    } | null;
};

export async function getAllWithLimit(limit: number = 8): Promise<ProductWithSubCategoryLimit[]> {
    const [rows] = await pool.query<(RowDataPacket & {
        id: number;
        name: string;
        description: string;
        price: number;
        subcategory_id: number | null;
        image_url: string;
        stock: number;
        discount: number;
        subCategory_id: number | null;
        subCategory_name: string | null;
    })[]>(
        `SELECT p.*, s.id as subCategory_id, s.name as subCategory_name
         FROM products p
                  LEFT JOIN subcategories s ON p.subcategory_id = s.id
         ORDER BY p.id DESC
             LIMIT ?`,
        [limit]
    );

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        subcategory_id: row.subcategory_id,
        image_url: row.image_url,
        stock: row.stock === 1,
        discount: row.discount,
        subCategory: row.subCategory_id
            ? { id: row.subCategory_id, name: row.subCategory_name ?? "" }
            : null,
    }));
}


export async function getById(id: number): Promise<ProductWithSubCategory | null> {
    if (isNaN(id) || id <= 0) {
        throw new Error('Invalid product ID');
    }
    const [rows] = await pool.query<any[]>(
        `SELECT p.*, s.id as subCategory_id, s.name as subCategory_name
         FROM products p
                  LEFT JOIN subcategories s ON p.subcategory_id = s.id
         WHERE p.id = ?`,
        [id]
    );

    if (!rows || rows.length === 0) return null;

    const row = rows[0];
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        subcategory_id: row.subcategory_id,
        image_url: row.image_url,
        stock: row.stock === 1,
        discount: row.discount,
        subCategory: row.subCategory_id
            ? {
                id: row.subCategory_id,
                name: row.subCategory_name,
            }
            : null,
    };
}

export async function create(data: NewProductInput): Promise<number> {
    const { name, description, price, subcategory_id, image_url, stock, discount } = data;
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        `INSERT INTO products
             (name, description, price, subcategory_id, image_url, stock, discount)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, description, price, subcategory_id, image_url, stock, discount]
    );
    return result.insertId;
}

export async function update(
    id: number,
    data: Partial<NewProductInput>
): Promise<boolean> {
    const fields = Object.keys(data);
    if (!fields.length) return false;

    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => (data as any)[f]);
    values.push(id);

    const [result] = await pool.execute<mysql.ResultSetHeader>(
        `UPDATE products
         SET ${setClause}
         WHERE id = ?`,
        values
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

export interface ProductFilters {
    category_id?: number;
    subcategory_id?: number;
    stock?: boolean;
    discount?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    limit?: number;
    offset?: number;
}

export async function getFilteredProducts(filters: ProductFilters): Promise<ProductWithSubCategory[]> {
    let query = `
        SELECT p.*, 
               s.id as subCategory_id, 
               s.name as subCategory_name,
               s.category_id as category_id,
               c.name as category_name
        FROM products p
        LEFT JOIN subcategories s ON p.subcategory_id = s.id
        LEFT JOIN categories c ON s.category_id = c.id
        WHERE 1=1
    `;

    const params: any[] = [];

    if (filters.category_id !== undefined) {
        query += " AND s.category_id = ?";
        params.push(filters.category_id);
    }

    if (filters.subcategory_id !== undefined) {
        query += " AND p.subcategory_id = ?";
        params.push(filters.subcategory_id);
    }

    if (filters.stock !== undefined) {
        query += " AND p.stock = ?";
        params.push(filters.stock ? 1 : 0);
    }

    if (filters.discount !== undefined) {
        query += " AND p.discount = ?";
        params.push(filters.discount);
    }

    if (filters.minPrice !== undefined) {
        query += " AND p.price >= ?";
        params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
        query += " AND p.price <= ?";
        params.push(filters.maxPrice);
    }

    if (filters.search) {
        query += " AND p.name LIKE ?";
        params.push(`%${filters.search}%`);
    }

    query += " ORDER BY p.id DESC";

    if (filters.limit !== undefined) {
        query += " LIMIT ?";
        params.push(filters.limit);
    }

    if (filters.offset !== undefined) {
        query += " OFFSET ?";
        params.push(filters.offset);
    }

    const [rows] = await pool.query<(RowDataPacket & Product)[]>(query, params);

    return rows.map(row => ({
        ...row,
        stock: Boolean(row.stock),
        subCategory: row.subCategory_id ? {
            id: row.subCategory_id,
            name: row.subCategory_name || ""
        } : null,
        category: row.category_id ? {
            id: row.category_id,
            name: row.category_name || ""
        } : null
    }));
}

export async function getPriceRange(filters: {
    categoryId?: number;
    subcategoryId?: number;
}): Promise<{ min: number; max: number }> {
    let query = `
        SELECT MIN(p.price) as min, MAX(p.price) as max
        FROM products p
            LEFT JOIN subcategories s ON p.subcategory_id = s.id
        WHERE 1=1
    `;

    const params: any[] = [];

    if (filters.categoryId !== undefined) {
        query += " AND s.category_id = ?";
        params.push(filters.categoryId);
    }

    if (filters.subcategoryId !== undefined) {
        query += " AND p.subcategory_id = ?";
        params.push(filters.subcategoryId);
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    return {
        min: rows[0].min || 0,
        max: rows[0].max || 10000
    };
}