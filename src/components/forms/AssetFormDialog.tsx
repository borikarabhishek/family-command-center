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
import type { Asset, AssetCategory } from "@/data/types";

const categories: AssetCategory[] = [
  "Bank accounts",
  "Fixed deposits",
  "Mutual funds",
  "Stocks",
  "Insurance",
  "Real estate",
  "Gold",
  "Business interests",
  "Other assets",
];

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  value: z.coerce.number().min(0, "Value must be zero or more").max(1e13),
  institution: z.string().trim().max(80),
  ownerId: z.string().trim().min(1, "Choose who owns this"),
});

export function AssetFormDialog({ asset, trigger }: { asset?: Asset; trigger: ReactNode }) {
  const { saveAsset, members } = useFamily();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    value: "",
    institution: "",
    ownerId: members[0]?.id ?? "",
    category: "Bank accounts" as AssetCategory,
  });

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      asset
        ? {
            name: asset.name,
            value: String(asset.value),
            institution: asset.institution ?? "",
            ownerId: asset.ownerId,
            category: asset.category,
          }
        : {
            name: "",
            value: "",
            institution: "",
            ownerId: members[0]?.id ?? "",
            category: "Bank accounts",
          },
    );
  }, [open, asset, members]);

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the details");
      return;
    }
    saveAsset({
      ...(asset ? { id: asset.id } : {}),
      name: parsed.data.name,
      value: parsed.data.value,
      ownerId: parsed.data.ownerId,
      category: form.category,
      institution: parsed.data.institution || undefined,
    });
    toast.success(asset ? "Asset updated" : "Asset added");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{asset ? "Edit asset" : "Add asset"}</DialogTitle>
          <DialogDescription>Record what the family owns and who it belongs to.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" className="sm:col-span-2">
            <Input
              value={form.name}
              placeholder="HDFC savings, Baner apartment…"
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
          <Field label="Current value (₹)">
            <Input
              inputMode="numeric"
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
            />
          </Field>
          <Field label="Owner">
            <MemberPicker
              value={form.ownerId}
              onChange={(v) => setForm((f) => ({ ...f, ownerId: v }))}
            />
          </Field>
          <Field label="Institution">
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
          <Button onClick={submit}>{asset ? "Save changes" : "Add asset"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
