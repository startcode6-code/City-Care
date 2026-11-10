import { api, publicApi } from "@/lib/api/client";

export interface Service {
    id: string;
    userId: string;
    slug: string;
    serviceName: string;
    summary: string;
    photoUrl: string | null;
    photoPubliceId: string | null;
    service: string[];
}

interface ServiceResponse {
    success: boolean;
    message: string;
    results: number;
    data: Service[];
}

// Shared cache: component unmount hone par bhi rahega.
let cachedServices: Service[] | null = null;
let servicesPromise: Promise<Service[]> | null = null;

export function getCachedServices() {
    return cachedServices;
}

export async function getServices(forceRefresh = false): Promise<Service[]> {
    // Already cached data available hai.
    if (!forceRefresh && cachedServices !== null) {
        return cachedServices;
    }

    // Same time par multiple API requests prevent karega.
    if (!forceRefresh && servicesPromise) {
        return servicesPromise;
    }

    servicesPromise = api.get<ServiceResponse>("/api/service/get")
        .then((response) => {
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch services.");
            }

            cachedServices = response.data.data;
            return cachedServices;
        })
        .finally(() => {
            servicesPromise = null;
        });

    return servicesPromise;
}

export function clearServicesCache() {
    cachedServices = null;
    servicesPromise = null;
}