import { NextResponse } from "next/server";
import { wooCommerceClient } from "@/lib/woocommerce";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { stock_status } = body; // 'instock' or 'outofstock'

        if (!stock_status) {
            return NextResponse.json(
                { error: "stock_status is required" },
                { status: 400 }
            );
        }

        const response = await wooCommerceClient.put(`products/${id}`, {
            stock_status,
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("WooCommerce API Error:", error.response?.data || error.message);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}
