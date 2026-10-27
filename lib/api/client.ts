import axios, {
    type InternalAxiosRequestConfig,
} from "axios";
import { showRevokedSessionDialog } from "@/components/admin/auth-session-provider";

const baseURL = "https://city-care-backend.onrender.com";


export const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Refresh request ke liye alag instance.
// Is par protected API wala interceptor nahi lagega.
export const authApi = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export function saveTokens(accessToken: string, refreshToken: string) {
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
}

export function clearTokens() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");


}

// Har API request ke saath access token attach hoga.

api.interceptors.request.use(
    (config) => {


        const token = sessionStorage.getItem("accessToken");

        if (token) {
            config.headers.set("Authorization", `Bearer ${token}`);
        }

        // 2. Check Authorization header
        console.log(
            "Authorization header exists:",
            config.headers.has("Authorization")
        );

        console.log("========================================");

        return config;
    },
    (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
    }
);


type RetryConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as RetryConfig | undefined;
        const responseData = error.response?.data;

        if (responseData.status === "REVOKED") {
            clearTokens();
            showRevokedSessionDialog();
            return Promise.reject(error);
        }

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes("/api/auth/signin") ||
            originalRequest.url?.includes("/api/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = (async () => {
                    const oldRefreshToken =
                        sessionStorage.getItem("refreshToken");

                    if (!oldRefreshToken) {
                        throw new Error("Refresh token not found");
                    }

                    const response = await authApi.post("/api/auth/refresh",
                        { refreshToken: oldRefreshToken },
                    );

                    const { accessToken, refreshToken } = response.data;

                    if (!accessToken || !refreshToken) {
                        throw new Error("Refresh tokens missing");
                    }

                    saveTokens(accessToken, refreshToken);

                    return accessToken as string;
                })();
            }

            const newAccessToken = await refreshPromise;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            clearTokens();

            if (typeof window !== "undefined") {
                window.location.replace("/admin/login");
            }

            return Promise.reject(refreshError);
        } finally {
            refreshPromise = null;
        }
    },
);