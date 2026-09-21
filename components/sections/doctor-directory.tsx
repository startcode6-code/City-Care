"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DoctorCard } from "@/components/shared/doctor-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { Doctor } from "@/lib/data";

export function DoctorDirectory({ doctors, departments }: { doctors: Doctor[]; departments: string[] }) {
  const [active, setActive] = useState("All");
  const shown = active === "All" ? doctors : doctors.filter((d) => d.department === active);

  return (
    <>
      <div role="group" aria-label="Filter by department" className="mb-8 flex flex-wrap gap-2">
        {["All", ...departments].map((name) => (
          <Button
            key={name}
            type="button"
            size="sm"
            variant={active === name ? "default" : "outline"}
            aria-pressed={active === name}
            onClick={() => setActive(name)}
            className="rounded-full"
          >
            {name}
          </Button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "doctor" : "doctors"}
      </p>
      {shown.length === 0 ? (
        <EmptyState
          title="No doctors in this department yet"
          description="Try another department, or call the front desk and we will help you find the right specialist."
          action={
            <Button type="button" variant="outline" onClick={() => setActive("All")}>
              Show all doctors
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((d) => (
            <DoctorCard key={d.slug} doctor={d} />
          ))}
        </ul>
      )}
    </>
  );
}
