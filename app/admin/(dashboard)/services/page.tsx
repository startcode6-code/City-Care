"use client";
import { ServiceForm } from "@/components/admin/admin-services-form";
import { useState } from "react";
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

const services = [
    {
        id: 1,
        name: "General Medicine",
        description: "Diagnosis and treatment of common illnesses.",
        status: "Active",
    },
    {
        id: 2,
        name: "Cardiology",
        description: "Heart care and treatment.",
        status: "Active",
    },
    {
        id: 3,
        name: "Neurology",
        description: "Brain and nervous system care.",
        status: "Active",
    },
    {
        id: 4,
        name: "Orthopedics",
        description: "Bone, joint, and muscle care.",
        status: "Inactive",
    },
    {
        id: 5,
        name: "General Surgery",
        description: "Surgical care and procedures.",
        status: "Active",
    },
    {
        id: 6,
        name: "Neurosurgery",
        description: "Surgical treatment of nervous system conditions.",
        status: "Active",
    },
    {
        id: 7,
        name: "Urology",
        description: "Urinary tract and related care.",
        status: "Active",
    },
    {
        id: 8,
        name: "Plastic Surgery",
        description: "Reconstructive and plastic surgery services.",
        status: "Inactive",
    },
    {
        id: 9,
        name: "Emergency Care",
        description: "Urgent medical assessment and treatment.",
        status: "Active",
    },
    {
        id: 10,
        name: "Intensive Care Unit",
        description: "Critical care for seriously ill patients.",
        status: "Active",
    },
    {
        id: 11,
        name: "Dental Care",
        description: "Oral health and dental treatment.",
        status: "Active",
    },
    {
        id: 12,
        name: "Radiology",
        description: "Medical imaging and diagnostic services.",
        status: "Active",
    },
];

const ITEMS_PER_PAGE = 10;

export default function ServicesPage() {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openActionId, setOpenActionId] = useState<number | null>(null);
    const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);


    const filteredServices = services.filter((service) => {
        const query = search.toLowerCase();

        return (
            service.name.toLowerCase().includes(query) ||
            service.description.toLowerCase().includes(query) ||
            service.status.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(
        filteredServices.length / ITEMS_PER_PAGE
    );

    const safePage = Math.min(currentPage, Math.max(totalPages, 1));

    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;

    const currentServices = filteredServices.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

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
                                    <td className="px-5 py-4">
                                        <Image
                                            src="/images/polytrauma.png"
                                            alt={service.name}
                                            width={50}
                                            height={50}
                                            className="h-10 w-10 rounded-lg object-cover"
                                        />
                                    </td>

                                    <td className="px-5 py-4 font-medium">
                                        {service.name}
                                    </td>

                                    <td className="max-w-xs px-5 py-4 text-muted-foreground">
                                        <p className="truncate">{service.description}</p>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${service.status === "Active"
                                                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                                : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {service.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="relative flex items-center justify-end gap-3">
                                            {/* View details */}
                                            <button
                                                type="button"
                                                aria-label={`View ${service.name}`}
                                                onClick={() => alert(`View ${service.name}`)}
                                                className="rounded-md p-1.5 transition-colors hover:bg-muted"
                                            >
                                                <ChevronRight className="size-5" />
                                            </button>

                                            {/* Three dots menu */}
                                            <button
                                                type="button"
                                                aria-label={`Actions for ${service.name}`}
                                                aria-haspopup="menu"
                                                aria-expanded={openActionId === service.id}
                                                onClick={() =>
                                                    setOpenActionId(
                                                        openActionId === service.id ? null : service.id
                                                    )
                                                }
                                                className="rounded-md p-1.5 transition-colors hover:bg-muted"
                                            >
                                                <MoreHorizontal className="size-5" />
                                            </button>

                                            {openActionId === service.id && (
                                                <div
                                                    role="menu"
                                                    className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg"
                                                >
                                                    <button
                                                        type="button"
                                                        role="menuitem"
                                                        onClick={() => {
                                                            setOpenActionId(null);
                                                            alert(`Edit ${service.name}`);
                                                        }}
                                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        role="menuitem"
                                                        onClick={() => {
                                                            setOpenActionId(null);
                                                            alert(`Delete ${service.name}`);
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

                            {currentServices.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
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
                        <button
                            type="button"
                            disabled={safePage <= 1}
                            onClick={() =>
                                setCurrentPage((page) => Math.max(1, page - 1))
                            }
                            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="size-4" />
                            Previous
                        </button>

                        <span className="px-2 text-sm">
                            Page {safePage} of {Math.max(totalPages, 1)}
                        </span>

                        <button
                            type="button"
                            disabled={safePage >= totalPages}
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.min(Math.max(totalPages, 1), page + 1)
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
