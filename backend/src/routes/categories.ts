import {Router} from "express";
import * as Category from "../models/Category";
import permit from "../middleware/permit";
import auth from "../middleware/auth";


const categoryRouter = Router();

categoryRouter.get("/", async (_req, res, next) => {
    try {
        const categories = await Category.getAll();
        res.json(categories);
        return;
    } catch (e) {
        next(e);
    }
});

categoryRouter.get("/limited", async (req, res, next) => {
    try {
        const limit = Number(req.query.limit) || 5;
        const categories = await Category.getLimited(limit);
        res.json(categories);
        return;
    } catch (e) {
        next(e);
    }
})

categoryRouter.get("/:id", async (req, res, next) => {
    try {
        const category = await Category.getById(Number(req.params.id));
        if (!category) res.status(404).json({message: "Not found"});
        res.json(category);
        return;
    } catch (e) {
        next(e);
    }
});

categoryRouter.post(
    "/",
    auth,
    permit("ADMIN"),
    Category.upload.single("photo"),
    async (req, res, next) => {
        try {
            const {name} = req.body;
            const photo = req.file
                ? `/uploads/categories/${req.file.filename}`
                : null;

            const id = await Category.create({name, photo});
            res.status(201).json({id, name, photo});
        } catch (e) {
            next(e);
        }
    }
);

categoryRouter.put(
    '/:id',
    auth,
    permit('ADMIN'),
    Category.upload.single('photo'),
    async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const {name} = req.body;

            const updates: Partial<Category.NewCategoryInput> = {};
            if (name !== undefined) updates.name = name.trim();
            if (req.file) updates.photo = `/uploads/categories/${req.file.filename}`;

            if (!Object.keys(updates).length) {
                res.status(400).json({message: 'Нет данных для обновления'});
                return;
            }

            const ok = await Category.update(id, updates);
            if (!ok) res.status(404).json({message: 'Категория не найдена'});

            const updatedCategory = await Category.getById(id);
            res.json(updatedCategory);
            return;
        } catch (e) {
            next(e);
        }
    },
);
categoryRouter.delete("/:id", auth, permit("ADMIN"), async (req, res, next) => {
    try {
        const ok = await Category.remove(Number(req.params.id));
        if (!ok) res.status(404).json({message: "Not found"});
        res.status(204).end();
        return;
    } catch (e) {
        next(e);
    }
});

export default categoryRouter;
