import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export class ItemController {
    static async addItem(req: Request, res: Response, next: NextFunction) {
        try {
            const { item_code, item_name, location_id, current_qty, barcode, supplier_id, type_id, tax_id, purchase_price, tax_percent, rol, moq, eoq,quantityType,defaultIncrease,defaultDecrease,packQty,packCount,groupName } = req.body;
            
            const existingItem = await prisma.itemMaster.findFirst({
                where: {
                    itemCode: item_code,
                    locationId: location_id
                }
            });

            if (existingItem) {
                res.status(400).json({ message: "Item code already exists in this location" });
                return;
            }

            const total_amount = purchase_price + ((purchase_price * tax_percent) / 100);
            const item = await prisma.itemMaster.create({
                data: {
                    itemCode: item_code,
                    itemName: item_name,
                    locationId: location_id,
                    currentQty: current_qty,
                    barcode: barcode,
                    supplierId: supplier_id,
                    typeId: type_id,
                    taxId: tax_id,
                    purchasePrice: purchase_price,
                    taxPercent: tax_percent,
                    totalAmount: total_amount,
                    rol: rol,
                    moq: moq,
                    eoq: eoq,
                    quantityType,
                    defaultIncrease,
                    defaultDecrease,
                    packQty,
                    groupName
                }
            })
            res.status(201).json({ item });
        } catch (err) {
            next(err);
        }
    }
    static async getAllItem(req: any, res: Response, next: NextFunction) {
        try {
            const locationId = req.headers.location_id;
            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }
            
            const items = await prisma.itemMaster.findMany({
                where: {
                    locationId: locationId,
                    isDisable:false
                }, include: {
                    location: true,
                    supplier: true,
                    type: true,
                    tax: true,
                    group: true
                },
                orderBy:{
                    itemCode:'asc'
                }
            })
            res.status(200).json(items)
        } catch (err) {
            next(err)
        }
    }

    static async getItemById(req: any, res: Response, next: NextFunction) {
        try {
             const locationId = req.headers.location_id;
            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }
            const id = req.params.itemId;
            const items = await prisma.itemMaster.findMany({
                where: {
                    locationId:locationId,
                    itemId: id,
                    isDisable:false
                }, include: {
                    location: true,
                    supplier: true,
                    type: true,
                    tax: true
                }

            })
            console.log(items)
            res.status(200).json(items)
        } catch (err) {
            next(err)
        }
    }

    static async getItemByBarcode(req: any, res: Response, next: NextFunction) {
        try {
            const barcode = req.params.barcode;
            const locationId = req.headers.location_id;
            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }
            const item = await prisma.itemMaster.findFirst({
                where: {
                    locationId: locationId,
                    barcode: barcode,
                    isDisable:false
                },
                include: {
                    location: true,
                    supplier: true,
                    type: true,
                    tax: true
                }
            })
            res.status(200).json(item)
        } catch (err) {
            next(err)
        }
    }

    static async getItemByCode(req: any, res: Response, next: NextFunction) {
        try {
            const itemCode = req.params.itemCode;
            const locationId = req.headers.location_id;
            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }
            const item = await prisma.itemMaster.findFirst({
                where: {
                    locationId: locationId,
                    itemCode: itemCode,
                    isDisable:false,
                },
                include: {
                    location: true,
                    supplier: true,
                    type: true,
                    tax: true
                }
            })
            res.status(200).json(item)
        } catch (err) {
            next(err)
        }
    }
    static async updateItem(req: any, res: Response, next: NextFunction) {
        try {
            const id = req.params.itemId;
            const { item_code, item_name, location_id, current_qty, barcode, supplier_id, type_id, tax_id, purchase_price, tax_percent,packQty,groupName } = req.body;
             const { rol, moq, eoq,defaultDecrease,defaultIncrease,quantityType } = req.body;

            const total_amount = purchase_price + (purchase_price * tax_percent) / 100;
            const item = await prisma.itemMaster.update({
                where: {
                    itemId: id,
                    isDisable:false
                },
                data: {
                    itemCode: item_code,
                    itemName: item_name,
                    locationId: location_id,
                    barcode: barcode,
                    supplierId: supplier_id,
                    typeId: type_id,
                    taxId: tax_id,
                    purchasePrice: purchase_price,
                    taxPercent: tax_percent,
                    totalAmount: total_amount,
                    rol: rol,
                    moq: moq,
                    eoq: eoq,
                    quantityType,
                    defaultIncrease,
                    defaultDecrease,
                    packQty,
                    groupName 

                }
            })
            res.status(200).json(item)
        } catch (err) {
            next(err)
        }
    }
 
    static async deleteItem(req: any, res: Response, next: NextFunction) {
        try {
            const id = req.params.itemId as string;
            const item = await prisma.itemMaster.update({
                where: {
                    itemId: id,
                    isDisable:false
                },
                data:{
                    isDisable:true
                }
            })
            res.status(200).json(item)
        } catch (err) {
            next(err)
        }
    }




}
