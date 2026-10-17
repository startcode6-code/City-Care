
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

type StatCardProps = {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
};

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: StatCardProps) {
    return (
        <section className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-primary/30">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight">
                        {value}
                    </p>
                </div>

                <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted/50">
                    <Icon className="size-5 text-muted-foreground" />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowUpRight className="size-3.5" />
                {description}
            </div>
        </section>
    );
}
