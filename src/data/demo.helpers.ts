/**
 * Helper functions for demo data queries and mutations
 * Centralizes duplicate data filtering logic across routes
 */

import {
  demoDocuments,
  demoTasks,
  demoAssets,
  demoMembers,
  type FamilyDocument,
  type FamilyTask,
  type Asset,
} from "@/data/demo";

/**
 * Get all documents owned by a family member
 * @param memberId - The member's ID
 * @returns Array of documents owned by this member
 */
export function getMemberDocuments(memberId: string): FamilyDocument[] {
  return demoDocuments.filter((doc) => doc.ownerId === memberId);
}

/**
 * Get all tasks assigned to or owned by a family member
 * @param memberId - The member's ID
 * @returns Array of tasks for this member
 */
export function getMemberTasks(memberId: string): FamilyTask[] {
  return demoTasks.filter((task) => task.assigneeId === memberId || task.ownerId === memberId);
}

/**
 * Get incomplete (non-completed) tasks for a member
 * @param memberId - The member's ID
 * @returns Array of pending/in-progress tasks
 */
export function getMemberPendingTasks(memberId: string): FamilyTask[] {
  return getMemberTasks(memberId).filter((task) => task.status !== "Completed");
}

/**
 * Get document count for a member
 * @param memberId - The member's ID
 * @returns Number of documents owned
 */
export function getMemberDocumentCount(memberId: string): number {
  return getMemberDocuments(memberId).length;
}

/**
 * Get pending task count for a member
 * @param memberId - The member's ID
 * @returns Number of pending tasks
 */
export function getMemberPendingTaskCount(memberId: string): number {
  return getMemberPendingTasks(memberId).length;
}

/**
 * Get all assets associated with a member
 * @param memberId - The member's ID
 * @returns Array of assets owned/associated with member
 */
export function getMemberAssets(memberId: string): Asset[] {
  return demoAssets.filter((asset) => asset.ownerId === memberId);
}

/**
 * Get total asset value for a member
 * @param memberId - The member's ID
 * @returns Total value of all assets
 */
export function getMemberAssetValue(memberId: string): number {
  return getMemberAssets(memberId).reduce((sum, asset) => sum + asset.estimatedValue, 0);
}

/**
 * Get member by ID with null-safety
 * @param memberId - The member's ID
 * @returns Member object or undefined
 */
export function getMemberById(memberId: string) {
  return demoMembers.find((m) => m.id === memberId);
}

/**
 * Get member name by ID, with fallback
 * @param memberId - The member's ID
 * @param fallback - Fallback value if member not found (default: "Unknown")
 * @returns Member name or fallback
 */
export function getMemberName(memberId: string, fallback: string = "Unknown"): string {
  return getMemberById(memberId)?.name ?? fallback;
}

/**
 * Filter tasks by status
 * @param memberId - The member's ID (optional, for filtering specific member)
 * @param status - The task status to filter by
 * @returns Array of tasks with matching status
 */
export function getTasksByStatus(status: string, memberId?: string): FamilyTask[] {
  let tasks = demoTasks.filter((t) => t.status === status);

  if (memberId) {
    tasks = tasks.filter((t) => t.assigneeId === memberId || t.ownerId === memberId);
  }

  return tasks;
}

/**
 * Filter documents by category
 * @param category - The document category to filter by
 * @param memberId - Optional member ID to filter by owner
 * @returns Array of documents matching filter
 */
export function getDocumentsByCategory(category: string, memberId?: string): FamilyDocument[] {
  let docs = demoDocuments.filter((d) => d.category === category || category === "All");

  if (memberId) {
    docs = docs.filter((d) => d.ownerId === memberId);
  }

  return docs;
}

/**
 * Search documents by name
 * @param query - Search query string
 * @param category - Optional category filter
 * @returns Array of documents matching search
 */
export function searchDocuments(query: string, category?: string): FamilyDocument[] {
  const lowerQuery = query.toLowerCase();

  let docs = demoDocuments.filter((d) => d.name.toLowerCase().includes(lowerQuery));

  if (category && category !== "All") {
    docs = docs.filter((d) => d.category === category);
  }

  return docs;
}

/**
 * Get documents expiring soon (within 90 days)
 * @returns Array of documents approaching expiry
 */
export function getExpiringDocuments(): FamilyDocument[] {
  const today = new Date();
  const ninetyDaysFromNow = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

  return demoDocuments.filter((doc) => {
    if (!doc.expiryDate) return false;
    const expiryDate = new Date(doc.expiryDate);
    return expiryDate >= today && expiryDate <= ninetyDaysFromNow;
  });
}

/**
 * Get member summary stats
 * @param memberId - The member's ID
 * @returns Object with member statistics
 */
export function getMemberStats(memberId: string) {
  return {
    documentCount: getMemberDocumentCount(memberId),
    pendingTaskCount: getMemberPendingTaskCount(memberId),
    assetValue: getMemberAssetValue(memberId),
    assets: getMemberAssets(memberId),
    documents: getMemberDocuments(memberId),
    tasks: getMemberTasks(memberId),
  };
}
