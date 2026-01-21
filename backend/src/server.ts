import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware';
import AuthRouter from './router/auth.router';
import LocationRouter from './router/location.router';
import UserRouter from './router/user.router';
import TaxRouter from './router/tax.router';
import CategoriesRouter from './router/categories.router';
import SupplierRouter from './router/supplier.router';
import ProductRouter from './router/product.router';
const app=express();
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:["http://localhost:3000", "http://localhost:5173"]
}));

app.get("/",(req,res)=>{
    res.status(200).json({
        message: "Hello Welcome to our site" });
})
app.use("/api/auth",AuthRouter);
app.use("/api/user",UserRouter);
app.use("/api/location", LocationRouter);
app.use("/api/tax", TaxRouter);
app.use("/api/categories",CategoriesRouter)
app.use("/api/supplier",SupplierRouter);
app.use("/api/item",ProductRouter)
app.use(errorHandler);

const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log("Website serve on http://localhost:"+port);
    
})