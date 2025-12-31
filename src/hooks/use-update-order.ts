import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateOrderParams {
    orderId: number;
    status: string;
}

export function useUpdateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId, status }: UpdateOrderParams) => {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) {
                throw new Error("Failed to update order");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
}
