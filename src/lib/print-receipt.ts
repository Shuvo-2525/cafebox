import { format } from "date-fns";

export const printReceipt = (order: any) => {
    // 58mm width is approximately 204px at 96 DPI, but standard receipt printers 
    // usually work well with a container width of around 48mm-58mm content.
    // We'll use a string buffer to build the HTML for simplicity and speed.

    const styles = `
    <style>
        @page { margin: 0; }
        body { margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace; width: 58mm; font-size: 12px; }
        .header { text-align: center; margin-bottom: 10px; }
        .title { font-size: 16px; font-weight: bold; }
        .subtitle { font-size: 10px; }
        .divider { border-top: 1px dashed black; margin: 5px 0; }
        .item { display: flex; justify-content: space-between; margin-bottom: 3px; }
        .item-name { flex: 1; margin-right: 5px; }
        .item-qty { font-weight: bold; margin-right: 5px; }
        .footer { text-align: center; margin-top: 15px; font-size: 10px; }
        .total { text-align: right; margin-top: 5px; font-weight: bold; font-size: 14px; }
    </style>
    `;

    const itemsHtml = order.line_items.map((item: any) => `
        <div class="item">
            <span class="item-qty">${item.quantity}x</span>
            <span class="item-name">${item.name}</span>
            <span>${order.currency_symbol}${item.total}</span>
        </div>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Receipt #${order.id}</title>
            ${styles}
        </head>
        <body>
            <div class="header">
                <div class="title">AKHAND CAFE</div>
                <div class="subtitle">Kitchen Ticket</div>
                <div class="subtitle">${format(new Date(order.date_created), "dd/MM/yyyy HH:mm")}</div>
                <div class="divider"></div>
                <div style="font-size: 14px; font-weight: bold;">Order #${order.id}</div>
                <div style="font-size: 12px;">${order.billing.first_name} ${order.billing.last_name}</div>
            </div>

            <div class="divider"></div>

            <div class="items">
                ${itemsHtml}
            </div>

            <div class="divider"></div>

            <div class="total">
                Total: ${order.currency_symbol}${order.total}
            </div>

            <div class="footer">
                Thank you!
            </div>
            
            <script>
                window.onload = function() {
                    window.print();
                    // Close the window after print (optional, but good for popups)
                    // window.close(); 
                }
            </script>
        </body>
    </html>
    `;

    // Open a new window/tab for printing
    const printWindow = window.open('', '', 'width=400,height=600');
    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    } else {
        alert("Pop-up blocked! Please allow pop-ups for this site to print receipts.");
    }
};
