
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export class LocationController {
    static async getAllLocation(req:Request,res:Response,next:NextFunction){
        try {
            const locations=await prisma.location.findMany();
            res.status(200).json(locations)
        }catch(err){
            next(err)
        }
    }
}