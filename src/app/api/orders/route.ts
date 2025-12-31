import { NextResponse } from "next/server";
import { wooCommerceClient } from "@/lib/woocommerce";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const params: any = {
        per_page: searchParams.get("per_page") || 50,
        status: searchParams.get("status") || "any",
    };

    if (searchParams.get("after")) params.after = searchParams.get("after");
    if (searchParams.get("before")) params.before = searchParams.get("before");
    if (searchParams.get("page")) params.page = searchParams.get("page");

    try {
        const response = await wooCommerceClient.get("orders", params);

        return NextResponse.json(response.data);
    } catch (error: any) {

        console.error("WooCommerce API Error:", error.response?.data || error.message);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
