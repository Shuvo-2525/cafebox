"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, MoreVertical, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { updateOrderStatus } from "@/app/actions/order-actions";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { OrderDetailsSheet } from "./order-details";
import { generateInvoice } from "@/lib/generate-invoice";

interface OrderCardProps {
    order: any;
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

export function OrderCard({ order }: OrderCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
    const queryClient = useQueryClient();

    // Get the first product image or fallback
    const mainItem = order.line_items[0];
    const mainImage = mainItem?.image?.src;
    const mainProductName = mainItem?.name || "Unknown Product";
    const quantity = mainItem?.quantity || 0;
    const otherItemsCount = order.line_items.length - 1;

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === order.status) return;

        setIsUpdating(true);

        const previousOrders = queryClient.getQueryData(["orders"]);
        queryClient.setQueryData(["orders"], (old: any[]) =>
            old.map(o => o.id === order.id ? { ...o, status: newStatus } : o)
        );

        const result = await updateOrderStatus(order.id, newStatus);

        if (!result.success) {
            queryClient.setQueryData(["orders"], previousOrders);
            alert("Failed to update status");
        } else {
            queryClient.invalidateQueries({ queryKey: ["orders"] });

            if (newStatus === "completed") {
                setShowInvoiceDialog(true);
            }
        }

        setIsUpdating(false);
    };

    const handleGenerateInvoice = () => {
        generateInvoice(order);
        setShowInvoiceDialog(false);
    };

    return (
        <>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-0 shadow bg-white/50 backdrop-blur-sm group cursor-pointer flex flex-col h-full" onClick={() => setShowDetails(true)}>
                <div className="aspect-square relative bg-muted flex items-center justify-center overflow-hidden">
                    {mainImage ? (
                        <Image
                            src={mainImage}
                            alt={mainProductName}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <ImageIcon className="h-12 w-12 text-muted-foreground/20" />
                    )}

                    {/* Quantity Badge - Overlay Top Right */}
                    {quantity > 0 && (
                        <div className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center bg-black/60 backdrop-blur-md text-white rounded-full text-sm font-bold shadow-sm z-10">
                            {quantity}
                        </div>
                    )}
                </div>

                <CardContent className="p-4 pt-4 flex-grow">
                    <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg line-clamp-2 leading-tight" title={mainProductName}>
                                {mainProductName}
                            </h3>
                            {otherItemsCount > 0 && (
                                <p className="text-xs text-muted-foreground font-medium">
                                    + {otherItemsCount} other item{otherItemsCount > 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                        {/* Price */}
                        <div className="font-bold text-lg whitespace-nowrap">
                            {order.currency_symbol}{order.total}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-3 pt-0 mt-auto">
                    <div className="w-full flex flex-col gap-3">
                        <div className="text-sm font-medium text-muted-foreground px-1">
                            {order.billing.first_name} {order.billing.last_name}
                        </div>

                        {/* Modern Status Button */}
                        <div onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        className="w-full justify-between bg-secondary/50 hover:bg-secondary h-10 transition-all duration-200 group/btn shadow-none border border-transparent hover:border-border/50"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${order.status === 'completed' ? 'bg-green-500' :
                                                    order.status === 'processing' ? 'bg-blue-500' :
                                                        order.status === 'pending' ? 'bg-yellow-500' :
                                                            order.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                                                }`} />
                                            <span className="capitalize font-medium text-foreground/80">{order.status}</span>
                                        </span>
                                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> :
                                            <MoreVertical className="h-4 w-4 text-muted-foreground group-hover/btn:text-foreground transition-colors" />
                                        }
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[200px]">
                                    <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                                        <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" /> Pending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange("processing")}>
                                        <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" /> Processing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2" /> Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange("cancelled")}>
                                        <div className="h-2 w-2 rounded-full bg-red-500 mr-2" /> Cancelled
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardFooter>
            </Card>

            <OrderDetailsSheet
                order={order}
                open={showDetails}
                onOpenChange={setShowDetails}
            />

            <AlertDialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Generate Invoice?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This order has been marked as completed. Would you like to generate and download the invoice PDF?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>No, thanks</AlertDialogCancel>
                        <AlertDialogAction onClick={handleGenerateInvoice}>Yes, Generate PDF</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
