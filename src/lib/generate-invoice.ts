import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

const DEFAULT_SETTINGS = {
    companyName: "Akhand Cafe",
    companyEmail: "admin@akhandcafe.com",
    companyAddress: "",
    companyTaxId: "",
    footerNote: "Thank you for your business!",
    logo: null,
    accentColor: "#000000",
};

export const generateInvoice = (order: any) => {
    // Get Settings
    let settings = DEFAULT_SETTINGS;
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("invoiceSettings");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge with defaults to ensure all keys exist
                settings = { ...DEFAULT_SETTINGS, ...parsed };
                // Fallback for critical fields if user left them empty (optional, but good for "Company Name")
                if (!settings.companyName) settings.companyName = DEFAULT_SETTINGS.companyName;
                if (!settings.companyEmail) settings.companyEmail = DEFAULT_SETTINGS.companyEmail;
            } catch (e) {
                console.error("Error parsing invoice settings", e);
            }
        }
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 14;

    // -- Header --
    // Logo
    let headerY = 22;
    if (settings.logo) {
        try {
            // Add logo (max width 40, aspect ratio preserved roughly by assuming square or adjusting)
            // We'll just set it to a fixed size for now, e.g., 30x30 or width 40
            doc.addImage(settings.logo, "PNG", margin, 15, 30, 30);
            headerY = 50; // Push text down if logo exists
        } catch (e) {
            console.error("Error adding logo", e);
        }
    }

    // Company Info (Right Side)
    doc.setFontSize(10);
    // Use Accent Color for Company Name ?? Or just Black? Let's use Black for text, Accent for "INVOICE"
    doc.setTextColor(0, 0, 0);
    doc.text(settings.companyName, pageWidth - margin, 22, { align: "right" });
    doc.text(settings.companyEmail, pageWidth - margin, 28, { align: "right" });

    // Address (Right Side, below email)
    if (settings.companyAddress) {
        const splitAddress = doc.splitTextToSize(settings.companyAddress, 60);
        doc.text(splitAddress, pageWidth - margin, 34, { align: "right" });
    }

    // Tax ID
    if (settings.companyTaxId) {
        // Position depends on address length
        // A simple way is to estimate Y or just put it fixed if address isn't too long
        // Let's put it below the address block.
        // For simplicity in this iteration, let's put it at a fixed Y or calculate it.
        // We'll just rely on a safe margin for now.
        doc.text(`Tax ID: ${settings.companyTaxId}`, pageWidth - margin, 50, { align: "right" });
    }

    // -- INVOICE Title --
    // Use Accent Color
    doc.setTextColor(settings.accentColor);
    doc.setFontSize(20);
    // If logo, "INVOICE" is to the right? Or stay left?
    // If Logo is left (x=14), Text should perhaps be strictly below or centered?
    // Let's keep "INVOICE" at x=14, but if logo is there, maybe move it down?
    // Let's move INVOICE down if logo is present.
    const titleY = settings.logo ? 55 : 22;
    doc.text("INVOICE", margin, titleY);

    // -- Meta Data --
    doc.setTextColor(0, 0, 0); // Reset to black
    doc.setFontSize(10);
    const metaY = titleY + 10;
    doc.text(`Invoice #: ${order.id}`, margin, metaY);
    doc.text(`Date: ${format(new Date(order.date_created), "PPP")}`, margin, metaY + 6);
    doc.text(`Status: ${order.status}`, margin, metaY + 12);

    // -- Billing Details --
    const billY = metaY + 25;
    doc.setFontSize(12);
    // Header in Accent?
    doc.setTextColor(settings.accentColor);
    doc.text("Bill To:", margin, billY);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`${order.billing.first_name} ${order.billing.last_name}`, margin, billY + 7);
    doc.text(order.billing.email, margin, billY + 12);
    doc.text(order.billing.phone, margin, billY + 17);
    doc.text(`${order.billing.address_1}, ${order.billing.city}`, margin, billY + 22);

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

    const startY = billY + 30;

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: startY,
        theme: "striped",
        headStyles: { fillColor: settings.accentColor }, // Use accent color for headers!
        styles: { textColor: [0, 0, 0] }, // Body text black
    });

    // -- Totals --
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.text(`Subtotal: ${order.currency_symbol}${order.total}`, pageWidth - margin, finalY, { align: "right" });
    doc.setFontSize(12);
    // doc.setFont("helvetica", "bold"); // bold needs font loaded
    // Just use size increase
    doc.setTextColor(settings.accentColor);
    doc.text(`Total: ${order.currency_symbol}${order.total}`, pageWidth - margin, finalY + 10, { align: "right" });

    // -- Footer --
    if (settings.footerNote) {
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(8);
        doc.text(settings.footerNote, pageWidth / 2, doc.internal.pageSize.height - 10, { align: "center" });
    }

    // -- Save --
    doc.save(`Invoice_${order.id}.pdf`);
};
