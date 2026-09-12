import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  onAuthStateChange,
  resetPasswordForEmail,
  signInWithPassword,
  signUpWithPassword,
  updateUserPassword,
} from "@/integrations/supabase/auth";
import { AuthProvider, useAuth } from "@/integrations/supabase/AuthProvider";

type AuthMode = "signIn" | "signUp" | "forgotPassword" | "resetPassword";

interface AuthStatusMessage {
  type: "error" | "success";
  text: string;
}

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
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<AuthStatusMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isConfigured) return;

    const { data } = onAuthStateChange((_session, event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("resetPassword");
        setStatusMessage({
          type: "success",
          text: "Enter your new password below to complete your password reset.",
        });
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [isConfigured]);

  useEffect(() => {
    if (user && mode !== "resetPassword") {
      void navigate({ to: "/" });
    }
  }, [mode, navigate, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "forgotPassword") {
        const result = await resetPasswordForEmail(email);
        if (result.error) {
          setStatusMessage({ type: "error", text: result.error.message });
        } else {
          setStatusMessage({
            type: "success",
            text: "Password reset link sent! Check your email inbox to reset your password.",
          });
        }
      } else if (mode === "resetPassword") {
        const result = await updateUserPassword(password);
        if (result.error) {
          setStatusMessage({ type: "error", text: result.error.message });
        } else {
          setStatusMessage({
            type: "success",
            text: "Password updated successfully. Redirecting to workspace…",
          });
          setTimeout(() => {
            void navigate({ to: "/" });
          }, 1500);
        }
      } else if (mode === "signIn") {
        const result = await signInWithPassword(email, password);
        if (result.error) {
          setStatusMessage({ type: "error", text: result.error.message });
        } else {
          await navigate({ to: "/" });
        }
      } else {
        const result = await signUpWithPassword(email, password);
        if (result.error) {
          setStatusMessage({ type: "error", text: result.error.message });
        } else {
          setStatusMessage({
            type: "success",
            text: "Account created! Check your email to confirm your account, then sign in.",
          });
        }
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to authenticate. Please try again.",
      });
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

  if (user && mode !== "resetPassword") return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="surface w-full max-w-md p-6 sm:p-8">
        <h1 className="font-display text-2xl">
          {mode === "signIn" && "Welcome back"}
          {mode === "signUp" && "Create account"}
          {mode === "forgotPassword" && "Reset your password"}
          {mode === "resetPassword" && "Set new password"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signIn" && "Sign in to create or access your family workspace."}
          {mode === "signUp" && "Create a private FamilyOS account to save your family workspace."}
          {mode === "forgotPassword" &&
            "Enter your account email address and we will send you a password reset link."}
          {mode === "resetPassword" && "Enter your new password to update your account."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode !== "resetPassword" && (
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
          )}

          {mode !== "forgotPassword" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">
                  {mode === "resetPassword" ? "New password" : "Password"}
                </Label>
                {mode === "signIn" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgotPassword");
                      setStatusMessage(null);
                    }}
                    className="text-xs text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
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
          )}

          {statusMessage ? (
            <p
              role="alert"
              className={`text-sm ${
                statusMessage.type === "error" ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {statusMessage.text}
            </p>
          ) : null}

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Please wait…"
              : mode === "signIn"
                ? "Sign in"
                : mode === "signUp"
                  ? "Create account"
                  : mode === "forgotPassword"
                    ? "Send reset link"
                    : "Update password"}
          </Button>
        </form>

        <div className="mt-4 space-y-2">
          {mode === "forgotPassword" ? (
            <Button
              className="w-full"
              variant="ghost"
              onClick={() => {
                setMode("signIn");
                setStatusMessage(null);
              }}
            >
              Back to sign in
            </Button>
          ) : mode === "resetPassword" ? (
            <Button
              className="w-full"
              variant="ghost"
              onClick={() => {
                setMode("signIn");
                setStatusMessage(null);
              }}
            >
              Sign in with password
            </Button>
          ) : (
            <Button
              className="w-full"
              variant="ghost"
              onClick={() => {
                setMode((currentMode) => (currentMode === "signIn" ? "signUp" : "signIn"));
                setStatusMessage(null);
              }}
            >
              {mode === "signIn"
                ? "Need an account? Create one"
                : "Already have an account? Sign in"}
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
