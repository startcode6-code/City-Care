import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { ImageIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"];

/**
 * Looks for /public/images/<name>.(jpg|jpeg|png|webp|avif).
 * If the file exists it is shown, otherwise a plain placeholder is drawn.
 * To use a real photo, drop a file with the right name into public/images.
 */
function findImage(name: string) {
  for (const ext of EXTENSIONS) {
    const file = path.join(process.cwd(), "public", "images", `${name}.${ext}`);
    if (fs.existsSync(file)) return `/images/${name}.${ext}`;
  }
  return null;
}

export function ImageSlot({
  name,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  icon: Icon = ImageIcon,
}: {
  name: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  icon?: LucideIcon;
}) {
  const src = findImage(name);
  return (
    <div className={cn("relative overflow-hidden bg-accent", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0 flex items-center justify-center">
          <Icon className="size-14 text-accent-foreground/50" aria-hidden />
        </div>
      )}
    </div>
  );
}
