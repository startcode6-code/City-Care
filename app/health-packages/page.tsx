import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeading } from "@/components/shared/section";
import { PackageCard } from "@/components/shared/package-card";
import { packages } from "@/lib/data";

export const metadata: Metadata = { title: "Health Packages" };

const faqs = [
  {
    q: "Do I need to fast before the checkup?",
    a: "Yes, for 10 to 12 hours. You can drink water. Take your usual medicines unless your doctor has told you otherwise.",
  },
  {
    q: "How long does a package take?",
    a: "Most packages are completed in 3 to 4 hours. Reports are ready the same day, and a doctor goes through them with you.",
  },
  {
    q: "Can I add extra tests?",
    a: "Yes. Tell the front desk when you book and we will add tests and update the price before you arrive.",
  },
];

export default function HealthPackagesPage() {
  return (
    <>
      <PageHero
        crumb="Health Packages"
        title="Health Packages"
        intro="Fixed-price checkups with the results explained by a doctor on the same day."
      />
      <Section>
        <ul className="grid gap-5 md:grid-cols-3">
          {packages.map((p) => (
            <PackageCard key={p.slug} pkg={p} />
          ))}
        </ul>
      </Section>
      <Section tone="card">
        <SectionHeading title="Common questions" />
        <dl className="grid gap-5 md:grid-cols-3">
          {faqs.map((f) => (
            <Card key={f.q} className="bg-background">
              <CardContent>
                <dt className="font-bold">{f.q}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{f.a}</dd>
              </CardContent>
            </Card>
          ))}
        </dl>
      </Section>
    </>
  );
}
