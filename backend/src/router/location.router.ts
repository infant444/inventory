import Router from 'express';
import asyncHandler from 'express-async-handler';
import { LocationController } from "../controller/location.controller";
const route=Router();
route.get("/",asyncHandler(async(req,res)=>{
    res.status(200).json({message:"Location route is working"});
}))
route.get("/get-all-location", asyncHandler(LocationController.getAllLocation));
export default route;