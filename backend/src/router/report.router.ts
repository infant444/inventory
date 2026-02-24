import { Router } from "express";
import asyncHandler from 'express-async-handler';
import authMiddleware from "../middleware/auth.middleware";
import { ReportController } from "../controller/report.controller";

const route = Router();

route.use(authMiddleware);

route.get("/summary", asyncHandler(ReportController.getSummary));
route.get("/list", asyncHandler(ReportController.getList));
route.get("/charts", asyncHandler(ReportController.getCharts));

export default route;
