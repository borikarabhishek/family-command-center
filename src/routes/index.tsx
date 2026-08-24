import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FamilyOS — Your family's private operating system" },
      {
        name: "description",
        content:
          "FamilyOS is a technology and coordination platform that helps Indian families organise documents, finances, tasks and trusted professionals in one private workspace.",
      },
      { property: "og:title", content: "FamilyOS — Your family's private operating system" },
      {
        property: "og:description",
        content:
          "Organise your family's documents, finances and professional services in one secure, private workspace.",
      },
    ],
  }),
  component: Onboarding,
});

const relationships = ["Self", "Spouse", "Son", "Daughter", "Mother", "Father", "Other"];
const roles = ["Family Owner", "Family Member", "Dependent", "Authorized Representative"];
const priorityOptions = [
  "Financial organization",
  "Legal protection",
  "Document management",
  "Healthcare coordination",
  "Education",
  "Travel",
  "Business",
  "Property",
  "Professional services",
];

interface MemberDraft {
  name: string;
  relationship: string;
  dob: string;
  contact: string;
  role: string;
}

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [familyName, setFamilyName] = useState("");
  const [primary, setPrimary] = useState("");
  const [memberCount, setMemberCount] = useState("5");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("English");
  const [members, setMembers] = useState<MemberDraft[]>([
    { name: "", relationship: "Spouse", dob: "", contact: "", role: "Family Member" },
  ]);
  const [priorities, setPriorities] = useState<string[]>([
    "Financial organization",
    "Document management",
  ]);

  const steps = ["Welcome", "Household", "Members", "Priorities"];

  const togglePriority = (p: string) =>
    setPriorities((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const finish = () => navigate({ to: "/dashboard" });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:py-14">
        <header className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl">FamilyOS</p>
            <p className="text-xs text-muted-foreground">
              Your family&apos;s private operating system.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={finish}>
            Explore demo family
          </Button>
        </header>

        <ol className="mt-8 flex items-center gap-2 text-[11px] text-muted-foreground">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border text-[10px]",
                  i <= step ? "border-accent bg-accent text-accent-foreground" : "border-border",
                )}
              >
                {i < step ? <Check className="size-3" /> : i + 1}
              </span>
              <span className={cn(i === step && "font-medium text-foreground")}>{s}</span>
              {i < steps.length - 1 ? <span className="mx-1 h-px w-5 bg-border" /> : null}
            </li>
          ))}
        </ol>

        <div className="surface mt-6 flex-1 p-6 sm:p-8">
          {step === 0 ? (
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl">Welcome to FamilyOS</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                FamilyOS is a technology and coordination platform. It helps your family organise
                information, keep documents in order, track what needs attention and coordinate
                trusted professionals — lawyers, chartered accountants, insurance and financial
                advisers — in one private workspace.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "One consolidated view of your family's affairs",
                  "A secure vault for identity, property, tax and insurance documents",
                  "Tasks, deadlines and approvals the whole family can see",
                  "A coordinated way to bring in the right professional",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 text-accent" />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-6 flex items-start gap-2 rounded-md border border-dashed border-border bg-muted/50 p-3 text-xs text-muted-foreground">
                <ShieldCheck className="mt-px size-3.5 shrink-0" />
                Prototype build. FamilyOS is not a bank, broker, insurer, law firm, CA firm or
                investment adviser. All figures and professionals shown are simulated.
              </p>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="max-w-2xl">
              <h2 className="text-2xl">Create your household</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This becomes your family workspace. You can change everything later.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="familyName">Family name</Label>
                  <Input
                    id="familyName"
                    placeholder="The Rao Family"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary">Primary member</Label>
                  <Input
                    id="primary"
                    placeholder="Abhishek Rao"
                    value={primary}
                    onChange={(e) => setPrimary(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="count">Number of family members</Label>
                  <Input
                    id="count"
                    type="number"
                    min={1}
                    value={memberCount}
                    onChange={(e) => setMemberCount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Pune"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preferred language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["English", "हिन्दी", "मराठी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ"].map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h2 className="text-2xl">Add family members</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add the people whose affairs this workspace will coordinate.
              </p>
              <div className="mt-6 space-y-4">
                {members.map((m, idx) => (
                  <div key={idx} className="rounded-lg border border-border p-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          placeholder="Sneha Rao"
                          value={m.name}
                          onChange={(e) =>
                            setMembers((prev) =>
                              prev.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Relationship</Label>
                        <Select
                          value={m.relationship}
                          onValueChange={(v) =>
                            setMembers((prev) =>
                              prev.map((x, i) => (i === idx ? { ...x, relationship: v } : x)),
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {relationships.map((r) => (
                              <SelectItem key={r} value={r}>
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Date of birth</Label>
                        <Input
                          type="date"
                          value={m.dob}
                          onChange={(e) =>
                            setMembers((prev) =>
                              prev.map((x, i) => (i === idx ? { ...x, dob: e.target.value } : x)),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact</Label>
                        <Input
                          placeholder="+91 98200 41121"
                          value={m.contact}
                          onChange={(e) =>
                            setMembers((prev) =>
                              prev.map((x, i) =>
                                i === idx ? { ...x, contact: e.target.value } : x,
                              ),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select
                          value={m.role}
                          onValueChange={(v) =>
                            setMembers((prev) =>
                              prev.map((x, i) => (i === idx ? { ...x, role: v } : x)),
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((r) => (
                              <SelectItem key={r} value={r}>
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {members.length > 1 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 text-destructive"
                        onClick={() => setMembers((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        Remove member
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() =>
                  setMembers((prev) => [
                    ...prev,
                    { name: "", relationship: "Son", dob: "", contact: "", role: "Dependent" },
                  ])
                }
              >
                Add another member
              </Button>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="max-w-3xl">
              <h2 className="text-2xl">What should FamilyOS help with first?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose as many as apply. This shapes your dashboard.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {priorityOptions.map((p) => {
                  const selected = priorities.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePriority(p)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-colors",
                        selected
                          ? "border-accent bg-accent/15 text-foreground"
                          : "border-border text-muted-foreground hover:border-accent/50",
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={finish}>Set up my FamilyOS</Button>
          )}
        </div>
      </div>
    </div>
  );
}
