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

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Update Order Error:", error.message);
        return { success: false, error: error.message };
    }
}

export async function updateOrderMeta(orderId: number, key: string, value: string) {
    try {
        const response = await wooCommerceClient.put(`orders/${orderId}`, {
            meta_data: [
                {
                    key: key,
                    value: value
                }
            ]
        });

        if (response.status !== 200) {
            throw new Error("Failed to update order metadata");
        }

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Update Meta Error:", error.message);
        return { success: false, error: error.message };
    }
}
