import {Router} from 'express';
import * as Product from '../models/Product';
import auth from "../middleware/auth";
import permit from "../middleware/permit";

const productsRouter = Router();

productsRouter.get('/', async (_req, res, next) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (e) {
        next(e);
    }
});

productsRouter.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.getById(Number(req.params.id));
        if (!product) res.status(404).json({message: 'Not found'});
        res.json(product);
        return;
    } catch (e) {
        next(e);
    }
});

productsRouter.post(
    '/',
    auth,
    permit("ADMIN"),
    Product.upload.single('image_url'),
    async (req, res, next) => {
        try {
            const {name, description, price, subcategory_id} = req.body;
            const image_url = req.file
                ? `/uploads/${req.file.filename}`
                : null;

            const productId = await Product.create({
                name,
                description,
                price: Number(price),
                subcategory_id: Number(subcategory_id),
                image_url,
            });

            const product = await Product.getById(productId);

            res.status(201).json({product});
        } catch (e) {
            next(e);
        }
    },
);

productsRouter.put(
    '/:id',
    auth,
    permit("ADMIN"),
    Product.upload.single('image_url'),
    async (req, res, next) => {
        try {
            const updates: any = {...req.body};
            if (req.file) updates.image_url = `/uploads/products/${req.file.filename}`;

            const ok = await Product.update(Number(req.params.id), updates);
            if (!ok) res.status(404).json({message: 'Not found'});
            const updatedProduct = await Product.getById(Number(req.params.id));
            res.json(updatedProduct);
            return;
        } catch (e) {
            next(e);
        }
    },
);

productsRouter.delete('/:id', auth, permit("ADMIN"), async (req, res, next) => {
    try {
        const ok = await Product.remove(Number(req.params.id));
        if (!ok) res.status(404).json({message: 'Not found'});
        res.status(204).json({message: 'Product deleted successfully'});
        return;
    } catch (e) {
        next(e);
    }
});

export default productsRouter;
