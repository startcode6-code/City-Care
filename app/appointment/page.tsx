import type { Metadata } from "next";
import { Clock, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { departmentSlugFromName, departments, doctors, packages } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Book an Appointment" };

type SearchParams = { doctor?: string; dept?: string; package?: string };

export default async function AppointmentPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { doctor, dept, package: pkg } = await searchParams;

  const selectedDoctor = doctors.find((d) => d.slug === doctor);
  const selectedPackage = packages.find((p) => p.slug === pkg);
  const departmentFromDoctor = selectedDoctor ? departmentSlugFromName(selectedDoctor.department) : undefined;
  const requestedDepartment = departments.some((d) => d.slug === dept) ? dept : undefined;
  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHero
        crumb="Book Appointment"
        title="Book an Appointment"
        intro="Tell us when you would like to visit. We will confirm the slot by phone or email."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <AppointmentForm
            minDate={minDate}
            defaultDepartment={requestedDepartment ?? departmentFromDoctor ?? ""}
            defaultDoctor={selectedDoctor?.slug ?? ""}
            packageSlug={selectedPackage?.slug ?? ""}
            packageName={selectedPackage?.name}
          />
          <aside className="space-y-4 self-start">
            <Card>
              <CardContent>
                <Phone className="size-6 text-destructive" aria-hidden />
                <h2 className="mt-3 font-bold">Emergency? Do not wait.</h2>
                <p className="mt-1 text-sm text-muted-foreground">Call now or come straight to the Emergency Wing.</p>
                <a
                  href={site.phoneHref}
                  className="mt-3 inline-block text-lg font-bold text-primary underline-offset-4 hover:underline"
                >
                  {site.phone}
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Clock className="size-6 text-primary" aria-hidden />
                <h2 className="mt-3 font-bold">Outpatient hours</h2>
                <p className="mt-1 text-sm text-muted-foreground">{site.hours}</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
