import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { DemoNotice } from "@/components/common/DemoNotice";
import { demoConversations } from "@/data/demo";
import { formatDateIN, initials } from "@/lib/format";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — FamilyOS" },
      {
        name: "description",
        content:
          "A single private thread per family matter and per professional, so context never gets lost across chat apps.",
      },
      { property: "og:title", content: "Messages — FamilyOS" },
      {
        property: "og:description",
        content: "Private family and professional conversations, kept in context.",
      },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  return (
    <AppShell>
      <PageHeader
        title="Messages"
        description="Conversations with your family and the professionals working on your matters."
      />

      <ul className="surface divide-y divide-border">
        {demoConversations.map((c) => (
          <li key={c.id} className="flex items-center gap-3 px-4 py-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
              {initials(c.title)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-medium">{c.title}</p>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {formatDateIN(c.lastAt)}
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {c.participant} · {c.lastMessage}
              </p>
            </div>
            {c.unread ? (
              <span className="numeric flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {c.unread}
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      <DemoNotice message="Messaging is a visual prototype. Real-time delivery is not implemented yet." />
    </AppShell>
  );
}
