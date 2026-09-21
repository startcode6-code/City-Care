import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { site } from "@/lib/site";

export function AppointmentCta() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <Container>
        <div className="rounded-xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Schedule Your Visit Today</h2>
          <p className="mx-auto mt-3 max-w-lg">
            Choose a department and a time that suits you. We will confirm by phone or email.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button  size="lg" className="bg-card text-primary hover:bg-card/90">
              render={<Link href="/appointment">Book Appointment</Link>}
            </Button>
            <Button
              
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
             render={<a href={site.phoneHref}>Emergency Call</a>}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
