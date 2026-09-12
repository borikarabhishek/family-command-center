import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getDocumentsByCategory,
  getExpiringDocuments,
  getMemberAssetValue,
  getMemberAssets,
  getMemberDocuments,
  getMemberName,
  getMemberPendingTasks,
  getMemberStats,
  getMemberTasks,
  getTasksByStatus,
  searchDocuments,
} from "@/data/demo.helpers";
import { demoAssets, demoDocuments, demoTasks } from "@/data/demo";

describe("demo data helpers", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T00:00:00Z"));
  });

  it("returns member-scoped documents, tasks, and assets", () => {
    expect(getMemberDocuments("mem_2")).toEqual(
      demoDocuments.filter((document) => document.ownerId === "mem_2"),
    );
    expect(getMemberTasks("mem_2")).toEqual(
      demoTasks.filter((task) => task.assigneeId === "mem_2" || task.ownerId === "mem_2"),
    );
    expect(getMemberAssets("mem_2")).toEqual(
      demoAssets.filter((asset) => asset.ownerId === "mem_2"),
    );
  });

  it("excludes completed tasks from the pending task result", () => {
    expect(getMemberPendingTasks("mem_1")).not.toContainEqual(
      expect.objectContaining({ status: "Completed" }),
    );
  });

  it("calculates a member's asset value from the domain value field", () => {
    expect(getMemberAssetValue("mem_2")).toBe(3_950_000);
  });

  it("returns known members and a fallback for unknown members", () => {
    expect(getMemberName("mem_1")).toBe("Abhishek Rao");
    expect(getMemberName("unknown", "Not found")).toBe("Not found");
  });

  it("filters tasks by status and optional member", () => {
    expect(getTasksByStatus("In Progress").every((task) => task.status === "In Progress")).toBe(
      true,
    );
    expect(
      getTasksByStatus("To Do", "mem_2").every(
        (task) =>
          task.status === "To Do" && (task.assigneeId === "mem_2" || task.ownerId === "mem_2"),
      ),
    ).toBe(true);
  });

  it("filters documents by category and owner", () => {
    expect(getDocumentsByCategory("Identity", "mem_2")).toEqual([
      expect.objectContaining({ name: "Aadhaar — Sneha Rao" }),
    ]);
    expect(getDocumentsByCategory("All")).toHaveLength(demoDocuments.length);
  });

  it("searches document names while respecting category filters", () => {
    expect(searchDocuments("passport")).toHaveLength(2);
    expect(searchDocuments("passport", "Travel")).toHaveLength(2);
    expect(searchDocuments("passport", "Identity")).toHaveLength(0);
  });

  it("finds documents expiring within 90 days using expiresAt", () => {
    expect(getExpiringDocuments().map((document) => document.id)).toEqual(
      expect.arrayContaining(["doc_3", "doc_4", "doc_21"]),
    );
  });

  it("returns a consistent member summary", () => {
    const summary = getMemberStats("mem_2");
    expect(summary.documentCount).toBe(summary.documents.length);
    expect(summary.pendingTaskCount).toBe(
      summary.tasks.filter((task) => task.status !== "Completed").length,
    );
    expect(summary.assetValue).toBe(3_950_000);
  });
});
