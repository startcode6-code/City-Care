
import { api } from "@/lib/api/client";

export type AppointmentStatus =
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED";

export interface Appointment {
    id: string;
    reference: string;
    name: string;
    phone: string;
    email: string | null;
    department: string;
    doctor: string | null;
    package: string | null;
    date: string;
    time: string;
    reason: string | null;
    status: AppointmentStatus;
    createdAt: string;
    updatedAt: string;
}

export interface AppointmentPayload {
    name?: string;
    phone?: string;
    email?: string | null;
    department?: string;
    doctor?: string | null;
    package?: string | null;
    date?: string;
    time?: string;
    reason?: string | null;
    status?: AppointmentStatus;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    results?: number;
}

const API_URL = "/api/appointment";
const CACHE_TIME = 60 * 1000;

let appointmentsCache: Appointment[] | null = null;
let cacheTime = 0;

let pendingRequest: Promise<Appointment[]> | null = null;

// Clear cache
export function clearAppointmentCache() {
    appointmentsCache = null;
    cacheTime = 0;
    pendingRequest = null;
}// Create appointment
export async function createAppointment(
    payload: AppointmentPayload
): Promise<Appointment> {
    try {
        const response = await api.post<ApiResponse<Appointment>>(
            `${API_URL}/create`,
            payload
        );

        if (!response.data.data) {
            throw new Error(
                response.data.message || "Appointment creation failed."
            );
        }

        clearAppointmentCache();

        return response.data.data;
    } catch (error) {
        console.error("Create Appointment Error:", error);
        throw error;
    }
}








// Get all appointments
export async function getAppointments(forceRefresh = false): Promise<Appointment[]> {
    if (!forceRefresh && appointmentsCache && Date.now() - cacheTime < CACHE_TIME) {
        return appointmentsCache;
    }

    // Prevent duplicate API requests
    if (!forceRefresh && pendingRequest) {
        return pendingRequest;
    }

    const request = (async () => {
        try {
            const response = await api.get<ApiResponse<Appointment[]>>(
                `${API_URL}/get`
            );

            const body = response.data;

            const appointments = Array.isArray(body.data)
                ? body.data
                : [];

            appointmentsCache = appointments;
            cacheTime = Date.now();

            return appointments;
        } catch (error) {
            console.error("Get Appointments Error:", error);
            throw error;
        } finally {
            pendingRequest = null;
        }
    })();

    pendingRequest = request;

    return request;
}

// Update appointment
export async function updateAppointment(id: string, payload: AppointmentPayload): Promise<Appointment> {
    try {
        const response = await api.patch<
            ApiResponse<Appointment>
        >(`${API_URL}/update/${id}`, payload);

        if (!response.data.data) {
            throw new Error(
                response.data.message || "Appointment update failed."
            );
        }

        clearAppointmentCache();

        return response.data.data;
    } catch (error) {
        console.error("Update Appointment Error:", error);
        throw error;
    }
}

// Delete appointment
export async function deleteAppointment(
    id: string
): Promise<void> {
    try {
        await api.delete(`${API_URL}/delete/${id}`);

        clearAppointmentCache();
    } catch (error) {
        console.error("Delete Appointment Error:", error);
        throw error;
    }
}
