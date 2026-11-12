
import { api, publicApi } from "@/lib/api/client";
import axios from "axios";

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Blog {
    id: string;
    userId: string;
    slug: string;
    title: string;
    category: string;
    author: string;
    imageUrl: string | null;
    imagePublicId: string | null;
    imageAlt: string | null;
    readTime: string | null;
    summary: string;
    content: string;
    tags: string[];
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string[];
    status: BlogStatus;
    isFeatured: boolean;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

interface BlogResponse {
    success: boolean;
    message?: string;
    results?: number;
    data:
    | Blog[]
    | Blog
    | {
        blogs?: Blog[];
        items?: Blog[];
        total?: number;
    };
}

export interface CreateBlogPayload {
    title: string;
    slug?: string;
    category: string;
    author: string;
    imageUrl: string | null;
    imagePublicId: string | null;
    imageAlt?: string | null;
    readTime: string | null;
    summary: string;
    content: string;
    tags?: string[];
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string[];
    status: BlogStatus;
    isFeatured: boolean;
}

export interface UploadBlogPhotoResponse {
    imageUrl: string;
    imagePublicId: string;
}

let cachedBlogs: Blog[] | null = null;
let blogsPromise: Promise<Blog[]> | null = null;

export function getCachedBlogs() {
    return cachedBlogs;
}

function normalizeBlogs(data: BlogResponse["data"]): Blog[] {
    if (Array.isArray(data)) return data;

    if (data && typeof data === "object") {
        if ("blogs" in data && Array.isArray(data.blogs)) {
            return data.blogs;
        }

        if ("items" in data && Array.isArray(data.items)) {
            return data.items;
        }
    }

    return [];
}

// ADMIN: GET ALL BLOGS
export async function getBlogs(forceRefresh = false): Promise<Blog[]> {
    if (!forceRefresh && cachedBlogs !== null) {
        return cachedBlogs;
    }

    if (!forceRefresh && blogsPromise) {
        return blogsPromise;
    }

    blogsPromise = api
        .get<BlogResponse>("/api/blog/get-blog")
        .then((response) => {
            if (!response.data?.success) {
                throw new Error(
                    response.data?.message || "Failed to fetch blogs."
                );
            }

            const blogs = normalizeBlogs(response.data.data);
            cachedBlogs = blogs;
            return blogs;
        })
        .finally(() => {
            blogsPromise = null;
        });

    return blogsPromise;
}

export function clearBlogsCache() {
    cachedBlogs = null;
    blogsPromise = null;
}

// UPLOAD BLOG IMAGE
export async function uploadBlogPhoto(photo: File
): Promise<UploadBlogPhotoResponse> {
    const formData = new FormData();
    formData.append("photo", photo);

    try {
        const response = await api.post("/api/blog/upload-photo", formData,
            {
                headers: {
                    "Content-Type": undefined
                }
            }
        );

        const result = response.data?.data ?? response.data;

        if (!result?.imageUrl || !result?.imagePublicId) {
            throw new Error("Invalid blog image upload response.");
        }

        return {
            imageUrl: result.imageUrl,
            imagePublicId: result.imagePublicId,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("BLOG PHOTO UPLOAD FAILED:", {
                status: error.response?.status,
                message: error.response?.data,
            });
        }

        throw error;
    }
}

// CREATE BLOG
export async function createBlog(data: CreateBlogPayload) {
    const response = await api.post("/api/blog/create", data);
    clearBlogsCache();
    return response.data;
}

// UPDATE BLOG
export async function updateBlog(
    id: string,
    data: Partial<CreateBlogPayload>
) {
    const response = await api.patch(`/api/blog/update/${id}`, data);
    clearBlogsCache();
    return response.data;
}

// DELETE BLOG
export async function deleteBlog(id: string) {
    const response = await api.delete(`/api/blog/delete/${id}`);
    clearBlogsCache();
    return response.data;
}

// UPDATE EXISTING BLOG IMAGE
export async function updateBlogPhoto(id: string, file: File) {
    const formData = new FormData();
    formData.append("photo", file, file.name);

    const response = await api.patch(
        `/api/blog/update-photo/${id}`,
        formData
    );

    clearBlogsCache();
    return response.data;
}

// PUBLIC: GET BLOGS
export async function getPublicBlogs(): Promise<Blog[]> {
    const response = await publicApi.get<BlogResponse>("/api/blog/public");

    if (!response.data?.success) {
        throw new Error(
            response.data?.message || "Failed to fetch public blogs."
        );
    }

    return normalizeBlogs(response.data.data);
}
