import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthController } from "../controller/auth.controller";
const route=Router();
route.get("/",asyncHandler(async(req,res)=>{
    res.status(200).json({message:"Location route is working"});
}))
route.post("/create-user", asyncHandler(AuthController.CreateUser));
route.post("/login", asyncHandler(AuthController.login));
route.put("/update-password", asyncHandler(AuthController.updatePassword));
route.get("/logout/:id", asyncHandler(AuthController.logout));
export default route;