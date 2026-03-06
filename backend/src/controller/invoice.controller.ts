import { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { transporter, mailGenerator } from "../config/email.config";

export class InvoiceController {
    static async createInvoice(req: any, res: Response, next: NextFunction) {
        try {
            const { invoice_number, invoice_name, supplier_id, amount, invoice_date, due_date, notes, type } = req.body;
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
                    createdBy: userId,
                    invoiceType: type || 'purchase'
                }
            });

            res.status(201).json(invoice);
        } catch (err) {
            next(err);
        }
    }

    static async getAllInvoices(req: any, res: Response, next: NextFunction) {
        try {
            const { status,type } = req.query;
            const locationId = req.headers.location_id;

            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const whereClause: any = { locationId: locationId };
            if (status) {
                whereClause.status = status;
            }
            if (type) {
                whereClause.invoiceType = type;
            }
            
            // console.log(whereClause)
            const invoices = await prisma.invoice.findMany({
                where: whereClause,
            
                orderBy: { invoiceDate: 'desc' }
            });

            res.status(200).json(invoices);
        } catch (err) {
            next(err);
        }
    }

    static async updateInvoice(req: any, res: Response, next: NextFunction) {
        try {
            const { invoiceId } = req.params;
            const { invoice_number, invoice_name, supplier_id, amount, invoice_date, due_date, notes, status, type } = req.body;

            const updateData: any = {
                invoiceNumber: invoice_number,
                invoiceName: invoice_name,
                supplierId: supplier_id || null,
                amount: amount,
                invoiceDate: new Date(invoice_date),
                dueDate: new Date(due_date),
                notes: notes || null,
                status: status
            };

            if (type) {
                updateData.invoiceType = type;
            }

            const invoice = await prisma.invoice.update({
                where: { invoiceId: invoiceId },
                data: updateData
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
            const {type}=req.query
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
                    invoiceType:type,
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

    static async sendInvoiceEmail(req: any, res: Response, next: NextFunction) {
        try {
            const { emails, start_date, end_date, type } = req.body;
            const locationId = req.headers.location_id;

            if (!locationId) {
                res.status(400).json({ message: "Location ID required" });
                return;
            }

            const whereClause: any = { locationId: locationId, invoiceType: type };
            if (start_date && end_date) {
                whereClause.invoiceDate = {
                    gte: new Date(start_date),
                    lte: new Date(end_date)
                };
            }

            const invoices = await prisma.invoice.findMany({
                where: whereClause,
                orderBy: { invoiceDate: 'desc' }
            });

            const emailList = emails.split(',').map((e: string) => e.trim()).filter((e: string) => e);
            
            const tableRows = invoices.map(inv => `
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${inv.invoiceNumber}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${inv.invoiceName}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">₹${parseFloat(inv.amount.toString()).toFixed(2)}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${new Date(inv.invoiceDate).toLocaleDateString()}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${inv.status}</td>
                </tr>
            `).join('');

            const template = {
                body: {
                    intro: `Invoice Report (${new Date(start_date).toLocaleDateString()} - ${new Date(end_date).toLocaleDateString()})`,
                    table: {
                        data: invoices.map(inv => ({
                            'Invoice #': inv.invoiceNumber,
                            'Name': inv.invoiceName,
                            'Amount': `₹${parseFloat(inv.amount.toString()).toFixed(2)}`,
                            'Invoice Date': new Date(inv.invoiceDate).toLocaleDateString(),
                            'Due Date': new Date(inv.dueDate).toLocaleDateString(),
                            'Status': inv.status
                        }))
                    },
                    outro: `Total Invoices: ${invoices.length}`
                }
            };

            const mail = mailGenerator.generate(template);

            for (const email of emailList) {
                await transporter.sendMail({
                    from: '"ABC Company" <riplanit@gmail.com>',
                    to: email,
                    subject: `Invoice Report - ${type === 'general' ? 'Office' : 'Purchase'} Payments`,
                    html: mail
                });
            }

            res.status(200).json({ message: "Email sent successfully" });
        } catch (err) {
            next(err);
        }
    }
}
