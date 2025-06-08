// models/orders.ts
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

export interface Order {
    id: number;
    user_id: number;
    order_date: Date;
    total_amount: number;
    status: "pending" | "processing" | "completed" | "cancelled";
    first_name: string,
    last_name: string,
    phone: string,
    address: string
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    first_name: string,
    last_name: string,
    phone: string,
    address: string
}

export async function createOrder(
    userId: number,
    totalAmount: number,
    first_name: string,
    last_name: string,
    phone: string,
    address: string
): Promise<number> {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        `INSERT INTO orders (user_id, total_amount, first_name, last_name, phone, address) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, totalAmount, first_name, last_name, phone, address]
    );
    return result.insertId;
}

// Добавить элемент в заказ
export async function addOrderItem(orderId: number, productId: number, quantity: number, price: number): Promise<number> {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [orderId, productId, quantity, price]
    );
    return result.insertId;
}

// Получить все заказы
export async function getAllOrders(): Promise<Order[]> {
    const [rows] = await pool.query<(RowDataPacket & Order)[]>(
        `SELECT * FROM orders ORDER BY id DESC`
    );
    return rows;
}

// Получить заказ по ID с элементами
export async function getOrderById(id: number): Promise<(Order & { items: OrderItem[] }) | null> {
    const [orderRows] = await pool.query<(RowDataPacket & Order)[]>(
        `SELECT * FROM orders WHERE id = ?`,
        [id]
    );
    const order = orderRows[0];
    if (!order) return null;

    const [items] = await pool.query<(RowDataPacket & OrderItem)[]>(
        `SELECT * FROM order_items WHERE order_id = ?`,
        [id]
    );

    return { ...order, items };
}

// Обновить статус заказа
export async function updateOrderStatus(id: number, status: Order["status"]): Promise<boolean> {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        `UPDATE orders SET status = ? WHERE id = ?`,
        [status, id]
    );
    return result.affectedRows > 0;
}

// Удалить заказ
export async function removeOrder(id: number): Promise<boolean> {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
        `DELETE FROM orders WHERE id = ?`,
        [id]
    );
    return result.affectedRows > 0;
}
