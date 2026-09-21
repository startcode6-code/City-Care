import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

export function Section({
  tone = "background",
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & { tone?: "background" | "card" }) {
  return (
    <section
      className={cn("py-16 sm:py-20", tone === "card" ? "bg-card" : "bg-background", className)}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  title,
  intro,
  href,
  hrefLabel = "View all",
}: {
  title: string;
  intro?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {intro && <p className="mt-2 max-w-xl text-muted-foreground">{intro}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {hrefLabel}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
