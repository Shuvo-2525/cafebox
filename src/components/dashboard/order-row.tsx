"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useState } from "react";
import { updateOrderStatus } from "@/app/actions/order-actions";
import { format } from "date-fns";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { OrderDetailsSheet } from "./order-details";

interface OrderRowProps {
    order: any; // Using any for now to match the hook type quickly, ideally strict type
}

const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    completed: "default",
    processing: "secondary",
    pending: "outline",
    cancelled: "destructive",
    failed: "destructive",
    "on-hold": "secondary",
    refunded: "outline"
};

export function OrderRow({ order }: OrderRowProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const queryClient = useQueryClient();

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === order.status) return;

        setIsUpdating(true);

        // Optimistic Update (Manual for now, can be done via setQueryData)
        const previousOrders = queryClient.getQueryData(["orders"]);
        queryClient.setQueryData(["orders"], (old: any[]) =>
            old.map(o => o.id === order.id ? { ...o, status: newStatus } : o)
        );

        const result = await updateOrderStatus(order.id, newStatus);

        if (!result.success) {
            // Revert if failed
            queryClient.setQueryData(["orders"], previousOrders);
            alert("Failed to update status");
        } else {
            // Invalidate to ensure sync
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        }

        setIsUpdating(false);
    };

    return (
        <TableRow className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium">
                #{order.id}
            </TableCell>
            <TableCell className="text-muted-foreground">
                {format(new Date(order.date_created), "MMM d, HH:mm")}
            </TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="font-medium">{order.billing.first_name} {order.billing.last_name}</span>
                    <span className="text-xs text-muted-foreground">{order.billing.email}</span>
                </div>
            </TableCell>
            <TableCell>
                <div
                    className="flex -space-x-2 overflow-hidden hover:space-x-1 hover:z-10 transition-all cursor-pointer p-1 rounded-md hover:bg-muted"
                    onClick={() => setShowDetails(true)}
                >
                    {order.line_items.map((item: any) => (
                        item.image?.src ? (
                            <div key={item.id} className="relative inline-block h-10 w-10 rounded-full ring-2 ring-white transition-transform hover:scale-110 z-0 hover:z-20">
                                <Image
                                    src={item.image.src}
                                    alt={item.name}
                                    fill
                                    className="rounded-full object-cover"
                                    sizes="40px"
                                />
                            </div>
                        ) : null
                    ))}
                    {order.line_items.length > 3 && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted ring-2 ring-white text-[10px] font-medium z-0">
                            +{order.line_items.length - 3}
                        </div>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-auto p-0 hover:bg-transparent">
                            <Badge variant={statusColors[order.status] || "outline"} className="cursor-pointer">
                                {isUpdating && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                                {order.status}
                            </Badge>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStatusChange("pending")}>Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("processing")}>Processing</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("completed")}>Completed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("cancelled")}>Cancelled</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
            <TableCell className="text-right">
                {order.currency_symbol}{order.total}
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setShowDetails(true)}>View details</DropdownMenuItem>
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <OrderDetailsSheet
                    order={order}
                    open={showDetails}
                    onOpenChange={setShowDetails}
                />
            </TableCell>
        </TableRow>
    );
}
