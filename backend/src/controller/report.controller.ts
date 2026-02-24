import { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export class ReportController {
    static async getSummary(req: any, res: Response, next: NextFunction) {
        try {
            const { startDate, endDate, supplierId, itemId } = req.query;
            const locationId = req.headers.location_id;

            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const whereClause: any = {
                item: { locationId: locationId }
            };

            if (supplierId) {
                whereClause.item.supplierId = supplierId;
            }

            if (itemId) {
                whereClause.itemId = itemId;
            }

            if (startDate && endDate) {
                whereClause.createdAt = {
                    gte: new Date(startDate as string),
                    lte: new Date(endDate as string)
                };
            }

            const transactions = await prisma.transactionLog.findMany({
                where: whereClause,
                include: {
                    item: {
                        include: {
                            tax: true
                        }
                    }
                }
            });

            let totalCheckInAmount = 0;
            let totalCheckOutAmount = 0;
            let totalCheckInQty = 0;
            let totalCheckOutQty = 0;

            transactions.forEach(t => {
                const price = Number(t.item.purchasePrice);
                const qty = Number(t.quantity);
                const taxPercent = Number(t.item.taxPercent || 0);
                const amount = price * qty;
                const taxAmount = (amount * taxPercent) / 100;
                const total = amount + taxAmount;

                if (t.transactionType === 'checkin') {
                    totalCheckInAmount += total;
                    totalCheckInQty += qty;
                } else {
                    totalCheckOutAmount += total;
                    totalCheckOutQty += qty;
                }
            });

            const revenue = totalCheckOutAmount - totalCheckInAmount;

            res.status(200).json({
                totalCheckInAmount,
                totalCheckOutAmount,
                revenue,
                totalTransactions: transactions.length,
                totalCheckInQty,
                totalCheckOutQty,
                totalQuantity: totalCheckInQty + totalCheckOutQty
            });
        } catch (err) {
            next(err);
        }
    }

    static async getList(req: any, res: Response, next: NextFunction) {
        try {
            const { startDate, endDate, page = 1, limit = 50, supplierId, itemId } = req.query;
            const locationId = req.headers.location_id;

            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const whereClause: any = {
                item: { locationId: locationId }
            };

            if (supplierId) {
                whereClause.item.supplierId = supplierId;
            }

            if (itemId) {
                whereClause.itemId = itemId;
            }

            if (startDate && endDate) {
                whereClause.createdAt = {
                    gte: new Date(startDate as string),
                    lte: new Date(endDate as string)
                };
            }

            const skip = (Number(page) - 1) * Number(limit);

            const [transactions, total] = await Promise.all([
                prisma.transactionLog.findMany({
                    where: whereClause,
                    include: {
                        item: {
                            include: {
                                location: true,
                                tax: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: Number(limit)
                }),
                prisma.transactionLog.count({ where: whereClause })
            ]);

            const formattedTransactions = transactions.map(t => {
                const price = Number(t.item.purchasePrice);
                const qty = Number(t.quantity);
                const taxPercent = Number(t.item.taxPercent || 0);
                const amount = price * qty;
                const taxAmount = (amount * taxPercent) / 100;
                const total = amount + taxAmount;

                return {
                    transactionId: t.transactionId,
                    date: t.createdAt,
                    itemName: t.item.itemName,
                    itemCode: t.item.itemCode,
                    type: t.transactionType,
                    quantity: qty,
                    price: price,
                    taxPercent: taxPercent,
                    taxAmount: taxAmount,
                    totalAmount: total,
                    location: t.item.location?.locationName,
                    takenBy: t.takenBy,
                    remarks: t.remarks
                };
            });

            res.status(200).json({
                transactions: formattedTransactions,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / Number(limit))
                }
            });
        } catch (err) {
            next(err);
        }
    }

    static async getCharts(req: any, res: Response, next: NextFunction) {
        try {
            const { startDate, endDate, supplierId, itemId } = req.query;
            const locationId = req.headers.location_id;

            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const whereClause: any = {
                item: { locationId: locationId }
            };

            if (supplierId) {
                whereClause.item.supplierId = supplierId;
            }

            if (itemId) {
                whereClause.itemId = itemId;
            }

            if (startDate && endDate) {
                whereClause.createdAt = {
                    gte: new Date(startDate as string),
                    lte: new Date(endDate as string)
                };
            }

            const transactions = await prisma.transactionLog.findMany({
                where: whereClause,
                include: {
                    item: {
                        include: { tax: true }
                    }
                },
                orderBy: { createdAt: 'asc' }
            });

            // Daily totals
            const dailyData: any = {};
            transactions.forEach(t => {
                const date = new Date(t.createdAt).toISOString().split('T')[0];
                const price = Number(t.item.purchasePrice);
                const qty = Number(t.quantity);
                const taxPercent = Number(t.item.taxPercent || 0);
                const amount = price * qty;
                const total = amount + (amount * taxPercent) / 100;

                if (!dailyData[date]) {
                    dailyData[date] = { date, checkIn: 0, checkOut: 0 };
                }

                if (t.transactionType === 'checkin') {
                    dailyData[date].checkIn += total;
                } else {
                    dailyData[date].checkOut += total;
                }
            });

            // Product totals - separate by check-in and check-out
            const checkInData: any = {};
            const checkOutData: any = {};
            transactions.forEach(t => {
                const itemName = t.item.itemName;
                const qty = Number(t.quantity);

                if (t.transactionType === 'checkin') {
                    if (!checkInData[itemName]) {
                        checkInData[itemName] = 0;
                    }
                    checkInData[itemName] += qty;
                } else {
                    if (!checkOutData[itemName]) {
                        checkOutData[itemName] = 0;
                    }
                    checkOutData[itemName] += qty;
                }
            });

            const topCheckIn = Object.entries(checkInData)
                .map(([name, quantity]) => ({ name, quantity }))
                .sort((a: any, b: any) => b.quantity - a.quantity)
                .slice(0, 10);

            const topCheckOut = Object.entries(checkOutData)
                .map(([name, quantity]) => ({ name, quantity }))
                .sort((a: any, b: any) => b.quantity - a.quantity)
                .slice(0, 10);

            const productData: any = {};
            transactions.forEach(t => {
                const itemName = t.item.itemName;
                const qty = Number(t.quantity);

                if (!productData[itemName]) {
                    productData[itemName] = 0;
                }
                productData[itemName] += qty;
            });

            const topProducts = Object.entries(productData)
                .map(([name, quantity]) => ({ name, quantity }))
                .sort((a: any, b: any) => b.quantity - a.quantity)
                .slice(0, 10);

            res.status(200).json({
                dailyTrend: Object.values(dailyData),
                topProducts,
                topCheckIn,
                topCheckOut
            });
        } catch (err) {
            next(err);
        }
    }
}
