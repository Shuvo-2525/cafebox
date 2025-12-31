"use client";

import { useState } from "react";

import { useOrders } from "@/hooks/use-orders";
import { Loader2, Package, RefreshCw, Search } from "lucide-react";
import { OrderCard } from "@/components/dashboard/order-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function DashboardPage() {
    const { data: orders, isLoading, isError, refetch } = useOrders();
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredOrders = orders?.filter((order) => {
        if (statusFilter === "all") return true;
        return order.status === statusFilter;
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Syncing orders from WooCommerce...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <p className="text-red-500 font-medium">Failed to load orders.</p>
                <Button onClick={() => refetch()} variant="outline">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground">Manage and track your store orders.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search orders..." className="pl-8" />
                    </div>
                    <Button size="icon" variant="outline" onClick={() => refetch()}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {["all", "pending", "processing", "completed", "cancelled"].map((status) => (
                    <Button
                        key={status}
                        variant={statusFilter === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStatusFilter(status)}
                        className="capitalize rounded-full px-4"
                    >
                        {status}
                    </Button>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all statuses
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredOrders?.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
                {filteredOrders?.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        No orders found with status "{statusFilter}".
                    </div>
                )}
            </div>
        </div>
    );
}
