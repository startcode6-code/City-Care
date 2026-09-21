import Link from "next/link";
import { Container } from "./container";

export function PageHero({ title, intro, crumb }: { title: string; intro: string; crumb: string }) {
  return (
    <div className="border-b bg-card">
      <Container className="py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/" className="underline-offset-4 hover:underline">
            Home
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span aria-current="page" className="text-foreground">
            {crumb}
          </span>
        </nav>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{intro}</p>
      </Container>
    </div>
  );
}
