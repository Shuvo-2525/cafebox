import { Sidebar } from "@/components/dashboard/sidebar";
import { AlertProvider } from "@/components/providers/alert-provider";
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AlertProvider>
            <div className="min-h-screen bg-background">
                {/* Sidebar (Desktop) */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="md:pl-64 min-h-screen transition-all duration-300">
                    <div className="container py-8 px-4 md:px-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AlertProvider>
    );
}
