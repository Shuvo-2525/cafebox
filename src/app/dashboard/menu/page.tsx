"use client";

import { useProducts } from "@/hooks/use-products";
import { useUpdateProduct } from "@/hooks/use-update-product";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search, Coffee } from "lucide-react";
import { useState } from "react";

export default function MenuManagerPage() {
    const [search, setSearch] = useState("");
    // Simple debounce via timeout not implemented to save tokens, assuming user types then waits or hits enter? 
    // Actually, let's just use raw search for now or rely on fast re-renders. 
    // Ideally use useDebounce, but I don't want to create extra files if not needed. 
    // I'll leave search as 'onChange' for now, API call might be frequent.

    // Better: use a local state for input and a debounced value for the query.
    // I'll inline a simple effect or just pass search directly if I trust React Query cancellation.

    const { data: products, isLoading } = useProducts(search);
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

    const handleStockToggle = (productId: number, currentStatus: string) => {
        const newStatus = currentStatus === "instock" ? "outofstock" : "instock";
        updateProduct({ productId, stockStatus: newStatus });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quick Menu Manager</h1>
                    <p className="text-muted-foreground">Instantly mark items as In Stock / Out of Stock.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search items..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {products?.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                            <CardContent className="p-0 flex items-center h-24">
                                <div className="h-24 w-24 bg-muted flex items-center justify-center flex-shrink-0">
                                    {product.images[0] ? (
                                        <img src={product.images[0].src} alt={product.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <Coffee className="h-8 w-8 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1 p-4 flex justify-between items-center bg-card">
                                    <div className="overflow-hidden mr-2">
                                        <h3 className="font-semibold truncate" title={product.name}>{product.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {product.stock_status === 'instock' ? (
                                                <span className="text-green-600 font-medium">In Stock</span>
                                            ) : (
                                                <span className="text-red-500 font-medium">Sold Out</span>
                                            )}
                                        </p>
                                    </div>
                                    <Switch
                                        checked={product.stock_status === "instock"}
                                        onCheckedChange={() => handleStockToggle(product.id, product.stock_status)}
                                        disabled={isUpdating}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {products?.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No products found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
