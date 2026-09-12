import * as z from "zod";
import {
  DOCUMENT_CATEGORIES,
  FAMILY_ROLES,
  LANGUAGES,
  PERMISSIONS,
  PRIORITY_LEVELS,
  RELATIONSHIPS,
  TASK_STATUS,
} from "@/data/constants";

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
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "Family name can only contain letters, spaces, hyphens, and apostrophes",
    }),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters" })
    .max(50, { message: "City must be less than 50 characters" }),
  language: z.enum(LANGUAGES, {
    errorMap: () => ({ message: "Please select a valid language" }),
  }),
});

export const FamilyMemberSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  relationship: z.enum(RELATIONSHIPS, {
    errorMap: () => ({ message: "Please select a valid relationship" }),
  }),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date of birth must be in YYYY-MM-DD format",
  }),
  contact: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number" })
    .optional()
    .or(z.literal("")),
  role: z.enum(FAMILY_ROLES, {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
  permission: z.enum(PERMISSIONS, {
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
  OnboardingMembersSchema,
).merge(OnboardingPrioritiesSchema);

// ============================================================================
// DOCUMENT SCHEMAS
// ============================================================================

export const DocumentFilterSchema = z.object({
  query: z.string().optional(),
  category: z.enum(DOCUMENT_CATEGORIES).optional(),
  ownerId: z.string().optional(),
});

// ============================================================================
// TASK SCHEMAS
// ============================================================================

export const TaskFilterSchema = z.object({
  status: z.enum(TASK_STATUS).optional(),
  priority: z.enum(PRIORITY_LEVELS).optional(),
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
export function validateData<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  data: unknown,
): z.SafeParseReturnType<unknown, z.infer<TSchema>> {
  return schema.safeParse(data);
}

/**
 * Get user-friendly error message from Zod validation error
 */
export function getValidationErrorMessage(error: z.ZodError): string {
  const firstError = error.errors[0];
  return firstError?.message || "Validation failed. Please check your input.";
}
