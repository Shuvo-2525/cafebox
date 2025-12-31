"use client";

import { useOrders } from "@/hooks/use-orders";
import { KitchenTicket } from "@/components/dashboard/kitchen-ticket";
import { Loader2, AlertCircle } from "lucide-react";

export default function KitchenPage() {
    const { data: orders, isLoading, isError } = useOrders();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-xl font-medium text-muted-foreground">Loading Kitchen Display...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-red-500">
                <AlertCircle className="h-12 w-12 mb-2" />
                <p className="text-xl font-medium">Failed to load orders connection.</p>
            </div>
        );
    }

    const activeOrders = orders?.filter(
        (order) => order.status === "processing" || order.status === "pending"
    ) || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
                <h1 className="text-4xl font-black uppercase tracking-tight text-primary">Kitchen Display</h1>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Active Tickets</p>
                    <p className="text-3xl font-bold font-mono">{activeOrders.length}</p>
                </div>
            </div>

            {activeOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[40vh] bg-muted/20 rounded-xl border-dashed border-2">
                    <p className="text-2xl text-muted-foreground font-light">All caught up! No active orders.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeOrders.map((order) => (
                        <KitchenTicket key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}
