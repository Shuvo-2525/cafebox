"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Shield, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Persist setting
    useEffect(() => {
        const saved = localStorage.getItem("soundEnabled");
        if (saved !== null) {
            setSoundEnabled(saved === "true");
        }
    }, []);

    const toggleSound = (checked: boolean) => {
        setSoundEnabled(checked);
        localStorage.setItem("soundEnabled", String(checked));
    };

    const testSound = () => {
        if (!soundEnabled) return;
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.play().catch(e => console.error("Audio play failed", e));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your dashboard preferences.</p>
            </div>

            <div className="grid gap-6">
                {/* Notifications Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            <CardTitle>Notifications</CardTitle>
                        </div>
                        <CardDescription>
                            Configure how you want to be alerted for new orders.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                                <Label className="text-base">Order Arrival Sound</Label>
                                <p className="text-sm text-muted-foreground">
                                    Play a distinct sound when a new order is received.
                                </p>
                            </div>
                            <Switch
                                checked={soundEnabled}
                                onCheckedChange={toggleSound}
                            />
                        </div>
                        <Button variant="outline" size="sm" onClick={testSound} disabled={!soundEnabled}>
                            Test Sound Volume
                        </Button>
                    </CardContent>
                </Card>

                {/* Account Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle>Admin Account</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your session and security.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" className="gap-2">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
