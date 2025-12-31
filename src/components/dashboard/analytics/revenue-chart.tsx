"use client";

import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, isSameDay, parseISO } from "date-fns";

interface RevenueChartProps {
    orders: any[];
}

export function RevenueChart({ orders }: RevenueChartProps) {
    const data = useMemo(() => {
        if (!orders) return [];

        const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const date = subDays(new Date(), 6 - i);
            return {
                date: format(date, "MMM dd"),
                originalDate: date,
                total: 0,
            };
        });

        // Aggregate revenue
        orders.forEach((order) => {
            const orderDate = new Date(order.date_created);
            // Only count completed or processing orders for revenue
            if (["completed", "processing"].includes(order.status)) {
                const dayStat = last7Days.find(d => isSameDay(d.originalDate, orderDate));
                if (dayStat) {
                    dayStat.total += parseFloat(order.total);
                }
            }
        });

        return last7Days;
    }, [orders]);

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle>Revenue (Last 7 Days)</CardTitle>
                <p className="text-2xl font-bold">
                    £{totalRevenue.toFixed(2)}
                </p>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `£${value}`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            cursor={{ stroke: '#888888', strokeWidth: 1 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#2563eb" // Primary Blue
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
