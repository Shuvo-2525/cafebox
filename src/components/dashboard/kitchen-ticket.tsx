import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, ChefHat } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUpdateOrder } from "@/hooks/use-update-order";

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

    const handleStatusChange = (newStatus: string) => {
        updateOrder({ orderId: order.id, status: newStatus });
    };

    const timeSince = formatDistanceToNow(new Date(order.date_created), { addSuffix: true });

    return (
        <Card className={`h-full flex flex-col border-2 ${order.status === 'processing' ? 'border-yellow-400' : order.status === 'pending' ? 'border-red-400' : 'border-border'}`}>
            <CardHeader className="pb-3 bg-muted/50">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">#{order.id}</CardTitle>
                        <p className="text-sm font-medium text-muted-foreground">
                            {order.billing.first_name} {order.billing.last_name}
                        </p>
                    </div>
                    <Badge variant={order.status === 'processing' ? "secondary" : "default"} className="text-sm uppercase">
                        {order.status}
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
                {order.status === 'pending' && (
                    <Button
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                        onClick={() => handleStatusChange('processing')}
                        disabled={isPending}
                    >
                        <ChefHat className="mr-2 h-4 w-4" /> Start Cooking
                    </Button>
                )}
                {order.status === 'processing' && (
                    <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleStatusChange('completed')} // Or 'ready-for-pickup' if custom status exists
                        disabled={isPending}
                    >
                        <CheckCircle className="mr-2 h-4 w-4" /> Order Ready
                    </Button>
                )}
                {order.status === 'completed' && (
                    <div className="w-full text-center text-green-600 font-bold border rounded-md py-2 bg-green-50">
                        COMPLETED
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
