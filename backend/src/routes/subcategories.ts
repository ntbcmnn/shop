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
    const newId = await SubcategoryModel.create(req.body);
    const name = req.body.name;
    res.status(201).send({id: newId, name});
});

subcategoriesRouter.put("/:id", auth, permit("ADMIN"), async (req, res) => {
    const updated = await SubcategoryModel.update(Number(req.params.id), req.body);
    const name = req.body.name;
    const id = req.params.id;

    if (!updated) {
        res.status(404).send({error: "Subcategory not found or no changes"});
        return;
    }
    res.status(201).send({id, name});
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
