"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { nav, site } from "@/lib/site";
import { useIsActive } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const isActive = useIsActive();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger 
        render = {
          <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" aria-hidden />
          <span className="sr-only">Open menu</span>
        </Button>
        }>
       
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{site.short}</SheetTitle>
          <SheetDescription>{site.tagline}</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-3 text-sm font-medium",
                isActive(item.href) ? "bg-accent text-accent-foreground" : "hover:bg-accent/60",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <Button asChild className="w-full">
            <Link href="/appointment" onClick={() => setOpen(false)}>
              Book Appointment
            </Link>
          </Button>
          <a href={site.phoneHref} className="block py-2 text-center text-sm font-semibold text-destructive">
            Emergency: {site.phone}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
