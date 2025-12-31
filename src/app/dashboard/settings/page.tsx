"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Shield, LogOut, FileText, Upload, Trash2, Palette } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface InvoiceSettings {
    companyName: string;
    companyEmail: string;
    companyAddress: string;
    companyTaxId: string;
    footerNote: string;
    logo: string | null;
    accentColor: string;
}

const DEFAULT_SETTINGS: InvoiceSettings = {
    companyName: "",
    companyEmail: "",
    companyAddress: "",
    companyTaxId: "",
    footerNote: "Thank you for your business!",
    logo: null,
    accentColor: "#000000",
};

export default function SettingsPage() {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(DEFAULT_SETTINGS);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Persist setting
    useEffect(() => {
        const savedSound = localStorage.getItem("soundEnabled");
        if (savedSound !== null) {
            setSoundEnabled(savedSound === "true");
        }

        const savedInvoice = localStorage.getItem("invoiceSettings");
        if (savedInvoice) {
            try {
                setInvoiceSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedInvoice) });
            } catch (e) {
                console.error("Failed to parse invoice settings", e);
            }
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

    // Invoice Settings Handlers
    const updateInvoiceSetting = (key: keyof InvoiceSettings, value: string | null) => {
        const newSettings = { ...invoiceSettings, [key]: value };
        setInvoiceSettings(newSettings);
    };

    const [isSaved, setIsSaved] = useState(false);

    const saveSettings = () => {
        localStorage.setItem("invoiceSettings", JSON.stringify(invoiceSettings));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                updateInvoiceSetting("logo", base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        updateInvoiceSetting("logo", null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-6 pb-10">
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

                {/* Invoice Customization Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <CardTitle>Invoice Customization</CardTitle>
                        </div>
                        <CardDescription>
                            Customize the PDF invoices generated for orders.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Identity */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    placeholder="Akhand Cafe"
                                    value={invoiceSettings.companyName}
                                    onChange={(e) => updateInvoiceSetting("companyName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyEmail">Company Email</Label>
                                <Input
                                    id="companyEmail"
                                    placeholder="admin@akhandcafe.com"
                                    value={invoiceSettings.companyEmail}
                                    onChange={(e) => updateInvoiceSetting("companyEmail", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="companyTaxId">Tax ID / GSTIN</Label>
                                <Input
                                    id="companyTaxId"
                                    placeholder="GSTIN123456789"
                                    value={invoiceSettings.companyTaxId}
                                    onChange={(e) => updateInvoiceSetting("companyTaxId", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="accentColor">Accent Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="accentColor"
                                        type="color"
                                        className="w-12 h-10 p-1 cursor-pointer"
                                        value={invoiceSettings.accentColor}
                                        onChange={(e) => updateInvoiceSetting("accentColor", e.target.value)}
                                    />
                                    <Input
                                        value={invoiceSettings.accentColor}
                                        onChange={(e) => updateInvoiceSetting("accentColor", e.target.value)}
                                        placeholder="#000000"
                                        className="font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="companyAddress">Company Address</Label>
                            <Textarea
                                id="companyAddress"
                                placeholder="123 Main St, City, Country"
                                value={invoiceSettings.companyAddress}
                                onChange={(e) => updateInvoiceSetting("companyAddress", e.target.value)}
                            />
                        </div>

                        {/* Branding */}
                        <div className="space-y-2">
                            <Label>Company Logo</Label>
                            <div className="flex items-start gap-4">
                                {invoiceSettings.logo ? (
                                    <div className="relative group border rounded-md p-2 w-32 h-32 flex items-center justify-center bg-gray-50">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={invoiceSettings.logo}
                                            alt="Logo Preview"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={removeLogo}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border border-dashed rounded-md w-32 h-32 flex flex-col items-center justify-center text-muted-foreground bg-gray-50/50">
                                        <Upload className="h-6 w-6 mb-2" />
                                        <span className="text-xs">No Logo</span>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        onChange={handleLogoUpload}
                                        className="max-w-xs"
                                    />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Recommended: Square PNG/JPG, max 500KB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="space-y-2">
                            <Label htmlFor="footerNote">Footer Note</Label>
                            <Input
                                id="footerNote"
                                placeholder="Thank you for your business!"
                                value={invoiceSettings.footerNote}
                                onChange={(e) => updateInvoiceSetting("footerNote", e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button onClick={saveSettings} disabled={isSaved}>
                                {isSaved ? "Saved!" : "Save Changes"}
                            </Button>
                        </div>

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
