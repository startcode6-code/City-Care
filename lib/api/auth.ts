import axios from "axios";
import { api, authApi } from "@/lib/api/client";



export async function signUp(data: { email: string, password: string, deviceInfo: string }) {
    const response = await axios.post("/auth/signup", data);
    return response.data;
}



export async function loginAdmin(data: { email: string; password: string; }) {
    const response = await authApi.post("/api/auth/signin", {
        email: data.email,
        password: data.password,
    });

    return response.data;
}

export async function refreshTokens(refreshToken: string) {
    const response = await authApi.post("/api/auth/refresh",
        { refreshToken },
    );

    return response.data;
}

export async function getCurrentAdmin() {
    const response = await api.get("/api/auth/me");
    return response.data;
}

export async function forgotPassword(email: string) {
    const response = await authApi.post("/api/auth/forgot-password", { email });
    return response.data;
}

export async function resetPassword(token: string, newPassword: string) {
    const response = await authApi.post("/api/auth/reset-password", { token, newPassword });
    return response.data;
}