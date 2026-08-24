import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  CalendarClock,
  FileText,
  ListChecks,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DemoNotice } from "@/components/common/DemoNotice";
import { Button } from "@/components/ui/button";
import {
  demoApprovals,
  demoDocuments,
  demoEvents,
  demoMembers,
  demoTasks,
  memberById,
  netWorthTrend,
  totals,
} from "@/data/demo";
import { formatDateIN, formatINR, daysUntil } from "@/lib/format";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Family Dashboard — FamilyOS" },
      {
        name: "description",
        content:
          "A consolidated view of your family's members, documents, finances, deadlines and pending approvals.",
      },
      { property: "og:title", content: "Family Dashboard — FamilyOS" },
      {
        property: "og:description",
        content: "Your family's affairs at a glance: finances, documents, tasks and approvals.",
      },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  { label: "Add family member", to: "/family" },
  { label: "Upload document", to: "/vault" },
  { label: "Create task", to: "/tasks" },
  { label: "Request professional", to: "/services" },
  { label: "Add asset", to: "/financial" },
  { label: "Add liability", to: "/financial" },
] as const;

function Dashboard() {
  const upcoming = [...demoEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const attention = demoDocuments.filter(
    (d) => d.status === "Expiring Soon" || d.status === "Expired",
  );
  const openTasks = demoTasks.filter((t) => t.status !== "Completed");
  const pendingApprovals = demoApprovals.filter((a) => a.status === "Pending");

  return (
    <AppShell>
      <PageHeader
        title="Good morning, Abhishek"
        description="Your family's affairs at a glance."
        action={
          <Button asChild>
            <Link to="/services">Request a professional</Link>
          </Button>
        }
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Family members" value={demoMembers.length} icon={<Users className="size-4" />} />
        <StatCard
          label="Documents"
          value={demoDocuments.length}
          hint={`${attention.length} need attention`}
          icon={<FileText className="size-4" />}
        />
        <StatCard label="Active tasks" value={openTasks.length} icon={<ListChecks className="size-4" />} />
        <StatCard
          label="Upcoming deadlines"
          value={upcoming.filter((e) => daysUntil(e.date) <= 30).length}
          icon={<CalendarClock className="size-4" />}
        />
        <StatCard
          label="Pending approvals"
          value={pendingApprovals.length}
          icon={<ShieldCheck className="size-4" />}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-caps">Net worth</p>
              <p className="numeric mt-1 font-display text-3xl">
                {formatINR(totals.netWorth, { compact: true })}
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/financial">
                Financial overview <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={netWorthTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="nw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="var(--color-muted-foreground)"
                />
                <YAxis
                  tickFormatter={(v: number) => `${(v / 1_00_00_000).toFixed(1)}Cr`}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  fontSize={11}
                  stroke="var(--color-muted-foreground)"
                />
                <Tooltip
                  formatter={(v: number) => formatINR(v)}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#nw)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Figure label="Total assets" value={formatINR(totals.assets, { compact: true })} />
            <Figure label="Total liabilities" value={formatINR(totals.liabilities, { compact: true })} />
            <Figure label="Net worth" value={formatINR(totals.netWorth, { compact: true })} />
            <Figure
              label="Monthly obligations"
              value={formatINR(totals.monthlyObligations, { compact: true })}
            />
          </div>
        </div>

        <div className="surface p-5">
          <p className="label-caps">Priority alerts</p>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 text-warning" />
              <span>
                {attention.length} documents require attention
                <Link to="/vault" className="ml-1 text-accent underline-offset-4 hover:underline">
                  Review
                </Link>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 text-info" />
              <span>
                {pendingApprovals.length} approvals awaiting the family owner
                <Link to="/tasks" className="ml-1 text-accent underline-offset-4 hover:underline">
                  Open
                </Link>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Banknote className="mt-0.5 size-4 text-muted-foreground" />
              <span>1 professional service request awaiting response</span>
            </li>
          </ul>

          <p className="label-caps mt-6">Quick actions</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {quickActions.map((a) => (
              <Button key={a.label} variant="outline" size="sm" className="justify-start" asChild>
                <Link to={a.to}>+ {a.label.replace("Add ", "").replace("Request ", "")}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="surface p-5">
          <div className="flex items-center justify-between">
            <p className="label-caps">Upcoming</p>
            <Link to="/calendar" className="text-xs text-accent hover:underline">
              Calendar
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {upcoming.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateIN(e.date)} · {memberById(e.memberId)?.name ?? "Family"}
                  </p>
                </div>
                <StatusBadge label={e.type} />
              </li>
            ))}
          </ul>
        </div>

        <div className="surface p-5">
          <div className="flex items-center justify-between">
            <p className="label-caps">Needs your attention</p>
            <Link to="/tasks" className="text-xs text-accent hover:underline">
              All tasks
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {openTasks.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due {formatDateIN(t.dueDate)} · {memberById(t.assigneeId)?.name}
                  </p>
                </div>
                <StatusBadge label={t.priority} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <DemoNotice />
    </AppShell>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border px-3 py-2">
      <p className="label-caps">{label}</p>
      <p className="numeric mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}
