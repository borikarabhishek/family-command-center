import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DemoNotice } from "@/components/common/DemoNotice";
import { Button } from "@/components/ui/button";
import { demoProfessionals, demoServiceRequests, memberById } from "@/data/demo";
import { useFamily } from "@/data/store";
import { formatDateIN } from "@/lib/format";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Professional Services — FamilyOS" },
      {
        name: "description",
        content:
          "Coordinate lawyers, chartered accountants, insurance and financial professionals for your family, and track every request end to end.",
      },
      { property: "og:title", content: "Professional Services — FamilyOS" },
      {
        property: "og:description",
        content: "Get the right professional when your family needs one.",
      },
    ],
  }),
  component: ServicesPage,
});

const categories = [
  "Legal",
  "CA / Tax",
  "Financial Planning",
  "Insurance",
  "Healthcare",
  "Education",
  "Travel",
  "Real Estate",
  "Property Management",
  "Business",
  "Compliance",
  "Cybersecurity",
];

function ServicesPage() {
  const { isSecureDemo } = useFamily();
  const secureDemoProps = isSecureDemo ? { "aria-describedby": "secure-demo-notice" } : {};
  return (
    <AppShell>
      <PageHeader
        title="Get the right professional when your family needs one."
        description="FamilyOS coordinates the engagement. It does not provide legal, tax, insurance or investment advice itself."
        action={
          <Button disabled={isSecureDemo} {...secureDemoProps}>
            Request a service
          </Button>
        }
      />

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
        {categories.map((c) => (
          <span
            key={c}
            className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
          >
            {c}
          </span>
        ))}
      </div>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {demoProfessionals.map((p) => (
          <article key={p.id} className="surface p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.profession} · {p.specialization}
                </p>
              </div>
              <span className="numeric flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3.5 text-accent" />
                {p.rating}
              </span>
            </div>
            <dl className="mt-4 space-y-1 text-xs text-muted-foreground">
              <Row label="Experience" value={`${p.experienceYears} years`} />
              <Row label="Location" value={p.location} />
              <Row label="Availability" value={p.availability} />
              <Row label="Indicative fee" value={p.indicativeFee} />
            </dl>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                View profile
              </Button>
              <Button size="sm" className="flex-1" disabled={isSecureDemo} {...secureDemoProps}>
                Request service
              </Button>
            </div>
          </article>
        ))}
      </section>

      <section className="surface mt-6">
        <p className="label-caps border-b border-border px-4 py-3">Your service requests</p>
        <ul className="divide-y divide-border">
          {demoServiceRequests.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{r.summary}</p>
                <p className="text-xs text-muted-foreground">
                  {r.category} · {memberById(r.memberId)?.name} · preferred{" "}
                  {formatDateIN(r.preferredDate)} · {r.budgetRange}
                </p>
              </div>
              <StatusBadge label={r.status} />
            </li>
          ))}
        </ul>
      </section>

      <DemoNotice message="Professionals shown are fictional demo profiles created for this prototype. They are not real, listed or verified practitioners." />
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt>{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
