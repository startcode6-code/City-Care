
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
} from "lucide-react";

export type AdminLoginCredentials = {
    email: string;
    password: string;
    rememberMe: boolean;
};

type AdminLoginFormProps = {
    onLogin?: (credentials: AdminLoginCredentials) => Promise<void>;
};

export function AdminLoginForm({ onLogin }: AdminLoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const normalizedEmail = email.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    const canSubmit = validEmail && password.length >= 6 && !loading;

    async function handleSubmit(event: FormEvent<HTMLFormElement>,) {
        event.preventDefault();
        setError("");
        setNotice("");

        if (!validEmail || !password) {
            setError("Please enter a valid email and password.");
            return;
        }

        if (!onLogin) {
            setNotice(
                "The login form is ready. Connect the authentication API to sign in.",
            );
            return;
        }

        setLoading(true);

        try {
            await onLogin({
                email: normalizedEmail,
                password,
                rememberMe,
            });
        } catch {
            setError("Unable to sign in. Please check your credentials and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Administrator access
                </p>

                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-[2.15rem]">
                    Welcome back
                </h1>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Sign in to manage hospital services, doctors and
                    website content.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label
                        htmlFor="admin-email"
                        className="text-sm font-medium text-foreground"
                    >
                        Email address
                    </label>

                    <div className="relative">
                        <Mail
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                        />

                        <input
                            id="admin-email"
                            name="email"
                            type="email"
                            autoComplete="username"
                            inputMode="email"
                            placeholder="you@hospital.com"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setError("");
                                setNotice("");
                            }}
                            required
                            aria-invalid={email.length > 0 && !validEmail}
                            className="h-12 w-full rounded-lg border border-input bg-background pl-11 pr-4 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20"
                        />
                    </div>

                    {email.length > 0 && !validEmail && (
                        <p className="text-xs text-destructive">
                            Enter a valid email address.
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                        <label
                            htmlFor="admin-password"
                            className="text-sm font-medium text-foreground"
                        >
                            Password
                        </label>

                        <Link
                            href="/admin/forgot-password"
                            className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <div className="relative">
                        <LockKeyhole
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                        />

                        <input
                            id="admin-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setError("");
                                setNotice("");
                            }}
                            required
                            className="h-12 w-full rounded-lg border border-input bg-background pl-11 pr-12 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            aria-pressed={showPassword}
                            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {showPassword ? (
                                <EyeOff className="size-[18px]" />
                            ) : (
                                <Eye className="size-[18px]" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-0.5">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(event) =>
                                setRememberMe(event.target.checked)
                            }
                            className="size-4 accent-primary"
                        />
                        Remember me
                    </label>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive"
                    >
                        {error}
                    </p>
                )}

                {notice && (
                    <p
                        role="status"
                        className="rounded-lg border border-border bg-muted/50 px-3.5 py-3 text-sm text-muted-foreground"
                    >
                        {notice}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
                >
                    {loading ? (
                        <>
                            <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                            Signing in...
                        </>
                    ) : (
                        <>
                            Sign in
                            <ArrowRight className="size-4" />
                        </>
                    )}
                </button>

                <p className="text-center text-xs leading-5 text-muted-foreground">
                    Access is restricted to authorized hospital administrators.
                </p>
            </form>
        </div>
    );
}
