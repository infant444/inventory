import cron from "node-cron";
import ExcelJS from "exceljs";
import { prisma } from "../lib/prisma";
import { transporter, mailGenerator } from "../config/email.config";
const PDFDocument = require('pdfkit');

const company_name = "ABC Company";

export const startScheduler = () => {
  // Runs every day at 6 PM
  cron.schedule("0 18 * * *", async () => {
    console.log("Running daily report scheduler...");
    await sendDailyReport();
  });
};

const sendDailyReport = async () => {
  try {
    // Fetch users with email notifications enabled (admin and analyzer)
    const users = await prisma.user.findMany({
      where: {
        emailNotification: true,
        isActive: true,
        role: { in: ["admin", "analyzer"] },
      },
      select: { email: true, fullName: true },
    });

    if (users.length === 0) {
      console.log("No users with email notifications enabled");
      return;
    }

    // Generate PDF file
    const pdfBuffer = await generateDailyReportPDF();

    // Send single email with first user as TO and rest as BCC
    const emails = users.map(u => u.email);
    const firstUserName = users[0].fullName;
    await sendEmailWithAttachment(emails, firstUserName, pdfBuffer);

    console.log("Daily reports sent successfully");
  } catch (error) {
    console.error("Error sending daily report:", error);
  }
};

