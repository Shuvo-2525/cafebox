import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useOrderMeta } from "@/hooks/use-order-meta";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Package, StickyNote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

interface OrderDetailsProps {
    order: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OrderDetailsSheet({ order, open, onOpenChange }: OrderDetailsProps) {
    const { meta, loading, updateMeta } = useOrderMeta(order.id);
    const [notes, setNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (meta?.notes) {
            setNotes(meta.notes);
        }
    }, [meta]);

    const handleSaveNotes = async () => {
        setIsSaving(true);
        await updateMeta({ notes });
        setIsSaving(false);
    };

    if (!order) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[600px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl">Order #{order.id}</SheetTitle>
                    <SheetDescription>
                        Placed on {format(new Date(order.date_created), "PPP p")}
                    </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="order" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="order">
                            <Package className="mr-2 h-4 w-4" /> Order Details
                        </TabsTrigger>
                        <TabsTrigger value="customer">
                            <User className="mr-2 h-4 w-4" /> Customer
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="order" className="mt-4 space-y-6">
                        {/* Line Items */}
                        <div className="rounded-lg border p-4 space-y-4">
                            <h3 className="font-semibold flex items-center mb-3">
                                <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                                Products ({order.line_items.length})
                            </h3>
                            <div className="space-y-4">
                                {order.line_items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 items-start">
                                        <div className="relative h-16 w-16 flex-shrink-0 rounded-md border bg-muted overflow-hidden">
                                            {item.image?.src ? (
                                                <Image
                                                    src={item.image.src}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-medium">
                                            {order.currency_symbol}{item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center font-bold">
                                <span>Total</span>
                                <span className="text-lg">{order.currency_symbol}{order.total}</span>
                            </div>
                        </div>

                        {/* Internal Notes */}
                        <div className="rounded-lg border p-4 space-y-3 bg-muted/20">
                            <div className="flex items-center gap-2 mb-2">
                                <StickyNote className="h-4 w-4 text-primary" />
                                <Label htmlFor="notes" className="font-semibold">Internal Staff Notes</Label>
                            </div>
                            <Textarea
                                id="notes"
                                className="min-h-[100px] resize-none bg-background"
                                placeholder="Add instructions or notes about this order..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button size="sm" onClick={handleSaveNotes} disabled={isSaving || loading}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Notes"}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="customer" className="mt-4 space-y-6">
                        <div className="grid gap-6">
                            {/* Billing Info */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg">Billing Address</h3>
                                <div className="rounded-lg border p-4 text-sm space-y-1">
                                    <p className="font-medium text-base">{order.billing.first_name} {order.billing.last_name}</p>
                                    <p>{order.billing.company}</p>
                                    <p>{order.billing.address_1}</p>
                                    <p>{order.billing.address_2}</p>
                                    <p>{order.billing.city}, {order.billing.state} {order.billing.postcode}</p>
                                    <p>{order.billing.country}</p>
                                    <Separator className="my-2" />
                                    <div className="grid grid-cols-[80px_1fr] gap-2 pt-1">
                                        <span className="text-muted-foreground">Email:</span>
                                        <span>{order.billing.email}</span>
                                        <span className="text-muted-foreground">Phone:</span>
                                        <span>{order.billing.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg">Shipping Address</h3>
                                <div className="rounded-lg border p-4 text-sm space-y-1">
                                    <p className="font-medium text-base">{order.shipping.first_name} {order.shipping.last_name}</p>
                                    <p>{order.shipping.company}</p>
                                    <p>{order.shipping.address_1}</p>
                                    <p>{order.shipping.address_2}</p>
                                    <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postcode}</p>
                                    <p>{order.shipping.country}</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
