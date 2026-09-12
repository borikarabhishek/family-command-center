import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Upload } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { DemoNotice } from "@/components/common/DemoNotice";
import { FilterButton } from "@/components/FilterButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { memberById } from "@/data/demo";
import { DOCUMENT_CATEGORIES } from "@/data/constants";
import { searchDocuments } from "@/data/demo.helpers";
import { formatDateIN } from "@/lib/format";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "Document Vault — FamilyOS" },
      {
        name: "description",
        content:
          "A secure family vault for identity, insurance, property, tax and legal documents with owners, expiry dates and review status.",
      },
      { property: "og:title", content: "Document Vault — FamilyOS" },
      {
        property: "og:description",
        content: "Every important family document, categorised and tracked for expiry.",
      },
    ],
  }),
  component: VaultPage,
});

export function VaultPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const docs = useMemo(() => searchDocuments(query, category), [query, category]);

  return (
    <AppShell>
      <PageHeader
        title="Document vault"
        description="Every important family document in one categorised, access-controlled place."
        action={
          <Button>
            <Upload className="size-4" /> Upload document
          </Button>
        }
      />

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search documents (e.g. passport, policy, deed)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
          role="group"
          aria-label="Filter documents by category"
        >
          {DOCUMENT_CATEGORIES.map((c) => (
            <FilterButton
              key={c}
              label={c}
              category="documents"
              isActive={category === c}
              onClick={() => setCategory(c)}
            />
          ))}
        </div>
      </div>

      {docs.length ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {docs.map((d) => (
            <article key={d.id} className="surface p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium leading-snug">{d.name}</p>
                <StatusBadge label={d.status} />
              </div>
              <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <dt>Category</dt>
                  <dd className="text-foreground">{d.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Owner</dt>
                  <dd className="text-foreground">{memberById(d.ownerId)?.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Uploaded</dt>
                  <dd>{formatDateIN(d.uploadedAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Expiry</dt>
                  <dd>{d.expiresAt ? formatDateIN(d.expiresAt) : "No expiry"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            title="No documents match"
            description="Try a different search term or category. You can also upload a new document to this category."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Clear filters
              </Button>
            }
          />
        </div>
      )}

      <DemoNotice message="Documents shown are simulated. Verification and OCR are not implemented in this prototype." />
    </AppShell>
  );
}
