import { Info } from "lucide-react";

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
