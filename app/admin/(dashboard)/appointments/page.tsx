"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
    Search,
    RefreshCw,
    CalendarDays,
    Users,
    Clock,
    CheckCircle2,
    Pencil,
    Trash2,
    Loader2,
    X,
    Phone,
    Mail,
    UserRound,
    Stethoscope,
    FileText,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    AppointmentStatus,
    getAppointments,
    deleteAppointment,
    updateAppointment,
    createAppointment,
    Appointment,
    AppointmentPayload,
} from "@/lib/api/appointments";

const PAGE_SIZE = 10;

const initialForm: AppointmentPayload = {
    name: "",
    phone: "",
    email: "",
    department: "",
    doctor: "",
    package: "",
    date: "",
    time: "",
    reason: "",
    status: "PENDING",
};

const statuses: AppointmentStatus[] = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

const fields: {
    key: keyof AppointmentPayload;
    label: string;
    icon: React.ReactNode;
    type?: string;
    required?: boolean;
}[] = [
        { key: "name", label: "Patient Name", icon: <UserRound />, required: true },
        { key: "phone", label: "Phone Number", icon: <Phone />, required: true },
        { key: "email", label: "Email", icon: <Mail />, type: "email" },
        { key: "department", label: "Department", icon: <Stethoscope />, required: true },
        { key: "doctor", label: "Doctor", icon: <UserRound /> },
        { key: "package", label: "Package", icon: <FileText /> },
        { key: "date", label: "Appointment Date", icon: <CalendarDays />, type: "date", required: true },
        { key: "time", label: "Appointment Time", icon: <Clock />, type: "time", required: true },
    ];

