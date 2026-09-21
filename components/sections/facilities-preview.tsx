import { Section, SectionHeading } from "@/components/shared/section";
import { FacilityCard } from "@/components/shared/facility-card";
import { facilities } from "@/lib/data";

export function FacilitiesPreview() {
  return (
    <Section tone="card">
      <SectionHeading title="Hospital Facilities" href="/facilities" hrefLabel="See all facilities" />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {facilities.slice(0, 3).map((f) => (
          <FacilityCard key={f.slug} facility={f} />
        ))}
      </ul>
    </Section>
  );
}
