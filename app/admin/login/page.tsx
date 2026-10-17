
import Link from "next/link";
import { ArrowLeft, HeartPulse } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
                {/* Hospital identity panel */}
                <section className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-muted/40 p-10 lg:flex xl:p-14">
                    <Link
                        href="/"
                        className="relative z-10 flex w-fit items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <HeartPulse className="size-6" />
                        </span>

                        <span className="min-w-0">
                            <span className="block text-sm font-bold tracking-tight text-foreground">
                                K.P. SINHA
                            </span>
                            <span className="block text-xs text-muted-foreground">
                                MEMORIAL HOSPITAL
                            </span>
                        </span>
                    </Link>

                    <div className="relative z-10 max-w-lg py-12">
                        <p className="mb-4 text-sm font-medium text-primary">
                            Hospital Administration Portal
                        </p>

                        <h2 className="text-4xl font-semibold leading-[1.15] tracking-tight text-foreground xl:text-5xl">
                            Everything your hospital website needs, in one place.
                        </h2>

                        <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
                            Manage doctors, services, health articles and
                            hospital information through one organized workspace.
                        </p>

                        <div className="mt-9 border-t border-border pt-6">
                            <p className="text-sm font-medium text-foreground">
                                K.P. Sinha Memorial Hospital
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Care, trust and service.
                            </p>
                        </div>
                    </div>

                    <p className="relative z-10 text-xs text-muted-foreground">
                        Authorized access only.
                    </p>

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full border border-border"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-12 -right-12 size-56 rounded-full border border-border"
                    />
                </section>

                {/* Login form panel */}
                <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
                    <div className="w-full max-w-md">
                        <Link
                            href="/"
                            className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
                        >
                            <ArrowLeft className="size-4" />
                            Back to hospital website
                        </Link>

                        <div className="mb-10 flex items-center gap-3 lg:hidden">
                            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                <HeartPulse className="size-6" />
                            </span>
                            <span>
                                <span className="block text-sm font-bold tracking-tight">
                                    K.P. SINHA
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                    MEMORIAL HOSPITAL
                                </span>
                            </span>
                        </div>

                        <AdminLoginForm />

                        <div className="mt-10 border-t border-border pt-5 text-center">
                            <p className="text-xs text-muted-foreground">
                                © {new Date().getFullYear()} K.P. Sinha Memorial Hospital
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
