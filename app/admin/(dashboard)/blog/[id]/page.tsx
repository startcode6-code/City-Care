
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Pencil,
    CalendarDays,
    Clock,
    UserRound,
    Tag,
    Star,
    Globe,
    FileText,
    Link2,
    Search,
    Loader2,
    AlertCircle,
    Newspaper,
} from "lucide-react";

import { getBlogs, type Blog } from "@/lib/api/blog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlogDetailsPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBlog = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const blogs = await getBlogs();
            const foundBlog = blogs.find((item) => item.id === params.id);

            if (!foundBlog) {
                setError("Blog article not found.");
                return;
            }

            setBlog(foundBlog);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to load blog details."
            );
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        void fetchBlog();
    }, [fetchBlog]);

    const formatDate = (date: string | null) => {
        if (!date) return "Not published";

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) return "—";

        return parsed.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const getStatus = () => {
        if (!blog) return null;

        if (blog.status === "PUBLISHED") {
            return (
                <Badge className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10">
                    <Globe className="mr-1 h-3 w-3" />
                    Published
                </Badge>
            );
        }

        if (blog.status === "DRAFT") {
            return (
                <Badge className="border border-amber-500/20 bg-amber-500/10 text-amber-700 hover:bg-amber-500/10">
                    Draft
                </Badge>
            );
        }

        return <Badge variant="outline">Archived</Badge>;
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Loading article details...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center p-5">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center p-8 text-center">
                        <div className="mb-4 rounded-full bg-destructive/10 p-4">
                            <AlertCircle className="h-7 w-7 text-destructive" />
                        </div>

                        <h2 className="text-lg font-semibold">
                            Unable to load article
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {error || "The requested blog could not be found."}
                        </p>

                        <div className="mt-6 flex gap-2">
                            <Button variant="outline" onClick={() => router.back()}>
                                Go Back
                            </Button>
                            <Button onClick={() => void fetchBlog()}>
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen space-y-6 p-4 md:p-6 lg:p-8">

            {/* Top navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                    variant="outline"
                    onClick={() => router.push("/admin/blog")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blogs
                </Button>

                <Button
                    onClick={() => router.push(`/admin/blog/${blog.id}/edit`)}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Article
                </Button>
            </div>

            {/* Page heading */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Newspaper className="h-4 w-4" />
                    <span>Blog Management</span>
                    <span>/</span>
                    <span className="text-foreground">Article Details</span>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    Article Details
                </h1>

                <p className="text-sm text-muted-foreground">
                    View complete information and publication details of this article.
                </p>
            </div>

            {/* Main article */}
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">

                <div className="min-w-0 space-y-6">

                    {/* Cover image */}
                    <Card className="overflow-hidden">
                        <div className="relative aspect-[16/8] w-full bg-muted">
                            {blog.imageUrl ? (
                                <Image
                                    src={blog.imageUrl}
                                    alt={blog.imageAlt || blog.title}
                                    fill
                                    unoptimized
                                    priority
                                    sizes="(max-width: 1280px) 100vw, 75vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <Newspaper className="h-16 w-16 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        <CardContent className="space-y-5 p-5 md:p-7">

                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                {getStatus()}

                                <Badge variant="outline">
                                    <Tag className="mr-1 h-3 w-3" />
                                    {blog.category}
                                </Badge>

                                {blog.isFeatured && (
                                    <Badge className="border border-amber-500/20 bg-amber-500/10 text-amber-700 hover:bg-amber-500/10">
                                        <Star className="mr-1 h-3 w-3" />
                                        Featured Article
                                    </Badge>
                                )}
                            </div>

                            {/* Title */}
                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                                    {blog.title}
                                </h2>

                                <p className="text-sm leading-7 text-muted-foreground">
                                    {blog.summary}
                                </p>
                            </div>

                            {/* Author information */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y py-4">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-muted p-2">
                                        <UserRound className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Author</p>
                                        <p className="text-sm font-medium">
                                            {blog.author || "Unknown author"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-muted p-2">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Reading time</p>
                                        <p className="text-sm font-medium">
                                            {blog.readTime || "—"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-muted p-2">
                                        <CalendarDays className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Published</p>
                                        <p className="text-sm font-medium">
                                            {formatDate(blog.publishedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Article content */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold">Article Content</h3>
                                </div>

                                <div className="rounded-xl border bg-card p-5 md:p-7">
                                    <div className="whitespace-pre-wrap break-words text-sm leading-8 text-muted-foreground">
                                        {blog.content || "No article content available."}
                                    </div>
                                </div>
                            </section>

                            {/* Tags */}
                            {blog.tags?.length > 0 && (
                                <section className="space-y-3">
                                    <h3 className="text-base font-semibold">Article Tags</h3>

                                    <div className="flex flex-wrap gap-2">
                                        {blog.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="px-3 py-1">
                                                <Tag className="mr-1.5 h-3 w-3" />
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right sidebar */}
                <aside className="space-y-5">

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Article Information
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <InfoItem label="Article ID" value={blog.id} />
                            <InfoItem label="Category" value={blog.category} />
                            <InfoItem label="Author" value={blog.author} />
                            <InfoItem label="Read Time" value={blog.readTime} />
                            <InfoItem label="URL Slug" value={`/${blog.slug}`} />
                            <InfoItem
                                label="Published Date"
                                value={formatDate(blog.publishedAt)}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Search className="h-4 w-4 text-primary" />
                                SEO Information
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <InfoItem
                                label="Meta Title"
                                value={blog.metaTitle || "Not provided"}
                            />

                            <InfoItem
                                label="Meta Description"
                                value={blog.metaDescription || "Not provided"}
                            />

                            <div className="space-y-2">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Meta Keywords
                                </p>

                                <div className="flex flex-wrap gap-1.5">
                                    {blog.metaKeywords?.length ? (
                                        blog.metaKeywords.map((keyword) => (
                                            <Badge key={keyword} variant="outline">
                                                {keyword}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-muted-foreground">
                                            Not provided
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Publishing Status
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                {getStatus()}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Featured</span>
                                <span className="text-sm font-medium">
                                    {blog.isFeatured ? "Yes" : "No"}
                                </span>
                            </div>

                            <Button
                                className="w-full"
                                onClick={() => router.push(`/admin/blog/${blog.id}/edit`)}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit This Article
                            </Button>
                        </CardContent>
                    </Card>

                </aside>
            </div>
        </div>
    );
}

function InfoItem({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <div className="space-y-1 border-b pb-3 last:border-0 last:pb-0">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="break-words text-sm font-medium">
                {value || "—"}
            </p>
        </div>
    );
}
