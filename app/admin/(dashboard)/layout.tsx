
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

export default function AdminDashboardLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return <AdminAuthGuard>
        <AdminShell>{children}</AdminShell>
    </AdminAuthGuard>;
}
