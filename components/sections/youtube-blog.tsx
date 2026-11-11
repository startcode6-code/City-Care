
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, Play, RefreshCw } from "lucide-react";

import { Section, SectionHeading } from "@/components/shared/section";
import {
  getPublicYoutubeVideos,
  type YoutubeVideo,
} from "@/lib/api/youtube-video";

function getYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (
      hostname === "youtube.com" ||
      hostname.endsWith(".youtube.com")
    ) {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v");
      }

      const match = parsedUrl.pathname.match(
        /^\/(?:embed|shorts)\/([^/]+)/
      );

      return match?.[1] ?? null;
    }

    return null;
  } catch {
    return null;
  }
}

function getYouTubeThumbnail(url: string): string {
  const videoId = getYouTubeVideoId(url);

  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "/images/video-placeholder.jpg";
}

export function YoutubeBlog() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVideos = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPublicYoutubeVideos(forceRefresh);
      setVideos(data);
    } catch (error: unknown) {
      console.error("Public YouTube videos error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load videos. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchVideos() {
      try {
        const data = await getPublicYoutubeVideos();

        if (active) {
          setVideos(data);
          setError(null);
        }
      } catch (error: unknown) {
        console.error("Public YouTube videos error:", error);

        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load videos."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchVideos();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Section>
      <SectionHeading
        title="Health Tips & Videos"
        intro="Watch expert health advice, preventive care tips, and useful guidance from our medical team."
        href="https://www.youtube.com/"
        hrefLabel="Visit our YouTube"
      />

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="aspect-video animate-pulse bg-muted" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-28 animate-pulse rounded bg-muted" />
                <div className="h-6 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-destructive/20 bg-card px-6 py-12 text-center">
          <p className="font-semibold text-foreground">
            Unable to load videos
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void loadVideos(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center">
          <p className="font-semibold text-foreground">
            No videos available
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Health videos will appear here when they are published.
          </p>
        </div>
      )}

      {!loading && !error && videos.length > 0 && (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => {
            const thumbnail = getYouTubeThumbnail(video.videoUrl);

            return (
              <li key={video.id} className="group min-w-0">
                <article className="h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <Link
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Watch ${video.title} on YouTube`}
                    className="block"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <Image
                        src={thumbnail}
                        alt={video.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/35">
                        <span className="flex size-14 items-center justify-center rounded-full bg-white/95 text-red-600 shadow-lg transition-transform group-hover:scale-110">
                          <Play className="ml-1 size-7 fill-current" />
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {video.category}
                    </span>

                    <h3 className="mt-3 line-clamp-2 min-h-14 text-lg font-bold leading-7 tracking-tight text-foreground">
                      {video.title}
                    </h3>

                    <Link
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:opacity-80"
                    >
                      Watch video
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
