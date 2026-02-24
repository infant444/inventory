import { Router } from "express";
import asyncHandler from 'express-async-handler';
import authMiddleware from "../middleware/auth.middleware";
import { ProductController } from "../controller/product.controller";

const route = Router();

route.use(authMiddleware);

route.post("/checkin", asyncHandler(ProductController.checkIn));
route.post("/checkout", asyncHandler(ProductController.checkOut));
route.post("/batch-checkin", asyncHandler(ProductController.batchCheckIn));
route.post("/batch-checkout", asyncHandler(ProductController.batchCheckOut));
route.get("/today-stats", asyncHandler(ProductController.getTodayStats));

export default route;