function formatDate(date: string) {
    if (!date) return "-";
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
    const styles: Record<AppointmentStatus, string> = {
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
        CANCELLED: "bg-red-50 text-red-700 border-red-200",
        COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };

    return (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
            {status}
        </span>
    );
}

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editing, setEditing] = useState<Appointment | null>(null);
    const [form, setForm] = useState<AppointmentPayload>(initialForm);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load appointments
    const loadAppointments = useCallback(async (force = false) => {
        try {
            setError("");
            if (force) setRefreshing(true);
            else setLoading(true);

            setAppointments(await getAppointments(force));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable To Load Appointments.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void loadAppointments();
    }, [loadAppointments]);

    // Search and filter
    const filteredAppointments = useMemo(() => {
        const query = search.toLowerCase().trim();

        return appointments.filter((item) => {
            const matchesSearch =
                !query ||
                item.name.toLowerCase().includes(query) ||
                item.phone.includes(query) ||
                item.reference.toLowerCase().includes(query) ||
                (item.doctor || "").toLowerCase().includes(query) ||
                item.department.toLowerCase().includes(query);

            return matchesSearch && (statusFilter === "ALL" || item.status === statusFilter);
        });
    }, [appointments, search, statusFilter]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / PAGE_SIZE));

    const paginatedAppointments = filteredAppointments.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    // Statistics
    const stats = useMemo(
        () => ({
            total: appointments.length,
            pending: appointments.filter((a) => a.status === "PENDING").length,
            confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
            completed: appointments.filter((a) => a.status === "COMPLETED").length,
        }),
        [appointments]
    );

    // Sidebar actions
    function openAdd() {
        setEditing(null);
        setForm(initialForm);
        setError("");
        setSuccess("");
        setSidebarOpen(true);
    }

    function openEdit(item: Appointment) {
        setEditing(item);
        setForm({
            name: item.name,
            phone: item.phone,
            email: item.email || "",
            department: item.department,
            doctor: item.doctor || "",
            package: item.package || "",
            date: item.date,
            time: item.time,
            reason: item.reason || "",
            status: item.status,
        });
        setError("");
        setSuccess("");
        setSidebarOpen(true);
    }

    function closeSidebar() {
        if (saving) return;
        setSidebarOpen(false);
        setEditing(null);
    }

    function handleChange(field: keyof AppointmentPayload, value: string) {
        setForm((previous) => ({ ...previous, [field]: value }));
    }

    // Add or update
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.name?.trim() || !form.phone?.trim() || !form.department?.trim() || !form.date || !form.time) {
            setError("Please Fill All Required Fields.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const payload = { ...form, name: form.name.trim(), phone: form.phone.trim() };

            if (editing) {
                await updateAppointment(editing.id, payload);
                setSuccess("Appointment Updated Successfully.");
            } else {
                await createAppointment(payload);
                setSuccess("Appointment Added Successfully.");
            }

            setSidebarOpen(false);
            setEditing(null);
            await loadAppointments(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed To Save Appointment.");
        } finally {
            setSaving(false);
        }
    }

    // Delete appointment
    async function handleDelete(item: Appointment) {
        if (!window.confirm(`Are You Sure You Want To Delete The Appointment Of ${item.name}?`)) return;

        try {
            setDeletingId(item.id);
            setError("");
            setSuccess("");

            await deleteAppointment(item.id);
            setAppointments((previous) => previous.filter((a) => a.id !== item.id));
            setSuccess("Appointment Deleted Successfully.");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed To Delete Appointment.");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage And Monitor Patient Appointment Requests.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => loadAppointments(true)} disabled={refreshing}>
                        <RefreshCw className={`mr-2 size-4 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>

                    <Button onClick={openAdd}>
                        <Plus className="mr-2 size-4" />
                        Add Appointment
                    </Button>
                </div>
            </div>

            {/* Notifications */}
            {error && !sidebarOpen && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle className="size-4 shrink-0" />
                    {error}
                    <button className="ml-auto" onClick={() => setError("")}>
                        <X className="size-4" />
                    </button>
                </div>
            )}

            {success && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                    <CheckCircle2 className="size-4" />
                    {success}
                    <button className="ml-auto" onClick={() => setSuccess("")}>
                        <X className="size-4" />
                    </button>
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total Appointments" value={stats.total} icon={<CalendarDays className="size-5" />} color="text-blue-600" bg="bg-blue-50" />
                <StatCard title="Pending Requests" value={stats.pending} icon={<Clock className="size-5" />} color="text-amber-600" bg="bg-amber-50" />
                <StatCard title="Confirmed" value={stats.confirmed} icon={<Users className="size-5" />} color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard title="Completed" value={stats.completed} icon={<CheckCircle2 className="size-5" />} color="text-purple-600" bg="bg-purple-50" />
            </div>

            {/* Table Card */}
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    {/* Search and filters */}
                    <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search Patient, Phone, Doctor..."
                                className="pl-9"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="ALL">All Status</option>
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Data Table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[1050px] text-left text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="px-5 py-4 font-semibold">Patient</th>
                                    <th className="px-5 py-4 font-semibold">Reference</th>
                                    <th className="px-5 py-4 font-semibold">Department / Doctor</th>
                                    <th className="px-5 py-4 font-semibold">Appointment Date</th>
                                    <th className="px-5 py-4 font-semibold">Status</th>
                                    <th className="px-5 py-4 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center">
                                            <Loader2 className="mx-auto size-7 animate-spin text-primary" />
                                            <p className="mt-3 text-muted-foreground">Loading Appointments...</p>
                                        </td>
                                    </tr>
                                ) : paginatedAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center">
                                            <CalendarDays className="mx-auto size-9 text-muted-foreground" />
                                            <p className="mt-3 font-medium">No Appointments Found</p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Try Changing Your Search Or Filter.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedAppointments.map((item) => (
                                        <tr key={item.id} className="transition-colors hover:bg-muted/30">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">{item.phone}</p>
                                                <p className="text-xs text-muted-foreground">{item.email || "No Email"}</p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="font-mono text-xs">{item.reference}</span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="font-medium">{item.department}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {item.doctor || "Any Available Doctor"}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="font-medium">{formatDate(item.date)}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge status={item.status} />
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title="Edit Appointment"
                                                        onClick={() => openEdit(item)}
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title="Delete Appointment"
                                                        disabled={deletingId === item.id}
                                                        onClick={() => handleDelete(item)}
                                                    >
                                                        {deletingId === item.id ? (
                                                            <Loader2 className="size-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="size-4 text-red-600" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && (
                        <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {filteredAppointments.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} To{" "}
                                {Math.min(currentPage * PAGE_SIZE, filteredAppointments.length)} Of{" "}
                                {filteredAppointments.length} Appointments
                            </p>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    <ChevronLeft className="size-4" />
                                    Previous
                                </Button>

                                <span className="px-2 text-sm">
                                    {currentPage} / {totalPages}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    Next
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add / Edit Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/50" onClick={closeSidebar} />

                    <aside className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right duration-300">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between border-b p-5">
                            <div>
                                <h2 className="text-lg font-bold">
                                    {editing ? "Edit Appointment" : "Add Appointment"}
                                </h2>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {editing ? `Reference: ${editing.reference}` : "Fill The Details Below"}
                                </p>
                            </div>

                            <Button variant="ghost" size="icon" onClick={closeSidebar}>
                                <X className="size-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
                            <div className="flex-1 space-y-4 overflow-y-auto p-5">
                                {error && (
                                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                        <AlertCircle className="size-4 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {fields.map((f) => (
                                    <FormField key={f.key} label={f.label} icon={f.icon}>
                                        <Input
                                            type={f.type || "text"}
                                            required={f.required}
                                            value={(form[f.key] as string) || ""}
                                            onChange={(e) => handleChange(f.key, e.target.value)}
                                        />
                                    </FormField>
                                ))}

                                <FormField label="Appointment Status">
                                    <select
                                        value={form.status || "PENDING"}
                                        onChange={(e) => handleChange("status", e.target.value)}
                                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                    >
                                        {statuses.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Reason For Visit">
                                    <textarea
                                        rows={3}
                                        value={form.reason || ""}
                                        onChange={(e) => handleChange("reason", e.target.value)}
                                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </FormField>
                            </div>

                            {/* Sidebar Footer */}
                            <div className="flex justify-end gap-2 border-t p-5">
                                <Button type="button" variant="outline" onClick={closeSidebar} disabled={saving}>
                                    Cancel
                                </Button>

                                <Button type="submit" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                                    {saving ? "Saving..." : editing ? "Update Appointment" : "Add Appointment"}
                                </Button>
                            </div>
                        </form>
                    </aside>
                </div>
            )}
        </div>
    );
}

// Statistics card
function StatCard({
    title,
    value,
    icon,
    color,
    bg,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    bg: string;
}) {
    return (
        <Card>
            <CardContent className="flex items-center justify-between p-5">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="mt-2 text-2xl font-bold">{value}</p>
                </div>

                <div className={`rounded-xl p-3 ${bg} ${color}`}>{icon}</div>
            </CardContent>
        </Card>
    );
}

// Form field
function FormField({
    label,
    icon,
    children,
}: {
    label: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
                {icon && <span className="size-4 text-muted-foreground [&>svg]:size-4">{icon}</span>}
                {label}
            </label>
            {children}
        </div>
    );
}