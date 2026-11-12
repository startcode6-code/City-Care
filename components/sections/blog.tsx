
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/shared/section";
import { getPublicBlogs, type Blog as BlogType } from "@/lib/api/blog";

export function Blog() {
  const [currentPage, setCurrentPage] = useState(0);
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cardsPerPage = 3;

  const fetchBlogs = useCallback(async () => {
    try {
      setError("");

      const response = await getPublicBlogs();

      // Only published blogs should be visible publicly.
      const publishedBlogs = response.filter(
        (blog) => blog.status === "PUBLISHED"
      );

      setBlogs(publishedBlogs);
    } catch (err) {
      console.error("PUBLIC BLOG FETCH ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load latest articles."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBlogs();
  }, [fetchBlogs]);

  // Divide blogs into groups of three.
  const pages: BlogType[][] = [];

  for (let i = 0; i < blogs.length; i += cardsPerPage) {
    pages.push(blogs.slice(i, i + cardsPerPage));
  }

  const totalPages = pages.length;

  useEffect(() => {
    if (totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((previous) =>
        previous >= totalPages - 1 ? 0 : previous + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [totalPages]);

  const nextPage = () => {
    setCurrentPage((previous) =>
      previous >= totalPages - 1 ? 0 : previous + 1
    );
  };

  const previousPage = () => {
    setCurrentPage((previous) =>
      previous <= 0 ? totalPages - 1 : previous - 1
    );
  };

  const formatDate = (date: string | null) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Section tone="background" className="bg-muted">
      {/* Heading + Navigation */}
      <div className="flex items-center justify-between gap-4">
        <SectionHeading title="Latest Health & Medical Insights" />

        {!loading && totalPages > 1 && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={previousPage}
              className="flex size-10 items-center justify-center rounded-full border bg-background transition hover:bg-muted"
              aria-label="Previous blogs"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={nextPage}
              className="flex size-10 items-center justify-center rounded-full border bg-background transition hover:bg-muted"
              aria-label="Next blogs"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden bg-background">
              <div className="aspect-[16/10] animate-pulse bg-muted" />
              <CardContent className="space-y-3 p-5">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-6 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-8 rounded-xl border bg-background p-8 text-center">
          <Newspaper className="mx-auto mb-3 size-8 text-muted-foreground" />
          <p className="font-medium">Unable to load articles</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void fetchBlogs();
            }}
            className="mt-4 text-sm font-semibold text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && blogs.length === 0 && (
        <div className="mt-8 rounded-xl border bg-background p-10 text-center">
          <Newspaper className="mx-auto mb-3 size-9 text-muted-foreground" />
          <h3 className="font-semibold">No articles available</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest health and medical articles will appear here.
          </p>
        </div>
      )}

      {/* Carousel */}
      {!loading && !error && blogs.length > 0 && (
        <>
          <div className="mt-6 overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentPage * 100}%)`,
              }}
            >
              {pages.map((page, pageIndex) => (
                <div key={pageIndex} className="min-w-full">
                  <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {page.map((post) => (
                      <li key={post.id} className="flex">
                        <Card className="w-full overflow-hidden bg-background">
                          <Link
                            href={`/blog/${post.slug}`}
                            aria-label={`Read ${post.title}`}
                            className="block overflow-hidden"
                          >
                            <div className="relative aspect-[16/10] w-full bg-muted">
                              {post.imageUrl ? (
                                <Image
                                  src={post.imageUrl}
                                  alt={post.imageAlt || post.title}
                                  fill
                                  unoptimized
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  className="object-cover transition-transform duration-500 hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Newspaper className="size-10 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </Link>

                          <CardContent className="flex flex-col p-5">
                            <span className="text-sm font-medium text-primary">
                              {post.category}
                            </span>

                            <h3 className="mt-2 line-clamp-2 text-xl font-semibold tracking-tight">
                              {post.title}
                            </h3>

                            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                              {post.summary}
                            </p>

                            <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                              <span>
                                {formatDate(post.publishedAt)}
                              </span>
                              <span>{post.readTime}</span>
                            </div>

                            <Link
                              href={`/blog/${post.slug}`}
                              className="mt-5 text-sm font-semibold text-primary hover:underline"
                            >
                              Read More →
                            </Link>
                          </CardContent>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {pages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentPage(index)}
                  className={`h-2 rounded-full transition-all ${currentPage === index
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                    }`}
                  aria-label={`Go to blog page ${index + 1}`}
                  aria-current={currentPage === index ? "true" : undefined}
                />
              ))}
            </div>
          )}
        </>
      )}
    </Section>
  );
}
