import { Router } from "express";
import asyncHandler from 'express-async-handler';
import authMiddleware from "../middleware/auth.middleware";
import { ItemController } from "../controller/item.controller";

const route = Router();

route.use(authMiddleware);

route.post("/add", asyncHandler(ItemController.addItem));
route.get("/all", asyncHandler(ItemController.getAllItem));
route.get("/get-by-id/:itemId", asyncHandler(ItemController.getItemById));
route.get("/get-by-barcode/:barcode", asyncHandler(ItemController.getItemByBarcode));
route.put("/update/:itemId", asyncHandler(ItemController.updateItem));
route.delete("/delete/:itemId", asyncHandler(ItemController.deleteItem));

// product config
route.get("/get-config/:itemId", asyncHandler(ItemController.getItemById));
route.put("/update-config/:itemId", asyncHandler(ItemController.updateItemConfig));
export default route;