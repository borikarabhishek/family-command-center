import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Field, Picker } from "./MemberFormDialog";
import { useFamily } from "@/data/store";
import type { DocumentCategory, ServiceRequest } from "@/data/types";

const allCategories: DocumentCategory[] = [
  "Identity",
  "Financial",
  "Insurance",
  "Property",
  "Legal",
  "Education",
  "Healthcare",
  "Business",
  "Tax",
  "Travel",
  "Family",
];

const durations = ["7", "14", "30", "60", "90"] as const;

const suggested: Partial<Record<string, DocumentCategory[]>> = {
  Legal: ["Legal", "Property", "Identity"],
  "CA / Tax": ["Tax", "Financial"],
  Insurance: ["Insurance", "Healthcare"],
  "Financial Planning": ["Financial", "Insurance"],
  "Real Estate": ["Property", "Legal"],
};

export function AccessRequestDialog({
  request,
  trigger,
}: {
  request: ServiceRequest;
  trigger: ReactNode;
}) {
  const { requestAccessApproval, professionalById, documents, members } = useFamily();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [includeFinancials, setIncludeFinancials] = useState(false);
  const [days, setDays] = useState<string>("30");
  const [amount, setAmount] = useState("");

  const professional = professionalById(request.professionalId);

  useEffect(() => {
    if (!open) return;
    setCategories(suggested[request.category] ?? []);
    setMemberIds([request.memberId]);
    setIncludeFinancials(false);
    setDays("30");
    setAmount("");
  }, [open, request]);

  const toggle = <T,>(list: T[], v: T) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  const previewCount = documents.filter(
    (d) => categories.includes(d.category) && (memberIds.length === 0 || memberIds.includes(d.ownerId)),
  ).length;

  const submit = () => {
    if (!request.professionalId) {
      toast.error("Assign a professional first");
      return;
    }
    if (categories.length === 0) {
      toast.error("Choose at least one document category to share");
      return;
    }
    requestAccessApproval({
      requestId: request.id,
      professionalId: request.professionalId,
      categories,
      memberIds,
      includeFinancials,
      accessDays: Number(days),
      amount: amount ? Number(amount) : undefined,
      detail: `${professional?.name ?? "The professional"} would get view-only access to ${
        categories.length
      } document ${categories.length === 1 ? "category" : "categories"} (${categories.join(
        ", ",
      )}) for ${memberIds.length || members.length} member(s), for ${days} days${
        includeFinancials ? ", including the financial summary" : ", excluding financial figures"
      }.`,
    });
    toast.success("Sent to the family owner for approval");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send for family approval</DialogTitle>
          <DialogDescription>
            Choose exactly what {professional?.name ?? "the professional"} may see. Access is
            view-only and expires automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="label-caps mb-2 block">Document categories</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {allCategories.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={categories.includes(c)}
                    onCheckedChange={() => setCategories((l) => toggle(l, c))}
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="label-caps mb-2 block">Whose records</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {members.map((m) => (
                <label key={m.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={memberIds.includes(m.id)}
                    onCheckedChange={() => setMemberIds((l) => toggle(l, m.id))}
                  />
                  {m.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <p className="text-sm font-medium">Share financial summary</p>
              <p className="text-xs text-muted-foreground">Net worth and totals, never statements.</p>
            </div>
            <Switch checked={includeFinancials} onCheckedChange={setIncludeFinancials} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Access expires after (days)">
              <Picker value={days} options={durations} onChange={(v) => setDays(v)} />
            </Field>
            <Field label="Estimated fee (₹, optional)">
              <Input
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Field>
          </div>

          <p className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            With these settings the professional would see <strong>{previewCount}</strong> document
            {previewCount === 1 ? "" : "s"} and nothing else.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Send for approval</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
