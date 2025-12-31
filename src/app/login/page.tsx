"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { verifyAdmin } from "@/lib/auth-admin";
import { Loader2, Lock } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const isAdmin = await verifyAdmin(userCredential.user.uid);

            if (isAdmin) {
                router.push("/dashboard");
            } else {
                await auth.signOut();
                setError("Access denied. You are not an admin.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const isAdmin = await verifyAdmin(userCredential.user.uid);

            if (isAdmin) {
                router.push("/dashboard");
            } else {
                await auth.signOut();
                setError("Access denied. You are not an admin.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to login with Google");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">
            <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 text-white shadow-2xl">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-white/10 rounded-full">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Admin Access</CardTitle>
                    <CardDescription className="text-center text-gray-300">
                        Enter your credentials to access the dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-white/30 focus:ring-white/30"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-white/30 focus:ring-white/30"
                                required
                            />
                        </div>
                        {error && (
                            <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-white text-black hover:bg-gray-200"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                        </Button>
                    </form>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-transparent px-2 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        type="button"
                        className="w-full border-white/10 bg-black/20 text-white hover:bg-white/10 hover:text-white"
                        disabled={loading}
                        onClick={handleGoogleLogin}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                            <>
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                                Google
                            </>
                        )}
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-white/10 pt-6">
                    <p className="text-xs text-gray-400">Restricted Area. Authorized Personnel Only.</p>
                </CardFooter>
            </Card>
        </div>
    );
}
