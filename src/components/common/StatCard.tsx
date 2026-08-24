import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  emphasis,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "surface p-4 sm:p-5",
        emphasis && "border-accent/40 bg-primary text-primary-foreground",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={cn("label-caps", emphasis && "text-primary-foreground/70")}>{label}</p>
        {icon ? (
          <span className={cn("text-muted-foreground", emphasis && "text-accent")}>{icon}</span>
        ) : null}
      </div>
      <p className="numeric mt-2 font-display text-2xl">{value}</p>
      {hint ? (
        <p
          className={cn(
            "mt-1 text-xs text-muted-foreground",
            emphasis && "text-primary-foreground/70",
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
