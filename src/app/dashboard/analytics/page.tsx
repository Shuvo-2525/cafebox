"use client";

import { RevenueChart } from "@/components/dashboard/analytics/revenue-chart";
import { StatusChart } from "@/components/dashboard/analytics/status-chart";
import { useOrders } from "@/hooks/use-orders";


// Correct imports
import { Button as UIButton } from "@/components/ui/button";
import { Loader2 as LoaderIcon } from "lucide-react";

export default function AnalyticsPage() {
    const { data: orders, isLoading, isError, refetch } = useOrders();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <LoaderIcon className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Analysing data...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 mb-4">Failed to load data</p>
                <UIButton onClick={() => refetch()}>Retry</UIButton>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Business Insights</h1>
                <p className="text-muted-foreground">Overview of your store's performance.</p>
            </div>

            {orders && orders.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <RevenueChart orders={orders} />
                    <StatusChart orders={orders} />
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                    No sufficient data for analytics yet.
                </div>
            )}
        </div>
    );
}
