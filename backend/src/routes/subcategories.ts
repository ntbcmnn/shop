import express from "express";
import * as SubcategoryModel from "../models/Subcategory";
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const subcategoriesRouter = express.Router();

subcategoriesRouter.get("/", async (_req, res) => {
    const subcategories = await SubcategoryModel.getAll();
    res.send(subcategories);
});

subcategoriesRouter.get("/:id", async (req, res) => {
    const subcategory = await SubcategoryModel.getById(Number(req.params.id));
    if (!subcategory) {
        res.status(404).send({error: "Subcategory not found"});
        return;
    }
    res.send(subcategory);
});

subcategoriesRouter.post("/", auth, permit("ADMIN"), async (req, res) => {
    try {
        const newSubcategory = await SubcategoryModel.create(req.body);
        res.status(201).send(newSubcategory);
    } catch (err) {
        res.status(400).send({ error: (err as Error).message });
    }
});

subcategoriesRouter.put("/:id", auth, permit("ADMIN"), async (req, res) => {
    const updated = await SubcategoryModel.update(Number(req.params.id), req.body);
    if (!updated) {
        res.status(404).send({error: "Subcategory not found or no changes"});
        return;
    }
    const subcategory = await SubcategoryModel.getById(Number(req.params.id));
    res.status(200).send(subcategory);
});

subcategoriesRouter.delete("/:id", auth, permit("ADMIN"), async (req, res) => {
    const deleted = await SubcategoryModel.remove(Number(req.params.id));
    if (!deleted) {
        res.status(404).send({error: "Subcategory not found"});
        return;
    }
    res.status(200).send({message: "Subcategory deleted successfully"});
});

export default subcategoriesRouter;
