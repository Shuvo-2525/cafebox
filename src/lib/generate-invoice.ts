import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const generateInvoice = (order: any) => {
    const doc = new jsPDF();

    // -- Header --
    doc.setFontSize(20);
    doc.text("INVOICE", 14, 22);

    doc.setFontSize(10);
    doc.text(`Invoice #: ${order.id}`, 14, 32);
    doc.text(`Date: ${format(new Date(order.date_created), "PPP")}`, 14, 38);
    doc.text(`Status: ${order.status}`, 14, 44);

    // -- Company Info (Right Side) --
    const pageWidth = doc.internal.pageSize.width;
    doc.setFontSize(10);
    doc.text("Akhand Cafe", pageWidth - 14, 22, { align: "right" });
    doc.text("admin@akhandcafe.com", pageWidth - 14, 28, { align: "right" });

    // -- Billing Details --
    doc.setFontSize(12);
    doc.text("Bill To:", 14, 55);
    doc.setFontSize(10);
    doc.text(`${order.billing.first_name} ${order.billing.last_name}`, 14, 62);
    doc.text(order.billing.email, 14, 67);
    doc.text(order.billing.phone, 14, 72);
    doc.text(`${order.billing.address_1}, ${order.billing.city}`, 14, 77);

    // -- Items Table --
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows: any[] = [];

    order.line_items.forEach((item: any) => {
        const itemData = [
            item.name,
            item.quantity,
            `${order.currency_symbol}${item.price}`,
            `${order.currency_symbol}${item.total}`,
        ];
        tableRows.push(itemData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 85,
        theme: "striped",
        headStyles: { fillColor: [66, 66, 66] },
    });

    // -- Totals --
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.text(`Subtotal: ${order.currency_symbol}${order.total}`, pageWidth - 14, finalY, { align: "right" });
    doc.setFontSize(12);
    doc.setFont("helvetica");
    doc.text(`Total: ${order.currency_symbol}${order.total}`, pageWidth - 14, finalY + 10, { align: "right" });

    // -- Save --
    doc.save(`Invoice_${order.id}.pdf`);
};
