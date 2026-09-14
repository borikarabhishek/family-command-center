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
import { Field, MemberPicker, Picker } from "./MemberFormDialog";
import { useFamily } from "@/data/store";
import type { Liability, LiabilityCategory } from "@/data/types";

const categories: LiabilityCategory[] = [
  "Home loan",
  "Personal loan",
  "Credit card",
  "Education loan",
  "Other liabilities",
];

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  outstanding: z.coerce.number().min(0, "Outstanding must be zero or more").max(1e13),
  monthlyObligation: z.coerce.number().min(0, "Monthly amount must be zero or more").max(1e10),
  institution: z.string().trim().max(80),
  ownerId: z.string().trim().min(1, "Choose who this belongs to"),
});

export function LiabilityFormDialog({
  liability,
  trigger,
}: {
  liability?: Liability;
  trigger: ReactNode;
}) {
  const { saveLiability, members } = useFamily();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    outstanding: "",
    monthlyObligation: "",
    institution: "",
    ownerId: members[0]?.id ?? "",
    category: "Home loan" as LiabilityCategory,
  });

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      liability
        ? {
            name: liability.name,
            outstanding: String(liability.outstanding),
            monthlyObligation: String(liability.monthlyObligation),
            institution: liability.institution ?? "",
            ownerId: liability.ownerId,
            category: liability.category,
          }
        : {
            name: "",
            outstanding: "",
            monthlyObligation: "",
            institution: "",
            ownerId: members[0]?.id ?? "",
            category: "Home loan",
          },
    );
  }, [open, liability, members]);

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the details");
      return;
    }
    saveLiability({
      ...(liability ? { id: liability.id } : {}),
      name: parsed.data.name,
      outstanding: parsed.data.outstanding,
      monthlyObligation: parsed.data.monthlyObligation,
      ownerId: parsed.data.ownerId,
      category: form.category,
      institution: parsed.data.institution || undefined,
    });
    toast.success(liability ? "Liability updated" : "Liability added");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{liability ? "Edit liability" : "Add liability"}</DialogTitle>
          <DialogDescription>Loans, cards and anything the family owes.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" className="sm:col-span-2">
            <Input
              value={form.name}
              placeholder="Home loan — Baner"
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              maxLength={80}
            />
          </Field>
          <Field label="Category">
            <Picker
              value={form.category}
              options={categories}
              onChange={(v) => setForm((f) => ({ ...f, category: v }))}
            />
          </Field>
          <Field label="Owner">
            <MemberPicker
              value={form.ownerId}
              onChange={(v) => setForm((f) => ({ ...f, ownerId: v }))}
            />
          </Field>
          <Field label="Outstanding (₹)">
            <Input
              inputMode="numeric"
              value={form.outstanding}
              onChange={(e) => setForm((f) => ({ ...f, outstanding: e.target.value }))}
            />
          </Field>
          <Field label="Monthly payment (₹)">
            <Input
              inputMode="numeric"
              value={form.monthlyObligation}
              onChange={(e) => setForm((f) => ({ ...f, monthlyObligation: e.target.value }))}
            />
          </Field>
          <Field label="Institution" className="sm:col-span-2">
            <Input
              value={form.institution}
              onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
              maxLength={80}
            />
          </Field>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>{liability ? "Save changes" : "Add liability"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
