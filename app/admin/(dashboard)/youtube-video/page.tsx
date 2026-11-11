
"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type FormEvent,
} from "react";


import {
    Plus,
    Search,
    Pencil,
    Trash2,
    ExternalLink,
    Loader2,
    Video,
    X,
    RefreshCw,
    AlertCircle,
    Play,
    ChevronLeft,
    ChevronRight,
    PlayCircle
} from "lucide-react";


import {
    getVideos,
    createVideo,
    updateVideo,
    deleteVideo,
    type YoutubeVideo,
    type CreateVideoInput,
} from "@/lib/api/youtube-video";

const PAGE_SIZE = 10;

const EMPTY_FORM: CreateVideoInput = {
    title: "",
    category: "",
    videoUrl: "",
};

function getErrorMessage(error: unknown) {
    const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
    };

    return (
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again."
    );
}

function getYoutubeId(url: string) {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^www\./, "");

        if (host === "youtu.be") {
            return parsed.pathname.split("/").filter(Boolean)[0] || null;
        }

        if (
            host === "youtube.com" ||
            host === "m.youtube.com" ||
            host === "youtube-nocookie.com"
        ) {
            if (parsed.pathname === "/watch") {
                return parsed.searchParams.get("v");
            }

            const parts = parsed.pathname.split("/").filter(Boolean);

            if (["embed", "shorts", "live"].includes(parts[0])) {
                return parts[1] || null;
            }
        }

        return null;
    } catch {
        return null;
    }
}

function getThumbnail(url: string) {
    const id = getYoutubeId(url);

    return id
        ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
        : null;
}

function isValidYoutubeUrl(url: string) {
    return Boolean(getYoutubeId(url));
}

