/**
 * Application-wide constants and configuration
 * Centralized place for enums, lists, and fixed values used throughout the app
 */

// ============================================================================
// FAMILY RELATIONSHIPS
// ============================================================================

export const RELATIONSHIPS = [
  "Self",
  "Spouse",
  "Son",
  "Daughter",
  "Mother",
  "Father",
  "Other",
] as const;

export type Relationship = (typeof RELATIONSHIPS)[number];

// ============================================================================
// FAMILY ROLES & PERMISSIONS
// ============================================================================

export const FAMILY_ROLES = [
  "Family Owner",
  "Family Member",
  "Dependent",
  "Authorized Representative",
] as const;

export type FamilyRole = (typeof FAMILY_ROLES)[number];

export const PERMISSIONS = ["Owner", "Member", "Viewer"] as const;

export type Permission = (typeof PERMISSIONS)[number];

// ============================================================================
// LANGUAGES
// ============================================================================

export const LANGUAGES = ["English", "हिन्दी", "मराठी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ"] as const;

export type Language = (typeof LANGUAGES)[number];

// ============================================================================
// ONBOARDING PRIORITIES
// ============================================================================

export const PRIORITY_OPTIONS = [
  "Financial organization",
  "Document management",
  "Legal protection",
  "Education planning",
  "Business management",
  "Real estate tracking",
  "Insurance planning",
  "Investment tracking",
  "Tax optimization",
  "Family communication",
] as const;

export type PriorityOption = (typeof PRIORITY_OPTIONS)[number];

// ============================================================================
// DOCUMENT CATEGORIES
// ============================================================================

export const DOCUMENT_CATEGORIES = [
  "All",
  "Identity",
  "Financial",
  "Insurance",
  "Property",
  "Legal",
  "Education",
  "Healthcare",
  "Business",
  "Tax",
  "Travel",
  "Family",
] as const;

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

// ============================================================================
// TASK/APPROVAL STATUSES
// ============================================================================

export const TASK_STATUS = ["To Do", "In Progress", "Waiting", "Completed"] as const;

export type TaskStatus = (typeof TASK_STATUS)[number];

export const TASK_FILTERS = ["All", ...TASK_STATUS] as const;

export type TaskFilter = (typeof TASK_FILTERS)[number];

export const APPROVAL_STATUS = ["Pending", "Approved", "Rejected", "Withdrawn"] as const;

export type ApprovalStatus = (typeof APPROVAL_STATUS)[number];

// ============================================================================
// PRIORITY LEVELS
// ============================================================================

export const PRIORITY_LEVELS = ["High", "Medium", "Low"] as const;

export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];

// ============================================================================
// DOCUMENT STATUS
// ============================================================================

export const DOCUMENT_STATUS = ["Verified", "Pending Review", "Expiring Soon", "Expired"] as const;

export type DocumentStatus = (typeof DOCUMENT_STATUS)[number];

// ============================================================================
// SERVICE CATEGORIES
// ============================================================================

export const SERVICE_CATEGORIES = [
  "Legal",
  "CA / Tax",
  "Financial Planning",
  "Insurance",
  "Healthcare",
  "Education",
  "Travel",
  "Real Estate",
  "Property Management",
  "Business",
  "Compliance",
  "Cybersecurity",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

// ============================================================================
// APPLICATION METADATA
// ============================================================================

export const APP_NAME = "FamilyOS";
export const APP_TAGLINE = "Your family's private operating system.";
export const APP_VERSION = "1.0.0-alpha";

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const MAX_FAMILY_NAME_LENGTH = 100;
export const MIN_FAMILY_NAME_LENGTH = 2;

export const MAX_CITY_LENGTH = 50;
export const MIN_CITY_LENGTH = 2;

export const MAX_FAMILY_MEMBERS = 50;
export const MIN_FAMILY_MEMBERS = 1;

export const MAX_PRIORITIES_SELECT = 5;
export const MIN_PRIORITIES_SELECT = 1;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  NOT_FOUND: "The page you're looking for doesn't exist.",
  UNAUTHORIZED: "You don't have permission to access this resource.",
  NETWORK_ERROR: "Network connection failed. Please check your internet.",
  VALIDATION_ERROR: "Please check your input and try again.",
  FORM_INCOMPLETE: "Please fill in all required fields.",
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  SAVED: "Changes saved successfully.",
  CREATED: "Created successfully.",
  DELETED: "Deleted successfully.",
  APPROVED: "Approved successfully.",
} as const;
