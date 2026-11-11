
import { api, authApi, publicApi } from "@/lib/api/client";

export interface YoutubeVideo {
    id: string;
    userId: string;
    slug: string;
    title: string;
    category: string;
    videoUrl: string;
    createdAt: string;
}

interface VideoApiResponse {
    success: boolean;
    message: string;
    results?: number;
    data: YoutubeVideo[] | YoutubeVideo;
}

export interface CreateVideoInput {
    title: string;
    category: string;
    videoUrl: string;
}



const CACHE_TIME = 60_000;

let videosCache: YoutubeVideo[] | null = null;
let cacheTime = 0;
let pendingRequest: Promise<YoutubeVideo[]> | null = null;

export function clearVideosCache() {
    videosCache = null;
    cacheTime = 0;
}

export async function getVideos(force = false): Promise<YoutubeVideo[]> {
    if (!force && videosCache && Date.now() - cacheTime < CACHE_TIME) {
        return videosCache;
    }

    if (!force && pendingRequest) {
        return pendingRequest;
    }

    pendingRequest = (async () => {
        try {
            const response = await api.get<VideoApiResponse>("/api/youtube-video/get");

            const data = response.data.data;

            if (!Array.isArray(data)) {
                throw new Error("Invalid videos API response.");
            }

            videosCache = data;
            cacheTime = Date.now();

            return data;
        } catch (error) {
            throw error;
        } finally {
            pendingRequest = null;
        }
    })();

    return pendingRequest;
}

export async function createVideo(data: CreateVideoInput) {
    try {
        const response = await api.post(
            "/api/youtube-video/create",
            data
        );

        clearVideosCache();
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateVideo(id: string, data: Partial<CreateVideoInput>) {
    try {
        const response = await api.put(
            `/api/youtube-video/update/${id}`,
            data
        );

        clearVideosCache();
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteVideo(id: string) {
    try {
        const response = await api.delete(
            `/api/youtube-video/delete/${id}`
        );

        clearVideosCache();
        return response.data;
    } catch (error) {
        throw error;
    }
}


export async function getPublicYoutubeVideos(force = false): Promise<YoutubeVideo[]> {



    if (!force && pendingRequest) {
        return pendingRequest;
    }

    const request = publicApi
        .get<VideoApiResponse>("/api/youtube-video/get/public")
        .then(({ data }) => {
            if (!data.success || !Array.isArray(data.data)) {
                throw new Error(
                    data.message || "Unable to fetch public videos."
                );
            }

            videosCache = data.data;
            cacheTime = Date.now();

            return data.data;
        })
        .finally(() => {
            if (pendingRequest === request) {
                pendingRequest = null;
            }
        });

    pendingRequest = request;

    return request;
}

