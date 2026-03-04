import cron from "node-cron";
import ExcelJS from "exceljs";
import { prisma } from "../lib/prisma";
import { transporter, mailGenerator } from "../config/email.config";

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

    // Generate Excel file
    const excelBuffer = await generateDailyReportExcel();

    // Send email to each user
    for (const user of users) {
      await sendEmailWithAttachment(user.email, user.fullName, excelBuffer);
    }

    console.log("Daily reports sent successfully");
  } catch (error) {
    console.error("Error sending daily report:", error);
  }
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
  email: string,
  fullName: string,
  excelBuffer: Buffer
): Promise<boolean> => {
  const today = new Date().toLocaleDateString();
  const template = {
    body: {
      name: fullName,
      intro: `Here is your daily inventory report for ${today}.`,
      table: {
        data: [
          { item: "Today's Transactions", description: "All transactions recorded today" },
          { item: "ROL Items", description: "Items at or below reorder level" },
          { item: "Upcoming Invoices", description: "Pending invoices due in next 30 days" },
        ],
      },
      outro: "Please find the detailed report in the attached Excel file.",
    },
  };

  const mail = mailGenerator.generate(template);
  const message = {
    from: `"${company_name}" <riplanit@gmail.com>`,
    to: email,
    subject: `Daily Inventory Report - ${today}`,
    html: mail,
    attachments: [
      {
        filename: `Daily_Report_${today.replace(/\//g, "-")}.xlsx`,
        content: excelBuffer,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  };

  try {
    await transporter.sendMail(message);
    console.log(`Successfully sent daily report to ${email}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    return false;
  }
};

