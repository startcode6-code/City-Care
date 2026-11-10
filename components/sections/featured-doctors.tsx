import { Section, SectionHeading } from "@/components/shared/section";
import { DoctorCard } from "@/components/shared/doctor-card";
import { getPublicDoctors } from "@/lib/api/doctor";

export async function FeaturedDoctors() {
  try {
    const response = await getPublicDoctors();

    const doctors = response.data.slice(0, 4);

    return (
      <Section>
        <SectionHeading
          title="Featured Doctors"
          intro="Meet our experienced and caring specialists, dedicated to your health and wellbeing."
          href="/doctors"
          hrefLabel="View all doctors"
        />

        {doctors.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-muted-foreground">
            No doctors available at the moment.
          </p>
        )}
      </Section>
    );
  } catch (error) {
    console.error("Failed to fetch doctors:", error);

    return (
      <Section>
        <SectionHeading
          title="Featured Doctors"
          intro="Meet our experienced and caring specialists, dedicated to your health and wellbeing."
        />
        <p className="py-10 text-center text-muted-foreground">
          Unable to load doctors. Please try again later.
        </p>
      </Section>
    );
  }
}

