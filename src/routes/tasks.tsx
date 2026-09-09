import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DemoNotice } from "@/components/common/DemoNotice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoApprovals, demoTasks, memberById } from "@/data/demo";
import { formatDateIN, formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks & Approvals — FamilyOS" },
      {
        name: "description",
        content:
          "Track family tasks, deadlines and owner approvals — renewals, fees, filings and document sharing decisions.",
      },
      { property: "og:title", content: "Tasks & Approvals — FamilyOS" },
      {
        property: "og:description",
        content: "Everything your family needs to act on, and everything awaiting approval.",
      },
    ],
  }),
  component: TasksPage,
});

const filters = ["All", "To Do", "In Progress", "Waiting", "Completed"];

function TasksPage() {
  const [filter, setFilter] = useState("All");
  const tasks = demoTasks.filter((t) => filter === "All" || t.status === filter);

  return (
    <AppShell>
      <PageHeader
        title="Tasks & approvals"
        description="What the family needs to act on, and what needs the owner's decision."
        action={<Button>Create task</Button>}
      />

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="approvals">
            Approvals ({demoApprovals.filter((a) => a.status === "Pending").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-4">
          <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Filter tasks by status">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-label={`Filter tasks by ${f}`}
                aria-pressed={filter === f}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors",
                  filter === f
                    ? "border-accent bg-accent/15 text-foreground"
                    : "border-border text-muted-foreground hover:border-accent/50",
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <ul className="surface divide-y divide-border">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.category} · {memberById(t.assigneeId)?.name} · due{" "}
                    {formatDateIN(t.dueDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge label={t.priority} />
                  <StatusBadge label={t.status} />
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="approvals" className="mt-4 space-y-3">
          {demoApprovals.map((a) => (
            <article key={a.id} className="surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{a.request}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Requested by {memberById(a.requestedById)?.name} · {formatDateIN(a.date)}
                    {a.amount ? ` · ${formatINR(a.amount)}` : ""}
                  </p>
                </div>
                <StatusBadge label={a.status} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{a.detail}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm">Approve</Button>
                <Button size="sm" variant="outline">
                  Reject
                </Button>
                <Button size="sm" variant="ghost">
                  View details
                </Button>
              </div>
            </article>
          ))}
        </TabsContent>
      </Tabs>

      <DemoNotice />
    </AppShell>
  );
}
