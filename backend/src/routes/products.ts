import { Router } from "express";
import * as Product from "../models/Product";
import auth from "../middleware/auth";
import permit from "../middleware/permit";
import { getPriceRange, ProductFilters,} from "../models/Product";

const productsRouter = Router();

productsRouter.get("/", async (_req, res, next) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (e) {
        next(e);
    }
});

productsRouter.get("/filter", async (req, res, next) => {
    try {
        const filters: ProductFilters = {
            category_id: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
            subcategory_id: req.query.subcategoryId ? parseInt(req.query.subcategoryId as string) : undefined,
            stock: req.query.inStock !== undefined ? req.query.inStock === 'true' : undefined,
            discount: req.query.discount !== undefined ? req.query.discount === 'true' : undefined,
            minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
            search: req.query.search ? req.query.search as string : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
            offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
        };

        const products = await Product.getFilteredProducts(filters);
        res.json(products);
    } catch (e) {
        next(e);
    }
});

productsRouter.get('/price-range', async (req, res, next) => {
    try {
        const filters: {
            categoryId?: number;
            subcategoryId?: number;
        } = {};

        if (req.query.categoryId) {
            const categoryId = Number(req.query.categoryId);
            if (isNaN(categoryId)) {
                res.status(400).json({ error: 'Invalid categoryId' });
                return
            }
            filters.categoryId = categoryId;
        }

        if (req.query.subcategoryId) {
            const subcategoryId = Number(req.query.subcategoryId);
            if (isNaN(subcategoryId)) {
                res.status(400).json({ error: 'Invalid subcategoryId' });
                return
            }
            filters.subcategoryId = subcategoryId;
        }

        const priceRange = await getPriceRange(filters);
        res.json(priceRange);
    } catch (error) {
        next(error);
    }
});

productsRouter.get("/limited", async (req, res, next) => {
    try {
        const limit = Number(req.query.limit) || 8;
        const products = await Product.getAllWithLimit(limit);
        res.json(products);
    } catch (e) {
        next(e);
    }
});

productsRouter.get("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
             res.status(400).json({ message: "Invalid product ID" });
            return
        }

        const product = await Product.getById(id);
        if (!product) {
             res.status(404).json({ message: "Not found" });
            return
        }
        res.json(product);
    } catch (e) {
        next(e);
    }
})

productsRouter.post(
    "/",
    auth,
    permit("ADMIN"),
    Product.upload.single("image_url"),
    async (req, res, next) => {
        try {
            const { name, description, price, subcategory_id, stock, discount } = req.body;
            const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;

            const productId = await Product.create({
                name,
                description,
                price: Number(price),
                subcategory_id: Number(subcategory_id),
                image_url,
                stock: stock === "true" || stock === true || stock === "1",
                discount: Number(discount),
            });

            const product = await Product.getById(productId);
            res.status(201).json({ product });
        } catch (e) {
            next(e);
        }
    }
);

productsRouter.put(
    "/:id",
    auth,
    permit("ADMIN"),
    Product.upload.single("image_url"),
    async (req, res, next) => {
        try {
            const updates: any = { ...req.body };
            if (req.file) updates.image_url = `/uploads/products/${req.file.filename}`;

            if (updates.stock !== undefined) {
                updates.stock = updates.stock === "true" || updates.stock === true || updates.stock === "1";
            }
            if (updates.discount !== undefined) {
                updates.discount = Number(updates.discount);
            }

            const ok = await Product.update(Number(req.params.id), updates);
            if (!ok) res.status(404).json({ message: "Not found" });

            const updatedProduct = await Product.getById(Number(req.params.id));
            res.json(updatedProduct);
            return
        } catch (e) {
            next(e);
        }
    }
);

productsRouter.delete("/:id", auth, permit("ADMIN"), async (req, res, next) => {
    try {
        const ok = await Product.remove(Number(req.params.id));
        if (!ok)  res.status(404).json({ message: "Not found" });
        res.status(204).json({ message: "Product deleted successfully" });
        return;
    } catch (e) {
        next(e);
    }
});

export default productsRouter;
