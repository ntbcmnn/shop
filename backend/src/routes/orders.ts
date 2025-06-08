// routes/orders.ts
import express from "express";
import * as Order from "../models/Order";


const orderRouter = express.Router();

// Получить все заказы
orderRouter.get("/", async (req, res) => {
    const orders = await Order.getAllOrders();
    res.json(orders);
});

// Получить заказ с элементами
orderRouter.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const order = await Order.getOrderById(id);
    if (!order) {
         res.status(404).json({ message: "Order not found" });
        return;
    }
    res.json(order);
});

// Создать заказ (с элементами)
orderRouter.post("/", async (req, res) => {
    const { user_id, total_amount, items, first_name, last_name, phone, address } = req.body;

    if (!user_id || !total_amount || !Array.isArray(items)) {
        res.status(400).json({ message: "Invalid data" });
        return;
    }

    try {
        const orderId = await Order.createOrder(
            user_id,
            total_amount,
            first_name ?? null,
            last_name ?? null,
            phone ?? null,
            address ?? null
        );

        for (const item of items) {
            await Order.addOrderItem(
                orderId,
                item.product_id,
                item.quantity,
                item.price
            );
        }

        res.status(201).json({ id: orderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create order" });
    }
});


// Обновить статус заказа
orderRouter.patch("/:id/status", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    const validStatuses = ["pending", "processing", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
         res.status(400).json({ message: "Invalid status" });
        return
    }

    const updated = await Order.updateOrderStatus(id, status as any);
    if (!updated) {
         res.status(404).json({ message: "Order not found" });
        return
    }

    res.json({ message: "Order status updated" });
});

// Удалить заказ
orderRouter.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const deleted = await Order.removeOrder(id);
    if (!deleted) {
         res.status(404).json({ message: "Order not found" });
        return;
    }
    res.json({ message: "Order deleted" });
});

export default orderRouter;
