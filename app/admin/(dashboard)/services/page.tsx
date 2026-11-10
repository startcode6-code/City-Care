"use client";
import { ServiceForm } from "@/components/admin/admin-services-form";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ServiceFormData } from "@/components/admin/admin-services-form";
import { useRouter } from "next/navigation";

import {
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Pencil,
    Trash2,
    RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { getServices, createService, deleteService, getCachedServices, CreateServicePayload, updateService, uploadServicePhoto, updateServicePhoto, type Service } from "@/lib/api/service";


const ITEMS_PER_PAGE = 10;

export default function ServicesPage() {
    const [service, setService] = useState<Service[]>(() => getCachedServices() ?? []);
    const [currentPage, setCurrentPage] = useState(1);
    const [openActionId, setOpenActionId] = useState<string | null>(null);
    const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(() => getCachedServices() === null);
    const [error, setError] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const router = useRouter();
    const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const fetchServicesData = useCallback(async (forceRefresh = false) => {
        try {
            setError(null);

            if (forceRefresh || getCachedServices() === null) {
                setLoading(true);
            }

            const data = await getServices(forceRefresh);
            setService(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch services.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServicesData();
    }, [fetchServicesData]);

    const filteredServices = useMemo(() => {
        const query = search.toLowerCase().trim();

        if (!Array.isArray(service)) return [];

        return service.filter((item) => {
            const name = (item.serviceName ?? "").toLowerCase();
            const summary = (item.summary ?? "").toLowerCase();
            const features = Array.isArray(item.service) ? item.service : [];

            return (
                name.includes(query) ||
                summary.includes(query) ||
                features.some((feature) =>
                    (feature ?? "").toLowerCase().includes(query)
                )
            );
        });
    }, [service, search]);

    const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
    const safePage = Math.min(currentPage, Math.max(totalPages, 1));
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const currentServices = filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    function handleSearch(value: string) {
        setSearch(value);
        setCurrentPage(1);
    }


    const handleSaveService = async (data: ServiceFormData) => {
        try {
            let photoUrl = selectedService?.photoUrl ?? "";
            let photoPublicId = selectedService?.photoPubliceId ?? "";

            // If a new photo is selected
            if (data.photo) {
                if (selectedService) {
                    // Update existing service photo
                    const uploadedPhoto = await updateServicePhoto(selectedService.id, data.photo);

                    photoUrl = uploadedPhoto.data.photoUrl;
                    photoPublicId = uploadedPhoto.data.photoPublicId;
                } else {
                    // Upload photo for new service
                    const uploadedPhoto = await uploadServicePhoto(data.photo);

                    photoUrl = uploadedPhoto.photoUrl;
                    photoPublicId = uploadedPhoto.photoPublicId;

                    if (!photoUrl || !photoPublicId) {
                        throw new Error("Service photo is required.");
                    }
                }
            }



            const payload: CreateServicePayload = {
                serviceName: data.serviceName,
                summary: data.summary,
                photoUrl,
                photoPublicId,
                services: data.services,
            };

            if (selectedService) {
                const response = await updateService(selectedService.id, payload);
                console.log("Service Updated:", response);
            } else {
                const response = await createService(payload);

                console.log("Service Created:", response);
            }

            await fetchServicesData(true);

            setIsAddServiceOpen(false);
            setSelectedService(null);

        } catch (error) {
            console.error("Save Service Error:", error);
            throw error;
        }
    };


    const handleDeleteService = async () => {
        if (!deleteTarget) return;

        try {
            setDeleting(true);
            setDeleteError(null);

            await deleteService(deleteTarget.id);

            // Immediately remove deleted service from UI
            setService((prev) =>
                prev.filter((item) => item.id !== deleteTarget.id)
            );

            setDeleteTarget(null);

            // Refresh latest services from backend
            await fetchServicesData(true);

        } catch (error) {
            console.error("Delete Service Error:", error);

            setDeleteError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete service."
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Hospital Services
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage all hospital services from one place.
                    </p>
                </div>


                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => fetchServicesData(true)}
                        disabled={loading}
                        aria-label="Refresh services"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                    >
                        <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setSelectedService(null);
                            setIsAddServiceOpen(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                        <Plus className="size-4" />
                        Add Service
                    </button>
                </div>

                <ServiceForm
                    open={isAddServiceOpen}
                    onClose={() => {
                        setIsAddServiceOpen(false);
                        setSelectedService(null);
                    }}
                    onSubmit={handleSaveService}
                    initialData={selectedService}
                />



            </div>

            {/* Search */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) => handleSearch(event.target.value)}
                        placeholder="Search services..."
                        aria-label="Search services"
                        className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>

                <p className="text-sm text-muted-foreground">
                    Total: {filteredServices.length} services
                </p>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] text-left text-sm">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="px-5 py-4 font-semibold">Images</th>
                                <th className="px-5 py-4 font-semibold">Service</th>
                                <th className="px-5 py-4 font-semibold">Description</th>
                                <th className="px-5 py-4 font-semibold">Status</th>
                                <th className="px-5 py-4 text-right font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {/* Loading State */}
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-12 text-center text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                            <p className="text-xs">Loading services...</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Error State */}
                            {!loading && error && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-10 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                                            <p className="text-sm font-medium">{error}</p>
                                            <button
                                                type="button"
                                                onClick={() => fetchServicesData(true)}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
                                            >
                                                Try again
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Service Rows */}
                            {!loading && !error && currentServices.map((service) => (
                                <tr
                                    key={service.id}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    {/* Service Image */}
                                    <td className="px-5 py-4">
                                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-border bg-muted/30">
                                            <Image
                                                src={
                                                    service.photoUrl ||
                                                    "/images/polytrauma.png"
                                                }
                                                alt={service.serviceName || "Service"}
                                                fill
                                                sizes="48px"
                                                unoptimized
                                                className="object-cover transition-transform duration-300 hover:scale-110"
                                            />
                                        </div>
                                    </td>

                                    {/* Service Name */}
                                    <td className="px-5 py-4">
                                        <div className="font-medium text-foreground">
                                            {service.serviceName || "Untitled Service"}
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {Array.isArray(service.service) ? service.service.length : 0} service features
                                        </p>
                                    </td>

                                    {/* Description */}
                                    <td className="max-w-xs px-5 py-4 text-muted-foreground">
                                        <p
                                            className="truncate"
                                            title={service.summary || ""}
                                        >
                                            {service.summary || "No summary available."}
                                        </p>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                            Active
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="relative flex items-center justify-end gap-3">
                                            {/* View Details */}
                                            <button
                                                type="button"
                                                aria-label={`View ${service.serviceName || "Service"}`}
                                                onClick={() => {
                                                    router.push(`/admin/services/${service.id}`);
                                                }}
                                                className="rounded-md p-1.5 transition-colors hover:bg-muted"
                                            >
                                                <ChevronRight className="size-5" />
                                            </button>

                                            {/* Three Dots Menu */}
                                            <button
                                                type="button"
                                                aria-label={`Actions for ${service.serviceName || "Service"}`}
                                                aria-haspopup="menu"
                                                aria-expanded={
                                                    openActionId === service.id
                                                }
                                                onClick={() =>
                                                    setOpenActionId(
                                                        openActionId === service.id
                                                            ? null
                                                            : service.id
                                                    )
                                                }
                                                className="rounded-md p-1.5 transition-colors hover:bg-muted"
                                            >
                                                <MoreHorizontal className="size-5" />
                                            </button>

                                            {/* Dropdown Actions */}
                                            {openActionId === service.id && (
                                                <div
                                                    role="menu"
                                                    className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg"
                                                >
                                                    {/* Edit */}
                                                    <button
                                                        type="button"
                                                        role="menuitem"
                                                        onClick={() => {
                                                            setOpenActionId(null);
                                                            setSelectedService(service);
                                                            setIsAddServiceOpen(true);
                                                        }}
                                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        role="menuitem"
                                                        onClick={() => {
                                                            setOpenActionId(null);
                                                            setDeleteError(null);
                                                            setDeleteTarget(service);
                                                        }}
                                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="size-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {/* Empty State */}
                            {!loading && !error && currentServices.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-12 text-center text-muted-foreground"
                                    >
                                        No services found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        {filteredServices.length === 0
                            ? "Showing 0 services"
                            : `Showing ${startIndex + 1}–${Math.min(
                                startIndex + ITEMS_PER_PAGE,
                                filteredServices.length
                            )} of ${filteredServices.length} services`}
                    </p>

                    <div className="flex items-center gap-2">
                        {/* Previous */}
                        <button
                            type="button"
                            disabled={safePage <= 1}
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.max(1, page - 1)
                                )
                            }
                            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="size-4" />
                            Previous
                        </button>

                        {/* Current Page */}
                        <span className="px-2 text-sm">
                            Page {safePage} of {Math.max(totalPages, 1)}
                        </span>

                        {/* Next */}
                        <button
                            type="button"
                            disabled={safePage >= totalPages}
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.min(
                                        Math.max(totalPages, 1),
                                        page + 1
                                    )
                                )
                            }
                            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
            {deleteTarget && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">

                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
                                <Trash2 className="size-5 text-destructive" />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold">
                                    Delete Service?
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <p className="mt-5 text-sm text-muted-foreground">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-foreground">
                                {deleteTarget.serviceName}
                            </span>
                            ?
                        </p>

                        {deleteError && (
                            <p className="mt-3 text-sm text-destructive">
                                {deleteError}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setDeleteTarget(null)}
                                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDeleteService}
                                className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deleting && (
                                    <RefreshCw className="size-4 animate-spin" />
                                )}

                                {deleting ? "Deleting..." : "Delete Service"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
