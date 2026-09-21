import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { Section, SectionHeading } from "@/components/shared/section";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <Section tone="card">
      <SectionHeading title="What patients say" />
      <ul className="grid gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <li key={t.name} className="flex">
            <Card className="w-full bg-background">
              <CardContent>
                <figure className="flex h-full flex-col">
                  <Quote className="size-7 text-primary" aria-hidden />
                  <blockquote className="mt-3 flex-1 leading-relaxed">{t.quote}</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <PersonAvatar name={t.name} />
                    <span className="leading-tight">
                      <span className="block text-sm font-semibold">{t.name}</span>
                      <span className="block text-xs text-muted-foreground">{t.meta}</span>
                    </span>
                  </figcaption>
                </figure>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
