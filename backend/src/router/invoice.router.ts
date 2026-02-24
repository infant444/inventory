import { Router } from "express";
import asyncHandler from 'express-async-handler';
import authMiddleware from "../middleware/auth.middleware";
import { InvoiceController } from "../controller/invoice.controller";

const route = Router();

route.use(authMiddleware);

route.post("/create", asyncHandler(InvoiceController.createInvoice));
route.get("/all", asyncHandler(InvoiceController.getAllInvoices));
route.put("/update/:invoiceId", asyncHandler(InvoiceController.updateInvoice));
route.put("/mark-paid/:invoiceId", asyncHandler(InvoiceController.markAsPaid));
route.delete("/delete/:invoiceId", asyncHandler(InvoiceController.deleteInvoice));
route.get("/upcoming-alerts", asyncHandler(InvoiceController.getUpcomingAlerts));

export default route;
