import { Router } from "express";
import asyncHandler from 'express-async-handler';
import authMiddleware from "../middleware/auth.middleware";
import { DashboardController } from "../controller/dashboard.controller";

const route = Router();

route.use(authMiddleware);

route.get("/stats", asyncHandler(DashboardController.getDashboardStats));
route.get("/recent-transactions", asyncHandler(DashboardController.getRecentTransactions));
route.get("/recent-invoices", asyncHandler(DashboardController.getRecentInvoices));
route.get("/low-stock-alerts", asyncHandler(DashboardController.getLowStockAlerts));

export default route;
