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
            });

            await prisma.itemPriceMaster.create({
                data: {
                    itemId: item.itemId,
                    price: purchase_price,
                    createdAt: new Date()
                }
            });

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
            
            const existingItem = await prisma.itemMaster.findUnique({
                where: { itemId: id }
            });

            // Only create price history if price actually changed
            if (existingItem && Number(existingItem.purchasePrice) !== Number(purchase_price)) {
                await prisma.itemPriceMaster.create({
                    data: {
                        itemId: id,
                        price: purchase_price,
                        createdAt: new Date()
                    }
                });
            }

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
                    groupName, 
                    currentQty:current_qty

                }
            });
            res.status(200).json(item);
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

    static async getItemPriceHistory(req: any, res: Response, next: NextFunction) {
        try {
            const itemId = req.params.itemId;
            const priceHistory = await prisma.itemPriceMaster.findMany({
                where: { itemId },
                orderBy: { createdAt: 'desc' }
            });
            res.status(200).json(priceHistory);
        } catch (err) {
            next(err);
        }
    }

    static async getAllItemPrices(req: any, res: Response, next: NextFunction) {
        try {
            const locationId = req.headers.location_id;
            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const items = await prisma.itemMaster.findMany({
                where: {
                    locationId,
                    isDisable: false
                },
                include: {
                    priceHistory: {
                        orderBy: { createdAt: 'asc' },
                        take: 1
                    },
                    supplier: true,
                    type: true
                },
                orderBy: { itemName: 'asc' }
            });

            const itemsWithPriceDetails = items.map(item => ({
                itemId: item.itemId,
                itemCode: item.itemCode,
                itemName: item.itemName,
                currentPrice: Number(item.purchasePrice),
                latestPriceUpdate: item.priceHistory[0]?.createdAt || item.createdAt,
                priceHistoryCount: item.priceHistory.length,
                category: item.type?.typeName,
                supplier: item.supplier?.supplierName,
                taxPercent: Number(item.taxPercent || 0)
            }));

            res.status(200).json(itemsWithPriceDetails);
        } catch (err) {
            next(err);
        }
    }

    static async getItemPriceStats(req: any, res: Response, next: NextFunction) {
        try {
            const itemId = req.params.itemId;
            
            const priceHistory = await prisma.itemPriceMaster.findMany({
                where: { itemId },
                orderBy: { createdAt: 'asc' }
            });

            if (priceHistory.length === 0) {
                res.status(404).json({ message: "No price history found" });
                return;
            }

            const prices = priceHistory.map(p => Number(p.price));
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
            const currentPrice = prices[prices.length - 1];
            const firstPrice = prices[0];
            const priceChange = currentPrice - firstPrice;
            const priceChangePercent = firstPrice > 0 ? ((priceChange / firstPrice) * 100).toFixed(2) : '0.00';

            const item = await prisma.itemMaster.findUnique({
                where: { itemId },
                include: { supplier: true, type: true }
            });

            res.status(200).json({
                itemId,
                itemCode: item?.itemCode,
                itemName: item?.itemName,
                category: item?.type?.typeName,
                supplier: item?.supplier?.supplierName,
                currentPrice,
                firstPrice,
                minPrice,
                maxPrice,
                avgPrice: avgPrice.toFixed(2),
                priceChange: priceChange.toFixed(2),
                priceChangePercent,
                totalPriceUpdates: priceHistory.length,
                priceHistory: priceHistory.map(p => ({
                    id: p.id,
                    price: Number(p.price),
                    createdAt: p.createdAt
                }))
            });
        } catch (err) {
            next(err);
        }
    }




}
