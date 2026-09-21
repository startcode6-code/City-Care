import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { FacilityCard } from "@/components/shared/facility-card";
import { AppointmentCta } from "@/components/sections/appointment-cta";
import { facilities } from "@/lib/data";

export const metadata: Metadata = { title: "Facilities" };

export default function FacilitiesPage() {
  return (
    <>
      <PageHero
        crumb="Facilities"
        title="Hospital Facilities"
        intro="Diagnostics, surgery and emergency care are all inside the same building."
      />
      <Section>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <FacilityCard key={f.slug} facility={f} />
          ))}
        </ul>
      </Section>
      <AppointmentCta />
    </>
  );
}
