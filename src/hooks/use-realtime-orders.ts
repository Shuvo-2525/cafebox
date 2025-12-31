"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useRealtimeOrders() {
    const queryClient = useQueryClient();

    useEffect(() => {
        // Listen to the system sync document
        const unsub = onSnapshot(doc(db, "system", "sync"), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                // When we receive an update, invalidate the orders query
                // This forces a re-fetch from the WooCommerce API
                console.log("Real-time signal received:", data);
                queryClient.invalidateQueries({ queryKey: ["orders"] });
            }
        });

        return () => unsub();
    }, [queryClient]);
}
