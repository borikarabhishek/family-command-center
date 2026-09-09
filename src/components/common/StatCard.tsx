import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * StatCard displays a single statistic or metric with a label and optional hint.
 * Used on dashboards to show key family metrics at a glance.
 *
 * @param label - The statistic label (e.g., "Pending Tasks", "Documents")
 * @param value - The numeric or text value to display (shown prominently)
 * @param hint - Optional secondary text, trend, or context
 * @param icon - Optional icon element to display alongside the stat
 * @param emphasis - Optional flag to highlight this card (uses primary color)
 *
 * @example
 * <StatCard
 *   label="Pending Tasks"
 *   value={5}
 *   hint="2 new today"
 *   icon={<ChecklistIcon />}
 *   emphasis
 * />
 */
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
