import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware';
import AuthRouter from './router/auth.router';
import LocationRouter from './router/location.router';

const app=express();
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:["http://localhost:3000"]
}));

app.get("/",(req,res)=>{
    res.status(200).json({
        message: "Hello Welcome to our site" });
})
app.use("/api/auth",AuthRouter);
app.use("/api/location", LocationRouter);
app.use(errorHandler);

const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log("Website serve on http://localhost:"+port);
    
})