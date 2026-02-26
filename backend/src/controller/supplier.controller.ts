import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class SupplierController {
    static async createSupplier(req: Request, res: Response, next: NextFunction) {
        try {
            const { supplierName, address, email, phone, contactPerson,vatId,taxId,ibanNumber } = req.body
            const supplier = await prisma.supplierMaster.create({
                data: {
                    supplierName: supplierName,
                    address: address,
                    contactPerson: contactPerson,
                    phone: phone,
                    email: email
                    ,vatId,
                    taxId,
                    ibanNumber 


                }
            })
            res.json(supplier)
        } catch (error) {
            next(error)
        }
    }
    static async getAllSuppliers(req: Request, res: Response, next: NextFunction) {
        try {
            const suppliers = await prisma.supplierMaster.findMany()
            res.json(suppliers)
        } catch (error) {
            next(error)
        }
    }
    static async getSupplierById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.supplierId
            const supplier = await prisma.supplierMaster.findUnique({
                where: {
                    supplierId: id
                }
            })
            res.json(supplier)
        } catch (error) {
            next(error)
        }
    }
    static async updateSupplier(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.supplierId
            const { supplierName, address, email, phone, contactPerson, vatId, taxId, ibanNumber } = req.body
            const supplier = await prisma.supplierMaster.update({
                where: {
                    supplierId: id
                },
                data: {
                    supplierName: supplierName,
                    address: address,
                    contactPerson: contactPerson,
                    phone: phone,
                    email: email,
                    vatId,
                    taxId,
                    ibanNumber
                }
            });
            res.json(supplier);
        } catch (error) {
            next(error)
        }
    }
    static async deleteSupplier(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.supplierId
            const supplier = await prisma.supplierMaster.delete({
                where: {
                    supplierId: id
                }
            })
            res.json(supplier)
        } catch (error) {
            next(error)
        }
    }
    
}