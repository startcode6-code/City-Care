import Link from "next/link";
import { CalendarCheck, Phone, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { ImageSlot } from "@/components/shared/image-slot";
import { site } from "@/lib/site";


export function Hero() {
  return (
    <section className="bg-card pb-24 pt-10 sm:pt-16">
      <Container className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <h1 className="max-w-md text-4xl font-extrabold leading-[1.1] tracking-tight text-primary sm:text-5xl">
            Quality Healthcare You Can Trust
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Six specialist departments, 50+ experienced doctors and an emergency team on duty every hour of the day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/appointment">
                <CalendarCheck aria-hidden />
                Book Appointment
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={site.phoneHref}>
                <Phone aria-hidden />
                Emergency Call
              </a>
            </Button>
          </div>
        </div>

        <ImageSlot
          name="hero"
          alt="Doctors at St. Jude's General Hospital"
          icon={Stethoscope}
          priority
          className="aspect-[5/4] rounded-xl border"
        />
      </Container>
    </section>
  );
}
