import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, ChefHat, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUpdateOrder } from "@/hooks/use-update-order";
import { useState } from "react";

interface Order {
    id: number;
    status: string;
    date_created: string;
    line_items: Array<{
        id: number;
        name: string;
        quantity: number;
    }>;
    billing: {
        first_name: string;
        last_name: string;
    };
}

export function KitchenTicket({ order }: { order: Order }) {
    const { mutate: updateOrder, isPending } = useUpdateOrder();
    const [isCompleting, setIsCompleting] = useState(false);

    // Need to use the server action directly for metadata, or update the hook.
    // simpler to just call the action here for the complex metadata + status update
    // But let's see if we can just use the action directly to be safe.

    const handleComplete = async () => {
        setIsCompleting(true);
        // 1. Mark status as completed (WC)
        // 2. Mark metadata as completed (Internal)

        // We can do this via the existing hook if we update it, but for now let's use the action
        // actually `useUpdateOrder` might be just a wrapper around `updateOrderStatus`.
        // Let's import the actions directly for this specific complex flow.

        const { updateOrderStatus, updateOrderMeta } = await import("@/app/actions/order-actions");

        await updateOrderMeta(order.id, "_pos_stage", "completed");
        await updateOrderStatus(order.id, "completed");

        // Force refresh via window or query client - ideally query client
        // Assuming parent component triggers re-render or we invalidate queries.
        // We'll trust the optimistic UI or just reload for now.
        window.location.reload();
    };

    const timeSince = formatDistanceToNow(new Date(order.date_created), { addSuffix: true });

    return (
        <Card className={`h-full flex flex-col border-2 border-yellow-400`}>
            <CardHeader className="pb-3 bg-muted/50">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">#{order.id}</CardTitle>
                        <p className="text-sm font-medium text-muted-foreground">
                            {order.billing.first_name} {order.billing.last_name}
                        </p>
                    </div>
                    <Badge variant="secondary" className="text-sm uppercase">
                        COOKING
                    </Badge>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1 font-mono">
                    <Clock className="h-3 w-3 mr-1" />
                    {timeSince}
                </div>
            </CardHeader>
            <CardContent className="flex-1 py-4">
                <ul className="space-y-3">
                    {order.line_items.map((item) => (
                        <li key={item.id} className="flex justify-between items-center text-lg">
                            <span className="font-bold">{item.quantity}x</span>
                            <span className="flex-1 ml-3">{item.name}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="gap-2 pt-0 pb-4">
                <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleComplete}
                    disabled={isPending || isCompleting}
                >
                    {isCompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Order Complete
                </Button>
            </CardFooter>
        </Card>
    );
}
