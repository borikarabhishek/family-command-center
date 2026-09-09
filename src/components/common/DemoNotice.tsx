import { Info } from "lucide-react";

/**
 * DemoNotice displays a subtle informational banner indicating that data is simulated.
 * Used throughout the prototype to help users understand they're viewing mock data.
 *
 * @param message - Custom message to display (default: "Data shown is simulated for prototype purposes.")
 *
 * @example
 * <DemoNotice />
 * // OR
 * <DemoNotice message="This is demo data. Real data will appear once you connect to your account." />
 */
export function DemoNotice({
  message = "Data shown is simulated for prototype purposes.",
}: {
  message?: string;
}) {
  return (
    <p className="mt-6 flex items-start gap-2 rounded-md border border-dashed border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
      <Info className="mt-px size-3.5 shrink-0" />
      {message}
    </p>
  );
}
