"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileDown, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

async function fetchTodaysOrders() {
    // Get start of today in ISO format
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const afterDate = today.toISOString();

    const res = await fetch(`/api/orders?after=${afterDate}&per_page=100`);
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
}

export default function ReportsPage() {
    const { data: orders, isLoading } = useQuery({
        queryKey: ["todays-orders"],
        queryFn: fetchTodaysOrders,
    });

    const generatePDF = () => {
        if (!orders) return;

        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text("End of Day Report", 14, 22);

        doc.setFontSize(11);
        doc.text(`Date: ${format(new Date(), "PPP")}`, 14, 30);
        doc.text(`Generated at: ${format(new Date(), "p")}`, 14, 36);

        // Stats
        const totalSales = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0);
        doc.text(`Total Sales: ${totalSales.toFixed(2)} ${orders[0]?.currency || 'USD'}`, 14, 46);
        doc.text(`Total Orders: ${orders.length}`, 14, 52);

        // Table
        const tableData = orders.map((order: any) => [
            `#${order.id}`,
            format(new Date(order.date_created), "p"),
            order.status,
            `${order.billing.first_name} ${order.billing.last_name}`,
            `${order.total}`
        ]);

        autoTable(doc, {
            head: [["Order ID", "Time", "Status", "Customer", "Total"]],
            body: tableData,
            startY: 60,
        });

        doc.save(`EOD_Report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center h-[50vh] items-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const totalSales = orders?.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0) || 0;
    const averageOrder = orders?.length ? totalSales / orders.length : 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Daily Reports</h1>
                <Button onClick={generatePDF} disabled={!orders?.length}>
                    <FileDown className="mr-2 h-4 w-4" /> Download PDF
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Today's revenue</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Transactions today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${averageOrder.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Per order average</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        {orders?.length === 0 ? "No orders today." : (
                            <ul className="space-y-2">
                                {orders?.slice(0, 5).map((order: any) => (
                                    <li key={order.id} className="flex justify-between py-2 border-b last:border-0">
                                        <span>Order #{order.id} - {order.billing.first_name}</span>
                                        <span className="font-medium">${order.total}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
