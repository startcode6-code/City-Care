
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { X, Plus, Trash2, ImagePlus } from "lucide-react";


export type ServiceFormData = {
    serviceName: string;
    summary: string;
    photo: File | null;
    services: string[];
};

type ServiceFormProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ServiceFormData) => Promise<void>;
    initialData?: {
        serviceName: string;
        summary: string;
        photoUrl: string | null;
        service: string[];
    } | null;
};

export function ServiceForm({
    open,
    onClose,
    onSubmit,
    initialData
}: ServiceFormProps) {

    const [formData, setFormData] = useState<ServiceFormData>({
        serviceName: "",
        summary: "",
        photo: null,
        services: [""],
    });

    const [submitting, setSubmitting] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        setFormData({
            serviceName: initialData?.serviceName ?? "",
            summary: initialData?.summary ?? "",
            photo: null,
            services: initialData?.service?.length
                ? [...initialData.service]
                : [""],
        });

        setPreview(initialData?.photoUrl ?? null);
    }, [open, initialData]);


    function updateService(index: number, value: string) {
        setFormData((prev) => ({
            ...prev,
            services: prev.services.map((item, i) =>
                i === index ? value : item
            ),
        }));
    }

    function addService() {
        setFormData((prev) => ({
            ...prev,
            services: [...prev.services, ""],
        }));
    }

    function removeService(index: number) {
        setFormData((prev) => ({
            ...prev,
            services: prev.services.filter((_, i) => i !== index),
        }));
    }

    function handlePhotoChange(file: File | null) {
        setFormData((prev) => ({ ...prev, photo: file }));

        if (preview) URL.revokeObjectURL(preview);

        setPreview(file ? URL.createObjectURL(file) : null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const filteredServices = formData.services
            .map((item) => item.trim())
            .filter(Boolean);

        if (!formData.photo && !initialData?.photoUrl) {
            alert("Please select a service photo.");
            return;
        }

        if (filteredServices.length === 0) {
            alert("Please add at least one service.");
            return;
        }

        try {
            setSubmitting(true);

            await onSubmit({
                ...formData,
                serviceName: formData.serviceName.trim(),
                summary: formData.summary.trim(),
                services: filteredServices,
            });

            if (preview) URL.revokeObjectURL(preview);

            setFormData({
                serviceName: "",
                summary: "",
                photo: null,
                services: [""],
            });

            setPreview(null);
            onClose();
        } catch (error) {
            console.error("Service submission failed:", error);
        } finally {
            setSubmitting(false);
        }
    }




    if (!open) return null;


    return (
        <div className="fixed inset-0 z-[100]">
            <button
                type="button"
                aria-label="Close form"
                onClick={onClose}
                className="absolute inset-0 size-full bg-black/30 backdrop-blur-sm"
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="service-form-title"
                className="absolute inset-y-0 right-0 flex w-full flex-col bg-background text-foreground shadow-2xl sm:w-[550px]"
            >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div>
                        <h2 id="service-form-title" className="text-xl font-semibold">
                            {initialData ? "Update Service" : "Add Service"}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {initialData
                                ? "Update hospital service details."
                                : "Create a new hospital service."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-lg p-2 hover:bg-muted"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">

                        {/* Service Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">
                                Service Name *
                            </label>

                            <input
                                required
                                value={formData.serviceName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        serviceName: e.target.value,
                                    })
                                }
                                placeholder="e.g. General Medicine & ICU"
                                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        {/* Summary */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">
                                Summary *
                            </label>

                            <textarea
                                required
                                rows={4}
                                value={formData.summary}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        summary: e.target.value,
                                    })
                                }
                                placeholder="Describe this hospital service..."
                                className="w-full resize-y rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        {/* Photo Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">
                                Service Photo *
                            </label>

                            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 transition hover:bg-muted">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Service preview"
                                        className="h-44 w-full object-cover"
                                    />
                                ) : (
                                    <>
                                        <ImagePlus className="mb-2 size-8 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            Click to upload photo
                                        </span>
                                        <span className="mt-1 text-xs text-muted-foreground">
                                            PNG, JPG or WEBP
                                        </span>
                                    </>
                                )}

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    required
                                    onChange={(e) =>
                                        handlePhotoChange(
                                            e.target.files?.[0] ?? null
                                        )
                                    }
                                />
                            </label>

                            {formData.photo && (
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{formData.photo.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handlePhotoChange(null)}
                                        className="text-destructive"
                                    >
                                        Remove photo
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Services List */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold">
                                    Service Features *
                                </label>

                                <button
                                    type="button"
                                    onClick={addService}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                                >
                                    <Plus className="size-4" />
                                    Add Feature
                                </button>
                            </div>

                            {formData.services.map((service, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        required={index === 0}
                                        value={service}
                                        onChange={(e) =>
                                            updateService(index, e.target.value)
                                        }
                                        placeholder={`Feature ${index + 1}`}
                                        className="h-11 flex-1 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                    />

                                    <button
                                        type="button"
                                        disabled={formData.services.length === 1}
                                        onClick={() => removeService(index)}
                                        className="rounded-lg p-2 text-destructive hover:bg-destructive/10 disabled:opacity-30"
                                        aria-label="Remove feature"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-border p-6">
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={submitting}
                                className="h-11 flex-1 rounded-xl border border-border text-sm font-medium hover:bg-muted"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="h-11 flex-1 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                            >
                                {submitting
                                    ? "Saving..."
                                    : initialData
                                        ? "Update Service"
                                        : "Create Service"}
                            </button>
                        </div>
                    </div>
                </form>
            </aside>
        </div>
    );
}
