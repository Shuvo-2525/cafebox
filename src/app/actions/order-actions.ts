"use server";

import { wooCommerceClient } from "@/lib/woocommerce";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: number, newStatus: string) {
    try {
        const response = await wooCommerceClient.put(`orders/${orderId}`, {
            status: newStatus,
        });

        if (response.status !== 200) {
            throw new Error("Failed to update order status");
        }

        // Revalidate the orders API cache (conceptually, though React Query handles client side)
        // We might also want to log this action to Firestore here in the next phase.

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Update Order Error:", error.message);
        return { success: false, error: error.message };
    }
}
