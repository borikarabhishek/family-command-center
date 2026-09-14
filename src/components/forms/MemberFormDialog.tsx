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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFamily } from "@/data/store";
import type { FamilyMember, MemberRole, PermissionLevel, VerificationStatus } from "@/data/types";

const roles: MemberRole[] = [
  "Family Owner",
  "Family Member",
  "Dependent",
  "Authorized Representative",
];
const permissions: PermissionLevel[] = ["Owner", "Member", "Viewer", "Authorized Representative"];
const verifications: VerificationStatus[] = ["Verified", "Pending Review", "Not Started"];

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  relationship: z.string().trim().min(1, "Relationship is required").max(40),
  dob: z.string().trim().min(1, "Date of birth is required"),
  contact: z.string().trim().max(40),
  city: z.string().trim().max(60),
  notes: z.string().trim().max(400),
});

const blank = {
  name: "",
  relationship: "",
  dob: "",
  contact: "",
  city: "",
  notes: "",
  role: "Family Member" as MemberRole,
  permission: "Member" as PermissionLevel,
  verification: "Not Started" as VerificationStatus,
};

export function MemberFormDialog({
  member,
  trigger,
}: {
  member?: FamilyMember;
  trigger: ReactNode;
}) {
  const { saveMember, family } = useFamily();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...blank, city: family.city });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      member
        ? {
            name: member.name,
            relationship: member.relationship,
            dob: member.dob,
            contact: member.contact === "—" ? "" : member.contact,
            city: member.city,
            notes: member.notes ?? "",
            role: member.role,
            permission: member.permission,
            verification: member.verification,
          }
        : { ...blank, city: family.city },
    );
  }, [open, member, family.city]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the details");
      return;
    }
    saveMember({
      ...(member ? { id: member.id } : {}),
      name: parsed.data.name,
      relationship: parsed.data.relationship,
      dob: parsed.data.dob,
      contact: parsed.data.contact || "—",
      city: parsed.data.city || family.city,
      role: form.role,
      permission: form.permission,
      verification: form.verification,
      notes: parsed.data.notes || undefined,
    });
    toast.success(member ? "Member updated" : "Family member added");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{member ? "Edit family member" : "Add family member"}</DialogTitle>
          <DialogDescription>
            Roles and access levels decide what this person — and any professional you engage — can
            see.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name" className="sm:col-span-2">
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={80} />
          </Field>
          <Field label="Relationship">
            <Input
              value={form.relationship}
              placeholder="Spouse, Son, Mother…"
              onChange={(e) => set("relationship", e.target.value)}
              maxLength={40}
            />
          </Field>
          <Field label="Date of birth">
            <Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
          </Field>
          <Field label="Contact">
            <Input
              value={form.contact}
              placeholder="+91…"
              onChange={(e) => set("contact", e.target.value)}
              maxLength={40}
            />
          </Field>
          <Field label="City">
            <Input value={form.city} onChange={(e) => set("city", e.target.value)} maxLength={60} />
          </Field>
          <Field label="Role">
            <Picker value={form.role} options={roles} onChange={(v) => set("role", v)} />
          </Field>
          <Field label="Access level">
            <Picker
              value={form.permission}
              options={permissions}
              onChange={(v) => set("permission", v)}
            />
          </Field>
          <Field label="Verification">
            <Picker
              value={form.verification}
              options={verifications}
              onChange={(v) => set("verification", v)}
            />
          </Field>
          <Field label="Notes" className="sm:col-span-2">
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              maxLength={400}
              rows={3}
            />
          </Field>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>{member ? "Save changes" : "Add member"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="label-caps mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

export function Picker<T extends string>({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: readonly T[];
  onChange: (v: T) => void;
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder ?? "Select"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function MemberPicker({
  value,
  onChange,
  includeAll,
}: {
  value: string;
  onChange: (v: string) => void;
  includeAll?: boolean;
}) {
  const { members } = useFamily();
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select member" />
      </SelectTrigger>
      <SelectContent>
        {includeAll ? <SelectItem value="all">All members</SelectItem> : null}
        {members.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            {m.name} — {m.relationship}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
