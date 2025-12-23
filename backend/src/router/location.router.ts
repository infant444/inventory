import Router from 'express';
import asyncHandler from 'express-async-handler';
import { LocationController } from "../controller/location.controller";
import authMiddleware from '../middleware/auth.middleware';
const route=Router();
route.use(authMiddleware)
route.post("/create-location",asyncHandler(LocationController.createLocation));

route.get("/get-all-location", asyncHandler(LocationController.getAllLocation));
route.get("/get-location-by-id/:locationId",asyncHandler(LocationController.getLocationById));
route.put("/update-location/:locationId",asyncHandler(LocationController.updateLocation));
route.delete("/delete-location/:locationId", asyncHandler(LocationController.deleteLocation));


route.post("/assign-location",  asyncHandler(LocationController.assignLocation));
route.get("/get-user-location",asyncHandler(LocationController.getUserLocation));
route.get("/get-user-location-by-user",asyncHandler(LocationController.getUserLocationById));


export default route;