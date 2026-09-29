"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

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
import { Section, SectionHeading } from "@/components/shared/section";
import { getDepartmentIcon } from "@/lib/icons";
import { departments } from "@/lib/data";

export function DepartmentGrid({
  tone = "card",
}: {
  tone?: "background" | "card";
}) {
  return (
    <Section tone="background" className="bg-muted">
      <SectionHeading
        title="Our Services"
        intro="Explore our specialist departments, available services, and care options."
        href="#/service"
      />

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((d) => {
          const Icon = getDepartmentIcon(d.slug);

          return (
            <li key={d.slug} className="flex">
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
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={d.images}
                      alt={`${d.name} service`}
                      fill
                      className="
                        object-cover
                        transition-transform duration-500
                        group-hover:scale-105
                      "
                      sizes="(max-width: 640px) 100vw,
                             (max-width: 1024px) 50vw,
                             33vw"
                    />

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                    {/* Service Icon */}
                    {/* <div
                      className="
                        absolute bottom-[-20px] left-6
                        flex size-14 items-center justify-center
                        rounded-2xl
                        border-4 border-background
                        bg-primary text-primary-foreground
                        shadow-lg
                        transition-transform duration-300
                        group-hover:scale-105
                      "
                    >
                      <Icon className="size-7" aria-hidden />
                    </div> */}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col px-6 pb-5 pt-9">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">
                        {d.name}
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
                          tracking-[0.16em] text-muted-foreground
                        "
                      >
                        Key Services
                      </p>

                      <ul className="mt-3 space-y-2.5">
                        {d.services.slice(0, 3).map((service) => (
                          <li
                            key={service}
                            className="
                              flex items-start gap-2.5
                              text-sm text-foreground/75
                            "
                          >
                            <span
                              className="
                                mt-0.5 flex size-5 shrink-0
                                items-center justify-center
                                rounded-full
                                bg-primary/10 text-primary
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
                    </div>

                    {/* Bottom Actions */}
                    <div
                      className="
                        mt-auto flex items-center justify-between
                        pt-6
                      "
                    >
                      <DialogTrigger
                        aria-label={`View services offered by ${d.name}`}
                        className="
                          inline-flex items-center gap-1.5
                          text-sm font-semibold text-primary
                          underline-offset-4
                          transition-colors
                          hover:underline
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
                        href={`/appointment?dept=${d.slug}`}
                        aria-label={`Book an appointment for ${d.name}`}
                        className="
                          inline-flex items-center
                          rounded-full
                          bg-primary/10
                          px-4 py-2
                          text-xs font-semibold
                          text-primary
                          transition-all
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

                {/* Details Dialog */}
                
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <IconBadge icon={Icon} />

                    <DialogTitle className="mt-3">
                      {d.name}
                    </DialogTitle>

                    <DialogDescription>
                      {d.summary}
                    </DialogDescription>
                  </DialogHeader>

                  {/* Services */}
                  <div>
                    <h4 className="text-sm font-semibold">
                      Services available
                    </h4>

                    <ul className="mt-3 space-y-2">
                      {d.services.map((service) => (
                        <li
                          key={service}
                          className="
                            flex items-start gap-2
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

                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Appointment */}
                  <div className="flex justify-end">
                    <Link
                      href={`/appointment?dept=${d.slug}`}
                      className="
                        inline-flex items-center gap-1.5
                        rounded-full
                        bg-primary
                        px-4 py-2
                        text-sm font-semibold
                        text-primary-foreground
                        transition-colors
                        hover:bg-primary/90
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
    </Section>
  );
}