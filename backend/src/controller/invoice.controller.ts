import { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export class InvoiceController {
    static async createInvoice(req: any, res: Response, next: NextFunction) {
        try {
            const { invoice_number, invoice_name, supplier_id, amount, invoice_date, due_date, notes } = req.body;
            const locationId = req.headers.location_id;
            const userId = req.user.id;

            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const invoice = await prisma.invoice.create({
                data: {
                    invoiceNumber: invoice_number,
                    invoiceName: invoice_name,
                    supplierId: supplier_id || null,
                    amount: amount,
                    invoiceDate: new Date(invoice_date),
                    dueDate: new Date(due_date),
                    notes: notes || null,
                    locationId: locationId,
                    createdBy: userId
                }
            });

            res.status(201).json(invoice);
        } catch (err) {
            next(err);
        }
    }

    static async getAllInvoices(req: any, res: Response, next: NextFunction) {
        try {
            const { status } = req.query;
            const locationId = req.headers.location_id;

            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const whereClause: any = { locationId: locationId };
            if (status) {
                whereClause.status = status;
            }

            const invoices = await prisma.invoice.findMany({
                where: whereClause,
                orderBy: { dueDate: 'asc' }
            });

            res.status(200).json(invoices);
        } catch (err) {
            next(err);
        }
    }

    static async updateInvoice(req: any, res: Response, next: NextFunction) {
        try {
            const { invoiceId } = req.params;
            const { invoice_number, invoice_name, supplier_id, amount, invoice_date, due_date, notes, status } = req.body;

            const invoice = await prisma.invoice.update({
                where: { invoiceId: invoiceId },
                data: {
                    invoiceNumber: invoice_number,
                    invoiceName: invoice_name,
                    supplierId: supplier_id || null,
                    amount: amount,
                    invoiceDate: new Date(invoice_date),
                    dueDate: new Date(due_date),
                    notes: notes || null,
                    status: status
                }
            });

            res.status(200).json(invoice);
        } catch (err) {
            next(err);
        }
    }

    static async markAsPaid(req: any, res: Response, next: NextFunction) {
        try {
            const { invoiceId } = req.params;
            const { payment_mode } = req.body;

            const invoice = await prisma.invoice.update({
                where: { invoiceId: invoiceId },
                data: {
                    status: 'paid',
                    paidDate: new Date(),
                    paymentMode: payment_mode
                }
            });

            res.status(200).json(invoice);
        } catch (err) {
            next(err);
        }
    }

    static async deleteInvoice(req: any, res: Response, next: NextFunction) {
        try {
            const { invoiceId } = req.params;

            await prisma.invoice.delete({
                where: { invoiceId: invoiceId }
            });

            res.status(200).json({ message: "Invoice deleted successfully" });
        } catch (err) {
            next(err);
        }
    }

    static async getUpcomingAlerts(req: any, res: Response, next: NextFunction) {
        try {
            const locationId = req.headers.location_id;

            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const today = new Date();
            const threeDaysLater = new Date();
            threeDaysLater.setDate(today.getDate() + 3);

            const upcomingInvoices = await prisma.invoice.findMany({
                where: {
                    locationId: locationId,
                    status: 'pending',
                    dueDate: {
                        gte: today,
                        lte: threeDaysLater
                    }
                },
                orderBy: { dueDate: 'asc' }
            });

            res.status(200).json(upcomingInvoices);
        } catch (err) {
            next(err);
        }
    }
}
