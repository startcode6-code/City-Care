import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/icon-badge";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { LocationMap } from "@/components/sections/location-map";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

const items = [
  { icon: Phone, title: "Emergency", lines: [site.phone, site.emergencyHours], href: site.phoneHref },
  { icon: Mail, title: "Email", lines: [site.email, "We reply within one working day"], href: `mailto:${site.email}` },
  { icon: MapPin, title: "Address", lines: [site.address], href: undefined },
  { icon: Clock, title: "Outpatient hours", lines: [site.hours], href: undefined },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumb="Contact"
        title="Contact Us"
        intro="Call for emergencies, email for everything else, or visit the front desk."
      />
      <Section>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.title} className="flex">
              <Card className="w-full">
                <CardContent>
                  <IconBadge icon={item.icon} className="size-11" iconClassName="size-5" />
                  <h2 className="mt-4 font-bold">{item.title}</h2>
                  <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                    {item.lines.map((line, i) =>
                      i === 0 && item.href ? (
                        <a
                          key={line}
                          href={item.href}
                          className="block font-semibold text-primary underline-offset-4 hover:underline"
                        >
                          {line}
                        </a>
                      ) : (
                        <p key={line}>{line}</p>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
      <LocationMap />
    </>
  );
}
