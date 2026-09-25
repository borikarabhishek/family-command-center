import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { DemoNotice } from "@/components/common/DemoNotice";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFamily } from "@/data/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Security — FamilyOS" },
      {
        name: "description",
        content:
          "Family settings, member permissions, two-factor authentication, sessions and data-sharing preferences.",
      },
      { property: "og:title", content: "Settings & Security — FamilyOS" },
      {
        property: "og:description",
        content: "Control who in your family can see what, and how the workspace is secured.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [sharing, setSharing] = useState(true);
  const { family, members, isSecureDemo } = useFamily();

  return (
    <AppShell>
      <PageHeader
        title="Settings"
        description="Family profile, permissions and security controls."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface p-5">
          <p className="label-caps">Family</p>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Family name" value={family.name} />
            <Row label="City" value={family.city} />
            <Row label="Preferred language" value={family.language} />
            <Row label="Members" value={String(members.length)} />
          </dl>
        </section>

        <section className="surface p-5">
          <p className="label-caps">Security</p>
          <div className="mt-3 space-y-4">
            <Toggle
              id="2fa"
              label="Two-factor authentication"
              hint="Required for the family owner."
              checked={twoFactor}
              onChange={setTwoFactor}
              disabled={isSecureDemo}
            />
            <Toggle
              id="bio"
              label="Biometric login"
              hint="Use Face ID or fingerprint on mobile."
              checked={biometric}
              onChange={setBiometric}
              disabled={isSecureDemo}
            />
            <Toggle
              id="share"
              label="Professional data sharing"
              hint="Professionals only see records approved for their matter."
              checked={sharing}
              onChange={setSharing}
              disabled={isSecureDemo}
            />
            <Button variant="outline" size="sm" disabled={isSecureDemo}>
              Manage active sessions
            </Button>
          </div>
        </section>

        <section className="surface p-5 lg:col-span-2">
          <p className="label-caps">Member permissions</p>
          <ul className="mt-3 divide-y divide-border text-sm">
            {members.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
                <span className="text-xs text-muted-foreground">{m.permission}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <DemoNotice message="Security toggles are simulated in this prototype and do not yet enforce real authentication." />
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Toggle({
  id,
  label,
  hint,
  checked,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
