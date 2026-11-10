
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
    ArrowLeft,
    Pencil,
    CheckCircle2,
    Stethoscope,
    Loader2,
    AlertCircle,
} from "lucide-react";

import {
    getServices,
    type Service,
} from "@/lib/api/service";

export default function ServiceDetailsPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const serviceId = params.id;

    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchService = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const services = await getServices(true);

            const foundService = services.find(
                (item: Service) => item.id === serviceId
            );

            if (!foundService) {
                setError("Service not found.");
                return;
            }

            setService(foundService);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load service details."
            );
        } finally {
            setLoading(false);
        }
    }, [serviceId]);

    useEffect(() => {
        fetchService();
    }, [fetchService]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Loading service details...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <AlertCircle className="size-12 text-destructive" />
                <h2 className="text-xl font-semibold">
                    {error || "Service not found"}
                </h2>
                <button
                    onClick={() => router.push("/admin/services")}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                    Back to Services
                </button>
            </div>
        );
    }

    const features = Array.isArray(service.service)
        ? service.service
        : [];

    return (
        <div className="mx-auto max-w-7xl space-y-7">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <button
                        onClick={() => router.push("/admin/services")}
                        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Services
                    </button>

                    <h1 className="text-2xl font-bold tracking-tight">
                        Service Details
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        View complete information about this hospital service.
                    </p>
                </div>

                <button
                    onClick={() =>
                        router.push(`/admin/services?edit=${service.id}`)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                    <Pencil className="size-4" />
                    Edit Service
                </button>
            </div>

            {/* Main Service Card */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="grid lg:grid-cols-2">

                    {/* Image */}
                    <div className="relative min-h-[280px] bg-muted sm:min-h-[380px]">
                        <Image
                            src={
                                service.photoUrl ||
                                "/images/polytrauma.png"
                            }
                            alt={service.serviceName}
                            fill
                            priority
                            unoptimized
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />

                        <div className="absolute left-5 top-5">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                                <CheckCircle2 className="size-4" />
                                Active Service
                            </span>
                        </div>
                    </div>

                    {/* Service Information */}
                    <div className="flex flex-col justify-center p-6 sm:p-10">
                        <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Stethoscope className="size-6" />
                        </div>

                        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                            Hospital Department / Service
                        </p>

                        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight">
                            {service.serviceName}
                        </h2>

                        <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
                            {service.summary || "No description available."}
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="rounded-xl border border-border bg-muted/30 p-4">
                                <p className="text-xs text-muted-foreground">
                                    Total Features
                                </p>
                                <p className="mt-1 text-2xl font-bold">
                                    {features.length}
                                </p>
                            </div>

                            <div className="rounded-xl border border-border bg-muted/30 p-4">
                                <p className="text-xs text-muted-foreground">
                                    Service Status
                                </p>
                                <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                                    <span className="size-2 rounded-full bg-green-500" />
                                    Active
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="space-y-5">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">
                        Services & Features
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        All treatments and facilities available under this service.
                    </p>
                </div>

                {features.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={`${index}-${feature}`}
                                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                            >
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <CheckCircle2 className="size-5" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        FEATURE {String(index + 1).padStart(2, "0")}
                                    </p>
                                    <h3 className="mt-1 text-sm font-semibold leading-6">
                                        {feature}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                        No service features available.
                    </div>
                )}
            </section>

            {/* Bottom Information */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Service Reference ID
                </p>
                <p className="mt-2 break-all font-mono text-sm">
                    {service.id}
                </p>
            </div>
        </div>
    );
}
