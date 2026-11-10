"use client"
import { ServiceForm } from "@/components/admin/admin-services-form";
import { useState, useEffect, useMemo } from "react";

import {
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";
import Image from "next/image";
import { getServices, getCachedServices, type Service } from "@/lib/api/service";



const ITEMS_PER_PAGE = 10;

export default function ServicesPage() {
    const [service, setService] = useState<Service[]>(() => getCachedServices() ?? []);
    const [currentPage, setCurrentPage] = useState(1);
    const [openActionId, setOpenActionId] = useState<string | null>(null);
    const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(() => getCachedServices() === null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchServices() {
            try {
                setError(null);

                // Cache available hai toh loading screen nahi dikhegi.
                if (getCachedServices() === null) {
                    setLoading(true);
                }

                const data = await getServices();

                if (isMounted) {
                    setService(data);
                }
            } catch (error) {
                if (isMounted) {
                    setError(error instanceof Error ? error.message : "Failed to fetch services.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchServices();
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredServices = useMemo(() => {
        const query = search.toLowerCase().trim();

        return service.filter((service) => {
            return (
                service.serviceName.toLowerCase().includes(query) ||
                service.summary.toLowerCase().includes(query) ||
                service.service.some((item) =>
                    item.toLowerCase().includes(query)
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

    function handleAddService(data: {
        name: string;
        description: string;
        status: "Active" | "Inactive";
    }) {
        console.log("New service:", data);
        setIsAddServiceOpen(false);
    }

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

                <button
                    type="button"
                    onClick={() => setIsAddServiceOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                    <Plus className="size-4" />
                    Add Service
                </button>

                <ServiceForm
                    open={isAddServiceOpen}
                    onClose={() => setIsAddServiceOpen(false)}
                    onSubmit={handleAddService}
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
                            {currentServices.map((service) => (
                                <tr
                                    key={service.id}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    {/* Service Image */}
                                    <td className="px-5 py-4">
                                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-border">
                                            <Image
                                                src={
                                                    service.photoUrl ||
                                                    "/images/polytrauma.png"
                                                }
                                                alt={service.serviceName}
                                                fill
                                                sizes="48px"
                                                className="object-cover transition-transform duration-300 hover:scale-110"
                                            />
                                        </div>
                                    </td>

                                    {/* Service Name */}
                                    <td className="px-5 py-4">
                                        <div className="font-medium text-foreground">
                                            {service.serviceName}
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {service.service.length} service features
                                        </p>
                                    </td>

                                    {/* Description */}
                                    <td className="max-w-xs px-5 py-4 text-muted-foreground">
                                        <p
                                            className="truncate"
                                            title={service.summary}
                                        >
                                            {service.summary}
                                        </p>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                            Not set
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="relative flex items-center justify-end gap-3">

                                            {/* View Details */}
                                            <button
                                                type="button"
                                                aria-label={`View ${service.serviceName}`}
                                                onClick={() => {
                                                    setOpenActionId(null);
                                                    alert(
                                                        `View ${service.serviceName}`
                                                    );
                                                }}
                                                className="rounded-md p-1.5 transition-colors hover:bg-muted"
                                            >
                                                <ChevronRight className="size-5" />
                                            </button>

                                            {/* Three Dots Menu */}
                                            <button
                                                type="button"
                                                aria-label={`Actions for ${service.serviceName}`}
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
                                                            alert(
                                                                `Edit ${service.serviceName}`
                                                            );
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
                                                            alert(
                                                                `Delete ${service.serviceName}`
                                                            );
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
                            {currentServices.length === 0 && (
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

        </div>
    );
}
