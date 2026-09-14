import { useEffect, useState, type ReactNode } from "react";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, MemberPicker, Picker } from "./MemberFormDialog";
import { useFamily } from "@/data/store";
import { addDaysISO } from "@/lib/format";
import type { Priority, ServiceCategory } from "@/data/types";

export const serviceCategories: ServiceCategory[] = [
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

const urgencies: Priority[] = ["Low", "Medium", "High"];

const schema = z.object({
  summary: z.string().trim().min(5, "Describe what you need in a few words").max(200),
  memberId: z.string().trim().min(1, "Choose who this is for"),
  preferredDate: z.string().trim().min(1, "Pick a preferred date"),
  budgetRange: z.string().trim().max(60),
});

export function ServiceRequestDialog({
  trigger,
  defaultCategory,
  defaultProfessionalId,
}: {
  trigger: ReactNode;
  defaultCategory?: ServiceCategory;
  defaultProfessionalId?: string;
}) {
  const { createRequest, assignProfessional, members, family } = useFamily();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    summary: "",
    memberId: family.primaryMemberId || members[0]?.id || "",
    preferredDate: addDaysISO(7),
    budgetRange: "",
    category: defaultCategory ?? ("Legal" as ServiceCategory),
    urgency: "Medium" as Priority,
  });

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm({
      summary: "",
      memberId: family.primaryMemberId || members[0]?.id || "",
      preferredDate: addDaysISO(7),
      budgetRange: "",
      category: defaultCategory ?? "Legal",
      urgency: "Medium",
    });
  }, [open, defaultCategory, family.primaryMemberId, members]);

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the details");
      return;
    }
    const id = createRequest({
      summary: parsed.data.summary,
      memberId: parsed.data.memberId,
      preferredDate: parsed.data.preferredDate,
      budgetRange: parsed.data.budgetRange || "To be discussed",
      category: form.category,
      urgency: form.urgency,
    });
    if (defaultProfessionalId) assignProfessional(id, defaultProfessionalId);
    toast.success("Request created", {
      description: defaultProfessionalId
        ? "Professional assigned. Next: send it for family approval."
        : "Next: assign a professional from the directory.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request a professional</DialogTitle>
          <DialogDescription>
            Nothing is shared with a professional until the family owner approves the exact records.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="What do you need?" className="sm:col-span-2">
            <Textarea
              rows={3}
              maxLength={200}
              value={form.summary}
              placeholder="Review the ancestral property title and registered will"
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
            />
          </Field>
          <Field label="Category">
            <Picker
              value={form.category}
              options={serviceCategories}
              onChange={(v) => setForm((f) => ({ ...f, category: v }))}
            />
          </Field>
          <Field label="For which member">
            <MemberPicker
              value={form.memberId}
              onChange={(v) => setForm((f) => ({ ...f, memberId: v }))}
            />
          </Field>
          <Field label="Urgency">
            <Picker
              value={form.urgency}
              options={urgencies}
              onChange={(v) => setForm((f) => ({ ...f, urgency: v }))}
            />
          </Field>
          <Field label="Preferred date">
            <Input
              type="date"
              value={form.preferredDate}
              onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))}
            />
          </Field>
          <Field label="Budget range" className="sm:col-span-2">
            <Input
              value={form.budgetRange}
              placeholder="₹10,000 – ₹25,000"
              maxLength={60}
              onChange={(e) => setForm((f) => ({ ...f, budgetRange: e.target.value }))}
            />
          </Field>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Create request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
