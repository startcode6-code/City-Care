import { Section, SectionHeading } from "@/components/shared/section";
import { DoctorCard } from "@/components/shared/doctor-card";
import { doctors } from "@/lib/data";

export function FeaturedDoctors() {
  return (
    <Section>
      <SectionHeading title="Featured Doctors" href="/doctors" hrefLabel="View all doctors" />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {doctors.slice(0, 4).map((doctor) => (
          <DoctorCard key={doctor.slug} doctor={doctor} />
        ))}
      </ul>
    </Section>
  );
}
