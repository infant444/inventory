import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export class ProductController {
    static async checkIn(req: any, res: Response, next: NextFunction) {
        try {
            const { item_id, quantity, price, notes ,quantityType} = req.body;
            const locationId = req.headers.location_id;
            const userId = req.user.id;

            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const result = await prisma.$transaction(async (tx) => {
                const item = await tx.itemMaster.findFirst({
                    where: { itemId: item_id, locationId: locationId },
                    include: { supplier: true, type: true, tax: true, location: true }
                });

                if (!item) {
                    throw new Error("Item not found");
                }

                const newQty = Number(item.currentQty) + Number(quantity);
                
                await tx.itemMaster.update({
                    where: { itemId: item_id },
                    data: { currentQty: newQty }
                });

                const transaction = await tx.transactionLog.create({
                    data: {
                        itemId: item_id,
                        transactionType: 'checkin',
                        quantity: quantity,
                        quantityType,
                        remainingQty: newQty,
                        takenBy: userId,
                        remarks: notes || null
                    }
                });

                return { transaction, item: { ...item, currentQty: newQty }, price };
            });

            res.status(201).json(result);
        } catch (err: any) {
            next(err);
        }
    }

    static async checkOut(req: any, res: Response, next: NextFunction) {
        try {
            const { item_id, quantity, price, notes,quantityType } = req.body;
            const locationId = req.headers.location_id;
            const userId = req.user.id;

            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const result = await prisma.$transaction(async (tx) => {
                const item = await tx.itemMaster.findFirst({
                    where: { itemId: item_id, locationId: locationId },
                    include: { supplier: true, type: true, tax: true, location: true }
                });

                if (!item) {
                    throw new Error("Item not found");
                }

                const newQty = Number(item.currentQty) - Number(quantity);
                
                if (newQty < 0) {
                    throw new Error("Insufficient stock");
                }

                await tx.itemMaster.update({
                    where: { itemId: item_id },
                    data: { currentQty: newQty }
                });

                const transaction = await tx.transactionLog.create({
                    data: {
                        itemId: item_id,
                        transactionType: 'checkout',
                        quantity: quantity,
                        quantityType,
                        remainingQty: newQty,
                        takenBy: userId,
                        remarks: notes || null
                    }
                });

                return { transaction, item: { ...item, currentQty: newQty }, price };
            });

            res.status(201).json(result);
        } catch (err: any) {
            next(err);
        }
    }

    static async batchCheckIn(req: any, res: Response, next: NextFunction) {
        try {
            const { items } = req.body; // Array of {item_id, quantity, price, notes}
            const locationId = req.headers.location_id;
            const userId = req.user.id;

            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const results = await prisma.$transaction(async (tx) => {
                const processedItems: any[] = [];

                for (const itemData of items) {
                    const item = await tx.itemMaster.findFirst({
                        where: { itemId: itemData.item_id, locationId: locationId },
                        include: { supplier: true, type: true, tax: true, location: true }
                    });

                    if (!item) continue;

                    const newQty = Number(item.currentQty) + Number(itemData.quantity);
                    
                    await tx.itemMaster.update({
                        where: { itemId: itemData.item_id },
                        data: { currentQty: newQty }
                    });

                    await tx.transactionLog.create({
                        data: {
                            itemId: itemData.item_id,
                            transactionType: 'checkin',
                            quantity: itemData.quantity,
                            quantityType: itemData.quantityType || 'gram',
                            remainingQty: newQty,
                            takenBy: userId,
                            remarks: itemData.notes || null
                        }
                    });

                    processedItems.push({ ...item, currentQty: newQty, quantity: itemData.quantity, price: itemData.price });
                }

                return processedItems;
            });

            res.status(201).json({ items: results, count: results.length });
        } catch (err: any) {
            next(err);
        }
    }

    static async batchCheckOut(req: any, res: Response, next: NextFunction) {
        try {
            const { items } = req.body; // Array of {item_id, quantity, price, notes}
            const locationId = req.headers.location_id;
            const userId = req.user.id;

            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const results = await prisma.$transaction(async (tx) => {
                const processedItems: any[] = [];
                const errors: any[] = [];

                for (const itemData of items) {
                    const item = await tx.itemMaster.findFirst({
                        where: { itemId: itemData.item_id, locationId: locationId },
                        include: { supplier: true, type: true, tax: true, location: true }
                    });

                    if (!item) {
                        errors.push({ item_id: itemData.item_id, error: "Item not found" });
                        continue;
                    }

                    const newQty = Number(item.currentQty) - Number(itemData.quantity);
                    
                    if (newQty < 0) {
                        errors.push({ item_id: itemData.item_id, error: "Insufficient stock" });
                        continue;
                    }

                    await tx.itemMaster.update({
                        where: { itemId: itemData.item_id },
                        data: { currentQty: newQty }
                    });

                    await tx.transactionLog.create({
                        data: {
                            itemId: itemData.item_id,
                            transactionType: 'checkout',
                            quantity: itemData.quantity,
                            quantityType: itemData.quantityType || 'gram',
                            remainingQty: newQty,
                            takenBy: userId,
                            remarks: itemData.notes || null
                        }
                    });

                    processedItems.push({ ...item, currentQty: newQty, quantity: itemData.quantity, price: itemData.price });
                }

                return { processedItems, errors };
            });

            res.status(201).json({ items: results.processedItems, count: results.processedItems.length, errors: results.errors });
        } catch (err: any) {
            next(err);
        }
    }

    static async getTodayStats(req: any, res: Response, next: NextFunction) {
        try {
            const locationId = req.headers.location_id;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const transactions = await prisma.transactionLog.findMany({
                where: {
                    createdAt: { gte: today },
                    item: { locationId: locationId }
                },
                include: { item: true }
            });

            const checkInCount = transactions.filter(t => t.transactionType === 'checkin').length;
            const checkOutCount = transactions.filter(t => t.transactionType === 'checkout').length;

            res.status(200).json({ checkInCount, checkOutCount });
        } catch (err) {
            next(err);
        }
    }
}
