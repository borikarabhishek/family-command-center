import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FilterButton } from "@/components/FilterButton";

describe("FilterButton", () => {
  it("exposes its selected state and accessible label", () => {
    render(<FilterButton label="Identity" category="documents" isActive onClick={vi.fn()} />);

    const button = screen.getByRole("button", { name: "Filter by Identity documents" });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onClick when activated", () => {
    const onClick = vi.fn();
    render(<FilterButton label="All" isActive={false} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Filter by All" }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
