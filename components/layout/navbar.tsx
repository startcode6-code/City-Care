import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { site } from "@/lib/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />
        <NavLinks />
        <div className="flex items-center gap-2 sm:gap-3">
          <a href={site.phoneHref} className="mr-2 hidden items-center gap-2 whitespace-nowrap 2xl:flex">
            <Phone className="size-4 text-destructive" aria-hidden />
            <span className="leading-tight">
              <span className="block text-[10px] text-muted-foreground">Emergency number</span>
              <span className="block text-[13px] font-semibold">{site.phone}</span>
            </span>
          </a>
          <div className="hidden sm:block">
            <Button asChild>
              <Link href="/appointment">Book Appointment</Link>
            </Button>
          </div>
          <ThemeToggle />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
