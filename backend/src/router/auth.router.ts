import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthController } from "../controller/auth.controller";
import authMiddleware from '../middleware/auth.middleware';
const route=Router();
route.get("/",asyncHandler(async(req,res)=>{
    res.status(200).json({message:"Location route is working"});
}))
route.post("/create-user", asyncHandler(AuthController.CreateUser));
route.post("/login", asyncHandler(AuthController.login));
route.put("/update-password", asyncHandler(AuthController.updatePassword));
route.put("/reset-password/:userid", asyncHandler(AuthController.resetPassword));
route.get("/logout",authMiddleware, asyncHandler(AuthController.logout));
export default route;