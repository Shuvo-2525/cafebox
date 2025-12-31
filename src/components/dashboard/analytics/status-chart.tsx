"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusChartProps {
    orders: any[];
}

const COLORS = {
    completed: "#22c55e", // Green
    pending: "#eab308",   // Yellow
    processing: "#3b82f6", // Blue
    cancelled: "#ef4444", // Red
    other: "#94a3b8"      // Gray
};

export function StatusChart({ orders }: StatusChartProps) {
    const data = useMemo(() => {
        if (!orders) return [];

        const counts: Record<string, number> = {
            completed: 0,
            pending: 0,
            processing: 0,
            cancelled: 0,
            other: 0
        };

        orders.forEach(order => {
            const status = order.status;
            if (counts[status] !== undefined) {
                counts[status]++;
            } else {
                counts.other++;
            }
        });

        // Filter out zero values for cleaner chart
        return Object.entries(counts)
            .filter(([_, value]) => value > 0)
            .map(([name, value]) => ({ name, value }));

    }, [orders]);

    return (
        <Card className="col-span-1 lg:col-span-1">
            <CardHeader>
                <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            strokeWidth={2}
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={(COLORS as any)[entry.name] || COLORS.other}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
