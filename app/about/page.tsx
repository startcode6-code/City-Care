import type { Metadata } from "next";
import { Building2, Clock, HeartHandshake, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/icon-badge";
import { ImageSlot } from "@/components/shared/image-slot";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeading } from "@/components/shared/section";
import { AppointmentCta } from "@/components/sections/appointment-cta";
import Image from "next/image";

export const metadata: Metadata = { title: "About Us" };

const principles = [
  {
    icon: HeartHandshake,
    title: "We listen first",
    text: "Every consultation starts with your questions. Doctors explain the diagnosis and the options in plain language before any decision is made.",
  },
  {
    icon: Stethoscope,
    title: "Specialists under one roof",
    text: "Cardiology, orthopedics, pediatrics and more share one record system, so your care team sees the full picture.",
  },
  {
    icon: Clock,
    title: "Open when you need us",
    text: "The Emergency Wing, ICU, lab and pharmacy run around the clock, every day of the year.",
  },
];

const numbers = [
  { value: "25+", label: "years serving Cityville" },
  { value: "50+", label: "specialist doctors" },
  { value: "150", label: "inpatient beds" },
  { value: "24×7", label: "emergency care" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About Us"
        title="A hospital built around the patient"
        intro="St. Jude's opened in 1998 as a 30-bed clinic. Today it is a 150-bed general hospital with six specialist departments."
      />

      <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Image
        alt="The St. Jude's General Hospital building"
        className="aspect-[4/3] w-full rounded-xl border object-cover"
        src="/images/pexels-supplier-gorden-ready-stok-minimalis-21695059-7335565.jpg"
        width={1200}
        height={900}
        priority
      />

    <div className="space-y-4 text-muted-foreground">
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Our story
      </h2>

      <p>
        We started with a simple rule: nobody should have to repeat their
        medical history three times. That rule shaped how we built the
        hospital, with departments on the same floors, shared records and a
        single front desk for appointments.
      </p>

      <p>
        Over the years we added an intensive care unit, a diagnostic lab that
        reports most results the same day, and a 24-hour Emergency Wing. The
        team has grown, but the rule has not changed.
      </p>
    </div>
  </div>
</Section>

      <Section tone="card">
        <SectionHeading title="How we work" />
        <ul className="grid gap-5 md:grid-cols-3">
          {principles.map((p) => (
            <li key={p.title} className="flex">
              <Card className="w-full bg-background">
                <CardContent>
                  <IconBadge icon={p.icon} />
                  <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{p.text}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <ul className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {numbers.map((n) => (
            <li key={n.label} className="flex">
              <Card className="w-full">
                <CardContent className="text-center">
                  <p className="text-4xl font-extrabold tracking-tight text-primary">{n.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{n.label}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <AppointmentCta />
    </>
  );
}
