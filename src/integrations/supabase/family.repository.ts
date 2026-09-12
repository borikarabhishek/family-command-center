import { getSupabaseClient } from "./client";

export interface CreateFamilyWorkspaceInput {
  familyName: string;
  city: string;
  language: string;
  priorities: string[];
  primaryMemberName: string;
}

/**
 * Creates the first family and assigns the authenticated user as its owner.
 * The database RPC keeps these dependent inserts atomic and RLS-protected.
 */
export async function createFamilyWorkspace(input: CreateFamilyWorkspaceInput): Promise<string> {
  const { data, error } = await getSupabaseClient().rpc("create_family_workspace", {
    family_name: input.familyName,
    family_city: input.city,
    family_language: input.language,
    family_priorities: input.priorities,
    primary_member_name: input.primaryMemberName,
  });

  if (error) throw error;
  return data;
}
