
import { MapPin, Phone, Navigation, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/shared/section";
import { site } from "@/lib/site";

export function LocationMap() {
  const q = encodeURIComponent(site.address);

  const mapUrl = `https://www.google.com/maps?q=${q}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

  return (
    <Section tone="card">
      <SectionHeading title="Hospital Location & Map" />

      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Google Map */}
        <div className="relative min-w-0 overflow-hidden rounded-2xl border bg-muted shadow-sm">
          <iframe
            title={`Map showing ${site.name}`}
            src={mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[360px] w-full sm:h-[440px] lg:h-[500px]"
          />

          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-background px-4 py-3 text-sm font-semibold shadow-lg transition-colors hover:bg-muted"
          >
            <Navigation className="size-4 text-primary" />
            Open Directions
            <ArrowUpRight className="size-4" />
          </a>
        </div>

        {/* Right: Hospital Details */}

        <div className="flex flex-col items-start py-2 lg:py-4">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <MapPin className="size-3.5" />
            Visit Our Hospital
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            {site.name}
          </h2>

          <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted-foreground sm:text-base">
            <MapPin className="mt-1 size-4 shrink-0 text-primary" />
            <span>{site.address}</span>
          </p>

          <a
            href={site.phoneHref}
            className="mt-3 inline-flex items-center gap-2 text-base font-medium transition-colors hover:text-primary"
          >
            <Phone className="size-4 text-primary" />
            <span>
              <span className="font-semibold">Phone: </span>
              {site.phone}
            </span>
          </a>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/appointment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md"
            >
              Book Appointment
              <ArrowUpRight className="size-4" />
            </Link>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              Get Directions
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            We look forward to welcoming you to City Care Hospital.
          </p>
        </div>
      </div>
    </Section>
  );
}
