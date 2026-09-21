import Link from "next/link";
import { site } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name}, home`}>
      <svg viewBox="0 0 32 32" className="size-9 text-primary" aria-hidden>
        <path
          d="M12 3h8a2 2 0 0 1 2 2v7h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7v7a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-7H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h7V5a2 2 0 0 1 2-2Z"
          fill="currentColor"
        />
        <path d="M16 9v14M9 16h14" className="stroke-primary-foreground" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="whitespace-nowrap leading-tight">
        <span className="block text-[15px] font-bold">{site.short}</span>
        <span className="block text-[11px] font-medium text-muted-foreground">{site.tagline}</span>
      </span>
    </Link>
  );
}
