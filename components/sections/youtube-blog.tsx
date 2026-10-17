import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";

const videos = [
  {
    title: "5 Important Health Checkups You Should Never Ignore",
    category: "Preventive Care",
    duration: "08:24",
    videoUrl: "https://www.youtube.com/watch?v=9zDNctfxD-0",
  },
  {
    title: "Early Signs of Heart Problems You Should Know",
    category: "Heart Health",
    duration: "06:15",
    videoUrl: "https://www.youtube.com/watch?v=Ki6mHHqpkLg",
  },
  {
    title: "Simple Daily Habits for a Healthier Life",
    category: "Healthy Lifestyle",
    duration: "05:42",
    videoUrl: "https://www.youtube.com/watch?v=Hig2maqDiCI",
  },
];

function getYouTubeVideoId(url: string) {
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

function getYouTubeThumbnail(url: string) {
  const videoId = getYouTubeVideoId(url);

  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "/images/video-placeholder.jpg";
}

export function YoutubeBlog() {
  return (
    <Section>
      <SectionHeading
        title="Health Tips & Videos"
        intro="Watch expert health advice, preventive care tips, and useful guidance from our medical team."
        href="https://www.youtube.com/"
        hrefLabel="Visit our YouTube"
      />

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => {
          const videoId = getYouTubeVideoId(video.videoUrl);
          const thumbnail = getYouTubeThumbnail(video.videoUrl);

          return (
            <li
              key={video.videoUrl + video.title}
              className="group min-w-0"
            >
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

                    <span className="absolute bottom-3 right-3 rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-white">
                      {video.duration}
                    </span>
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
    </Section>
  );
}