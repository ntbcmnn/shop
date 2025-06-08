import { NextFunction, Router, Request, Response } from "express";
import {
    createCart,
    getCartById,
    getUserCart,
    deleteCart,
    Cart,
} from "../models/Cart";
import {
    addCartItem,
    getCartItems,
    updateCartItem,
    removeCartItem,
    clearCart,
    calculateCartTotal,
} from "../models/CartItem";

export const cartRouter = Router();

declare module 'express-serve-static-core' {
    interface Request {
        cart?: Cart;
    }
}

async function checkCartExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { cartId } = req.params;
        const cart = await getCartById(Number(cartId));

        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }

        req.cart = cart;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

cartRouter.post("/", async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            res.status(400).json({ error: "User ID is required" });
            return;
        }

        const cartId = await createCart({ user_id: Number(user_id) });

        res.status(201).json({
            cart_id: cartId,
            message: "Cart created successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

cartRouter.get("/user/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const cart = await getUserCart(Number(userId));

        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }

        const items = await getCartItems(cart.id);

        res.json({
            cart,
            items,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

cartRouter.post("/:cartId/items", checkCartExists, async (req: Request, res: Response) => {
    try {
        const { cart } = req;
        const { product_id, quantity = 1 } = req.body;

        if (!product_id) {
            res.status(400).json({ error: "Product ID is required" });
            return;
        }

        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }

        const itemId = await addCartItem({
            cart_id: cart.id,
            product_id: Number(product_id),
            quantity: Number(quantity),
        });

        res.status(201).json({
            message: "Product added to cart",
            item_id: itemId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

cartRouter.get("/:cartId/items", checkCartExists, async (req: Request, res: Response) => {
    try {
        const { cart } = req;

        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }

        const items = await getCartItems(cart.id);

        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

cartRouter.put("/items/:itemId", async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            res.status(400).json({
                error: "Quantity is required and must be greater than 0"
            });
            return;
        }

        const success = await updateCartItem(Number(itemId), {
            quantity: Number(quantity),
        });

        if (!success) {
            res.status(404).json({ error: "Cart item not found" });
            return;
        }

        res.json({ message: "Cart item updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

cartRouter.delete("/items/:itemId", async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params;
        const success = await removeCartItem(Number(itemId));

        if (!success) {
            res.status(404).json({ error: "Cart item not found" });
            return;
        }

        res.json({ message: "Cart item deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

cartRouter.delete("/:cartId", checkCartExists, async (req: Request, res: Response) => {
    try {
        const { cart } = req;

        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }

        await clearCart(cart.id);
        await deleteCart(cart.id);

        res.json({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

cartRouter.get("/:cartId/total", checkCartExists, async (req: Request, res: Response) => {
    try {
        const { cart } = req;

        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }

        const total = await calculateCartTotal(cart.id);

        res.json({
            total: total.toFixed(2),
            currency: "USD",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default cartRouter;