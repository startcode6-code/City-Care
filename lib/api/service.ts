import { api, publicApi } from "@/lib/api/client";
import axios from "axios";

export interface Service {
    id: string;
    userId: string;
    slug: string;
    serviceName: string;
    summary: string;
    photoUrl: string | null;
    photoPublicId: string | null;
    service: string[];
}

interface ServiceResponse {
    success: boolean;
    message?: string;
    results?: number;
    data: Service[] | { services?: Service[]; total?: number };
}


export interface CreateServicePayload {
    serviceName: string;
    summary: string;
    photoUrl: string;
    photoPublicId: string;
    services: string[];
}

export interface UploadServicePhotoResponse {
    photoUrl: string;
    photoPublicId: string;
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

    servicesPromise = api
        .get<ServiceResponse>("/api/service/get")
        .then((response) => {
            if (response.data && response.data.success === false) {
                throw new Error(response.data.message || "Failed to fetch services.");
            }

            const rawData = response.data?.data;
            let list: Service[] = [];

            if (Array.isArray(rawData)) {
                list = rawData;
            } else if (rawData && typeof rawData === "object" && "services" in rawData && Array.isArray(rawData.services)) {
                list = rawData.services;
            } else if (Array.isArray(response.data)) {
                list = response.data;
            }

            cachedServices = list;
            return list;
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


export async function uploadServicePhoto(photo: File): Promise<UploadServicePhotoResponse> {
    const formData = new FormData();

    formData.append("photo", photo);

    try {
        const response = await api.post("/api/service/upload/service-photo", formData,
            {
                headers: {
                    "Content-Type": undefined,
                },
            }
        );

        console.log("Photo Upload Response:", response.data);

        const result = response.data.data ?? response.data;

        return {
            photoUrl: result.photoUrl,
            photoPublicId: result.photoPublicId,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Upload Status:", error.response?.status);
            console.error("Upload Backend Message:", error.response?.data);
            console.error("Upload Headers:", error.response?.headers);
        }

        throw error;
    }
}



export async function createService(data: CreateServicePayload) {
    const response = await api.post("/api/service/create", data);
    return response.data;
}
export async function updateService(id: string, data: CreateServicePayload) {
    const response = await api.patch(`/api/service/update/${id}`, data);
    return response.data;
}

export async function deleteService(id: string) {
    const response = await api.delete(`/api/service/delete/${id}`);
    return response.data;
}


export async function updateServicePhoto(id: string, file: File) {
    const formData = new FormData();
    formData.append("photo", file, file.name);

    const response = await api.patch(`/api/service/${id}/update-photo`, formData,
        {
            headers: {
                "Content-Type": undefined
            }
        }
    );
    return response.data;
}


export async function getPublicServices(): Promise<Service[]> {
    const response = await publicApi.get<ServiceResponse>("/api/service/public");

    if (response.data?.success === false) {
        throw new Error(response.data.message || "Failed to fetch public services.");
    }

    const rawData = response.data?.data;

    if (Array.isArray(rawData)) {
        return rawData;
    }

    if (rawData && typeof rawData === "object" && "services" in rawData && Array.isArray(rawData.services)) {
        return rawData.services;
    }

    return [];
}
