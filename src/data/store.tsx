import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AccessGrant,
  Approval,
  Asset,
  CalendarEvent,
  Conversation,
  Family,
  FamilyDocument,
  FamilyMember,
  FamilyTask,
  Liability,
  Professional,
  ServiceRequest,
} from "./types";
import {
  demoApprovals,
  demoAssets,
  demoConversations,
  demoDocuments,
  demoEvents,
  demoFamily,
  demoLiabilities,
  demoMembers,
  demoProfessionals,
  demoServiceRequests,
  demoTasks,
  netWorthTrend as demoTrend,
} from "./demo";
import { addDaysISO, todayISO } from "@/lib/format";

export interface AppData {
  family: Family;
  members: FamilyMember[];
  assets: Asset[];
  liabilities: Liability[];
  documents: FamilyDocument[];
  tasks: FamilyTask[];
  approvals: Approval[];
  professionals: Professional[];
  requests: ServiceRequest[];
  grants: AccessGrant[];
  events: CalendarEvent[];
  conversations: Conversation[];
  trend: { month: string; value: number }[];
}

const STORAGE_KEY = "familyos.v2";

function seed(): AppData {
  return {
    family: { ...demoFamily },
    members: [...demoMembers],
    assets: [...demoAssets],
    liabilities: [...demoLiabilities],
    documents: [...demoDocuments],
    tasks: [...demoTasks],
    approvals: demoApprovals.map((a) => ({
      ...a,
      kind: a.id === "apr_2" ? ("Data Access" as const) : ("Engagement" as const),
      requestId: a.id === "apr_2" ? "req_1" : undefined,
      professionalId: a.id === "apr_2" ? "pro_1" : undefined,
      categories: a.id === "apr_2" ? (["Property", "Legal"] as const).slice() : undefined,
      memberIds: a.id === "apr_2" ? ["mem_1", "mem_5"] : undefined,
      includeFinancials: false,
      accessDays: a.id === "apr_2" ? 30 : undefined,
    })),
    professionals: [...demoProfessionals],
    requests: [...demoServiceRequests],
    grants: [],
    events: [...demoEvents],
    conversations: [...demoConversations],
    trend: [...demoTrend],
  };
}

function emptyData(familyName: string, city: string): AppData {
  return {
    family: {
      id: "fam_1",
      name: familyName,
      city,
      language: "English",
      primaryMemberId: "",
      createdAt: todayISO(),
      priorities: [],
    },
    members: [],
    assets: [],
    liabilities: [],
    documents: [],
    tasks: [],
    approvals: [],
    professionals: [...demoProfessionals],
    requests: [],
    grants: [],
    events: [],
    conversations: [],
    trend: [],
  };
}

const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;

interface FamilyContextValue extends AppData {
  hydrated: boolean;
  memberById: (id?: string) => FamilyMember | undefined;
  professionalById: (id?: string) => Professional | undefined;
  requestById: (id?: string) => ServiceRequest | undefined;
  totals: {
    assets: number;
    liabilities: number;
    netWorth: number;
    monthlyObligations: number;
  };
  updateFamily: (patch: Partial<Family>) => void;
  saveMember: (m: Omit<FamilyMember, "id"> & { id?: string }) => void;
  deleteMember: (id: string) => void;
  saveAsset: (a: Omit<Asset, "id"> & { id?: string }) => void;
  deleteAsset: (id: string) => void;
  saveLiability: (l: Omit<Liability, "id"> & { id?: string }) => void;
  deleteLiability: (id: string) => void;
  saveDocument: (d: Omit<FamilyDocument, "id"> & { id?: string }) => void;
  deleteDocument: (id: string) => void;
  saveTask: (t: Omit<FamilyTask, "id"> & { id?: string }) => void;
  deleteTask: (id: string) => void;
  createRequest: (r: Omit<ServiceRequest, "id" | "status">) => string;
  assignProfessional: (requestId: string, professionalId: string) => void;
  requestAccessApproval: (input: {
    requestId: string;
    professionalId: string;
    categories: AccessGrant["categories"];
    memberIds: string[];
    includeFinancials: boolean;
    accessDays: number;
    amount?: number;
    detail: string;
  }) => void;
  decideApproval: (approvalId: string, decision: "Approved" | "Rejected") => void;
  completeRequest: (requestId: string) => void;
  revokeGrant: (grantId: string) => void;
  grantsForProfessional: (professionalId: string) => AccessGrant[];
  visibleDocumentsFor: (professionalId: string) => FamilyDocument[];
  resetToDemo: () => void;
  startEmpty: (familyName: string, city: string) => void;
}

