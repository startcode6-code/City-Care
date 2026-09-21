import { Section, SectionHeading } from "@/components/shared/section";
import { PackageCard } from "@/components/shared/package-card";
import { packages } from "@/lib/data";

export function PackagesPreview() {
  return (
    <Section>
      <SectionHeading
        title="Health Packages"
        intro="Fixed-price checkups with the results explained by a doctor."
        href="/health-packages"
        hrefLabel="Compare packages"
      />
      <ul className="grid gap-5 md:grid-cols-3">
        {packages.map((p) => (
          <PackageCard key={p.slug} pkg={p} showTests={false} />
        ))}
      </ul>
    </Section>
  );
}
