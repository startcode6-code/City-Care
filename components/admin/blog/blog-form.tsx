
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import {
    X,
    Upload,
    FileText,
    ImagePlus,
    BookOpen,
    Search,
    Loader2,
    Plus,
    Tag,
    Settings2,
} from "lucide-react";

import {
    createBlog,
    updateBlog,
    uploadBlogPhoto,
    type Blog,
    type CreateBlogPayload,
} from "@/lib/api/blog";

interface BlogFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    blog?: Blog | null;
    onSuccess?: () => void;
}

const inputClass =
    "w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const initialForm = {
    title: "",
    slug: "",
    category: "",
    author: "",
    readTime: "5 min read",
    imageUrl: "",
    imagePublicId: "",
    imageAlt: "",
    summary: "",
    content: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    isFeatured: false,
};

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function Field({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

export function BlogFormSheet({
    open,
    onOpenChange,
    blog,
    onSuccess,
}: BlogFormSheetProps) {
    const isEdit = Boolean(blog);
    const fileRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState(initialForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [slugManuallyChanged, setSlugManuallyChanged] = useState(false);

    useEffect(() => {
        if (!open) return;

        if (blog) {
            setForm({
                title: blog.title || "",
                slug: blog.slug || "",
                category: blog.category || "",
                author: blog.author || "",
                readTime: blog.readTime || "5 min read",
                imageUrl: blog.imageUrl || "",
                imagePublicId: blog.imagePublicId || "",
                imageAlt: blog.imageAlt || "",
                summary: blog.summary || "",
                content: blog.content || "",
                tags: blog.tags?.join(", ") || "",
                metaTitle: blog.metaTitle || "",
                metaDescription: blog.metaDescription || "",
                metaKeywords: blog.metaKeywords?.join(", ") || "",
                status: blog.status || "DRAFT",
                isFeatured: blog.isFeatured || false,
            });

            setPreview(blog.imageUrl || "");
        } else {
            setForm(initialForm);
            setPreview("");
        }

        setImageFile(null);
        setError("");
        setSlugManuallyChanged(false);
    }, [open, blog]);

    useEffect(() => {
        if (!imageFile) return;

        const url = URL.createObjectURL(imageFile);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    function updateField<K extends keyof typeof initialForm>(
        key: K,
        value: (typeof initialForm)[K]
    ) {
        setForm((previous) => ({ ...previous, [key]: value }));
    }

    function handleTitleChange(value: string) {
        setForm((previous) => ({
            ...previous,
            title: value,
            slug: slugManuallyChanged ? previous.slug : slugify(value),
            metaTitle: previous.metaTitle || value,
        }));
    }

    function handleImage(file?: File) {
        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setError("Only JPG, PNG and WebP images are allowed.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");
            return;
        }

        setError("");
        setImageFile(file);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!form.title.trim()) {
            setError("Please enter blog title.");
            return;
        }

        if (!form.category.trim()) {
            setError("Please enter blog category.");
            return;
        }

        if (!form.author.trim()) {
            setError("Please enter author name.");
            return;
        }

        if (!form.summary.trim()) {
            setError("Please enter blog summary.");
            return;
        }

        if (!form.content.trim()) {
            setError("Please enter blog content.");
            return;
        }

        if (!isEdit && !imageFile) {
            setError("Please upload blog cover image.");
            return;
        }

        try {
            setSaving(true);

            let imageUrl = form.imageUrl || null;
            let imagePublicId = form.imagePublicId || null;

            if (imageFile) {
                const uploadResult: any = await uploadBlogPhoto(imageFile);
                const uploaded = uploadResult?.data ?? uploadResult;

                imageUrl =
                    uploaded?.imageUrl ??
                    uploaded?.photoUrl ??
                    uploaded?.url ??
                    uploaded?.secure_url ??
                    null;

                imagePublicId =
                    uploaded?.imagePublicId ??
                    uploaded?.photoPublicId ??
                    uploaded?.publicId ??
                    uploaded?.public_id ??
                    null;

                if (!imageUrl) {
                    throw new Error("Image upload response does not contain image URL.");
                }
            }

            const payload: CreateBlogPayload = {
                title: form.title.trim(),
                slug: form.slug || slugify(form.title),
                category: form.category.trim(),
                author: form.author.trim(),
                readTime: form.readTime.trim(),
                imageUrl,
                imagePublicId,
                imageAlt: form.imageAlt.trim(),
                summary: form.summary.trim(),
                content: form.content.trim(),
                tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
                metaTitle: form.metaTitle.trim(),
                metaDescription: form.metaDescription.trim(),
                metaKeywords: form.metaKeywords
                    .split(",")
                    .map((keyword) => keyword.trim())
                    .filter(Boolean),
                status: form.status,
                isFeatured: form.isFeatured,
            };

            if (isEdit && blog) {
                await updateBlog(blog.id, payload);
            } else {
                await createBlog(payload);
            }

            onOpenChange(false);
            onSuccess?.();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to save blog. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Overlay */}
            <button
                type="button"
                aria-label="Close blog form"
                onClick={() => onOpenChange(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"
            />

            {/* Drawer */}
            <div className="absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-2xl sm:max-w-[720px]">
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5 sm:px-7">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FileText size={22} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {isEdit ? "Update Blog" : "Add New Blog"}
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Enter the blog post information.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        <X size={21} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6 sm:px-7">

                        {/* Basic information */}
                        <section className="space-y-5">
                            <div className="flex items-center gap-2">
                                <BookOpen size={18} className="text-blue-600" />
                                <h3 className="font-semibold text-gray-900">
                                    Basic Information
                                </h3>
                            </div>

                            <Field label="Blog Cover Image" required={!isEdit}>
                                <div className="flex flex-wrap items-center gap-5">
                                    <div className="relative flex h-32 w-40 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                                        {preview ? (
                                            <Image
                                                src={preview}
                                                alt="Blog cover preview"
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        ) : (
                                            <ImagePlus size={35} className="text-gray-400" />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            className="hidden"
                                            onChange={(e) => handleImage(e.target.files?.[0])}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => fileRef.current?.click()}
                                            className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-medium hover:bg-gray-50"
                                        >
                                            <Upload size={17} />
                                            {preview ? "Change Image" : "Upload Image"}
                                        </button>

                                        <p className="text-xs text-gray-500">
                                            JPG, PNG or WebP. Maximum 5 MB.
                                        </p>

                                        {preview && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setPreview("");
                                                    updateField("imageUrl", "");
                                                    updateField("imagePublicId", "");
                                                    if (fileRef.current) fileRef.current.value = "";
                                                }}
                                                className="text-xs font-medium text-red-500"
                                            >
                                                Remove image
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Field>

                            <Field label="Blog Title" required>
                                <input
                                    className={inputClass}
                                    placeholder="Enter blog title"
                                    value={form.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                />
                            </Field>

                            <Field label="URL Slug" required>
                                <input
                                    className={inputClass}
                                    placeholder="blog-url-slug"
                                    value={form.slug}
                                    onChange={(e) => {
                                        setSlugManuallyChanged(true);
                                        updateField("slug", slugify(e.target.value));
                                    }}
                                />
                                <p className="text-xs text-gray-500">
                                    Generated automatically from blog title.
                                </p>
                            </Field>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Category" required>
                                    <input
                                        className={inputClass}
                                        placeholder="e.g. Healthcare"
                                        value={form.category}
                                        onChange={(e) => updateField("category", e.target.value)}
                                    />
                                </Field>

                                <Field label="Author" required>
                                    <input
                                        className={inputClass}
                                        placeholder="Author name"
                                        value={form.author}
                                        onChange={(e) => updateField("author", e.target.value)}
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Read Time">
                                    <input
                                        className={inputClass}
                                        placeholder="5 min read"
                                        value={form.readTime}
                                        onChange={(e) => updateField("readTime", e.target.value)}
                                    />
                                </Field>

                                <Field label="Image Alt Text">
                                    <input
                                        className={inputClass}
                                        placeholder="Describe the cover image"
                                        value={form.imageAlt}
                                        onChange={(e) => updateField("imageAlt", e.target.value)}
                                    />
                                </Field>
                            </div>

                            <Field label="Short Summary" required>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="Write a short description of this blog..."
                                    value={form.summary}
                                    onChange={(e) => updateField("summary", e.target.value)}
                                />
                            </Field>

                            <Field label="Full Blog Content" required>
                                <textarea
                                    rows={9}
                                    className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="Write your complete blog content here..."
                                    value={form.content}
                                    onChange={(e) => updateField("content", e.target.value)}
                                />
                            </Field>

                            <Field label="Tags">
                                <input
                                    className={inputClass}
                                    placeholder="Healthcare, Health Tips, Prevention"
                                    value={form.tags}
                                    onChange={(e) => updateField("tags", e.target.value)}
                                />
                                <p className="text-xs text-gray-500">
                                    Separate multiple tags using commas.
                                </p>
                            </Field>
                        </section>

                        <div className="border-t border-gray-100" />

                        {/* SEO */}
                        <section className="space-y-5">
                            <div className="flex items-center gap-2">
                                <Search size={18} className="text-blue-600" />
                                <h3 className="font-semibold text-gray-900">
                                    SEO Information
                                </h3>
                            </div>

                            <Field label="Meta Title">
                                <input
                                    className={inputClass}
                                    placeholder="SEO title"
                                    value={form.metaTitle}
                                    onChange={(e) => updateField("metaTitle", e.target.value)}
                                />
                            </Field>

                            <Field label="Meta Description">
                                <textarea
                                    rows={3}
                                    className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="SEO description"
                                    value={form.metaDescription}
                                    onChange={(e) =>
                                        updateField("metaDescription", e.target.value)
                                    }
                                />
                            </Field>

                            <Field label="Meta Keywords">
                                <input
                                    className={inputClass}
                                    placeholder="hospital, healthcare, medical advice"
                                    value={form.metaKeywords}
                                    onChange={(e) =>
                                        updateField("metaKeywords", e.target.value)
                                    }
                                />
                            </Field>
                        </section>

                        <div className="border-t border-gray-100" />

                        {/* Publishing */}
                        <section className="space-y-5">
                            <div className="flex items-center gap-2">
                                <Settings2 size={18} className="text-blue-600" />
                                <h3 className="font-semibold text-gray-900">
                                    Publishing Settings
                                </h3>
                            </div>

                            <Field label="Blog Status">
                                <select
                                    className={inputClass}
                                    value={form.status}
                                    onChange={(e) =>
                                        updateField(
                                            "status",
                                            e.target.value as typeof form.status
                                        )
                                    }
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="PUBLISHED">Published</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </Field>

                            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        Featured Blog
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Highlight this blog on the website.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={form.isFeatured}
                                    onChange={(e) =>
                                        updateField("isFeatured", e.target.checked)
                                    }
                                    className="h-5 w-5 accent-blue-600"
                                />
                            </label>
                        </section>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4 sm:px-7">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => onOpenChange(false)}
                            className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={17} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    {isEdit ? "Update Blog" : "Save Blog"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
