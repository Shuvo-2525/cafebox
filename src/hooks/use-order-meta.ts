import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface OrderMeta {
    notes?: string;
    assignedTo?: string; // UID of the staff member
    updatedAt?: number;
    updatedBy?: string;
}

export function useOrderMeta(orderId: number) {
    const [meta, setMeta] = useState<OrderMeta | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) return;

        const docRef = doc(db, "order_meta", orderId.toString());
        const unsubscribe = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                setMeta(snap.data() as OrderMeta);
            } else {
                setMeta(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [orderId]);

    const updateMeta = async (data: Partial<OrderMeta>) => {
        const docRef = doc(db, "order_meta", orderId.toString());
        await setDoc(docRef, { ...data, updatedAt: Date.now() }, { merge: true });
    };

    return { meta, loading, updateMeta };
}
