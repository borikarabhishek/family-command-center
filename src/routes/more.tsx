import { createFileRoute, Link } from "@tanstack/react-router";
import { Banknote, Briefcase, CalendarDays, ChevronRight, ListChecks, MessageSquare, Settings } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { DemoNotice } from "@/components/common/DemoNotice";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "More — FamilyOS" },
      {
        name: "description",
        content:
          "Reach the financial overview, calendar, messages and settings sections of your family workspace.",
      },
      { property: "og:title", content: "More — FamilyOS" },
      { property: "og:description", content: "The rest of your FamilyOS workspace." },
    ],
  }),
  component: MorePage,
});

const links = [
  { to: "/financial", label: "Financial Overview", icon: Banknote },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function MorePage() {
  return (
    <AppShell>
      <PageHeader title="More" description="The rest of your family workspace." />
      <ul className="surface divide-y divide-border">
        {links.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link to={to} className="flex items-center gap-3 px-4 py-4 text-sm">
              <Icon className="size-4 text-muted-foreground" />
              <span className="flex-1 font-medium">{label}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
      <DemoNotice message="FamilyOS is a technology and coordination platform — not a bank, broker, insurer, law firm, CA firm or investment adviser." />
    </AppShell>
  );
}
