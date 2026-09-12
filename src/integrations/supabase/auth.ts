import type { AuthError, Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./client";

export type AuthResult = { error: AuthError | null };

export async function signUpWithPassword(email: string, password: string): Promise<AuthResult> {
  const { error } = await getSupabaseClient().auth.signUp({ email, password });
  return { error };
}

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
  return { error };
}

export async function signOut(): Promise<AuthResult> {
  const { error } = await getSupabaseClient().auth.signOut();
  return { error };
}

export async function resetPasswordForEmail(
  email: string,
  redirectTo?: string,
): Promise<AuthResult> {
  const redirect =
    redirectTo ?? (typeof window !== "undefined" ? `${window.location.origin}/auth` : undefined);
  const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
    redirectTo: redirect,
  });
  return { error };
}

export async function updateUserPassword(newPassword: string): Promise<AuthResult> {
  const { error } = await getSupabaseClient().auth.updateUser({ password: newPassword });
  return { error };
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(
  callback: (session: Session | null, event?: string) => void,
) {
  return getSupabaseClient().auth.onAuthStateChange((event, session) => callback(session, event));
}

export type AuthUser = User;
