import { Router } from "express";
import * as Category from "../models/Category";
import permit from "../middleware/permit";
import auth from "../middleware/auth";


const categoryRouter = Router();

categoryRouter.get("/", async (_req, res, next) => {
    try {
        const categories = await Category.getAll();
        res.json(categories);
    } catch (e) {
        next(e);
    }
});

categoryRouter.get("/:id", async (req, res, next) => {
    try {
        const category = await Category.getById(Number(req.params.id));
        if (!category)  res.status(404).json({ message: "Not found" });
        res.json(category);
        return;
    } catch (e) {
        next(e);
    }
});

// 🛡️ Добавлять может только админ
categoryRouter.post(
    "/",
    auth,
    permit("ADMIN"),
    Category.upload.single("photo"),
    async (req, res, next) => {
        try {
            const { name } = req.body;
            const photo = req.file
                ? `/uploads/categories/${req.file.filename}`
                : null;

            const id = await Category.create({ name, photo });
            res.status(201).json({ id, name, photo });
        } catch (e) {
            next(e);
        }
    }
);

// 🛡️ Редактировать может только админ
categoryRouter.put(
    "/:id",
    auth,
    permit("ADMIN"),
    Category.upload.single("photo"),
    async (req, res, next) => {
        try {
            const updates: any = { name: req.body.name };
            if (req.file) updates.photo = `/uploads/categories/${req.file.filename}`;

            const ok = await Category.update(Number(req.params.id), updates);
            if (!ok)  res.status(404).json({ message: "Not found" });
            const updatedCategory = await Category.getById(Number(req.params.id));
            res.json(updatedCategory);
            return;
        } catch (e) {
            next(e);
        }
    }
);

// 🛡️ Удалять может только админ
categoryRouter.delete("/:id",auth, permit("ADMIN"), async (req, res, next) => {
    try {
        const ok = await Category.remove(Number(req.params.id));
        if (!ok)  res.status(404).json({ message: "Not found" });
        res.status(204).end();
        return;
    } catch (e) {
        next(e);
    }
});

export default categoryRouter;
