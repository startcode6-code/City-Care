
import { api, publicApi } from "@/lib/api/client";
import axios from "axios";

export interface Doctor {
    id: string;
    userId: string;
    slug: string;
    name: string;
    department: string;
    role: string;
    years: number;
    days: string;
    languages: (
        | "ENGLISH"
        | "HINDI"
        | "MANDARIN"
        | "SPANISH"
        | "FRENCH"
        | "GERMAN"
        | "ARABIC"
        | "BENGALI"
        | "URDU"
        | "TAMIL"
        | "TELUGU"
        | "MARATHI"
        | "PUNJABI"
        | "GUJARATI"
        | "JAPANESE"
    )[];
    bio: string;
    photoUrl: string | null,
    photoPublicId: string | null
}

export interface DoctorResponse {
    success: boolean;
    message: string;
    results: number;
    data: Doctor[];
}

export async function getPublicDoctors(): Promise<DoctorResponse> {
    const response = await publicApi.get("api/doctors/public");
    return response.data;
}

export async function getDoctors() {
    const response = await api.get("/api/doctors/get");
    return response.data;
}

export async function createDoctor(data: Omit<Doctor, "id" | "userId">) {
    const response = await api.post("/api/doctors/create", data);
    return response.data;
}

export async function updateDoctor(id: string, data: Partial<Omit<Doctor, "id" | "userId">>) {
    const response = await api.patch(`/api/doctors/update/${id}`, data);
    return response.data;
}

export async function deleteDoctor(id: string) {
    const response = await api.delete(`/api/doctors/delete/${id}`);
    return response.data;
}


export async function uploadDoctorPhoto(file: File) {
    const formData = new FormData();
    formData.append("photo", file, file.name);
    try {
        const response = await api.post(
            "/api/doctors/upload/doctor-photo",
            formData,
            {
                headers: {
                    "Content-Type": undefined,
                },
            }
        );
        console.log("Upload successful:", response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("PHOTO UPLOAD FAILED:", {
                status: error.response?.status,
                message: error.response?.data,
                url: error.config?.url,
                method: error.config?.method,
            });
        }

        throw error;
    }
}

export async function updateDoctorPhoto(id: string, file: File) {
    const formData = new FormData();
    formData.append("photo", file, file.name);

    const response = await api.patch(`/api/doctors/${id}/update-photo`, formData,
        {
            headers: {
                "Content-Type": undefined
            }
        }
    );
    return response.data;
}

