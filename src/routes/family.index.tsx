import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, ShieldCheck, UserPlus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DemoNotice } from "@/components/common/DemoNotice";
import { Button } from "@/components/ui/button";
import { demoDocuments, demoFamily, demoMembers, demoTasks } from "@/data/demo";
import { ageFromDOB, initials } from "@/lib/format";

export const Route = createFileRoute("/family/")({
  head: () => ({
    meta: [
      { title: "Family — FamilyOS" },
      {
        name: "description",
        content:
          "Your household structure: members, relationships, roles, permissions and what each person is responsible for.",
      },
      { property: "og:title", content: "Family — FamilyOS" },
      {
        property: "og:description",
        content: "Household members, roles, permissions and responsibilities in one place.",
      },
    ],
  }),
  component: FamilyPage,
});

function FamilyPage() {
  return (
    <AppShell>
      <PageHeader
        title={demoFamily.name}
        description={`${demoMembers.length} members · ${demoFamily.city} · workspace created ${demoFamily.createdAt}`}
        action={
          <Button>
            <UserPlus className="size-4" /> Add family member
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {demoMembers.map((m) => {
          const docs = demoDocuments.filter((d) => d.ownerId === m.id).length;
          const tasks = demoTasks.filter(
            (t) => t.assigneeId === m.id && t.status !== "Completed",
          ).length;
          return (
            <Link
              key={m.id}
              to="/family/$memberId"
              params={{ memberId: m.id }}
              className="surface group p-5 transition-colors hover:border-accent/50"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-foreground">
                  {initials(m.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.relationship} · {ageFromDOB(m.dob)} years
                  </p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge label={m.role} tone="neutral" />
                <StatusBadge label={m.verification} />
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Metric label="Documents" value={docs} />
                <Metric label="Open tasks" value={tasks} />
                <Metric label="Access" value={m.permission === "Owner" ? "Full" : m.permission} />
              </dl>
            </Link>
          );
        })}
      </div>

      <div className="surface mt-6 p-5">
        <p className="label-caps flex items-center gap-2">
          <ShieldCheck className="size-3.5" /> Permission model
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          {[
            ["Owner", "Full access. Approves professional engagements and data sharing."],
            ["Member", "Sees shared family records and their own financial details."],
            ["Viewer", "Read-only on records explicitly shared with them."],
            [
              "Authorized Representative",
              "Time-limited access to a specific matter only. Never the full portfolio.",
            ],
          ].map(([role, desc]) => (
            <div key={role} className="rounded-md border border-border p-3">
              <p className="font-medium">{role}</p>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <DemoNotice />
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-muted/60 px-2 py-2">
      <dt className="label-caps text-[10px]">{label}</dt>
      <dd className="numeric mt-0.5 text-sm font-semibold">{value}</dd>
    </div>
  );
}
