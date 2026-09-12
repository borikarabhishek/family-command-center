import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  onAuthStateChange,
  resetPasswordForEmail,
  signInWithPassword,
  signInWithPhoneOtp,
  signUpWithPassword,
  updateUserPassword,
  verifyPhoneOtp,
} from "@/integrations/supabase/auth";
import { AuthProvider, useAuth } from "@/integrations/supabase/AuthProvider";

type AuthMethod = "email" | "phone";
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
  const [method, setMethod] = useState<AuthMethod>("email");
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<AuthStatusMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isConfigured) return;

    const { data } = onAuthStateChange((_session, event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("resetPassword");
        setMethod("email");
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
      if (method === "phone") {
        if (!otpSent) {
          const formattedPhone = phone.trim().startsWith("+") ? phone.trim() : `+${phone.trim()}`;
          const result = await signInWithPhoneOtp(formattedPhone);
          if (result.error) {
            setStatusMessage({ type: "error", text: result.error.message });
          } else {
            setOtpSent(true);
            setStatusMessage({
              type: "success",
              text: `6-digit verification code sent to ${formattedPhone}.`,
            });
          }
        } else {
          const formattedPhone = phone.trim().startsWith("+") ? phone.trim() : `+${phone.trim()}`;
          const result = await verifyPhoneOtp(formattedPhone, otpToken.trim());
          if (result.error) {
            setStatusMessage({ type: "error", text: result.error.message });
          } else {
            await navigate({ to: "/" });
          }
        }
      } else {
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
          {method === "phone"
            ? otpSent
              ? "Verify phone number"
              : "Sign in with phone"
            : mode === "signIn"
              ? "Welcome back"
              : mode === "signUp"
                ? "Create account"
                : mode === "forgotPassword"
                  ? "Reset your password"
                  : "Set new password"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {method === "phone"
            ? otpSent
              ? "Enter the 6-digit verification code sent via SMS."
              : "We'll text you a one-time verification code to sign in."
            : mode === "signIn"
              ? "Sign in to create or access your family workspace."
              : mode === "signUp"
                ? "Create a private FamilyOS account to save your family workspace."
                : mode === "forgotPassword"
                  ? "Enter your account email address and we will send you a password reset link."
                  : "Enter your new password to update your account."}
        </p>

        {mode !== "forgotPassword" && mode !== "resetPassword" && (
          <div className="mt-5 grid grid-cols-2 gap-1 rounded-lg bg-muted/60 p-1">
            <button
              type="button"
              onClick={() => {
                setMethod("email");
                setStatusMessage(null);
                setOtpSent(false);
              }}
              className={`rounded-md py-1.5 text-xs font-medium transition-all ${
                method === "email"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod("phone");
                setStatusMessage(null);
                setOtpSent(false);
              }}
              className={`rounded-md py-1.5 text-xs font-medium transition-all ${
                method === "phone"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Phone Number
            </button>
          </div>
        )}

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {method === "phone" ? (
            <>
              {!otpSent ? (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Include your country code (e.g. +1 for US, +91 for India).
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="otp">Verification code</Label>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpToken("");
                        setStatusMessage(null);
                      }}
                      className="text-xs text-primary underline-offset-4 hover:underline"
                    >
                      Change number
                    </button>
                  </div>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    value={otpToken}
                    onChange={(event) => setOtpToken(event.target.value)}
                    required
                  />
                </div>
              )}
            </>
          ) : (
            <>
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
            </>
          )}

          {statusMessage ? (
            <p
              role="alert"
              className={`text-sm ${
                statusMessage.type === "error"
                  ? "text-destructive"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {statusMessage.text}
            </p>
          ) : null}

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Please wait…"
              : method === "phone"
                ? otpSent
                  ? "Verify & Sign in"
                  : "Send verification code"
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
          ) : method === "email" ? (
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
          ) : otpSent ? (
            <Button
              className="w-full"
              variant="ghost"
              onClick={async () => {
                const formattedPhone = phone.trim().startsWith("+")
                  ? phone.trim()
                  : `+${phone.trim()}`;
                setIsSubmitting(true);
                try {
                  const res = await signInWithPhoneOtp(formattedPhone);
                  if (res.error) {
                    setStatusMessage({ type: "error", text: res.error.message });
                  } else {
                    setStatusMessage({
                      type: "success",
                      text: "Verification code resent successfully.",
                    });
                  }
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
            >
              Resend verification code
            </Button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
