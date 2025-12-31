import { NextResponse } from "next/server";
import { wooCommerceClient } from "@/lib/woocommerce";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    try {
        const params: any = {
            per_page: 100,
            status: "publish",
        };

        if (search) {
            params.search = search;
        }

        const response = await wooCommerceClient.get("products", params);

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("WooCommerce API Error:", error.response?.data || error.message);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
