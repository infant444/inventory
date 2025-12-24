import { Router } from "express";
import asyncHandler from 'express-async-handler';
import { categoriesController } from "../controller/categories.controller";
import authMiddleware from "../middleware/auth.middleware";

const route=Router();


route.use(authMiddleware);
route.post("/create",asyncHandler(categoriesController.createCategories));
route.get("/all", asyncHandler(categoriesController.getAllCategories));
route.get("/get-by-id/:categoriesId", asyncHandler(categoriesController.getCategoriesById));
route.put("/update/:categoriesId", asyncHandler(categoriesController.updateCategories));
route.delete("/delete/:categoriesId", asyncHandler(categoriesController.deleteCategories));
export default route;