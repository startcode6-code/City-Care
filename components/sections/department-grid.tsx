
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowRight,
  Check,
  RefreshCw,
  Stethoscope,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { IconBadge } from "@/components/shared/icon-badge";
import {
  Section,
  SectionHeading,
} from "@/components/shared/section";

import { getDepartmentIcon } from "@/lib/icons";

import {
  getPublicServices,
  type Service,
} from "@/lib/api/service";

export function DepartmentGrid({
  tone = "card",
}: {
  tone?: "background" | "card";
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch public services
  useEffect(() => {
    let isMounted = true;

    async function fetchServices() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPublicServices();

        if (isMounted) {
          setServices(data);
        }
      } catch (err) {
        console.error("Public Services Error:", err);

        if (isMounted) {
          setError(
            "Unable to load hospital services. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  return (
    <Section
      tone={tone}
      className="bg-muted"
    >
      <SectionHeading
        title="Our Services"
        intro="Explore our specialist departments, available services, and care options."
        href="#/service"
      />

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="overflow-hidden rounded-2xl border-border/60 p-0"
            >
              <div className="h-48 animate-pulse bg-muted-foreground/10" />

              <div className="space-y-4 p-6">
                <div className="h-6 w-2/3 animate-pulse rounded bg-muted-foreground/10" />

                <div className="h-4 w-full animate-pulse rounded bg-muted-foreground/10" />

                <div className="h-4 w-4/5 animate-pulse rounded bg-muted-foreground/10" />

                <div className="space-y-3 pt-3">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted-foreground/10" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted-foreground/10" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted-foreground/10" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <Stethoscope className="size-7 text-destructive" />
          </div>

          <h3 className="mt-5 text-lg font-bold">
            Services unavailable
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setRetryCount((prev) => prev + 1)}
            className="
                            mt-6 inline-flex items-center gap-2
                            rounded-full bg-primary px-5 py-2.5
                            text-sm font-semibold
                            text-primary-foreground
                            transition-colors hover:bg-primary/90
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-ring
                            focus-visible:ring-offset-2
                        "
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && services.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-background px-6 py-16 text-center">
          <Stethoscope className="mx-auto size-12 text-muted-foreground/50" />

          <h3 className="mt-4 text-lg font-bold">
            No services available
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Our hospital services will be updated soon.
          </p>
        </div>
      )}

      {/* Services Grid */}
      {!loading && !error && services.length > 0 && (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((d) => {
            const Icon = getDepartmentIcon(d.slug);

            const serviceItems = Array.isArray(d.service)
              ? d.service
              : [];

            return (
              <li key={d.id} className="flex">
                <Dialog>
                  <Card
                    className="
                                            group relative flex w-full flex-col
                                            overflow-hidden rounded-2xl
                                            border-border/60 bg-background
                                            p-0 shadow-sm
                                            transition-all duration-300
                                            hover:-translate-y-1
                                            hover:border-primary/30
                                            hover:shadow-xl
                                        "
                  >
                    {/* Service Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      {d.photoUrl ? (
                        <Image
                          src={d.photoUrl}
                          alt={`${d.serviceName} service`}
                          fill
                          className="
                                                        object-cover
                                                        transition-transform duration-500
                                                        group-hover:scale-105
                                                    "
                          sizes="
                                                        (max-width: 640px) 100vw,
                                                        (max-width: 1024px) 50vw,
                                                        33vw
                                                    "
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Icon className="size-16 text-muted-foreground/40" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col px-6 pb-5 pt-6">
                      {/* Service Title */}
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">
                          {d.serviceName}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {d.summary}
                        </p>
                      </div>

                      {/* Key Services */}
                      <div className="mt-5">
                        <p
                          className="
                                                        text-[11px] font-bold uppercase
                                                        tracking-[0.16em]
                                                        text-muted-foreground
                                                    "
                        >
                          Key Services
                        </p>

                        {serviceItems.length > 0 ? (
                          <ul className="mt-3 space-y-2.5">
                            {serviceItems
                              .slice(0, 3)
                              .map((service, index) => (
                                <li
                                  key={`${d.id}-${index}`}
                                  className="
                                                                        flex items-start gap-2.5
                                                                        text-sm text-foreground/75
                                                                    "
                                >
                                  <span
                                    className="
                                                                            mt-0.5 flex size-5 shrink-0
                                                                            items-center justify-center
                                                                            rounded-full bg-primary/10
                                                                            text-primary
                                                                        "
                                  >
                                    <Check
                                      className="size-3"
                                      strokeWidth={2.5}
                                      aria-hidden
                                    />
                                  </span>

                                  <span className="leading-5">
                                    {service}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        ) : (
                          <p className="mt-3 text-sm text-muted-foreground">
                            Contact us for available services.
                          </p>
                        )}
                      </div>

                      {/* Bottom Actions */}
                      <div
                        className="
                                                    mt-auto flex items-center
                                                    justify-between gap-3 pt-6
                                                "
                      >
                        <DialogTrigger
                          aria-label={`View services offered by ${d.serviceName}`}
                          className="
                                                        inline-flex items-center gap-1.5
                                                        text-sm font-semibold text-primary
                                                        underline-offset-4
                                                        transition-colors hover:underline
                                                        focus-visible:outline-none
                                                        focus-visible:ring-2
                                                        focus-visible:ring-ring
                                                        focus-visible:ring-offset-2
                                                    "
                        >
                          View services

                          <ArrowRight
                            className="
                                                            size-4
                                                            transition-transform duration-200
                                                            group-hover:translate-x-1
                                                        "
                            aria-hidden
                          />
                        </DialogTrigger>

                        <Link
                          href={`/appointment?dept=${encodeURIComponent(d.slug)}`}
                          aria-label={`Book an appointment for ${d.serviceName}`}
                          className="
                                                        inline-flex shrink-0 items-center
                                                        rounded-full bg-primary/10
                                                        px-4 py-2 text-xs font-semibold
                                                        text-primary transition-all
                                                        hover:bg-primary
                                                        hover:text-primary-foreground
                                                        focus-visible:outline-none
                                                        focus-visible:ring-2
                                                        focus-visible:ring-ring
                                                        focus-visible:ring-offset-2
                                                    "
                        >
                          Book visit
                        </Link>
                      </div>
                    </div>
                  </Card>

                  {/* Service Details Dialog */}
                  <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
                    <DialogHeader>
                      <IconBadge icon={Icon} />

                      <DialogTitle className="mt-3 text-xl">
                        {d.serviceName}
                      </DialogTitle>

                      <DialogDescription className="leading-6">
                        {d.summary}
                      </DialogDescription>
                    </DialogHeader>

                    {/* Complete Service List */}
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold">
                        Services available
                      </h4>

                      {serviceItems.length > 0 ? (
                        <ul className="mt-3 space-y-3">
                          {serviceItems.map(
                            (service, index) => (
                              <li
                                key={`${d.id}-detail-${index}`}
                                className="
                                                                    flex items-start gap-2.5
                                                                    text-sm text-muted-foreground
                                                                "
                              >
                                <Check
                                  className="
                                                                        mt-0.5 size-4 shrink-0
                                                                        text-primary
                                                                    "
                                  aria-hidden
                                />

                                <span className="leading-5">
                                  {service}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="mt-3 text-sm text-muted-foreground">
                          Please contact the hospital
                          for service details.
                        </p>
                      )}
                    </div>

                    {/* Appointment Button */}
                    <div className="mt-5 flex justify-end">
                      <Link
                        href={`/appointment?dept=${encodeURIComponent(d.slug)}`}
                        className="
                                                    inline-flex items-center gap-1.5
                                                    rounded-full bg-primary
                                                    px-5 py-2.5 text-sm font-semibold
                                                    text-primary-foreground
                                                    transition-colors hover:bg-primary/90
                                                    focus-visible:outline-none
                                                    focus-visible:ring-2
                                                    focus-visible:ring-ring
                                                    focus-visible:ring-offset-2
                                                "
                      >
                        Book an appointment

                        <ArrowRight
                          className="size-4"
                          aria-hidden
                        />
                      </Link>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