const generateDailyReportPDF = async (): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Title
      doc.fontSize(22).font('Helvetica-Bold').text('Daily Inventory Report', { align: 'center' });
      doc.fontSize(12).font('Helvetica').text(today.toLocaleDateString(), { align: 'center' });
      doc.moveDown(2);

      // Section 1: Today's Transactions
      const transactions = await prisma.transactionLog.findMany({
        where: { createdAt: { gte: today, lt: tomorrow } },
        include: {
          item: { include: { location: true } },
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      doc.fontSize(16).font('Helvetica-Bold').text('Today\'s Transactions', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(`Total: ${transactions.length} transactions`);
      doc.moveDown();

      if (transactions.length > 0) {
        const colPositions = [50, 95, 210, 280, 330, 395, 485];
        const colWidths = [45, 115, 70, 50, 65, 90, 55];
        const headers = ['Code', 'Item Name', 'Type', 'Qty', 'User', 'Time'];
        
        const tableTop = doc.y;
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Code', colPositions[0], tableTop, { width: colWidths[0], align: 'left' });
        doc.text('Item Name', colPositions[1], tableTop, { width: colWidths[1], align: 'left' });
        doc.text('Type', colPositions[2], tableTop, { width: colWidths[2], align: 'left' });
        doc.text('Qty', colPositions[3], tableTop, { width: colWidths[3], align: 'right' });
        doc.text('User', colPositions[4], tableTop, { width: colWidths[4], align: 'left' });
        doc.text('Time', colPositions[5], tableTop, { width: colWidths[5], align: 'left' });
        doc.moveTo(50, tableTop + 12).lineTo(540, tableTop + 12).stroke();
        doc.moveDown();

        doc.font('Helvetica').fontSize(8);
        transactions.slice(0, 15).forEach((t) => {
          if (doc.y > 700) doc.addPage();
          const rowY = doc.y;
          const userName = t.user?.fullName || t.takenBy || 'N/A';
          doc.text(t.item.itemCode, colPositions[0], rowY, { width: colWidths[0], align: 'left' });
          doc.text(t.item.itemName.substring(0, 18), colPositions[1], rowY, { width: colWidths[1], align: 'left' });
          doc.text(t.transactionType, colPositions[2], rowY, { width: colWidths[2], align: 'left' });
          doc.text(t.quantity.toString(), colPositions[3], rowY, { width: colWidths[3], align: 'right' });
          doc.text(userName.substring(0, 10), colPositions[4], rowY, { width: colWidths[4], align: 'left' });
          doc.text(t.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), colPositions[5], rowY, { width: colWidths[5], align: 'left' });
          doc.moveDown();
        });
        if (transactions.length > 15) {
          doc.fontSize(8).fillColor('gray').text(`... and ${transactions.length - 15} more transactions`, 50);
          doc.fillColor('black');
        }
      } else {
        doc.fontSize(10).text('No transactions today', 50);
      }

      doc.moveDown(2);

      // Section 2: ROL Items
      if (doc.y > 600) doc.addPage();
      const rolItems = await prisma.itemMaster.findMany({
        where: { currentQty: { lte: prisma.itemMaster.fields.rol } },
        include: { location: true, supplier: true },
        orderBy: { currentQty: 'asc' },
      });

      doc.fontSize(16).font('Helvetica-Bold').text('Items at Reorder Level', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(`Total: ${rolItems.length} items`);
      doc.moveDown();

      if (rolItems.length > 0) {
        const rolColPositions = [50, 120, 250, 310, 360, 410];
        const rolColWidths = [70, 130, 60, 50, 50, 130];
        const rolHeaders = ['Item Code', 'Item Name', 'Current', 'ROL', 'MOQ', 'Supplier'];
        
        const tableTop = doc.y;
        doc.fontSize(9).font('Helvetica-Bold');
        rolHeaders.forEach((h, i) => {
          doc.text(h, rolColPositions[i], tableTop, { width: rolColWidths[i], align: 'left' });
        });
        doc.moveTo(50, tableTop + 12).lineTo(540, tableTop + 12).stroke();
        doc.moveDown();

        doc.font('Helvetica').fontSize(8);
        rolItems.slice(0, 20).forEach((item) => {
          if (doc.y > 700) doc.addPage();
          const rowY = doc.y;
          doc.text(item.itemCode, rolColPositions[0], rowY, { width: rolColWidths[0], align: 'left' });
          doc.text(item.itemName.substring(0, 22), rolColPositions[1], rowY, { width: rolColWidths[1], align: 'left' });
          doc.text(item.currentQty.toString(), rolColPositions[2], rowY, { width: rolColWidths[2], align: 'right' });
          doc.text(item.rol.toString(), rolColPositions[3], rowY, { width: rolColWidths[3], align: 'right' });
          doc.text(item.moq?.toString() || 'N/A', rolColPositions[4], rowY, { width: rolColWidths[4], align: 'right' });
          doc.text(item.supplier?.supplierName.substring(0, 25) || 'N/A', rolColPositions[5], rowY, { width: rolColWidths[5], align: 'left' });
          doc.moveDown();
        });
        if (rolItems.length > 20) {
          doc.fontSize(8).fillColor('gray').text(`... and ${rolItems.length - 20} more items`, 50);
          doc.fillColor('black');
        }
      } else {
        doc.fontSize(10).text('No items at reorder level', 50);
      }

      doc.moveDown(2);

      // Section 3: Upcoming Pending Invoices
      if (doc.y > 600) doc.addPage();
      const upcomingDate = new Date();
      upcomingDate.setDate(upcomingDate.getDate() + 30);
      const invoices = await prisma.invoice.findMany({
        where: {
          status: 'pending',
          dueDate: { gte: today, lte: upcomingDate },
        },
        orderBy: { dueDate: 'asc' },
      });

      // Fetch user names for invoices
      const userIds = [...new Set(invoices.map(inv => inv.createdBy))];
      const users = await prisma.user.findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, fullName: true },
      });
      const userMap = new Map(users.map(u => [u.userId, u.fullName]));

      doc.fontSize(16).font('Helvetica-Bold').text('Upcoming Pending Invoices (Next 30 Days)', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(`Total: ${invoices.length} invoices`);
      doc.moveDown();

      if (invoices.length > 0) {
        const invColPositions = [50, 120, 230, 310, 380, 440];
        const invColWidths = [70, 110, 80, 70, 60, 100];
        const invHeaders = ['Invoice #', 'Name', 'Amount', 'Due Date', 'Days Left', 'Created By'];
        
        const tableTop = doc.y;
        doc.fontSize(9).font('Helvetica-Bold');
        invHeaders.forEach((h, i) => {
          doc.text(h, invColPositions[i], tableTop, { width: invColWidths[i], align: 'left' });
        });
        doc.moveTo(50, tableTop + 12).lineTo(540, tableTop + 12).stroke();
        doc.moveDown();

        doc.font('Helvetica').fontSize(8);
        invoices.slice(0, 20).forEach((inv) => {
          if (doc.y > 700) doc.addPage();
          const daysUntilDue = Math.ceil((inv.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const rowY = doc.y;
          doc.text(inv.invoiceNumber, invColPositions[0], rowY, { width: invColWidths[0], align: 'left' });
          doc.text(inv.invoiceName.substring(0, 18), invColPositions[1], rowY, { width: invColWidths[1], align: 'left' });
          doc.text(`₹${parseFloat(inv.amount.toString()).toFixed(2)}`, invColPositions[2], rowY, { width: invColWidths[2], align: 'right' });
          doc.text(inv.dueDate.toLocaleDateString(), invColPositions[3], rowY, { width: invColWidths[3], align: 'center' });
          doc.text(daysUntilDue.toString(), invColPositions[4], rowY, { width: invColWidths[4], align: 'center' });
          doc.text(userMap.get(inv.createdBy) || 'N/A', invColPositions[5], rowY, { width: invColWidths[5], align: 'left' });
          doc.moveDown();
        });
        if (invoices.length > 20) {
          doc.fontSize(8).fillColor('gray').text(`... and ${invoices.length - 20} more invoices`, 50);
          doc.fillColor('black');
        }
      } else {
        doc.fontSize(10).text('No pending invoices in next 30 days', 50);
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(8).fillColor('gray').text(`Generated on ${new Date().toLocaleString()}`, 50, doc.page.height - 50, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const generateDailyReportExcel = async (): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();

  // Today's date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Sheet 1: Today's Transactions
  const transactionsSheet = workbook.addWorksheet("Today Transactions");
  const transactions = await prisma.transactionLog.findMany({
    where: {
      createdAt: { gte: today, lt: tomorrow },
    },
    include: {
      item: { include: { location: true, supplier: true } },
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  transactionsSheet.columns = [
    { header: "Transaction ID", key: "transactionId", width: 30 },
    { header: "Item Code", key: "itemCode", width: 15 },
    { header: "Item Name", key: "itemName", width: 25 },
    { header: "Location", key: "location", width: 20 },
    { header: "Type", key: "type", width: 12 },
    { header: "Quantity", key: "quantity", width: 12 },
    { header: "Remaining Qty", key: "remainingQty", width: 15 },
    { header: "Taken By", key: "takenBy", width: 20 },
    { header: "Remarks", key: "remarks", width: 30 },
    { header: "Date", key: "date", width: 20 },
  ];

  transactions.forEach((t) => {
    transactionsSheet.addRow({
      transactionId: t.transactionId,
      itemCode: t.item.itemCode,
      itemName: t.item.itemName,
      location: t.item.location.locationName,
      type: t.transactionType,
      quantity: t.quantity.toString(),
      remainingQty: t.remainingQty.toString(),
      takenBy: t.user?.fullName || t.takenBy || "N/A",
      remarks: t.remarks || "",
      date: t.createdAt.toLocaleString(),
    });
  });

  styleSheet(transactionsSheet);

  // Sheet 2: ROL (Reorder Level) Items
  const rolSheet = workbook.addWorksheet("ROL Items");
  const rolItems = await prisma.itemMaster.findMany({
    where: {
      currentQty: { lte: prisma.itemMaster.fields.rol },
    },
    include: {
      location: true,
      supplier: true,
      type: true,
    },
    orderBy: { currentQty: "asc" },
  });

  rolSheet.columns = [
    { header: "Item Code", key: "itemCode", width: 15 },
    { header: "Item Name", key: "itemName", width: 25 },
    { header: "Location", key: "location", width: 20 },
    { header: "Current Qty", key: "currentQty", width: 15 },
    { header: "ROL", key: "rol", width: 12 },
    { header: "MOQ", key: "moq", width: 12 },
    { header: "Supplier", key: "supplier", width: 25 },
    { header: "Type", key: "type", width: 15 },
    { header: "Last Purchase", key: "lastPurchase", width: 20 },
  ];

  rolItems.forEach((item) => {
    rolSheet.addRow({
      itemCode: item.itemCode,
      itemName: item.itemName,
      location: item.location.locationName,
      currentQty: item.currentQty.toString(),
      rol: item.rol.toString(),
      moq: item.moq?.toString() || "N/A",
      supplier: item.supplier?.supplierName || "N/A",
      type: item.type?.typeName || "N/A",
      lastPurchase: item.lastPurchaseDate?.toLocaleDateString() || "N/A",
    });
  });

  styleSheet(rolSheet);

  // Sheet 3: Upcoming Pending Invoices
  const invoicesSheet = workbook.addWorksheet("Upcoming Pending Invoices");
  const upcomingDate = new Date();
  upcomingDate.setDate(upcomingDate.getDate() + 30); // Next 30 days

  const invoices = await prisma.invoice.findMany({
    where: {
      status: "pending",
      dueDate: { gte: today, lte: upcomingDate },
    },
    orderBy: { dueDate: "asc" },
  });

  invoicesSheet.columns = [
    { header: "Invoice Number", key: "invoiceNumber", width: 20 },
    { header: "Invoice Name", key: "invoiceName", width: 30 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Invoice Date", key: "invoiceDate", width: 15 },
    { header: "Due Date", key: "dueDate", width: 15 },
    { header: "Days Until Due", key: "daysUntilDue", width: 15 },
    { header: "Status", key: "status", width: 12 },
    { header: "Notes", key: "notes", width: 30 },
  ];

  invoices.forEach((inv) => {
    const daysUntilDue = Math.ceil(
      (inv.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    invoicesSheet.addRow({
      invoiceNumber: inv.invoiceNumber,
      invoiceName: inv.invoiceName,
      amount: inv.amount.toString(),
      invoiceDate: inv.invoiceDate.toLocaleDateString(),
      dueDate: inv.dueDate.toLocaleDateString(),
      daysUntilDue: daysUntilDue.toString(),
      status: inv.status,
      notes: inv.notes || "",
    });
  });

  styleSheet(invoicesSheet);

  return Buffer.from(await workbook.xlsx.writeBuffer());
};

const styleSheet = (sheet: ExcelJS.Worksheet) => {
  // Style header row
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4472C4" },
  };
  sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
};

const sendEmailWithAttachment = async (
  emails: string[],
  fullName: string,
  pdfBuffer: Buffer
): Promise<boolean> => {
  const today = new Date().toLocaleDateString();
  
  const emailBody = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Daily Inventory Report</h2>
      <p>Dear Team,</p>
      <p>Please find attached the daily inventory report for <strong>${today}</strong>.</p>
      <h3>Report Contents:</h3>
      <ul>
        <li><strong>Today's Transactions:</strong> All transactions recorded today</li>
        <li><strong>ROL Items:</strong> Items at or below reorder level</li>
        <li><strong>Upcoming Invoices:</strong> Pending invoices due in next 30 days</li>
      </ul>
      <p>The detailed report is attached as a PDF file.</p>
      <br/>
      <p>Best regards,<br/>${company_name}</p>
    </div>
  `;

  const mailOptions: any = {
    from: `"${company_name}" <riplanit@gmail.com>`,
    to: emails[0],
    subject: `Daily Inventory Report - ${today}`,
    html: emailBody,
    attachments: [
      {
        filename: `Daily_Inventory_Report_${today.replace(/\//g, "-")}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  if (emails.length > 1) {
    mailOptions.bcc = emails.slice(1).join(',');
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Successfully sent daily report to ${emails.length} recipient(s)`);
    return true;
  } catch (error) {
    console.error(`Failed to send email:`, error);
    return false;
  }
};

