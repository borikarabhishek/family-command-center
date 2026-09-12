import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithPassword, signUpWithPassword } from "@/integrations/supabase/auth";
import { AuthProvider, useAuth } from "@/integrations/supabase/AuthProvider";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — FamilyOS" },
      { name: "description", content: "Sign in to your private FamilyOS workspace." },
    ],
  }),
  component: AuthRoute,
});

function AuthRoute() {
  return (
    <AuthProvider>
      <AuthPage />
    </AuthProvider>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { isConfigured, user } = useAuth();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) void navigate({ to: "/" });
  }, [navigate, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      const result =
        mode === "signIn"
          ? await signInWithPassword(email, password)
          : await signUpWithPassword(email, password);

      if (result.error) {
        setMessage(result.error.message);
      } else if (mode === "signUp") {
        setMessage("Check your email to confirm your account, then sign in.");
      } else {
        await navigate({ to: "/" });
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to authenticate. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="max-w-md text-center text-sm text-muted-foreground">
          Supabase is not configured. Add the public project URL and publishable key to
          <code className="mx-1 rounded bg-muted px-1 py-0.5">.env.local</code>.
        </p>
      </main>
    );
  }

  if (user) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="surface w-full max-w-md p-6 sm:p-8">
        <h1 className="font-display text-2xl">
          {mode === "signIn" ? "Welcome back" : "Create account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signIn"
            ? "Sign in to create or access your family workspace."
            : "Create a private FamilyOS account to save your family workspace."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {message ? (
            <p role="alert" className="text-sm text-destructive">
              {message}
            </p>
          ) : null}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait…" : mode === "signIn" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <Button
          className="mt-3 w-full"
          variant="ghost"
          onClick={() => {
            setMode((currentMode) => (currentMode === "signIn" ? "signUp" : "signIn"));
            setMessage(null);
          }}
        >
          {mode === "signIn" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </Button>
      </section>
    </main>
  );
}
