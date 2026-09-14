import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Banknote, Pencil, Plus, Trash2, Wallet } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { DemoNotice } from "@/components/common/DemoNotice";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { AssetFormDialog } from "@/components/forms/AssetFormDialog";
import { LiabilityFormDialog } from "@/components/forms/LiabilityFormDialog";
import { useFamily } from "@/data/store";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/financial")({
  head: () => ({
    meta: [
      { title: "Financial Overview — FamilyOS" },
      {
        name: "description",
        content:
          "Consolidated family net worth, asset allocation, liabilities and monthly obligations, with full add and edit control.",
      },
      { property: "og:title", content: "Financial Overview — FamilyOS" },
      {
        property: "og:description",
        content: "See what your family owns and owes in one consolidated view.",
      },
    ],
  }),
  component: FinancialPage,
});

const palette = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function FinancialPage() {
  const { assets, liabilities, totals, memberById, deleteAsset, deleteLiability, members } =
    useFamily();

  const byCategory = Object.entries(
    assets.reduce<Record<string, number>>((acc, a) => {
      acc[a.category] = (acc[a.category] ?? 0) + a.value;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const liabilityBars = Object.entries(
    liabilities.reduce<Record<string, number>>((acc, l) => {
      acc[l.category] = (acc[l.category] ?? 0) + l.outstanding;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const noMembers = members.length === 0;

  return (
    <AppShell>
      <PageHeader
        title="Financial overview"
        description="What your family owns, owes and pays each month — consolidated in one place."
        action={
          <div className="flex gap-2">
            <AssetFormDialog
              trigger={
                <Button size="sm" disabled={noMembers}>
                  <Plus className="size-4" /> Asset
                </Button>
              }
            />
            <LiabilityFormDialog
              trigger={
                <Button size="sm" variant="outline" disabled={noMembers}>
                  <Plus className="size-4" /> Liability
                </Button>
              }
            />
          </div>
        }
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total assets" value={formatINR(totals.assets, { compact: true })} />
        <StatCard label="Total liabilities" value={formatINR(totals.liabilities, { compact: true })} />
        <StatCard label="Net worth" value={formatINR(totals.netWorth, { compact: true })} emphasis />
        <StatCard
          label="Monthly obligations"
          value={formatINR(totals.monthlyObligations, { compact: true })}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="surface p-5">
          <p className="label-caps">Asset allocation</p>
          {byCategory.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Add your first asset to see the allocation chart.
            </p>
          ) : (
            <>
              <div className="mt-2 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82}>
                      {byCategory.map((_, i) => (
                        <Cell key={i} fill={palette[i % palette.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => formatINR(v)}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid var(--color-border)",
                        background: "var(--color-card)",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {byCategory.map((c, i) => (
                  <li key={c.name} className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ background: palette[i % palette.length] }}
                    />
                    {c.name}
                    <span className="numeric ml-auto">{formatINR(c.value, { compact: true })}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="surface p-5 lg:col-span-2">
          <p className="label-caps">Liabilities by type</p>
          {liabilityBars.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No liabilities recorded.</p>
          ) : (
            <div className="mt-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={liabilityBars} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    interval={0}
                    height={50}
                    angle={-18}
                    textAnchor="end"
                    stroke="var(--color-muted-foreground)"
                  />
                  <YAxis
                    tickFormatter={(v: number) => `${(v / 1_00_000).toFixed(0)}L`}
                    tickLine={false}
                    axisLine={false}
                    width={42}
                    fontSize={11}
                    stroke="var(--color-muted-foreground)"
                  />
                  <Tooltip
                    cursor={{ fill: "var(--color-muted)" }}
                    formatter={(v: number) => formatINR(v)}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--color-chart-3)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      <section className="surface mt-6">
        <p className="label-caps border-b border-border px-4 py-3">Assets</p>
        {assets.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<Wallet className="size-6" />}
              title="No assets yet"
              description="Add bank accounts, property, investments or gold to build your family's net worth picture."
              action={
                <AssetFormDialog
                  trigger={
                    <Button disabled={noMembers}>
                      <Plus className="size-4" /> Add asset
                    </Button>
                  }
                />
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {assets.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.category} · {memberById(a.ownerId)?.name ?? "Unassigned"}
                    {a.institution ? ` · ${a.institution}` : ""}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <span className="numeric mr-2 font-medium">{formatINR(a.value)}</span>
                  <AssetFormDialog
                    asset={a}
                    trigger={
                      <Button size="icon" variant="ghost" aria-label={`Edit ${a.name}`}>
                        <Pencil className="size-4" />
                      </Button>
                    }
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${a.name}`}
                    onClick={() => deleteAsset(a.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface mt-6">
        <p className="label-caps border-b border-border px-4 py-3">Liabilities</p>
        {liabilities.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<Banknote className="size-6" />}
              title="No liabilities recorded"
              description="Add loans, credit cards or any other obligations to see monthly commitments."
              action={
                <LiabilityFormDialog
                  trigger={
                    <Button disabled={noMembers}>
                      <Plus className="size-4" /> Add liability
                    </Button>
                  }
                />
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {liabilities.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.category} · {memberById(l.ownerId)?.name ?? "Unassigned"} · EMI{" "}
                    {formatINR(l.monthlyObligation)}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <span className="numeric mr-2 font-medium">{formatINR(l.outstanding)}</span>
                  <LiabilityFormDialog
                    liability={l}
                    trigger={
                      <Button size="icon" variant="ghost" aria-label={`Edit ${l.name}`}>
                        <Pencil className="size-4" />
                      </Button>
                    }
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${l.name}`}
                    onClick={() => deleteLiability(l.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <DemoNotice message="FamilyOS is not an investment adviser and makes no investment recommendations. Figures are the ones you enter." />
    </AppShell>
  );
}
