"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/shared/section";
import { blogPosts } from "@/lib/data";

export function Blog() {
  const [currentPage, setCurrentPage] = useState(0);

  const cardsPerPage = 3;

  // Blog posts ko 3-3 ke groups me divide karenge
  const pages = [];

  for (let i = 0; i < blogPosts.length; i += cardsPerPage) {
    pages.push(blogPosts.slice(i, i + cardsPerPage));
  }

  const totalPages = pages.length;

  // Auto slide
  useEffect(() => {
    if (totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) =>
        prev === totalPages - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [totalPages]);

  const nextPage = () => {
    setCurrentPage((prev) =>
      prev === totalPages - 1 ? 0 : prev + 1
    );
  };

  const previousPage = () => {
    setCurrentPage((prev) =>
      prev === 0 ? totalPages - 1 : prev - 1
    );
  };

  return (
    <Section tone="background"
     className="bg-muted"
    >
      {/* Heading + Navigation */}
      <div className="flex items-center justify-between">
        <SectionHeading title="Latest Health & Medical Insights" />

        <div className="flex gap-2">
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
      </div>

      {/* Carousel */}
      <div className="mt-6 overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentPage * 100}%)`,
          }}
        >
          {pages.map((page, pageIndex) => (
            <div
              key={pageIndex}
              className="min-w-full"
            >
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {page.map((post) => (
                  <li key={post.slug} className="flex">
                    <Card className="w-full overflow-hidden bg-background">
                      <Image
                        src="/images/blog_images.png"
                        alt={post.title}
                        width={600}
                        height={400}
                        className="aspect-[16/10] w-full object-cover"
                      />

                      <CardContent className="flex flex-col p-5">
                        <span className="text-sm font-medium text-primary">
                          {post.category}
                        </span>

                        <h3 className="mt-2 text-xl font-semibold tracking-tight">
                          {post.title}
                        </h3>

                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {post.summary}
                        </p>

                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{post.publishedAt}</span>
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
              className={`h-2 rounded-full transition-all ${
                currentPage === index
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
              aria-label={`Go to blog page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </Section>
  );
}