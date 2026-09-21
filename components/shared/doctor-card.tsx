import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "./person-avatar";
import type { Doctor } from "@/lib/data";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <li className="flex">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center text-center">
          <PersonAvatar name={doctor.name} />
          <h3 className="mt-4 font-bold">{doctor.name}</h3>
          <p className="text-sm font-medium text-primary">{doctor.department}</p>
          <p className="mt-1 text-sm text-muted-foreground">{doctor.role}</p>
          <p className="text-sm text-muted-foreground">{doctor.years} years of experience</p>
          <div className="mt-auto w-full pt-5">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={`/doctors/${doctor.slug}`} aria-label={`View profile of ${doctor.name}`}>
                View Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
