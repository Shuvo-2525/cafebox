import { useQuery } from "@tanstack/react-query";

interface Order {
    id: number;
    status: string;
    total: string;
    currency: string;
    date_created: string;
    billing: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address_1: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
    };
    shipping: {
        first_name: string;
        last_name: string;
        address_1: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
    };
    line_items: Array<{
        id: number;
        name: string;
        quantity: number;
        price: number;
        image: {
            src: string;
        };
    }>;
    meta_data: Array<{
        key: string;
        value: string;
    }>;
}

async function fetchOrders(): Promise<Order[]> {
    const res = await fetch("/api/orders");
    if (!res.ok) {
        throw new Error("Failed to fetch orders");
    }
    return res.json();
}

export function useOrders() {
    return useQuery({
        queryKey: ["orders"],
        queryFn: fetchOrders,
        refetchInterval: 4000, // Sync every 4 seconds
    });
}
