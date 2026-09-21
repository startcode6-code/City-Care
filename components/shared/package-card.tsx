import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { HealthPackage } from "@/lib/data";

export function PackageCard({ pkg, showTests = true }: { pkg: HealthPackage; showTests?: boolean }) {
  return (
    <li className="flex">
      <Card className="w-full">
        <CardContent className="flex flex-col">
          <h3 className="text-lg font-bold">{pkg.name}</h3>
          <p className="text-sm text-muted-foreground">{pkg.audience}</p>
          <p className="mt-4 flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold tracking-tight text-primary">${pkg.price}</span>
            <span className="text-sm text-muted-foreground">per person</span>
          </p>
          {showTests && (
            <ul className="mt-5 space-y-2.5 text-sm">
              {pkg.tests.map((test) => (
                <li key={test} className="flex gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  {test}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto pt-6">
            <Button asChild variant="outline" className="w-full">
              <Link href={`/appointment?package=${pkg.slug}`} aria-label={`Book the ${pkg.name} package`}>
                Book this package
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
