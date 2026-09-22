import { Card, CardContent } from "@/components/ui/card";
import { ImageSlot } from "./image-slot";
import { getFacilityIcon } from "@/lib/icons";
import type { Facility } from "@/lib/data";
import Image from "next/image";

export function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <li className="flex">
      <Card className="w-full overflow-hidden">
        <Image
          alt={facility.name}
          src={getFacilityIcon(facility.slug)}
          width={800}
          height={600}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
           className="aspect-[4/3] w-full object-cover"
        />
        <CardContent className="p-5">
          <h3 className="font-bold">{facility.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{facility.summary}</p>
        </CardContent>
      </Card>
    </li>
  );
}
