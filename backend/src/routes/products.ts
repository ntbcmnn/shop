import {Router} from 'express';
import * as Product from '../models/Product';

const router = Router();

router.get('/', async (_req, res, next) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (e) {
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.getById(Number(req.params.id));
        if (!product) res.status(404).json({message: 'Not found'});
        res.json(product);
        return;
    } catch (e) {
        next(e);
    }
});

router.post(
    '/',
    Product.upload.single('image'),
    async (req, res, next) => {
        try {
            const {name, description, price, subcategory_id} = req.body;
            const image_url = req.file
                ? `/uploads/${req.file.filename}`
                : null;

            const id = await Product.create({
                name,
                description,
                price: Number(price),
                subcategory_id: Number(subcategory_id),
                image_url,
            });

            res.status(201).json({id});
        } catch (e) {
            next(e);
        }
    },
);

router.put(
    '/:id',
    Product.upload.single('image'),
    async (req, res, next) => {
        try {
            const updates: any = {...req.body};
            if (req.file) updates.image_url = `/uploads/${req.file.filename}`;

            const ok = await Product.update(Number(req.params.id), updates);
            if (!ok) res.status(404).json({message: 'Not found'});
            res.json({message: 'Updated'});
            return;
        } catch (e) {
            next(e);
        }
    },
);

router.delete('/:id', async (req, res, next) => {
    try {
        const ok = await Product.remove(Number(req.params.id));
        if (!ok) res.status(404).json({message: 'Not found'});
        res.status(204).end();
        return;
    } catch (e) {
        next(e);
    }
});

export default router;
