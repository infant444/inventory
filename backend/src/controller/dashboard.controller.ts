import { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export class DashboardController {
    static async getDashboardStats(req: any, res: Response, next: NextFunction) {
        try {
            const locationId = req.headers.location_id;
            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const [totalItems, activeInvoices, pendingInvoices, totalUsers, lowStockItems] = await Promise.all([
                prisma.itemMaster.count({ where: { locationId } }),
                prisma.invoice.count({ where: { locationId, status: { in: ['pending', 'overdue'] } } }),
                prisma.invoice.count({ where: { locationId, status: 'pending' } }),
                prisma.user.count({ where: { isActive: true } }),
                prisma.itemMaster.count({
                    where: {
                        locationId,
                        currentQty: { lte: prisma.itemMaster.fields.rol }
                    }
                })
            ]);

            res.status(200).json({
                totalItems,
                activeInvoices,
                pendingInvoices,
                totalUsers,
                lowStockAlerts: lowStockItems
            });
        } catch (err) {
            next(err);
        }
    }

    static async getRecentTransactions(req: any, res: Response, next: NextFunction) {
        try {
            const locationId = req.headers.location_id;
            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const transactions = await prisma.transactionLog.findMany({
                where: { item: { locationId } },
                include: { item: true },
                orderBy: { createdAt: 'desc' },
                take: 5
            });

            res.status(200).json(transactions);
        } catch (err) {
            next(err);
        }
    }

    static async getRecentInvoices(req: any, res: Response, next: NextFunction) {
        try {
            const locationId = req.headers.location_id;
            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const invoices = await prisma.invoice.findMany({
                where: { locationId },
                orderBy: { createdAt: 'desc' },
                take: 5
            });

            res.status(200).json(invoices);
        } catch (err) {
            next(err);
        }
    }

    static async getLowStockAlerts(req: any, res: Response, next: NextFunction) {
        try {
            const locationId = req.headers.location_id;
            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const items = await prisma.itemMaster.findMany({
                where: { locationId },
                include: { supplier: true, type: true }
            });

            const lowStock = items
                .filter(item => Number(item.currentQty) <= Number(item.rol))
                .slice(0, 5)
                .map(item => ({
                    itemId: item.itemId,
                    itemCode: item.itemCode,
                    itemName: item.itemName,
                    currentQty: Number(item.currentQty),
                    rol: Number(item.rol),
                    supplier: item.supplier?.supplierName,
                    category: item.type?.typeName
                }));

            res.status(200).json(lowStock);
        } catch (err) {
            next(err);
        }
    }
}
