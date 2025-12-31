import { NextResponse } from "next/server";
import { wooCommerceClient } from "@/lib/woocommerce";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { error: "Status is required" },
                { status: 400 }
            );
        }

        const response = await wooCommerceClient.put(`orders/${id}`, {
            status,
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("WooCommerce API Error:", error.response?.data || error.message);
        return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 }
        );
    }
}
