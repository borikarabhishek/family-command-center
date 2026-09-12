import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock ResizeObserver for Recharts ResponsiveContainer in test environment
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

vi.mock("@/components/layout/AppShell", () => ({
  AppShell: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/integrations/supabase/AuthProvider", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    isConfigured: true,
    isLoading: false,
    session: null,
    user: null,
  }),
}));

import { Onboarding } from "@/routes/index";
import { Dashboard } from "@/routes/dashboard";
import { FinancialPage } from "@/routes/financial";
import { SettingsPage } from "@/routes/settings";

describe("End-to-end Demo Family Journey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1. Onboarding: navigates to demo workspace or progresses through setup steps", () => {
    render(<Onboarding />);

    expect(screen.getByText("Welcome to FamilyOS")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explore demo family" })).toBeInTheDocument();

    // Click explore demo family
    fireEvent.click(screen.getByRole("button", { name: "Explore demo family" }));
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });

    // Progress through setup wizard steps
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));
    expect(screen.getByRole("heading", { name: "Create your household" })).toBeInTheDocument();
  });

  it("2. Dashboard: renders key stats, attention notices, net worth, and quick actions", () => {
    render(<Dashboard />);

    // Header & Stats
    expect(screen.getByRole("heading", { name: "Good morning, Abhishek" })).toBeInTheDocument();
    expect(screen.getByText("Family members")).toBeInTheDocument();
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Active tasks")).toBeInTheDocument();

    // Financial net worth card & Quick actions
    expect(screen.getAllByText("Net worth").length).toBeGreaterThan(0);
    expect(screen.getByText("Quick actions")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add family member" })).toHaveAttribute("href", "/family");
    expect(screen.getByRole("link", { name: "Upload document" })).toHaveAttribute("href", "/vault");
    expect(screen.getByRole("link", { name: "Request professional" })).toHaveAttribute("href", "/services");
  });

  it("3. Financial Overview: computes assets, liabilities, and net worth balance", () => {
    render(<FinancialPage />);

    expect(screen.getByRole("heading", { name: "Financial overview" })).toBeInTheDocument();
    expect(screen.getByText("Total assets")).toBeInTheDocument();
    expect(screen.getByText("Total liabilities")).toBeInTheDocument();
    expect(screen.getByText("Monthly obligations")).toBeInTheDocument();
    expect(screen.getByText("₹3.29 Cr")).toBeInTheDocument();
    expect(screen.getByText("₹2.52 Cr")).toBeInTheDocument();
  });

  it("4. Settings & Sign out: provides control toggles and allows exiting demo or signing out", async () => {
    render(<SettingsPage />);

    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("Family name")).toBeInTheDocument();
    expect(screen.getByText("The Rao Family")).toBeInTheDocument();

    // Sign out / exit demo action
    const exitButtons = screen.getAllByRole("button", { name: /Exit demo/i });
    expect(exitButtons.length).toBeGreaterThan(0);

    fireEvent.click(exitButtons[0]);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/auth" });
    });
  });
});