const FamilyContext = createContext<FamilyContextValue | null>(null);

export function FamilyProvider({ children }: { children: ReactNode }) {
  // Always render the seeded data first so SSR and the first client render match.
  const [data, setData] = useState<AppData>(() => seed());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...seed(), ...(JSON.parse(raw) as AppData) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage unavailable */
    }
  }, [data, hydrated]);

  const patch = useCallback((fn: (d: AppData) => AppData) => setData((d) => fn(d)), []);

  const upsert = <T extends { id: string }>(list: T[], item: T) =>
    list.some((x) => x.id === item.id)
      ? list.map((x) => (x.id === item.id ? item : x))
      : [...list, item];

  const value = useMemo<FamilyContextValue>(() => {
    const memberById = (id?: string) => data.members.find((m) => m.id === id);
    const professionalById = (id?: string) => data.professionals.find((p) => p.id === id);
    const requestById = (id?: string) => data.requests.find((r) => r.id === id);

    const assetsTotal = data.assets.reduce((s, a) => s + a.value, 0);
    const liabilitiesTotal = data.liabilities.reduce((s, l) => s + l.outstanding, 0);

    const activeGrants = (professionalId: string) =>
      data.grants.filter(
        (g) =>
          g.professionalId === professionalId &&
          g.status === "Active" &&
          new Date(g.expiresAt).getTime() >= Date.now() - 86_400_000,
      );

    return {
      ...data,
      hydrated,
      memberById,
      professionalById,
      requestById,
      totals: {
        assets: assetsTotal,
        liabilities: liabilitiesTotal,
        netWorth: assetsTotal - liabilitiesTotal,
        monthlyObligations: data.liabilities.reduce((s, l) => s + l.monthlyObligation, 0),
      },
      updateFamily: (p) => patch((d) => ({ ...d, family: { ...d.family, ...p } })),

      saveMember: (m) =>
        patch((d) => {
          const member = { ...m, id: m.id ?? uid("mem") } as FamilyMember;
          const members = upsert(d.members, member);
          return {
            ...d,
            members,
            family: {
              ...d.family,
              primaryMemberId:
                d.family.primaryMemberId ||
                (member.role === "Family Owner" ? member.id : d.family.primaryMemberId),
            },
          };
        }),
      deleteMember: (id) =>
        patch((d) => ({
          ...d,
          members: d.members.filter((m) => m.id !== id),
          assets: d.assets.filter((a) => a.ownerId !== id),
          liabilities: d.liabilities.filter((l) => l.ownerId !== id),
          documents: d.documents.filter((x) => x.ownerId !== id),
          tasks: d.tasks.filter((t) => t.assigneeId !== id && t.ownerId !== id),
        })),

      saveAsset: (a) =>
        patch((d) => ({ ...d, assets: upsert(d.assets, { ...a, id: a.id ?? uid("ast") } as Asset) })),
      deleteAsset: (id) => patch((d) => ({ ...d, assets: d.assets.filter((a) => a.id !== id) })),

      saveLiability: (l) =>
        patch((d) => ({
          ...d,
          liabilities: upsert(d.liabilities, { ...l, id: l.id ?? uid("lia") } as Liability),
        })),
      deleteLiability: (id) =>
        patch((d) => ({ ...d, liabilities: d.liabilities.filter((l) => l.id !== id) })),

      saveDocument: (doc) =>
        patch((d) => ({
          ...d,
          documents: upsert(d.documents, { ...doc, id: doc.id ?? uid("doc") } as FamilyDocument),
        })),
      deleteDocument: (id) =>
        patch((d) => ({ ...d, documents: d.documents.filter((x) => x.id !== id) })),

      saveTask: (t) =>
        patch((d) => ({ ...d, tasks: upsert(d.tasks, { ...t, id: t.id ?? uid("tsk") } as FamilyTask) })),
      deleteTask: (id) => patch((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) })),

      createRequest: (r) => {
        const id = uid("req");
        patch((d) => ({ ...d, requests: [{ ...r, id, status: "Created" }, ...d.requests] }));
        return id;
      },
      assignProfessional: (requestId, professionalId) =>
        patch((d) => ({
          ...d,
          requests: d.requests.map((r) =>
            r.id === requestId ? { ...r, professionalId, status: "Professional Assigned" } : r,
          ),
        })),
      requestAccessApproval: (input) =>
        patch((d) => {
          const req = d.requests.find((r) => r.id === input.requestId);
          const approval: Approval = {
            id: uid("apr"),
            kind: "Data Access",
            request: `Approve ${professionalById(input.professionalId)?.name ?? "professional"} for “${
              req?.summary ?? "service request"
            }”`,
            requestedById: req?.memberId ?? d.family.primaryMemberId,
            amount: input.amount,
            date: todayISO(),
            status: "Pending",
            detail: input.detail,
            requestId: input.requestId,
            professionalId: input.professionalId,
            categories: input.categories,
            memberIds: input.memberIds,
            includeFinancials: input.includeFinancials,
            accessDays: input.accessDays,
          };
          return {
            ...d,
            approvals: [approval, ...d.approvals],
            requests: d.requests.map((r) =>
              r.id === input.requestId
                ? { ...r, professionalId: input.professionalId, status: "Awaiting Family Approval" }
                : r,
            ),
          };
        }),
      decideApproval: (approvalId, decision) =>
        patch((d) => {
          const approval = d.approvals.find((a) => a.id === approvalId);
          if (!approval) return d;
          const approvals = d.approvals.map((a) =>
            a.id === approvalId ? { ...a, status: decision, decidedAt: todayISO() } : a,
          );
          let grants = d.grants;
          let requests = d.requests;

          if (approval.requestId) {
            requests = d.requests.map((r) =>
              r.id === approval.requestId
                ? { ...r, status: decision === "Approved" ? "In Progress" : "Created" }
                : r,
            );
          }
          if (decision === "Approved" && approval.professionalId) {
            grants = [
              {
                id: uid("grn"),
                professionalId: approval.professionalId,
                requestId: approval.requestId,
                categories: approval.categories ?? [],
                memberIds: approval.memberIds ?? [],
                includeFinancials: approval.includeFinancials ?? false,
                grantedAt: todayISO(),
                expiresAt: addDaysISO(approval.accessDays ?? 30),
                status: "Active",
                note: approval.request,
              },
              ...d.grants,
            ];
          }
          return { ...d, approvals, grants, requests };
        }),
      completeRequest: (requestId) =>
        patch((d) => ({
          ...d,
          requests: d.requests.map((r) => (r.id === requestId ? { ...r, status: "Completed" } : r)),
          grants: d.grants.map((g) =>
            g.requestId === requestId && g.status === "Active" ? { ...g, status: "Revoked" } : g,
          ),
        })),
      revokeGrant: (grantId) =>
        patch((d) => ({
          ...d,
          grants: d.grants.map((g) => (g.id === grantId ? { ...g, status: "Revoked" } : g)),
        })),
      grantsForProfessional: activeGrants,
      visibleDocumentsFor: (professionalId) => {
        const gs = activeGrants(professionalId);
        if (gs.length === 0) return [];
        return data.documents.filter((doc) =>
          gs.some(
            (g) =>
              g.categories.includes(doc.category) &&
              (g.memberIds.length === 0 || g.memberIds.includes(doc.ownerId)),
          ),
        );
      },
      resetToDemo: () => setData(seed()),
      startEmpty: (familyName, city) => setData(emptyData(familyName, city)),
    };
  }, [data, hydrated, patch]);

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamily(): FamilyContextValue {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error("useFamily must be used inside <FamilyProvider>");
  return ctx;
}
