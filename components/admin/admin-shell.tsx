
"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

import {
    Activity,
    Bell,
    CalendarDays,
    ExternalLink,
    FileText,
    LayoutDashboard,
    Menu,
    Settings,
    Stethoscope,
    Video,
    X,
    Hospital,
    ChevronRight,
    UserRound,
    LogOut,
    ChevronDown,

} from "lucide-react";

const navigation = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Doctors", href: "/admin/doctors", icon: Stethoscope },
    { label: "Services", href: "/admin/services", icon: Hospital },
    { label: "Appointments", href: "/admin/appointments", icon: CalendarDays },
    { label: "Blog", href: "/admin/blog", icon: FileText },
    { label: "Videos", href: "/admin/videos", icon: Video },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        function handleOutsideClick(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);


    const currentPage = navigation.find((item) => item.href === pathname)?.label ?? "Administration";

    return (
        <div className="min-h-screen bg-muted/30 text-foreground">
            {/* Mobile overlay */}
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border/80 bg-background transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Brand */}
                <div className="flex h-[84px] items-center border-b border-border/70 px-5">
                    <Link
                        href="/admin/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="group flex min-w-0 items-center gap-3"
                    >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-[1.03]">
                            <Activity className="size-5" strokeWidth={2.2} />
                        </span>

                        <span className="min-w-0">
                            <span className="block truncate text-[13px] font-bold tracking-[0.04em]">
                                K.P. SINHA
                            </span>
                            <span className="mt-1 block truncate text-xs text-muted-foreground">
                                Memorial Hospital
                            </span>
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close sidebar"
                        className="ml-auto rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="px-5 pb-2 pt-7">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/80">
                        Main menu
                    </p>
                </div>

                <nav
                    aria-label="Admin navigation"
                    className="flex-1 space-y-1 overflow-y-auto px-3 pb-4"
                >
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                aria-current={active ? "page" : undefined}
                                className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-all duration-200 ${active
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                    }`}
                            >
                                {active && (
                                    <span className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-r-full bg-primary" />
                                )}

                                <Icon
                                    className={`size-[18px] shrink-0 transition-transform duration-200 ${active ? "" : "group-hover:scale-105"
                                        }`}
                                    strokeWidth={active ? 2.2 : 1.8}
                                />

                                <span className="flex-1">{item.label}</span>

                                {active && (
                                    <ChevronRight className="size-4 opacity-70" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar footer */}
                <div className="border-t border-border/70 p-4">
                    <div className="mb-3 rounded-xl border border-border/70 bg-muted/30 p-3">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                                A
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-xs font-semibold">Hospital Admin</p>
                                <p className="mt-1 truncate text-[11px] text-muted-foreground">
                                    Administration panel
                                </p>
                            </div>
                            <span className="ml-auto size-2 rounded-full bg-emerald-500" />
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <ExternalLink className="size-4" />
                        Back to website
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="min-w-0 md:pl-[260px]">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open navigation menu"
                            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background transition-colors hover:bg-muted md:hidden"
                        >
                            <Menu className="size-5" />
                        </button>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold tracking-tight">
                                {currentPage}
                            </p>
                            <p className="mt-1 hidden text-xs text-muted-foreground sm:block">
                                K.P. Sinha Memorial Hospital
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <ThemeToggle />

                        <button
                            type="button"
                            aria-label="Notifications (demo)"
                            title="Notifications"
                            className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <Bell className="size-[18px]" strokeWidth={1.8} />
                            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-background bg-primary" />
                        </button>


                        <div
                            ref={profileRef}
                            className="relative ml-1 flex items-center border-l border-border pl-3 sm:ml-2 sm:pl-4"
                        >
                            <button
                                type="button"
                                onClick={() => setProfileOpen((open) => !open)}
                                aria-expanded={profileOpen}
                                aria-haspopup="true"
                                aria-label="Open admin profile menu"
                                className="flex items-center gap-2 rounded-xl p-1.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/10">
                                    A
                                </span>

                                <span className="hidden lg:block">
                                    <span className="block text-xs font-semibold">Admin</span>
                                    <span className="mt-1 block text-[11px] text-muted-foreground">
                                        Hospital staff
                                    </span>
                                </span>

                                <ChevronDown
                                    className={`hidden size-4 text-muted-foreground transition-transform lg:block ${profileOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {profileOpen && (
                                <div
                                    role="menu"
                                    aria-label="Admin profile menu"
                                    className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-border bg-background p-1.5 shadow-xl"
                                >
                                    <div className="px-3 py-3">
                                        <p className="text-sm font-semibold">Hospital Admin</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Administration account
                                        </p>
                                        <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-primary">
                                            ADMIN
                                        </span>
                                    </div>

                                    <div className="my-1 border-t border-border" />

                                    <Link
                                        href="/admin/dashboard"
                                        role="menuitem"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                                    >
                                        <LayoutDashboard className="size-4 text-muted-foreground" />
                                        Dashboard
                                    </Link>

                                    <Link
                                        href="/admin/settings"
                                        role="menuitem"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                                    >
                                        <Settings className="size-4 text-muted-foreground" />
                                        Account settings
                                    </Link>

                                    <div className="my-1 border-t border-border" />

                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => {
                                            setProfileOpen(false);
                                        }}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                                    >
                                        <LogOut className="size-4" />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>


                    </div>
                </header>

                {/* Page content */}
                <main className="mx-auto min-h-[calc(100vh-76px)] w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
