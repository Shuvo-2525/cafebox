"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Settings, LogOut, Package, ChefHat, Coffee, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    {
        title: "Orders",
        href: "/dashboard",
        icon: Package,
    },
    {
        title: "Kitchen",
        href: "/dashboard/kitchen",
        icon: ChefHat,
    },
    {
        title: "Menu",
        href: "/dashboard/menu",
        icon: Coffee,
    },
    {
        title: "Reports",
        href: "/dashboard/reports",
        icon: FileText,
    },
    {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full border-r bg-muted/10 backdrop-blur-xl w-64 hidden md:flex fixed left-0 top-0 bottom-0 z-30">
            <div className="p-6 border-b flex items-center gap-2">
                <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    A
                </div>
                <span className="font-bold text-lg tracking-tight">Akhand Admin</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {sidebarItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 relative overflow-hidden transition-all duration-300",
                                pathname === item.href
                                    ? "bg-black text-white hover:bg-black/90 hover:text-white shadow-md"
                                    : "hover:bg-muted"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            <span className="font-medium">{item.title}</span>
                            {pathname === item.href && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                            )}
                        </Button>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t">
                <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </Button>
            </div>
        </div>
    );
}
