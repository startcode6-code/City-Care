
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CheckCircle2,
    HeartPulse,
    Mail,
    Send,
} from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSubmitted(false);

        if (!isValidEmail) {
            setError("Please enter a valid email address.");
            return;
        }

        // UI demo only. No email is sent at this stage.
        setSubmitted(true);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
            <div className="w-full max-w-md">
                <Link
                    href="/admin/login"
                    className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to login
                </Link>

                <div className="mb-8 flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                        <HeartPulse className="size-6" />
                    </div>
                    <div>
                        <p className="text-xl font-bold tracking-tight">
                            City Care
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Hospital Administration
                        </p>
                    </div>
                </div>

                <div className="mb-8 flex size-14 items-center justify-center rounded-2xl border border-border bg-card">
                    <Mail className="size-6 text-primary" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                    Forgot your password?
                </h1>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Enter the email address associated with your admin
                    account. We&apos;ll help you get back into your account.
                </p>

                {submitted ? (
                    <div
                        role="status"
                        className="mt-8 rounded-2xl border border-border bg-card p-5"
                    >
                        <CheckCircle2 className="mb-3 size-7 text-primary" />
                        <h2 className="font-semibold">Form validated</h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Your email format is valid. Password reset emails
                            will be enabled when the backend is connected.
                        </p>
                        <button
                            type="button"
                            onClick={() => setSubmitted(false)}
                            className="mt-4 text-sm font-semibold text-primary hover:underline"
                        >
                            Try another email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div className="space-y-2">
                            <label
                                htmlFor="reset-email"
                                className="text-sm font-medium"
                            >
                                Email address
                            </label>

                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="reset-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="admin@citycare.com"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        setError("");
                                    }}
                                    required
                                    className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                                />
                            </div>
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                            >
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={!isValidEmail}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                        >
                            Send reset link
                            <Send className="size-4" />
                        </button>
                    </form>
                )}

                <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">
                    For account security, password recovery will be handled
                    through the hospital&apos;s verified backend process.
                </p>
            </div>
        </main>
    );
}
