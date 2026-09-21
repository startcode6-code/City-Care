import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/icon-badge";
import { Section, SectionHeading } from "@/components/shared/section";
import { getDepartmentIcon } from "@/lib/icons";
import { departments } from "@/lib/data";

export function DepartmentGrid({ tone = "card" }: { tone?: "background" | "card" }) {
  return (
    <Section tone={tone}>
      <SectionHeading
        title="Our Departments"
        intro="Pick a department to see the services it offers and the doctors who lead it."
        href="#/departments"
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((d) => (
          <li key={d.slug} className="flex">
            <Card className="w-full bg-background">
              <CardContent>
                <IconBadge icon={getDepartmentIcon(d.slug)} />
                <h3 className="mt-4 text-lg font-bold">{d.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{d.summary}</p>
              </CardContent>
              <CardFooter className="justify-between border-t p-4 text-sm font-semibold">
                <Link
                  href={`/departments#${d.slug}`}
                  aria-label={`View details of ${d.name}`}
                  className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
                >
                  View details
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link
                  href={`/appointment?dept=${d.slug}`}
                  aria-label={`Book a visit to ${d.name}`}
                  className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Book a visit
                </Link>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
