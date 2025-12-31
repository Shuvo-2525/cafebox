"use client";

import { useOrders } from "@/hooks/use-orders";
import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useRealtimeOrders } from "@/hooks/use-realtime-orders";

export function AlertProvider({ children }: { children: React.ReactNode }) {
    useRealtimeOrders(); // Trigger real-time updates
    const { data: orders } = useOrders();
    const prevCountRef = useRef<number | null>(null);
    const [alert, setAlert] = useState<{ message: string; visible: boolean }>({
        message: "",
        visible: false,
    });

    useEffect(() => {
        if (!orders) return;

        // Initialize ref on first load
        if (prevCountRef.current === null) {
            prevCountRef.current = orders.length;
            return;
        }

        // Check for new orders
        if (orders.length > prevCountRef.current) {
            const newOrdersCount = orders.length - prevCountRef.current;
            triggerAlert(newOrdersCount);
            prevCountRef.current = orders.length;
        }
    }, [orders]);

    const triggerAlert = (count: number) => {
        // Play Audio from public folder
        const audio = new Audio("/sounds/notification.mp3");
        audio.play().catch((err) => {
            console.error("Failed to play notification sound. Ensure 'public/sounds/notification.mp3' exists.", err);
        });

        // Show Visual Alert
        setAlert({
            message: `You received ${count} new order${count > 1 ? "s" : ""}!`,
            visible: true,
        });

        // Auto hide after 5 seconds
        setTimeout(() => {
            setAlert((prev) => ({ ...prev, visible: false }));
        }, 5000);
    };

    return (
        <>
            {children}
            <AnimatePresence>
                {alert.visible && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-6 left-1/2 z-50 w-full max-w-sm"
                    >
                        <Card className="mx-4 flex items-center justify-between p-4 shadow-lg border-l-4 border-l-primary bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <Bell className="h-4 w-4" />
                                </div>
                                <div className="text-sm font-medium">
                                    {alert.message}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mr-2"
                                onClick={() => setAlert({ ...alert, visible: false })}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
