import { createFileRoute } from "@tanstack/react-router";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { DemoNotice } from "@/components/common/DemoNotice";
import { demoAssets, demoLiabilities, memberById, totals } from "@/data/demo";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/financial")({
  head: () => ({
    meta: [
      { title: "Financial Overview — FamilyOS" },
      {
        name: "description",
        content:
          "Consolidated family net worth, asset allocation, liabilities and monthly obligations — simulated prototype data.",
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

export function FinancialPage() {
  const byCategory = Object.entries(
    demoAssets.reduce<Record<string, number>>((acc, a) => {
      acc[a.category] = (acc[a.category] ?? 0) + a.value;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  return (
    <AppShell>
      <PageHeader
        title="Financial overview"
        description="What your family owns, owes and pays each month — consolidated in one place."
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total assets" value={formatINR(totals.assets, { compact: true })} />
        <StatCard
          label="Total liabilities"
          value={formatINR(totals.liabilities, { compact: true })}
        />
        <StatCard
          label="Net worth"
          value={formatINR(totals.netWorth, { compact: true })}
          emphasis
        />
        <StatCard
          label="Monthly obligations"
          value={formatINR(totals.monthlyObligations, { compact: true })}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="surface p-5">
          <p className="label-caps">Asset allocation</p>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={82}
                >
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
        </div>

        <div className="surface lg:col-span-2">
          <p className="label-caps border-b border-border px-4 py-3">Assets</p>
          <ul className="divide-y divide-border">
            {demoAssets.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.category} · {memberById(a.ownerId)?.name}
                  </p>
                </div>
                <span className="numeric font-medium">{formatINR(a.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface mt-6">
        <p className="label-caps border-b border-border px-4 py-3">Liabilities</p>
        <ul className="divide-y divide-border">
          {demoLiabilities.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{l.name}</p>
                <p className="text-xs text-muted-foreground">
                  {l.category} · {memberById(l.ownerId)?.name} · EMI{" "}
                  {formatINR(l.monthlyObligation)}
                </p>
              </div>
              <span className="numeric font-medium">{formatINR(l.outstanding)}</span>
            </li>
          ))}
        </ul>
      </section>

      <DemoNotice message="Data shown is simulated for prototype purposes. FamilyOS is not an investment adviser and makes no investment recommendations." />
    </AppShell>
  );
}
