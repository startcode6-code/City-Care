"use client";

import { useState } from "react";
import { X } from "lucide-react";

type ServiceFormData = {
    name: string;
    description: string;
    status: "Active" | "Inactive";
};

type ServiceFormProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ServiceFormData) => void;
};

export function ServiceForm({
    open,
    onClose,
    onSubmit,
}: ServiceFormProps) {
    const [formData, setFormData] = useState<ServiceFormData>({
        name: "",
        description: "",
        status: "Active",
    });

    if (!open) return null;

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onSubmit(formData);

        setFormData({
            name: "",
            description: "",
            status: "Active",
        });
    }

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Background overlay */}
            <button
                type="button"
                aria-label="Close add service form"
                onClick={onClose}
                className="absolute inset-0 size-full bg-black/15 backdrop-blur-[5px]"
            />

            {/* Right-side drawer */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="service-form-title"
                className="absolute inset-y-0 right-0 flex w-full flex-col bg-background text-foreground shadow-2xl sm:w-[300px] lg:w-[52%] xl:w-[30%]"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-7">
                    <div>
                        <h2
                            id="service-form-title"
                            className="text-xl font-semibold"
                        >
                            Add Service
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Create a new hospital service.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-md p-1.5 hover:bg-muted"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
                        <div className="space-y-2">
                            <label
                                htmlFor="service-name"
                                className="text-sm font-semibold"
                            >
                                Service name <span className="text-destructive">*</span>
                            </label>

                            <input
                                id="service-name"
                                required
                                autoFocus
                                value={formData.name}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        name: event.target.value,
                                    })
                                }
                                placeholder="Enter service name"
                                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="service-description"
                                className="text-sm font-semibold"
                            >
                                Description <span className="text-destructive">*</span>
                            </label>

                            <textarea
                                id="service-description"
                                required
                                rows={4}
                                value={formData.description}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        description: event.target.value,
                                    })
                                }
                                placeholder="Describe this hospital service"
                                className="w-full resize-y rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="service-status"
                                className="text-sm font-semibold"
                            >
                                Status
                            </label>

                            <select
                                id="service-status"
                                value={formData.status}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        status: event.target.value as ServiceFormData["status"],
                                    })
                                }
                                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Bottom button */}
                    <div className="border-t border-border p-5 sm:px-7">
                        <button
                            type="submit"
                            className="flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
                        >
                            Create service
                        </button>
                    </div>
                </form>
            </aside>
        </div>
    );
}
