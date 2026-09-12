import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { TasksPage } from "@/routes/tasks";
import { VaultPage } from "@/routes/vault";

vi.mock("@/components/layout/AppShell", () => ({
  AppShell: ({ children }: { children: ReactNode }) => children,
}));

describe("core family workflows", () => {
  it("filters the document vault by search and category", () => {
    render(<VaultPage />);

    expect(screen.getByRole("heading", { name: "Document vault" })).toBeInTheDocument();
    expect(screen.getByText("Passport — Sneha Rao")).toBeInTheDocument();

    fireEvent.change(
      screen.getByPlaceholderText("Search documents (e.g. passport, policy, deed)"),
      { target: { value: "passport" } },
    );
    expect(screen.getByText("Passport — Sneha Rao")).toBeInTheDocument();
    expect(screen.queryByText("Aadhaar — Abhishek Rao")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Filter by Identity documents" }));
    expect(screen.getByRole("heading", { name: "No documents match" })).toBeInTheDocument();
  });

  it("filters the tasks list and preserves status accessibility state", () => {
    render(<TasksPage />);

    expect(screen.getByRole("heading", { name: "Tasks & approvals" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Filter by In Progress tasks" }));

    expect(screen.getByRole("button", { name: "Filter by In Progress tasks" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("Renew family health insurance")).toBeInTheDocument();
    expect(screen.queryByText("Pay Q2 school fee — Vihaan")).not.toBeInTheDocument();
  });
});
