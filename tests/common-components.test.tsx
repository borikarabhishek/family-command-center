import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";

function ThrowError(): never {
  throw new Error("Expected test error");
}

describe("shared components", () => {
  it("maps a recognized status to its semantic tone", () => {
    render(<StatusBadge label="Expired" />);

    expect(screen.getByText("Expired")).toHaveClass("text-destructive");
  });

  it("allows an explicit status tone to override automatic mapping", () => {
    render(<StatusBadge label="Custom status" tone="info" />);

    expect(screen.getByText("Custom status")).toHaveClass("text-info");
  });

  it("renders empty-state guidance and an action", () => {
    render(
      <EmptyState
        title="No documents"
        description="Upload a document to begin."
        action={<button type="button">Upload document</button>}
      />,
    );

    expect(screen.getByRole("heading", { name: "No documents" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upload document" })).toBeInTheDocument();
  });

  it("renders a supplied fallback when a child throws", () => {
    const onError = vi.fn();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <ErrorBoundary
        onError={onError}
        fallback={(error, reset) => (
          <button type="button" onClick={reset}>
            Recover from {error.message}
          </button>
        )}
      >
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("button", { name: "Recover from Expected test error" }),
    ).toBeInTheDocument();
    expect(onError).toHaveBeenCalledOnce();
    consoleError.mockRestore();
  });
});
