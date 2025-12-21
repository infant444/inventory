import dorenv from 'dotenv';
dorenv.config();
import express from 'express';
import cors from 'cors';

const app=express();
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:["http://localhost:3000"]
}));

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Hello Welcome to my site ,I will sure to you will enjoy in out site because the lot of events is add to the site and get great experience and get afford able price to get on it" 
    })
})


const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log("Website serve on http://localhost:"+port);
    
})