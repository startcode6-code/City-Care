import Link from "next/link";
import {
    ArrowRight,
    CalendarCheck2,
    FileText,
    Hospital,
    Plus,
    Stethoscope,
    Video,
} from "lucide-react";

const tones = {
    sky: { icon: "bg-sky-500/10 text-sky-600 dark:text-sky-400", bar: "bg-sky-500", hover: "hover:border-sky-500/40" },
    emerald: { icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", hover: "hover:border-emerald-500/40" },
    amber: { icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400", bar: "bg-amber-500", hover: "hover:border-amber-500/40" },
    violet: { icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400", bar: "bg-violet-500", hover: "hover:border-violet-500/40" },
};

const stats = [
    { title: "Total Doctors", note: "Registered Profiles", icon: Stethoscope, href: "/admin/doctors", tone: tones.sky },
    { title: "Appointments", note: "Patient Requests", icon: CalendarCheck2, href: "/admin/appointments", tone: tones.emerald },
    { title: "Services", note: "Departments & Care", icon: Hospital, href: "/admin/services", tone: tones.amber },
    { title: "Blog Articles", note: "Health Updates", icon: FileText, href: "/admin/blog", tone: tones.violet },
];

const actions = [
    { title: "Add Doctor", sub: "New Profile", icon: Stethoscope, href: "/admin/doctors", tone: tones.sky },
    { title: "Appointments", sub: "Review Requests", icon: CalendarCheck2, href: "/admin/appointments", tone: tones.emerald },
    { title: "Write Article", sub: "Health Tips", icon: FileText, href: "/admin/blog", tone: tones.violet },
    { title: "Upload Video", sub: "Public Website", icon: Video, href: "/admin/videos", tone: tones.amber },
];

export default function AdminDashboardPage() {
    const today = new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Asia/Kolkata",
    }).format(new Date());

    return (
        <div className="mx-auto max-w-[1400px] space-y-6 pb-8">
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
                {stats.map(({ title, note, icon: Icon, href, tone }) => (
                    <Link
                        key={title}
                        href={href}
                        className={`group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${tone.hover}`}
                    >
                        <span className={`absolute inset-x-0 top-0 h-1 ${tone.bar}`} />
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                                <p className="mt-2 text-4xl font-extrabold tabular-nums tracking-tight">—</p>
                            </div>
                            <span className={`flex size-12 items-center justify-center rounded-2xl transition-transform group-hover:rotate-6 group-hover:scale-110 ${tone.icon}`}>
                                <Icon className="size-6" strokeWidth={1.8} />
                            </span>
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">{note}</p>
                    </Link>
                ))}
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                {/* Appointments */}
                <section className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <h2 className="font-semibold">Recent Appointments</h2>
                            <p className="text-xs text-muted-foreground">Latest Patient Requests</p>
                        </div>
                        <Link href="/admin/appointments" className="text-sm font-semibold text-primary hover:underline">
                            View All
                        </Link>
                    </div>

                    <div className="hidden grid-cols-[2fr_2fr_1.5fr_1fr] border-y border-border bg-muted/50 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
                        <span>Patient</span>
                        <span>Doctor</span>
                        <span>Date</span>
                        <span>Status</span>
                    </div>

                    {/* Skeleton rows until API is connected */}
                    <div className="relative divide-y divide-border">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="grid grid-cols-[auto_1fr] items-center gap-3 px-6 py-4 sm:grid-cols-[2fr_2fr_1.5fr_1fr] sm:gap-0">
                                <div className="flex items-center gap-3">
                                    <span className="size-9 animate-pulse rounded-full bg-muted" />
                                    <span className="h-3 w-24 animate-pulse rounded bg-muted" />
                                </div>
                                <span className="h-3 w-28 animate-pulse rounded bg-muted" />
                                <span className="hidden h-3 w-20 animate-pulse rounded bg-muted sm:block" />
                                <span className="hidden h-6 w-16 animate-pulse rounded-full bg-muted sm:block" />
                            </div>
                        ))}

                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 text-center backdrop-blur-[2px]">
                            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <CalendarCheck2 className="size-6" />
                            </span>
                            <p className="mt-3 text-sm font-semibold">No Appointments Yet</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                New Requests Will Appear Here
                            </p>
                        </div>
                    </div>
                </section>

                {/* Quick actions */}
                <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
                    <h2 className="font-semibold">Quick Actions</h2>
                    <p className="text-xs text-muted-foreground">Jump Straight To What You Need</p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        {actions.map(({ title, sub, icon: Icon, href, tone }) => (
                            <Link
                                key={title}
                                href={href}
                                className={`group rounded-xl border border-border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${tone.hover}`}
                            >
                                <span className={`flex size-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${tone.icon}`}>
                                    <Icon className="size-5" strokeWidth={1.8} />
                                </span>
                                <p className="mt-3 text-sm font-semibold">{title}</p>
                                <p className="text-xs text-muted-foreground">{sub}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}