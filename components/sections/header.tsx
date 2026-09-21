"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, HeartPulse, Menu, Phone } from "lucide-react";
import { Button, buttonVariants  } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Container } from "@/components/shared/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

const nav = [
  { label: "Home", href: "/" },
  { label: "Departments", href: "/departments" },
  { label: "Doctors", href: "/doctors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <HeartPulse className="size-5" aria-hidden />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-primary">
        {site.name}
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

        <Button
        className="hidden sm:inline-flex"
        render={
          <Link href="/appointment" />
        }
      >
        <CalendarCheck aria-hidden />
        Book Appointment
      </Button>

          {/* Mobile menu */}
          <Sheet>

            
          <SheetTrigger
             render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                 aria-label="Open menu"
         />
       }
        >
        <Menu aria-hidden />
        </SheetTrigger>


            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{site.name}</SheetTitle>
              </SheetHeader>

              <nav aria-label="Mobile" className="px-4">
                <ul className="flex flex-col">
                  {nav.map((item) => (
                    <li key={item.href}>

                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={cn(
                            "block rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-accent",
                            isActive(item.href)
                            ? "text-primary"
                            : "text-foreground",
                        )}
                        />
                    }
                    >
                    {item.label}
                    </SheetClose>
                  </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto flex flex-col gap-3 p-4">

             <SheetClose
              nativeButton={false}
              render={
                <Link
                  href="/appointment"
                  className={buttonVariants({ size: "lg" })}
                />
              }
            >
              <CalendarCheck aria-hidden />
              Book Appointment
            </SheetClose>
                <Button  size="lg" variant="outline">
                  <a href={site.phoneHref}>
                    <Phone aria-hidden />
                    Emergency Call
                  </a>
                </Button>
              </div>


            </SheetContent>


          </Sheet>
        </div>
      </Container>
    </header>
  );
}