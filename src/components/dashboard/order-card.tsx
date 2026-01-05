import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Image as ImageIcon, Printer, FileText } from "lucide-react";
import { useState } from "react";
import { updateOrderStatus, updateOrderMeta } from "@/app/actions/order-actions";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { OrderDetailsSheet } from "./order-details";
import { generateInvoice } from "@/lib/generate-invoice";
import { printReceipt } from "@/lib/print-receipt";

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
    const queryClient = useQueryClient();

    // Helper to get meta value
    const getMeta = (key: string) => order.meta_data?.find((m: any) => m.key === key)?.value;
    const posStage = getMeta('_pos_stage');

    // Display Logic
    // If WC status is 'processing' BUT no POS stage, we treat it as Pending (New Order)
    const isActuallyPending = order.status === 'pending' || (order.status === 'processing' && !posStage);
    const isCooking = posStage === 'kitchen';
    const isCompleted = order.status === 'completed';

    // Get the first product image or fallback
    const mainItem = order.line_items[0];
    const mainImage = mainItem?.image?.src;
    const mainProductName = mainItem?.name || "Unknown Product";
    const quantity = mainItem?.quantity || 0;
    const otherItemsCount = order.line_items.length - 1;

    const handleSendToKitchen = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsUpdating(true);

        // 1. Optimistic Update
        const previousOrders = queryClient.getQueryData(["orders"]);
        queryClient.setQueryData(["orders"], (old: any[]) =>
            old.map(o => o.id === order.id ? {
                ...o,
                status: 'processing', // Ensure WC status is processing
                meta_data: [...(o.meta_data || []), { key: '_pos_stage', value: 'kitchen' }]
            } : o)
        );

        // 2. Print Receipt
        printReceipt(order);

        // 3. API Calls (Parallel)
        // a. Ensure status is processing (payment accepted) if not already
        if (order.status !== 'processing') {
            await updateOrderStatus(order.id, "processing");
        }
        // b. Set metadata tag
        const result = await updateOrderMeta(order.id, "_pos_stage", "kitchen");

        if (!result.success) {
            queryClient.setQueryData(["orders"], previousOrders);
            alert("Failed to send to kitchen");
        } else {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
        setIsUpdating(false);
    };

    const handleDownloadInvoice = (e: React.MouseEvent) => {
        e.stopPropagation();
        generateInvoice(order);
    };

    const displayStatus = isCompleted ? 'completed' : isCooking ? 'cooking' : 'pending';
    const statusColor = isCompleted ? 'default' : isCooking ? 'secondary' : 'outline'; // Green, Blue, Outline

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
                        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground px-1">
                            <span>{order.billing.first_name} {order.billing.last_name}</span>
                            <Badge variant={statusColor as any} className="uppercase text-[10px]">
                                {displayStatus}
                            </Badge>
                        </div>

                        {/* Action Buttons based on Status */}
                        <div className="mt-1">
                            {isActuallyPending && !isCompleted && (
                                <Button
                                    className="w-full bg-primary hover:bg-primary/90"
                                    onClick={handleSendToKitchen}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" />}
                                    Send to Kitchen
                                </Button>
                            )}

                            {isCompleted && (
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={handleDownloadInvoice}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Download Invoice
                                </Button>
                            )}

                            {isCooking && !isCompleted && (
                                <div className="text-center text-xs text-blue-600 py-2 font-bold flex items-center justify-center gap-2 bg-blue-50 rounded-md">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Cooking in Kitchen...
                                </div>
                            )}
                        </div>
                    </div>
                </CardFooter>
            </Card>

            <OrderDetailsSheet
                order={order}
                open={showDetails}
                onOpenChange={setShowDetails}
            />
        </>
    );
}
