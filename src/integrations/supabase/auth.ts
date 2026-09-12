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

export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  return getSupabaseClient().auth.onAuthStateChange((_event, session) => callback(session));
}

export type AuthUser = User;
