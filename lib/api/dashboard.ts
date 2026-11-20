import { api } from "@/lib/api/client";

export interface DashboardStats {
    totalDoctors: number;
    totalServices: number;
    totalAppointments: number;
    totalBlogs: number;
    totalVideos: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get("api/dashboard/stats");

    return response.data.data;
}