import { Building2, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/shared/container";
import { IconBadge } from "@/components/shared/icon-badge";
import { highlights } from "@/lib/data";

const icons = [Clock, Users, Building2];

export function HighlightStrip() {
  return (
    <div className="relative z-10 -mt-12">
      <Container>
        <ul className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item, i) => (
            <li key={item.title} className="flex">
              <Card className="w-full">
                <CardContent className="flex items-center gap-4 p-5">
                  <IconBadge icon={icons[i]} />
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
