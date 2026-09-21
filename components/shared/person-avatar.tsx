import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initialsOf(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export function PersonAvatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  return (
    <Avatar className={cn(size === "lg" ? "size-28" : "size-16")}>
      <AvatarFallback className={size === "lg" ? "text-3xl" : "text-lg"} aria-hidden>
        {initialsOf(name)}
      </AvatarFallback>
    </Avatar>
  );
}
