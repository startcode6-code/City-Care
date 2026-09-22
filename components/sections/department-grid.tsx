"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";


import { IconBadge } from "@/components/shared/icon-badge";
import { Section, SectionHeading } from "@/components/shared/section";
import { getDepartmentIcon } from "@/lib/icons";
import { departments } from "@/lib/data";

export function DepartmentGrid({ tone = "card" }: { tone?: "background" | "card" }) {
  return (
    <Section tone={tone}>
      <SectionHeading
        title="Our Services"
        intro="Pick a department to see the services it offers and the doctors who lead it."
        href="#/service"
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((d) => {
          const Icon = getDepartmentIcon(d.slug);
          return (
            <li key={d.slug} className="flex">
              <Dialog>
                <Card className="w-full bg-background">
                  <CardContent>
                    <IconBadge icon={Icon} />
                    <h3 className="mt-4 text-lg font-bold">{d.name}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{d.summary}</p>
                  </CardContent>
                  <CardFooter className="justify-between border-t p-4 text-sm font-semibold">

                    <DialogTrigger
                    aria-label={`View details of ${d.name}`}
                    className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
                  >
                    View details
                    <ArrowRight className="size-4" aria-hidden />
                  </DialogTrigger>

                    <Link
                      href={`/appointment?dept=${d.slug}`}
                      aria-label={`Book a visit to ${d.name}`}
                      className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >Book a visit</Link>
                    
                  </CardFooter>
                </Card>

                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <IconBadge icon={Icon} />
                    <DialogTitle className="mt-3">{d.name}</DialogTitle>
                    <DialogDescription>{d.summary}</DialogDescription>
                  </DialogHeader>

                  <div>
                    <h4 className="text-sm font-semibold">Services</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {d.services.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      href={`/appointment?dept=${d.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      Book a visit
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
