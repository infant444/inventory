import { NextFunction,Request,Response } from "express"
import { prisma } from "../lib/prisma"

export class TaxController{
    static async createTax(req:Request, res:Response, next:NextFunction){
        try{
            const {tax_name, taxPercentage,description} = req.body
            const tax = await prisma.taxMaster.create({
                data:{
                    tax_name: tax_name,
                    taxPercentage:taxPercentage,
                    description:description
                }
            })
            res.json(tax)
        }catch(error){
            next(error)
        }
    }
    static async getAllTax(req:Request, res:Response, next:NextFunction){
        try{
            const tax = await prisma.taxMaster.findMany()
            res.json(tax)
               
        }catch(error){
            next(error)
        }
    }
    static async getTaxById(req:Request, res:Response, next:NextFunction){
        try{
            const id = req.params.taxId
            const tax = await prisma.taxMaster.findUnique({
                where:{
                    taxId:id
                }
            })
            res.json(tax)
        }catch(error){
            next(error)
        }
    }
    static async updateTax(req:Request, res:Response, next:NextFunction){
        try{
            const id = req.params.taxId
            const {tax_name, taxPercentage,description} = req.body
            const tax = await prisma.taxMaster.update({
                where:{
                    taxId:id
                },
                data:{
                    tax_name: tax_name,
                    taxPercentage:taxPercentage,
                    description:description
                }
            })
            res.json(tax)
        }catch(error){
            next(error)
        }
    }
    static async deleteTax(req:Request, res:Response, next:NextFunction){
        try{
            const id = req.params.taxId
            const tax = await prisma.taxMaster.delete({
                where:{
                    taxId:id
                }
            })
            res.json(tax)
        }catch(error){
            next(error)
        }
    }
}