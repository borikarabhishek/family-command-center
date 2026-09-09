import { z } from "zod";

/**
 * Validation schemas for form inputs and API data
 * All schemas include helpful error messages for end users
 */

// ============================================================================
// ONBOARDING SCHEMAS
// ============================================================================

export const OnboardingWelcomeSchema = z.object({
  familyName: z
    .string()
    .min(2, { message: "Family name must be at least 2 characters" })
    .max(100, { message: "Family name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Family name can only contain letters, spaces, hyphens, and apostrophes" }),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters" })
    .max(50, { message: "City must be less than 50 characters" }),
  language: z.enum(["English", "हिन्दी"], {
    errorMap: () => ({ message: "Please select a valid language" }),
  }),
});

export const FamilyMemberSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  relationship: z.enum(
    ["Self", "Spouse", "Son", "Daughter", "Mother", "Father", "Other"],
    {
      errorMap: () => ({ message: "Please select a valid relationship" }),
    }
  ),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date of birth must be in YYYY-MM-DD format",
  }),
  contact: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number" })
    .optional()
    .or(z.literal("")),
  role: z.enum(["Family Owner", "Family Member", "Dependent", "Authorized Representative"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
  permission: z.enum(["Owner", "Member", "Viewer"], {
    errorMap: () => ({ message: "Please select a valid permission level" }),
  }),
});

export const OnboardingMembersSchema = z.object({
  members: z
    .array(FamilyMemberSchema)
    .min(1, { message: "At least one family member is required" })
    .max(50, { message: "Maximum 50 family members allowed" }),
});

export const OnboardingPrioritiesSchema = z.object({
  priorities: z
    .array(z.string())
    .min(1, { message: "Select at least one priority" })
    .max(5, { message: "Select at most 5 priorities" }),
});

export const CompleteOnboardingSchema = OnboardingWelcomeSchema.merge(
  OnboardingMembersSchema
).merge(OnboardingPrioritiesSchema);

// ============================================================================
// DOCUMENT SCHEMAS
// ============================================================================

export const DocumentFilterSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  ownerId: z.string().optional(),
});

// ============================================================================
// TASK SCHEMAS
// ============================================================================

export const TaskFilterSchema = z.object({
  status: z.enum(["Pending", "In Progress", "Completed", "On Hold"]).optional(),
  priority: z.enum(["High", "Medium", "Low"]).optional(),
});

// ============================================================================
// FORM SUBMISSION TYPES
// ============================================================================

export type OnboardingWelcome = z.infer<typeof OnboardingWelcomeSchema>;
export type FamilyMember = z.infer<typeof FamilyMemberSchema>;
export type OnboardingMembers = z.infer<typeof OnboardingMembersSchema>;
export type OnboardingPriorities = z.infer<typeof OnboardingPrioritiesSchema>;
export type CompleteOnboarding = z.infer<typeof CompleteOnboardingSchema>;
export type DocumentFilter = z.infer<typeof DocumentFilterSchema>;
export type TaskFilter = z.infer<typeof TaskFilterSchema>;

/**
 * Utility to safely parse and validate data
 * Returns { success: true, data } or { success: false, error }
 */
export function validateData<T>(schema: z.Schema, data: unknown): { success: boolean; data?: T; error?: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data as T };
  }
  return { success: false, error: result.error };
}

/**
 * Get user-friendly error message from Zod validation error
 */
export function getValidationErrorMessage(error: z.ZodError): string {
  const firstError = error.errors[0];
  return firstError?.message || "Validation failed. Please check your input.";
}
