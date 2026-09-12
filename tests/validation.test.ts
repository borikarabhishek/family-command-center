import { describe, expect, it } from "vitest";
import {
  CompleteOnboardingSchema,
  DocumentFilterSchema,
  OnboardingWelcomeSchema,
  TaskFilterSchema,
  getValidationErrorMessage,
  validateData,
} from "@/lib/validation";

const validWelcome = {
  familyName: "The Rao Family",
  city: "Pune",
  language: "मराठी",
};

describe("onboarding validation", () => {
  it("accepts all supported language options", () => {
    expect(OnboardingWelcomeSchema.parse(validWelcome)).toEqual(validWelcome);
  });

  it("rejects invalid family names with a user-facing message", () => {
    const result = OnboardingWelcomeSchema.safeParse({ ...validWelcome, familyName: "A1" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(getValidationErrorMessage(result.error)).toBe(
        "Family name can only contain letters, spaces, hyphens, and apostrophes",
      );
    }
  });

  it("accepts valid completed onboarding data", () => {
    const result = CompleteOnboardingSchema.safeParse({
      ...validWelcome,
      priorities: ["Document management"],
      members: [
        {
          id: "member-1",
          name: "Abhishek Rao",
          relationship: "Self",
          dob: "1985-06-12",
          contact: "+919820041120",
          role: "Family Owner",
          permission: "Owner",
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});

describe("filter validation", () => {
  it("accepts status values used by family tasks", () => {
    expect(TaskFilterSchema.parse({ status: "Waiting", priority: "High" })).toEqual({
      status: "Waiting",
      priority: "High",
    });
  });

  it("rejects obsolete task status values", () => {
    expect(TaskFilterSchema.safeParse({ status: "Pending" }).success).toBe(false);
  });

  it("supports the all-documents filter", () => {
    expect(DocumentFilterSchema.parse({ category: "All" })).toEqual({ category: "All" });
  });

  it("preserves the schema's inferred data type", () => {
    const result = validateData(OnboardingWelcomeSchema, validWelcome);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.language).toBe("मराठी");
    }
  });
});
