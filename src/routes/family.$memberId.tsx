import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { DemoNotice } from "@/components/common/DemoNotice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  demoAssets,
  demoDocuments,
  demoLiabilities,
  demoMembers,
  demoServiceRequests,
  demoTasks,
} from "@/data/demo";
import { ageFromDOB, formatDateIN, formatINR, initials } from "@/lib/format";

export const Route = createFileRoute("/family/$memberId")({
  loader: ({ params }) => {
    const member = demoMembers.find((m) => m.id === params.memberId);
    if (!member) throw notFound();
    return { member };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.member.name ?? "Family member";
    return {
      meta: [
        { title: `${name} — FamilyOS` },
        {
          name: "description",
          content: `Profile, documents, financial records, tasks and services for ${name}.`,
        },
        { property: "og:title", content: `${name} — FamilyOS` },
        {
          property: "og:description",
          content: `Family member profile and records for ${name}.`,
        },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: MemberProfile,
});

function MemberProfile() {
  const { member } = Route.useLoaderData();
  const docs = demoDocuments.filter((d) => d.ownerId === member.id);
  const assets = demoAssets.filter((a) => a.ownerId === member.id);
  const liabilities = demoLiabilities.filter((l) => l.ownerId === member.id);
  const tasks = demoTasks.filter((t) => t.assigneeId === member.id || t.ownerId === member.id);
  const services = demoServiceRequests.filter((s) => s.memberId === member.id);

  return (
    <AppShell>
      <Link
        to="/family"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Family
      </Link>

      <div className="surface mb-6 flex flex-wrap items-center gap-4 p-5">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary font-display text-lg text-primary-foreground">
          {initials(member.name)}
        </span>
        <div className="flex-1">
          <h1 className="text-2xl">{member.name}</h1>
          <p className="text-sm text-muted-foreground">
            {member.relationship} · {ageFromDOB(member.dob)} years · {member.city} ·{" "}
            {member.contact}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={member.role} tone="neutral" />
          <StatusBadge label={member.verification} />
          <StatusBadge label={`Access: ${member.permission}`} tone="info" />
        </div>
      </div>

      <PageHeader title="Profile" description="Everything FamilyOS coordinates for this member." />

      <Tabs defaultValue="overview">
        <TabsList className="flex w-full flex-wrap justify-start">
          {["overview", "documents", "financial", "tasks", "services", "notes"].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Tile label="Documents" value={docs.length} />
          <Tile label="Open tasks" value={tasks.filter((t) => t.status !== "Completed").length} />
          <Tile
            label="Assets held"
            value={formatINR(
              assets.reduce((s, a) => s + a.value, 0),
              { compact: true },
            )}
          />
          <Tile
            label="Liabilities"
            value={formatINR(
              liabilities.reduce((s, l) => s + l.outstanding, 0),
              { compact: true },
            )}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          {docs.length ? (
            <ul className="surface divide-y divide-border">
              {docs.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.category} · uploaded {formatDateIN(d.uploadedAt)}
                      {d.expiresAt ? ` · expires ${formatDateIN(d.expiresAt)}` : ""}
                    </p>
                  </div>
                  <StatusBadge label={d.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No documents yet"
              description="Upload identity, insurance or education records for this member to keep them in one place."
            />
          )}
        </TabsContent>

        <TabsContent value="financial" className="mt-4 space-y-4">
          <ListCard
            title="Assets"
            rows={assets.map((a) => ({
              id: a.id,
              primary: a.name,
              secondary: a.category,
              value: formatINR(a.value),
            }))}
            emptyLabel="No assets recorded for this member."
          />
          <ListCard
            title="Liabilities"
            rows={liabilities.map((l) => ({
              id: l.id,
              primary: l.name,
              secondary: `${l.category} · EMI ${formatINR(l.monthlyObligation)}`,
              value: formatINR(l.outstanding),
            }))}
            emptyLabel="No liabilities recorded for this member."
          />
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          {tasks.length ? (
            <ul className="surface divide-y divide-border">
              {tasks.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">Due {formatDateIN(t.dueDate)}</p>
                  </div>
                  <StatusBadge label={t.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Nothing pending" description="No open tasks for this member." />
          )}
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          {services.length ? (
            <ul className="surface divide-y divide-border">
              {services.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{s.summary}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.category} · preferred {formatDateIN(s.preferredDate)}
                    </p>
                  </div>
                  <StatusBadge label={s.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No service requests"
              description="When this member needs a lawyer, CA or adviser, the request will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <div className="surface p-5 text-sm text-muted-foreground">
            {member.notes ?? "No notes recorded for this member yet."}
          </div>
        </TabsContent>
      </Tabs>

      <DemoNotice />
    </AppShell>
  );
}

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="surface p-4">
      <p className="label-caps">{label}</p>
      <p className="numeric mt-1 font-display text-xl">{value}</p>
    </div>
  );
}

function ListCard({
  title,
  rows,
  emptyLabel,
}: {
  title: string;
  rows: { id: string; primary: string; secondary: string; value: string }[];
  emptyLabel: string;
}) {
  return (
    <div className="surface">
      <p className="label-caps border-b border-border px-4 py-3">{title}</p>
      {rows.length ? (
        <ul className="divide-y divide-border">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{r.primary}</p>
                <p className="text-xs text-muted-foreground">{r.secondary}</p>
              </div>
              <span className="numeric font-medium">{r.value}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-6 text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </div>
  );
}
