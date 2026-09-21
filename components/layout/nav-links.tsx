"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { nav } from "@/lib/site";

export function useIsActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

export function NavLinks() {
  const isActive = useIsActive();
  return (
    <nav aria-label="Main" className="hidden items-center gap-5 lg:flex xl:gap-6">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={cn(
            "whitespace-nowrap border-b-2 py-1 text-[13px] font-medium",
            isActive(item.href)
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
