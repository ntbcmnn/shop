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

export interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
}

export interface CartItemWithProduct extends CartItem {
    product_name: string;
    product_price: number;
}

export interface NewCartItemInput {
    cart_id: number;
    product_id: number;
    quantity?: number;
}

export interface UpdateCartItemInput {
    quantity: number;
}

export async function addCartItem(data: NewCartItemInput): Promise<number> {
    const { cart_id, product_id, quantity = 1 } = data;

    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = await getCartItemByProduct(cart_id, product_id);

    if (existingItem) {
        // Обновляем количество, если товар уже есть
        await updateCartItem(existingItem.id, {
            quantity: existingItem.quantity + quantity
        });
        return existingItem.id;
    } else {
        // Добавляем новый товар
        const [result] = await pool.execute<mysql.ResultSetHeader>(
            "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
            [cart_id, product_id, quantity]
        );
        return result.insertId;
    }
}

export async function getCartItem(id: number): Promise<CartItemWithProduct | null> {
    const [rows] = await pool.query<(RowDataPacket & CartItemWithProduct)[]>(
        `SELECT cart_items.*, products.name as product_name, products.price as product_price
 FROM cart_items
          JOIN products ON cart_items.product_id = products.id
 WHERE cart_items.cart_id = ?`,
        [id]
    );
    return rows[0] ?? null;
}

export async function getCartItemByProduct(
    cartId: number,
    productId: number
): Promise<CartItem | null> {
    const [rows] = await pool.query<(RowDataPacket & CartItem)[]>(
        "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?",
        [cartId, productId]
    );
    return rows[0] ?? null;
}

export async function getCartItems(cartId: number): Promise<CartItemWithProduct[]> {
    const [rows] = await pool.query<(RowDataPacket & CartItemWithProduct)[]>(
        `SELECT cart_items.*, products.name as product_name, products.price as product_price
 FROM cart_items
          JOIN products ON cart_items.product_id = products.id
 WHERE cart_items.cart_id = ?`,
        [cartId]
    );
    return rows;
}

export async function updateCartItem(
    id: number,
    data: UpdateCartItemInput
): Promise<boolean> {
    const { quantity } = data;

    if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
    }

    const [result] = await pool.execute<mysql.ResultSetHeader>(
        "UPDATE cart_items SET quantity = ? WHERE id = ?",
        [quantity, id]
    );
    return result.affectedRows > 0;
}

export async function removeCartItem(id: number): Promise<boolean> {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        "DELETE FROM cart_items WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
}

export async function clearCart(cartId: number): Promise<number> {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        "DELETE FROM cart_items WHERE cart_id = ?",
        [cartId]
    );
    return result.affectedRows;
}

export async function calculateCartTotal(cartId: number): Promise<number> {
    const [rows] = await pool.query<(RowDataPacket & { total: number })[]>(
        `SELECT SUM(products.price * cart_items.quantity) as total
         FROM cart_items
                  JOIN products ON cart_items.product_id = products.id
         WHERE cart_items.cart_id = ?`,
        [cartId]
    );
    return rows[0]?.total ?? 0;
}