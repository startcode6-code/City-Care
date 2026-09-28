"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

export function DepartmentGrid({tone = "card",}: {
  tone?: "background" | "card";
}) {
  return (
    <Section 

      tone="background"
      className="bg-muted"
>
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
                    group flex w-full flex-col overflow-hidden
                    border-border/70 bg-background
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-primary/40
                    hover:shadow-lg
                  "
                >
                  <CardContent className="flex flex-1 flex-col p-6">
                    {/* Icon */}
                    <div
                      className="
                        flex size-14 items-center justify-center
                        rounded-2xl border border-primary/10
                        bg-primary/10 text-primary
                        transition-all duration-300
                        group-hover:bg-primary group-hover:text-primary-foreground
                      "
                    >
                      <Icon className="size-7" aria-hidden />
                    </div>

                    {/* Title */}
                    <div className="mt-5">
                      <h3 className="text-xl font-bold tracking-tight">
                        {d.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {d.summary}
                      </p>
                    </div>

                    {/* Services */}
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Key Services
                      </p>

                      <ul className="mt-3 space-y-2.5">
                        {d.services.slice(0, 3).map((service) => (
                          <li
                            key={service}
                            className="flex items-start gap-2 text-sm text-foreground/80"
                          >
                            <span
                              className="
                                mt-0.5 flex size-5 shrink-0 items-center
                                justify-center rounded-full
                                bg-primary/10 text-primary
                              "
                            >
                              <Check className="size-3" aria-hidden />
                            </span>

                            <span className="leading-5">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  {/* Footer */}
                  <CardFooter
                    className="
                      mt-auto flex items-center justify-between
                      border-t border-border/70 px-6 py-4
                    "
                  >
                    <DialogTrigger
                      aria-label={`View services offered by ${d.name}`}
                      className="
                        inline-flex items-center gap-1.5
                        text-sm font-semibold text-primary
                        underline-offset-4
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
                          size-4 transition-transform duration-200
                          group-hover:translate-x-1
                        "
                        aria-hidden
                      />
                    </DialogTrigger>

                    <Link
                      href={`/appointment?dept=${d.slug}`}
                      aria-label={`Book an appointment for ${d.name}`}
                      className="
                        inline-flex items-center rounded-md
                        px-2 py-1 text-sm font-semibold
                        text-muted-foreground
                        transition-colors
                        hover:text-foreground
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-ring
                        focus-visible:ring-offset-2
                      "
                    >
                      Book visit
                    </Link>
                  </CardFooter>
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

                  <div>
                    <h4 className="text-sm font-semibold">
                      Services available
                    </h4>

                    <ul className="mt-3 space-y-2">
                      {d.services.map((service) => (
                        <li
                          key={service}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-primary"
                            aria-hidden
                          />

                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      href={`/appointment?dept=${d.slug}`}
                      className="
                        inline-flex items-center gap-1.5
                        text-sm font-semibold text-primary
                        underline-offset-4 hover:underline
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-ring
                        focus-visible:ring-offset-2
                      "
                    >
                      Book an appointment
                      <ArrowRight className="size-4" aria-hidden />
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