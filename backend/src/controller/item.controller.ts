import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export class ItemController {
    static async addItem(req: Request, res: Response, next: NextFunction) {
        try {
            const { item_code, item_name, location_id, opening_qty, barcode, supplier_id, type_id, tax_id, purchase_price, tax_percent, rol, moq, eoq } = req.body;
            const total_amount = purchase_price + ((purchase_price * tax_percent) / 100);
            const item = await prisma.itemMaster.create({
                data: {
                    itemCode: item_code,
                    itemName: item_name,
                    locationId: location_id,
                    openingQty: opening_qty,
                    currentQty: opening_qty,
                    barcode: barcode,
                    supplierId: supplier_id,
                    typeId: type_id,
                    taxId: tax_id,
                    purchasePrice: purchase_price,
                    taxPercent: tax_percent,
                    totalAmount: total_amount
                }
            })
            const item_config = await prisma.purchaseMaster.create({
                data: {
                    rol: rol,
                    moq: moq,
                    eoq: eoq,
                    itemId: item.itemId,
                    availableQty: opening_qty,
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
                    locationId: locationId
                }, include: {
                    location: true,
                    supplier: true,
                    type: true,
                    tax: true,
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
                    itemId: id
                }, include: {
                    location: true,
                    supplier: true,
                    type: true,
                    tax: true,
                }

            })
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
                    barcode: barcode
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
            const { item_code, item_name, location_id, opening_qty, barcode, supplier_id, type_id, tax_id, purchase_price, tax_percent } = req.body;
            const total_amount = purchase_price + (purchase_price * tax_percent) / 100;
            const item = await prisma.itemMaster.update({
                where: {
                    itemId: id
                },
                data: {
                    itemCode: item_code,
                    itemName: item_name,
                    locationId: location_id,
                    openingQty: opening_qty,
                    barcode: barcode,
                    supplierId: supplier_id,
                    typeId: type_id,
                    taxId: tax_id,
                    purchasePrice: purchase_price,
                    taxPercent: tax_percent,
                    totalAmount: total_amount
                }
            })
            res.status(200).json(item)
        } catch (err) {
            next(err)
        }
    }
 
    static async deleteItem(req: any, res: Response, next: NextFunction) {
        try {
            const id = req.params.itemId;
            const item = await prisma.itemMaster.delete({
                where: {
                    itemId: id
                }
            })
            res.status(200).json(item)
        } catch (err) {
            next(err)
        }
    }

    // Product Config
    static async getItemConfig(req: any, res: Response, next: NextFunction) {
        try {
            const items = await prisma.purchaseMaster.findMany({
                where: {
                    itemId: req.params.itemId
                }
            })
            res.status(200).json(items)
        } catch (err) {
            next(err)
        }
    }
       static async updateItemConfig(req: any, res: Response, next: NextFunction) {
        try {
            const id = req.params.itemsId;
            const { rol, moq, eoq } = req.body;
            const item = await prisma.purchaseMaster.update({
                where: {
                    itemId: id
                },
                data: {
                    rol: rol,
                    moq: moq,
                    eoq: eoq,
                }
            })
            res.status(200).json(item)
        } catch (err) {
            next(err)
        }
    }


}
