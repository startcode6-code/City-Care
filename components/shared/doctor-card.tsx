import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, UserRound } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@/lib/data";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <li className="flex">
      <Card
        className="
          group relative flex w-full flex-col
          overflow-hidden rounded-2xl
          border-border/60 bg-background
          p-0 shadow-sm
          transition-all duration-300
          hover:-translate-y-1
          hover:border-primary/30
          hover:shadow-xl
        "
      >
        {/* Doctor Image */}
        <div className="relative h-50 w-full overflow-hidden">
          <Image
            src='/images/dr_images.png'
            alt={doctor.name}
            fill
            className="
              object-cover
              object-center
              transition-transform duration-500
              group-hover:scale-105
            "
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 50vw,
              25vw
            "
          />

          {/* Image Overlay */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t
              from-black/20
              via-transparent
              to-transparent
            "
          />

      

        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-5 pb-5 pt-9">
          {/* Doctor Name */}
          <h3 className="text-xl font-bold tracking-tight">
            {doctor.name}
          </h3>

          {/* Role */}
          <p className="mt-1 text-sm font-semibold text-primary">
            {doctor.role}
          </p>

          {/* Experience */}
          <div
            className="
              mt-5 flex items-center gap-2
              text-sm text-muted-foreground
            "
          >
            <span
              className="
                flex size-8 items-center justify-center
                rounded-full
                bg-primary/10
                text-primary
              "
            >
              <UserRound className="size-4" aria-hidden />
            </span>

            <span>
              {doctor.years} years of experience
            </span>
          </div>

          {/* Button */}
          <div className="mt-auto pt-6">
            <Button
              variant="ghost"
              className="
                h-11 w-full
                rounded-full
                bg-primary/10
                text-sm font-semibold
                text-primary
                transition-all duration-300
                hover:bg-primary
                hover:text-primary-foreground
                hover:shadow-md
              "
              nativeButton={false}
              render={
                <Link href={`/doctors/${doctor.slug}`} />
              }
            >
              <span>View Profile</span>

              <ArrowRight
                className="
                  size-4
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
                aria-hidden
              />
            </Button>
          </div>
        </div>
      </Card>
    </li>
  );
}