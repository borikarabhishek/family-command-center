import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DemoNotice } from "@/components/common/DemoNotice";
import { demoEvents, memberById } from "@/data/demo";
import { daysUntil, formatDateIN } from "@/lib/format";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Family Calendar — FamilyOS" },
      {
        name: "description",
        content:
          "Renewals, payments, filings and appointments for the whole household on a single family timeline.",
      },
      { property: "og:title", content: "Family Calendar — FamilyOS" },
      {
        property: "og:description",
        content: "Every family deadline and appointment on one timeline.",
      },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const events = [...demoEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <AppShell>
      <PageHeader
        title="Family calendar"
        description="Deadlines and appointments drawn from documents, tasks and service requests."
      />

      <ol className="surface divide-y divide-border">
        {events.map((e) => {
          const days = daysUntil(e.date);
          return (
            <li key={e.id} className="flex items-center gap-4 px-4 py-4">
              <div className="w-16 shrink-0 rounded-md border border-border px-2 py-1.5 text-center">
                <p className="label-caps text-[10px]">
                  {new Date(e.date).toLocaleString("en-IN", { month: "short" })}
                </p>
                <p className="numeric font-display text-lg leading-none">
                  {new Date(e.date).getDate()}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{e.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateIN(e.date)} · {memberById(e.memberId)?.name ?? "Family"} ·{" "}
                  {days >= 0 ? `in ${days} days` : `${Math.abs(days)} days ago`}
                </p>
              </div>
              <StatusBadge label={e.type} />
            </li>
          );
        })}
      </ol>

      <DemoNotice />
    </AppShell>
  );
}
