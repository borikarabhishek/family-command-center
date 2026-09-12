import { describe, expect, it, vi } from "vitest";
import { ageFromDOB, daysUntil, formatDateIN, formatINR, initials } from "@/lib/format";

describe("formatINR", () => {
  it("formats standard Indian currency", () => {
    expect(formatINR(100000)).toContain("1,00,000");
  });

  it("supports compact lakh and crore notation", () => {
    expect(formatINR(125000, { compact: true })).toBe("₹1.25 L");
    expect(formatINR(10000000, { compact: true })).toBe("₹1.00 Cr");
  });
});

describe("formatDateIN", () => {
  it("formats an ISO date with an Indian locale", () => {
    expect(formatDateIN("2026-09-09")).toMatch(/09 Sep 2026/);
  });
});

describe("ageFromDOB", () => {
  it("accounts for whether the birthday has occurred", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T12:00:00Z"));

    expect(ageFromDOB("1990-09-10")).toBe(35);
    expect(ageFromDOB("1990-09-08")).toBe(36);

    vi.useRealTimers();
  });
});

describe("daysUntil", () => {
  it("rounds a future date up to the next whole day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T00:00:00Z"));

    expect(daysUntil("2026-09-10T01:00:00Z")).toBe(2);

    vi.useRealTimers();
  });
});

describe("initials", () => {
  it("returns up to two uppercase initials", () => {
    expect(initials("Abhishek Rao")).toBe("AR");
    expect(initials("  Madonna  ")).toBe("M");
    expect(initials("John Fitzgerald Kennedy")).toBe("JF");
  });
});
