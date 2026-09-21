import Link from "next/link";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { ImageSlot } from "@/components/shared/image-slot";

export function AboutPreview() {
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">About Us</h2>
          <p className="mt-4 text-muted-foreground">
            St. Jude&apos;s has cared for families in Cityville for over 25 years. Our specialists work as one team, so a
            heart patient with diabetes, or a child with a broken arm, sees the right people without being sent around
            town.
          </p>
          <p className="mt-4 text-muted-foreground">
            Every department shares the same records, the same diagnostic lab and the same promise: you will always
            know what is happening and what comes next.
          </p>
          <Button className="mt-7">
            render={<Link href="/about">Learn more</Link>}
          </Button>
        </div>
        <ImageSlot
          name="hospital-building"
          alt="The St. Jude's General Hospital building"
          icon={Building2}
          className="aspect-[16/10] rounded-xl border"
        />
      </div>
    </Section>
  );
}
