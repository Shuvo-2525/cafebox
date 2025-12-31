import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProductParams {
    productId: number;
    stockStatus: "instock" | "outofstock";
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, stockStatus }: UpdateProductParams) => {
            const res = await fetch(`/api/products/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ stock_status: stockStatus }),
            });

            if (!res.ok) {
                throw new Error("Failed to update product");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}
