import { Navigation } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";
import { site } from "@/lib/site";

export function LocationMap() {
  const q = encodeURIComponent(site.address);
  return (
    <Section tone="card">
      <SectionHeading title="Hospital Location & Map" />
      <div className="overflow-hidden rounded-xl border">
        <iframe
          title={`Map showing ${site.name}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-80 w-full bg-muted sm:h-96"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-card p-4">
          <div>
            <p className="font-bold">{site.name}</p>
            <p className="text-sm text-muted-foreground">{site.address}</p>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            <Navigation className="size-4" aria-hidden />
            Get directions
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </Section>
  );
}
