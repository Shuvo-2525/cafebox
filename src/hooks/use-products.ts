import { useQuery } from "@tanstack/react-query";

interface Product {
    id: number;
    name: string;
    stock_status: "instock" | "outofstock" | "onbackorder";
    price: string;
    images: Array<{ src: string }>;
}

async function fetchProducts(search?: string): Promise<Product[]> {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    const res = await fetch(`/api/products?${params.toString()}`);
    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }
    return res.json();
}

export function useProducts(search?: string) {
    return useQuery({
        queryKey: ["products", search],
        queryFn: () => fetchProducts(search),
    });
}
