/**
 * FamilyOS domain model.
 * Prototype-only: these entities mirror the intended backend schema so that
 * future persistence can be introduced without reshaping the UI layer.
 */

export type MemberRole =
  "Family Owner" | "Family Member" | "Dependent" | "Authorized Representative";

export type PermissionLevel = "Owner" | "Member" | "Viewer" | "Authorized Representative";

export type VerificationStatus = "Verified" | "Pending Review" | "Not Started";

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dob: string;
  contact: string;
  role: MemberRole;
  permission: PermissionLevel;
  verification: VerificationStatus;
  city: string;
  notes?: string;
}

export interface Family {
  id: string;
  name: string;
  city: string;
  language: string;
  primaryMemberId: string;
  createdAt: string;
  priorities: string[];
}

export type AssetCategory =
  | "Bank accounts"
  | "Fixed deposits"
  | "Mutual funds"
  | "Stocks"
  | "Insurance"
  | "Real estate"
  | "Gold"
  | "Business interests"
  | "Other assets";

export type LiabilityCategory =
  "Home loan" | "Personal loan" | "Credit card" | "Education loan" | "Other liabilities";

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  value: number;
  ownerId: string;
  institution?: string;
}

export interface Liability {
  id: string;
  name: string;
  category: LiabilityCategory;
  outstanding: number;
  monthlyObligation: number;
  ownerId: string;
  institution?: string;
}

export type DocumentCategory =
  | "Identity"
  | "Financial"
  | "Insurance"
  | "Property"
  | "Legal"
  | "Education"
  | "Healthcare"
  | "Business"
  | "Tax"
  | "Travel"
  | "Family";

export type DocumentStatus = "Verified" | "Pending Review" | "Expiring Soon" | "Expired";

export interface FamilyDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  ownerId: string;
  uploadedAt: string;
  expiresAt?: string;
  status: DocumentStatus;
}

export type TaskStatus = "To Do" | "In Progress" | "Waiting" | "Completed";
export type Priority = "Low" | "Medium" | "High";

export interface FamilyTask {
  id: string;
  title: string;
  ownerId: string;
  assigneeId: string;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
  category: string;
}

export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export interface Approval {
  id: string;
  request: string;
  requestedById: string;
  amount?: number;
  date: string;
  status: ApprovalStatus;
  detail: string;
}

export type ServiceCategory =
  | "Legal"
  | "CA / Tax"
  | "Financial Planning"
  | "Insurance"
  | "Healthcare"
  | "Education"
  | "Travel"
  | "Real Estate"
  | "Property Management"
  | "Business"
  | "Compliance"
  | "Cybersecurity";

export interface Professional {
  id: string;
  name: string;
  profession: ServiceCategory;
  specialization: string;
  experienceYears: number;
  location: string;
  rating: number;
  availability: string;
  indicativeFee: string;
}

export type ServiceRequestStatus =
  "Created" | "Professional Assigned" | "Awaiting Family Approval" | "In Progress" | "Completed";

export interface ServiceRequest {
  id: string;
  category: ServiceCategory;
  summary: string;
  memberId: string;
  urgency: Priority;
  preferredDate: string;
  budgetRange: string;
  status: ServiceRequestStatus;
  professionalId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "Renewal" | "Payment" | "Deadline" | "Appointment" | "Family";
  memberId?: string;
}

export interface Conversation {
  id: string;
  title: string;
  participant: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
}
