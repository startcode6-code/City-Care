import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function IconBadge({
  icon: Icon,
  className,
  iconClassName,
}: {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground", className)}
    >
      <Icon className={cn("size-6", iconClassName)} />
    </span>
  );
}