export default function VideosPage() {
    const [videos, setVideos] = useState<YoutubeVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] =
        useState<YoutubeVideo | null>(null);

    const [form, setForm] = useState<CreateVideoInput>(EMPTY_FORM);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchVideos = useCallback(async (force = false) => {
        try {
            setError("");

            if (force) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await getVideos(force);
            setVideos(data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void fetchVideos();
    }, [fetchVideos]);

    const filteredVideos = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return videos;

        return videos.filter((video) =>
            [video.title, video.category, video.slug]
                .some((value) => value.toLowerCase().includes(query))
        );
    }, [videos, search]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredVideos.length / PAGE_SIZE)
    );

    const currentPage = Math.min(page, totalPages);

    const paginatedVideos = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;

        return filteredVideos.slice(start, start + PAGE_SIZE);
    }, [filteredVideos, currentPage]);

    function openAddModal() {
        setEditingVideo(null);
        setForm(EMPTY_FORM);
        setFormError("");
        setModalOpen(true);
    }

    function openEditModal(video: YoutubeVideo) {
        setEditingVideo(video);

        setForm({
            title: video.title,
            category: video.category,
            videoUrl: video.videoUrl,
        });

        setFormError("");
        setModalOpen(true);
    }

    function closeModal() {
        if (saving) return;

        setModalOpen(false);
        setEditingVideo(null);
        setForm(EMPTY_FORM);
        setFormError("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormError("");

        const payload = {
            title: form.title.trim(),
            category: form.category.trim(),
            videoUrl: form.videoUrl.trim(),
        };

        if (!payload.title || !payload.category || !payload.videoUrl) {
            setFormError("Please fill in all fields.");
            return;
        }

        if (!isValidYoutubeUrl(payload.videoUrl)) {
            setFormError("Please enter a valid YouTube video URL.");
            return;
        }

        try {
            setSaving(true);

            if (editingVideo) {
                await updateVideo(editingVideo.id, payload);
            } else {
                await createVideo(payload);
            }

            setModalOpen(false);
            setEditingVideo(null);
            setForm(EMPTY_FORM);

            await fetchVideos(true);
        } catch (err) {
            setFormError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deletingId) return;

        try {
            setDeleteLoading(true);

            await deleteVideo(deletingId);

            setDeletingId(null);
            await fetchVideos(true);
        } catch (err) {
            setError(getErrorMessage(err));
            setDeletingId(null);
        } finally {
            setDeleteLoading(false);
        }
    }

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-red-50 p-2.5 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                            <PlayCircle size={23} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                YouTube Videos
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Manage your hospital's video library.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => void fetchVideos(true)}
                        disabled={refreshing || loading}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                        <Plus size={17} />
                        Add Video
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Total Videos</p>
                        <Video size={19} className="text-muted-foreground" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-foreground">
                        {videos.length}
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Categories</p>
                        <PlayCircle size={19} className="text-muted-foreground" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-foreground">
                        {new Set(videos.map((video) => video.category)).size}
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Search Results</p>
                        <Search size={19} className="text-muted-foreground" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-foreground">
                        {filteredVideos.length}
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    <AlertCircle size={19} className="mt-0.5 shrink-0" />
                    <div className="flex-1">{error}</div>
                    <button
                        type="button"
                        onClick={() => void fetchVideos(true)}
                        className="font-semibold underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-semibold text-foreground">
                            Video Library
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            All your uploaded YouTube videos
                        </p>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setPage(1);
                            }}
                            placeholder="Search videos..."
                            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-9 text-sm outline-none transition focus:border-primary"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                aria-label="Clear search"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4 p-5">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex animate-pulse items-center gap-4"
                            >
                                <div className="h-16 w-28 rounded-lg bg-muted" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-2/3 rounded bg-muted" />
                                    <div className="h-3 w-1/3 rounded bg-muted" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : paginatedVideos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                        <div className="mb-4 rounded-2xl bg-muted p-4">
                            <Video size={30} className="text-muted-foreground" />
                        </div>

                        <h3 className="font-semibold text-foreground">
                            {search ? "No videos found" : "No videos yet"}
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            {search
                                ? "Try searching with another title or category."
                                : "Start building your video library by adding your first YouTube video."}
                        </p>

                        {!search && (
                            <button
                                type="button"
                                onClick={openAddModal}
                                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                            >
                                <Plus size={16} />
                                Add First Video
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left">
                                <thead className="bg-muted/40">
                                    <tr className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        <th className="px-5 py-4">Video</th>
                                        <th className="px-5 py-4">Category</th>
                                        <th className="px-5 py-4">Date Added</th>
                                        <th className="px-5 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {paginatedVideos.map((video) => {
                                        const thumbnail = getThumbnail(video.videoUrl);

                                        return (
                                            <tr
                                                key={video.id}
                                                className="transition hover:bg-muted/30"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <a
                                                            href={video.videoUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group relative h-[68px] w-28 shrink-0 overflow-hidden rounded-lg bg-muted"
                                                        >
                                                            {thumbnail ? (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img
                                                                    src={thumbnail}
                                                                    alt={video.title}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full items-center justify-center">
                                                                    <PlayCircle size={25} />
                                                                </div>
                                                            )}

                                                            <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                                                                <Play
                                                                    size={23}
                                                                    fill="white"
                                                                    className="text-white"
                                                                />
                                                            </span>
                                                        </a>

                                                        <div className="min-w-0">
                                                            <p className="max-w-sm truncate text-sm font-semibold text-foreground">
                                                                {video.title}
                                                            </p>
                                                            <a
                                                                href={video.videoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                                                            >
                                                                Watch on YouTube
                                                                <ExternalLink size={12} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="inline-flex rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground">
                                                        {video.category}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-sm text-muted-foreground">
                                                    {new Date(video.createdAt).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(video)}
                                                            title="Edit video"
                                                            className="rounded-lg border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => setDeletingId(video.id)}
                                                            title="Delete video"
                                                            className="rounded-lg border border-border p-2 text-muted-foreground transition hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-muted-foreground">
                                Showing{" "}
                                {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                                {Math.min(currentPage * PAGE_SIZE, filteredVideos.length)}{" "}
                                of {filteredVideos.length} videos
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={() => setPage((value) => value - 1)}
                                    className="rounded-lg border border-border p-2 disabled:opacity-40"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={17} />
                                </button>

                                <span className="px-2 text-sm text-foreground">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setPage((value) => value + 1)}
                                    className="rounded-lg border border-border p-2 disabled:opacity-40"
                                    aria-label="Next page"
                                >
                                    <ChevronRight size={17} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Add / Edit Modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeModal();
                    }}
                >
                    <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
                        <div className="flex items-center justify-between border-b border-border p-5">
                            <div>
                                <h2 className="text-lg font-bold text-foreground">
                                    {editingVideo ? "Update Video" : "Add New Video"}
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Enter your YouTube video details below.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                                aria-label="Close modal"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 p-5">
                            {formError && (
                                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                                    {formError}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Video Title
                                </label>
                                <input
                                    value={form.title}
                                    onChange={(event) =>
                                        setForm((previous) => ({
                                            ...previous,
                                            title: event.target.value,
                                        }))
                                    }
                                    placeholder="Enter video title"
                                    maxLength={200}
                                    required
                                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Category
                                </label>
                                <input
                                    value={form.category}
                                    onChange={(event) =>
                                        setForm((previous) => ({
                                            ...previous,
                                            category: event.target.value,
                                        }))
                                    }
                                    placeholder="e.g. Preventive Care"
                                    maxLength={100}
                                    required
                                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    YouTube Video URL
                                </label>
                                <input
                                    type="url"
                                    value={form.videoUrl}
                                    onChange={(event) =>
                                        setForm((previous) => ({
                                            ...previous,
                                            videoUrl: event.target.value,
                                        }))
                                    }
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    required
                                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                                />

                                {form.videoUrl && getThumbnail(form.videoUrl) && (
                                    <div className="overflow-hidden rounded-lg border border-border">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={getThumbnail(form.videoUrl)!}
                                            alt="YouTube video preview"
                                            className="aspect-video w-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 border-t border-border pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                                >
                                    {saving && <Loader2 size={16} className="animate-spin" />}
                                    {saving
                                        ? "Saving..."
                                        : editingVideo
                                            ? "Update Video"
                                            : "Add Video"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <Trash2 size={22} />
                        </div>

                        <h2 className="text-lg font-bold text-foreground">
                            Delete this video?
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            This action cannot be undone. The video record will be
                            permanently deleted.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeletingId(null)}
                                disabled={deleteLoading}
                                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() => void handleDelete()}
                                disabled={deleteLoading}
                                className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                            >
                                {deleteLoading && (
                                    <Loader2 size={15} className="animate-spin" />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
