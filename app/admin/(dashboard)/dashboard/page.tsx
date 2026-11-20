"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    ArrowRight,
    CalendarCheck2,
    FileText,
    Hospital,
    Plus,
    Stethoscope,
} from "lucide-react";

import { getAppointments, Appointment } from "@/lib/api/appointments";
import { getDashboardStats, DashboardStats } from "@/lib/api/dashboard";

const tones = {
    sky: { icon: "bg-sky-500/10 text-sky-600 dark:text-sky-400", bar: "bg-sky-500", hover: "hover:border-sky-500/40" },
    emerald: { icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", hover: "hover:border-emerald-500/40" },
    amber: { icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400", bar: "bg-amber-500", hover: "hover:border-amber-500/40" },
    violet: { icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400", bar: "bg-violet-500", hover: "hover:border-violet-500/40" },
};

const statCards: {
    title: string;
    note: string;
    key: keyof DashboardStats;
    icon: typeof Stethoscope;
    href: string;
    tone: (typeof tones)[keyof typeof tones];
}[] = [
        { title: "Total Doctors", note: "Registered Profiles", key: "totalDoctors", icon: Stethoscope, href: "/admin/doctors", tone: tones.sky },
        { title: "Appointments", note: "Patient Requests", key: "totalAppointments", icon: CalendarCheck2, href: "/admin/appointments", tone: tones.emerald },
        { title: "Services", note: "Departments & Care", key: "totalServices", icon: Hospital, href: "/admin/services", tone: tones.amber },
        { title: "Blog Articles", note: "Health Updates", key: "totalBlogs", icon: FileText, href: "/admin/blog", tone: tones.violet },
    ];

const statusStyles: Record<string, string> = {
    CONFIRMED: "bg-green-500/10 text-green-600",
    CANCELLED: "bg-red-500/10 text-red-600",
    COMPLETED: "bg-blue-500/10 text-blue-600",
    PENDING: "bg-yellow-500/10 text-yellow-600",
};

// Shimmer block: pass size and shape through className
function Shimmer({ className = "" }: { className?: string }) {
    return (
        <span
            className={`relative block overflow-hidden bg-muted before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent ${className}`}
        />
    );
}

export default function AdminDashboardPage() {
    const today = new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Asia/Kolkata",
    }).format(new Date());

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(true);

    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadStats() {
            try {
                const data = await getDashboardStats();
                if (mounted) setDashboardStats(data);
            } catch (error) {
                console.error("Dashboard Stats Error:", error);
            } finally {
                if (mounted) setStatsLoading(false);
            }
        }

        async function loadAppointments() {
            try {
                const data = await getAppointments();
                if (mounted) setAppointments(data.slice(0, 5));
            } catch (error) {
                console.error("Dashboard Appointments Error:", error);
            } finally {
                if (mounted) setAppointmentsLoading(false);
            }
        }

        // Both requests run in parallel
        void loadStats();
        void loadAppointments();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="mx-auto max-w-[1400px] space-y-6 pb-8">
            {/* Shimmer keyframes */}
            <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>

            {/* Banner */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-lg shadow-primary/20 sm:p-8">
                <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
                        backgroundSize: "18px 18px",
                    }}
                />
                <Stethoscope
                    className="absolute -bottom-6 right-6 size-48 -rotate-12 opacity-15 sm:size-60"
                    strokeWidth={1}
                />

                <div className="relative max-w-xl">
                    <p className="text-sm font-medium text-primary-foreground/80">{today}</p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
                        Welcome Back, Admin
                    </h1>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href="/admin/doctors"
                            className="inline-flex h-11 items-center gap-2 rounded-xl bg-background px-5 text-sm font-semibold text-foreground shadow-sm transition hover:scale-[1.02]"
                        >
                            <Plus className="size-4" />
                            Add Doctor
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex h-11 items-center gap-2 rounded-xl border border-primary-foreground/30 px-5 text-sm font-semibold transition hover:bg-primary-foreground/10"
                        >
                            View Website
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map(({ title, note, key, icon: Icon, href, tone }) => (
                    <Link
                        key={title}
                        href={href}
                        className={`group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${tone.hover}`}
                    >
                        <span className={`absolute inset-x-0 top-0 h-1 ${tone.bar}`} />

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{title}</p>

                                {statsLoading ? (
                                    <Shimmer className="mt-3 h-9 w-16 rounded-md" />
                                ) : (
                                    <p className="mt-2 text-4xl font-extrabold tabular-nums tracking-tight">
                                        {dashboardStats ? dashboardStats[key] : "—"}
                                    </p>
                                )}
                            </div>

                            <span className={`flex size-12 items-center justify-center rounded-2xl transition-transform group-hover:rotate-6 group-hover:scale-110 ${tone.icon}`}>
                                <Icon className="size-6" strokeWidth={1.8} />
                            </span>
                        </div>

                        <p className="mt-4 text-xs text-muted-foreground">{note}</p>
                    </Link>
                ))}
            </section>

            {/* Appointments */}
            <section className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between px-6 py-4">
                    <div>
                        <h2 className="font-semibold">Recent Appointments</h2>
                        <p className="text-xs text-muted-foreground">Latest Patient Requests</p>
                    </div>

                    <Link
                        href="/admin/appointments"
                        className="text-sm font-semibold text-primary hover:underline"
                    >
                        View All
                    </Link>
                </div>

                {/* Table Header */}
                <div className="hidden grid-cols-[2fr_2fr_1.5fr_1fr] border-y border-border bg-muted/50 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
                    <span>Patient</span>
                    <span>Doctor</span>
                    <span>Date</span>
                    <span>Status</span>
                </div>

                {/* Rows */}
                <div className="relative divide-y divide-border">
                    {appointmentsLoading ? (
                        [0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="grid grid-cols-[auto_1fr] items-center gap-3 px-6 py-4 sm:grid-cols-[2fr_2fr_1.5fr_1fr] sm:gap-0"
                            >
                                <div className="flex items-center gap-3">
                                    <Shimmer className="size-9 rounded-full" />
                                    <div className="space-y-2">
                                        <Shimmer className="h-3 w-24 rounded" />
                                        <Shimmer className="h-2.5 w-16 rounded" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Shimmer className="h-3 w-28 rounded" />
                                    <Shimmer className="h-2.5 w-20 rounded" />
                                </div>
                                <div className="hidden space-y-2 sm:block">
                                    <Shimmer className="h-3 w-20 rounded" />
                                    <Shimmer className="h-2.5 w-12 rounded" />
                                </div>
                                <Shimmer className="hidden h-6 w-20 rounded-full sm:block" />
                            </div>
                        ))
                    ) : appointments.length > 0 ? (
                        appointments.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-[auto_1fr] items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[2fr_2fr_1.5fr_1fr] sm:gap-0"
                            >
                                {/* Patient */}
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                        {item.name.charAt(0).toUpperCase()}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">{item.name}</p>
                                        <p className="truncate text-xs text-muted-foreground">{item.phone}</p>
                                    </div>
                                </div>

                                {/* Doctor */}
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        {item.doctor || "Not Assigned"}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">{item.department}</p>
                                </div>

                                {/* Date */}
                                <div className="hidden sm:block">
                                    <p className="text-sm">
                                        {new Date(`${item.date}T00:00:00`).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{item.time}</p>
                                </div>

                                {/* Status */}
                                <div className="hidden sm:block">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[item.status] ?? statusStyles.PENDING}`}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <>
                            {/* Skeleton Background */}
                            {[0, 1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-[auto_1fr] items-center gap-3 px-6 py-4 opacity-20 sm:grid-cols-[2fr_2fr_1.5fr_1fr]"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="size-9 rounded-full bg-muted" />
                                        <span className="h-3 w-24 rounded bg-muted" />
                                    </div>
                                    <span className="h-3 w-28 rounded bg-muted" />
                                    <span className="hidden h-3 w-20 rounded bg-muted sm:block" />
                                    <span className="hidden h-6 w-16 rounded-full bg-muted sm:block" />
                                </div>
                            ))}

                            {/* Empty State Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 text-center backdrop-blur-[2px]">
                                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <CalendarCheck2 className="size-6" />
                                </span>
                                <p className="mt-3 text-sm font-semibold">No Appointments Yet</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    New Requests Will Appear Here
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}