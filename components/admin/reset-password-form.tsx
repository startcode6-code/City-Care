
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    ArrowLeft,
    ShieldCheck,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { resetPassword } from "@/lib/api/auth";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Invalid or missing password reset link.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const result = await resetPassword(token, password);
            console.log(result);
            if (result.success === true) {
                setSuccess(true);
            } else {
                setError(result.message || "Reset Password Failed");

            }
        } catch (e) {
            setError("An error occurred. Please try again.");

        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 dark:bg-slate-950">
            {/* Background decoration */}
            <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative w-full max-w-md">
                {/* Hospital branding */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                        <LockKeyhole className="size-7" />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        K.P. Sinha Memorial Hospital
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Secure Admin Portal
                    </p>
                </div>

                <Card className="border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                    <CardHeader className="space-y-3 pb-6">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            <ShieldCheck className="size-6" />
                        </div>

                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                            Reset your password
                        </CardTitle>

                        <CardDescription className="leading-relaxed">
                            Create a new secure password for your hospital admin account.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {success ? (
                            <div className="space-y-5 text-center">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                    <CheckCircle2 className="size-8" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Password details validated
                                    </h2>

                                    <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                        Your password form is ready. The password update API will
                                        be connected next.
                                    </p>
                                </div>
                                {/* 
                                <Button  variant="default" asChild className="w-full"> 
                                    <Link href="/admin/login">Back to Login</Link>
                                </Button> */}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* New password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>

                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-11 pr-11"
                                            autoComplete="new-password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
                                            aria-label={
                                                showPassword ? "Hide password" : "Show password"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>

                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Use at least 8 characters.
                                    </p>
                                </div>

                                {/* Confirm password */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        Confirm New Password
                                    </Label>

                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-11 pr-11"
                                            autoComplete="new-password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Error message */}
                                {error && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="h-11 w-full bg-blue-600 font-semibold hover:bg-blue-700"
                                >
                                    Reset Password
                                </Button>

                                <div className="pt-1 text-center">
                                    <Link
                                        href="/admin/login"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                                    >
                                        <ArrowLeft className="size-4" />
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Protected access · K.P. Sinha Memorial Hospital
                </p>
            </div>
        </main>
    );
}
