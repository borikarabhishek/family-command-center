import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { DemoNotice } from "@/components/common/DemoNotice";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { demoFamily, demoMembers } from "@/data/demo";
import { signOut } from "@/integrations/supabase/auth";
import { AuthProvider, useAuth } from "@/integrations/supabase/AuthProvider";

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
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <AuthProvider>
      <SettingsPage />
    </AuthProvider>
  );
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [sharing, setSharing] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      await navigate({ to: "/auth" });
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Settings"
        description="Family profile, permissions and security controls."
        action={
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut className="mr-2 size-4" />
            {isSigningOut ? "Signing out…" : user ? "Sign out" : "Exit demo"}
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface p-5">
          <p className="label-caps">Family</p>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Family name" value={demoFamily.name} />
            <Row label="City" value={demoFamily.city} />
            <Row label="Preferred language" value={demoFamily.language} />
            <Row label="Members" value={String(demoMembers.length)} />
            {user ? <Row label="Account email" value={user.email ?? "Active user"} /> : null}
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
            />
            <Toggle
              id="bio"
              label="Biometric login"
              hint="Use Face ID or fingerprint on mobile."
              checked={biometric}
              onChange={setBiometric}
            />
            <Toggle
              id="share"
              label="Professional data sharing"
              hint="Professionals only see records approved for their matter."
              checked={sharing}
              onChange={setSharing}
            />
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm">
                Manage active sessions
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {user ? "Sign out of account" : "Exit demo mode"}
              </Button>
            </div>
          </div>
        </section>

        <section className="surface p-5 lg:col-span-2">
          <p className="label-caps">Member permissions</p>
          <ul className="mt-3 divide-y divide-border text-sm">
            {demoMembers.map((m) => (
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
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
