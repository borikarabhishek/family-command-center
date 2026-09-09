import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

/**
 * Mapping of common status labels to visual tones
 * Auto-detects the appropriate color based on the label text
 * (e.g., "Verified" → success, "Expired" → danger)
 */
const toneMap: Record<string, Tone> = {
  Verified: "success",
  Completed: "success",
  Approved: "success",
  "Pending Review": "warning",
  "Expiring Soon": "warning",
  Waiting: "warning",
  Pending: "warning",
  Expired: "danger",
  Rejected: "danger",
  High: "danger",
  Medium: "warning",
  Low: "neutral",
  "In Progress": "info",
  "Professional Assigned": "info",
  "Awaiting Family Approval": "warning",
  Created: "neutral",
  "To Do": "neutral",
  "Not Started": "neutral",
};

const toneClasses: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  success: "bg-success/10 text-success border-success/25",
  warning: "bg-warning/15 text-warning-foreground border-warning/35",
  danger: "bg-destructive/10 text-destructive border-destructive/25",
  info: "bg-info/10 text-info border-info/25",
};

/**
 * StatusBadge displays a colored status label with automatic tone detection.
 * Used throughout the app to indicate document status, task priority, approval status, etc.
 *
 * @param label - The status text to display
 * @param tone - Optional override for the visual tone (auto-detected if not provided)
 * @param className - Optional additional CSS classes
 *
 * @example
 * <StatusBadge label="Verified" />  // Green badge
 * <StatusBadge label="Expired" />   // Red badge
 * <StatusBadge label="In Progress" />  // Blue badge
 */
export function StatusBadge({
  label,
  tone,
  className,
}: {
  label: string;
  tone?: Tone;
  className?: string;
}) {
  const resolved = tone ?? toneMap[label] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        toneClasses[resolved],
        className,
      )}
    >
      {label}
    </span>
  );
}
