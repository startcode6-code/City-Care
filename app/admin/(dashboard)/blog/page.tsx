
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BlogFormSheet } from "@/components/admin/blog/blog-form";

import {
  Plus,
  Search,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  FileText,
  Globe,
  Clock3,
  Star,
  CalendarDays,
  UserRound,
  Newspaper,
  X,
  ArrowUpRight,
  BookOpen,
  Loader2,
} from "lucide-react";

import {
  getBlogs,
  deleteBlog,
  getCachedBlogs,
  type Blog,
  type BlogStatus,
} from "@/lib/api/blog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PAGE_SIZE = 10;

type StatusFilter = BlogStatus | "ALL";

export default function BlogPage() {
  const router = useRouter();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const [blogs, setBlogs] = useState<Blog[]>(() => getCachedBlogs() ?? []);
  const [loading, setLoading] = useState(() => getCachedBlogs() === null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getBlogs(forceRefresh);
      setBlogs(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to load blogs."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchBlogs();
  }, [fetchBlogs]);

  const filteredBlogs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return blogs.filter((blog) => {
      const matchesSearch =
        !query ||
        blog.title?.toLowerCase().includes(query) ||
        blog.author?.toLowerCase().includes(query) ||
        blog.category?.toLowerCase().includes(query) ||
        blog.slug?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || blog.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [blogs, search, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / PAGE_SIZE)
  );

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const publishedBlogs = blogs.filter(
    (blog) => blog.status === "PUBLISHED"
  ).length;

  const draftBlogs = blogs.filter(
    (blog) => blog.status === "DRAFT"
  ).length;

  const featuredBlogs = blogs.filter(
    (blog) => blog.isFeatured
  ).length;

  const handleAddBlog = () => {
    setSelectedBlog(null);
    setFormOpen(true);
  };

  const handleEditBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormOpen(true);
  };

  const handleViewBlog = (blog: Blog) => {
    router.push(`/admin/blog/${blog.id}`);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;

    try {
      setDeleting(true);
      setError("");

      await deleteBlog(blogToDelete.id);

      setBlogs((previous) =>
        previous.filter((blog) => blog.id !== blogToDelete.id)
      );

      setBlogToDelete(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to delete blog."
      );
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Not published";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: BlogStatus) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Published
          </Badge>
        );

      case "DRAFT":
        return (
          <Badge className="border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
            Draft
          </Badge>
        );

      default:
        return (
          <Badge variant="outline">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-gray-400" />
            Archived
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen space-y-7 p-4 md:p-6 lg:p-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Newspaper className="h-4 w-4" />
            <span>Content Management</span>
            <span>/</span>
            <span className="text-foreground">Blog</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Blog Articles
          </h1>

          <p className="text-sm text-muted-foreground">
            Create, manage and publish hospital news and health articles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => void fetchBlogs(true)}
            disabled={refreshing}
            className="h-10"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button onClick={handleAddBlog} className="h-10">
            <Plus className="mr-2 h-4 w-4" />
            Create Article
          </Button>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          title="Total Articles"
          value={blogs.length}
          description="All articles"
          icon={<FileText className="h-4 w-4" />}
          loading={loading}
        />

        <StatCard
          title="Published"
          value={publishedBlogs}
          description="Live on website"
          icon={<Globe className="h-4 w-4" />}
          loading={loading}
        />

        <StatCard
          title="Drafts"
          value={draftBlogs}
          description="Waiting to publish"
          icon={<Clock3 className="h-4 w-4" />}
          loading={loading}
        />

        <StatCard
          title="Featured"
          value={featuredBlogs}
          description="Highlighted articles"
          icon={<Star className="h-4 w-4" />}
          loading={loading}
        />
      </div>

      {/* MAIN CONTENT */}
      <Card className="overflow-hidden border shadow-sm">

        {/* TOOLBAR */}
        <div className="flex flex-col justify-between gap-4 border-b p-4 md:flex-row md:items-center md:px-5">
          <div>
            <h2 className="font-semibold tracking-tight">
              All Articles
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {filteredBlogs.length} articles found
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative sm:w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search articles..."
                className="h-10 pl-9 pr-9"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-[155px]"
            >
              <option value="ALL">All statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mx-5 mt-4 flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <span>{error}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void fetchBlogs(true)}
            >
              Retry
            </Button>
          </div>
        )}

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                <th className="px-5 py-3.5 font-medium">ARTICLE</th>
                <th className="px-4 py-3.5 font-medium">CATEGORY</th>
                <th className="px-4 py-3.5 font-medium">READ TIME</th>
                <th className="px-4 py-3.5 font-medium">STATUS</th>
                <th className="px-4 py-3.5 font-medium">DATE</th>
                <th className="px-5 py-3.5 text-right font-medium"> </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6} className="px-5 py-5">
                      <div className="h-14 animate-pulse rounded-md bg-muted" />
                    </td>
                  </tr>
                ))
              ) : paginatedBlogs.length > 0 ? (
                paginatedBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    {/* ARTICLE */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleViewBlog(blog)}
                        className="flex max-w-[420px] items-center gap-3 text-left"
                      >
                        <div className="relative h-[58px] w-[82px] shrink-0 overflow-hidden rounded-lg border bg-muted">
                          {blog.imageUrl ? (
                            <Image
                              src={blog.imageUrl}
                              alt={blog.imageAlt || blog.title}
                              fill
                              unoptimized
                              sizes="82px"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Newspaper className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium text-foreground transition-colors group-hover:text-primary">
                            {blog.title}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <UserRound className="h-3 w-3" />
                            {blog.author || "Unknown author"}
                          </p>

                          <p className="mt-1 max-w-[280px] truncate text-xs text-muted-foreground">
                            /{blog.slug}
                          </p>
                        </div>
                      </button>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-4 py-4">
                      <span className="text-sm text-muted-foreground">
                        {blog.category || "—"}
                      </span>
                    </td>

                    {/* READ TIME */}
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" />
                        {blog.readTime || "—"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4">
                      {getStatusBadge(blog.status)}
                    </td>

                    {/* DATE */}
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(blog.publishedAt)}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label={`Actions for ${blog.title}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handleViewBlog(blog)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleEditBlog(blog)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit article
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setBlogToDelete(blog)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete article
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-20 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-4 rounded-xl border bg-muted/40 p-4">
                        <BookOpen className="h-7 w-7 text-muted-foreground" />
                      </div>

                      <h3 className="font-semibold">
                        {search || statusFilter !== "ALL"
                          ? "No articles found"
                          : "No articles created yet"}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {search || statusFilter !== "ALL"
                          ? "Try changing your search or status filter."
                          : "Create your first article to start publishing."}
                      </p>

                      {!search && statusFilter === "ALL" && (
                        <Button
                          className="mt-5"
                          onClick={handleAddBlog}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Article
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading && filteredBlogs.length > 0 && (
          <div className="flex flex-col justify-between gap-3 border-t px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredBlogs.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredBlogs.length}
              </span>{" "}
              articles
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                Previous
              </Button>

              <span className="min-w-16 text-center text-xs tabular-nums text-muted-foreground">
                {currentPage} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ADD / UPDATE DRAWER */}
      <BlogFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        blog={selectedBlog}
        onSuccess={() => {
          void fetchBlogs(true);
        }}
      />

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={!!blogToDelete}
        onOpenChange={(open) => {
          if (!open && !deleting) setBlogToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this article?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{blogToDelete?.title}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
            >
              {deleting ? "Deleting..." : "Delete Article"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  loading,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex items-start justify-between gap-3 p-4 md:p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{title}</p>

          {loading ? (
            <div className="mt-2 h-8 w-12 animate-pulse rounded bg-muted" />
          ) : (
            <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
              {value.toString().padStart(2, "0")}
            </p>
          )}

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="rounded-lg border bg-muted/40 p-2.5 text-muted-foreground">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
