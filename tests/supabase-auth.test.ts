import { describe, expect, it, vi, beforeEach } from "vitest";

const mockAuth = {
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signInWithOtp: vi.fn(),
  verifyOtp: vi.fn(),
  signOut: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
};

vi.mock("@/integrations/supabase/client", () => ({
  getSupabaseClient: () => ({ auth: mockAuth }),
  isSupabaseConfigured: true,
}));

import {
  signInWithPassword,
  signUpWithPassword,
  signInWithPhoneOtp,
  verifyPhoneOtp,
  signInWithPhonePassword,
  signUpWithPhonePassword,
  signOut,
  resetPasswordForEmail,
  updateUserPassword,
  getCurrentSession,
} from "@/integrations/supabase/auth";

describe("Supabase auth functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls signUp with email and password", async () => {
    mockAuth.signUp.mockResolvedValueOnce({ error: null });
    const result = await signUpWithPassword("user@example.com", "secret123");

    expect(mockAuth.signUp).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret123",
    });
    expect(result.error).toBeNull();
  });

  it("calls signInWithPassword with email and password", async () => {
    mockAuth.signInWithPassword.mockResolvedValueOnce({ error: null });
    const result = await signInWithPassword("user@example.com", "secret123");

    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret123",
    });
    expect(result.error).toBeNull();
  });

  it("calls resetPasswordForEmail with email and redirectTo", async () => {
    mockAuth.resetPasswordForEmail.mockResolvedValueOnce({ error: null });
    const result = await resetPasswordForEmail("user@example.com", "http://localhost:8080/auth");

    expect(mockAuth.resetPasswordForEmail).toHaveBeenCalledWith("user@example.com", {
      redirectTo: "http://localhost:8080/auth",
    });
    expect(result.error).toBeNull();
  });

  it("calls signInWithPhoneOtp with phone number", async () => {
    mockAuth.signInWithOtp.mockResolvedValueOnce({ error: null });
    const result = await signInWithPhoneOtp("+15551234567");

    expect(mockAuth.signInWithOtp).toHaveBeenCalledWith({
      phone: "+15551234567",
    });
    expect(result.error).toBeNull();
  });

  it("calls verifyPhoneOtp with phone and token", async () => {
    mockAuth.verifyOtp.mockResolvedValueOnce({ error: null });
    const result = await verifyPhoneOtp("+15551234567", "123456");

    expect(mockAuth.verifyOtp).toHaveBeenCalledWith({
      phone: "+15551234567",
      token: "123456",
      type: "sms",
    });
    expect(result.error).toBeNull();
  });

  it("calls signInWithPhonePassword and signUpWithPhonePassword", async () => {
    mockAuth.signInWithPassword.mockResolvedValueOnce({ error: null });
    const signInRes = await signInWithPhonePassword("+15551234567", "secret123");
    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
      phone: "+15551234567",
      password: "secret123",
    });
    expect(signInRes.error).toBeNull();

    mockAuth.signUp.mockResolvedValueOnce({ error: null });
    const signUpRes = await signUpWithPhonePassword("+15551234567", "secret123");
    expect(mockAuth.signUp).toHaveBeenCalledWith({
      phone: "+15551234567",
      password: "secret123",
    });
    expect(signUpRes.error).toBeNull();
  });

  it("calls updateUser with new password", async () => {
    mockAuth.updateUser.mockResolvedValueOnce({ error: null });
    const result = await updateUserPassword("newSecret456");

    expect(mockAuth.updateUser).toHaveBeenCalledWith({
      password: "newSecret456",
    });
    expect(result.error).toBeNull();
  });

  it("calls signOut", async () => {
    mockAuth.signOut.mockResolvedValueOnce({ error: null });
    const result = await signOut();

    expect(mockAuth.signOut).toHaveBeenCalled();
    expect(result.error).toBeNull();
  });

  it("retrieves current session", async () => {
    const mockSession = { user: { id: "123", email: "user@example.com" } };
    mockAuth.getSession.mockResolvedValueOnce({ data: { session: mockSession }, error: null });
    const session = await getCurrentSession();

    expect(mockAuth.getSession).toHaveBeenCalled();
    expect(session).toEqual(mockSession);
  });
});
