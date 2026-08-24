import type {
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

/**
 * Simulated demo household. No real personal or financial data.
 */

export const demoFamily: Family = {
  id: "fam_1",
  name: "The Rao Family",
  city: "Pune",
  language: "English",
  primaryMemberId: "mem_1",
  createdAt: "2026-03-14",
  priorities: ["Financial organization", "Document management", "Legal protection", "Education"],
};

export const demoMembers: FamilyMember[] = [
  {
    id: "mem_1",
    name: "Abhishek Rao",
    relationship: "Self",
    dob: "1985-06-12",
    contact: "+91 98200 41120",
    role: "Family Owner",
    permission: "Owner",
    verification: "Verified",
    city: "Pune",
    notes: "Primary decision maker. Approves all professional engagements above ₹25,000.",
  },
  {
    id: "mem_2",
    name: "Sneha Rao",
    relationship: "Spouse",
    dob: "1988-02-03",
    contact: "+91 98200 41121",
    role: "Family Member",
    permission: "Member",
    verification: "Verified",
    city: "Pune",
    notes: "Manages household insurance and school coordination.",
  },
  {
    id: "mem_3",
    name: "Vihaan Rao",
    relationship: "Son",
    dob: "2012-09-21",
    contact: "—",
    role: "Dependent",
    permission: "Viewer",
    verification: "Pending Review",
    city: "Pune",
    notes: "Grade 8, Symbiosis International School.",
  },
  {
    id: "mem_4",
    name: "Ira Rao",
    relationship: "Daughter",
    dob: "2017-11-08",
    contact: "—",
    role: "Dependent",
    permission: "Viewer",
    verification: "Not Started",
    city: "Pune",
  },
  {
    id: "mem_5",
    name: "Sushila Rao",
    relationship: "Mother",
    dob: "1957-01-19",
    contact: "+91 98200 41125",
    role: "Family Member",
    permission: "Member",
    verification: "Verified",
    city: "Nagpur",
    notes: "Senior citizen health cover renewed annually in September.",
  },
];

export const demoAssets: Asset[] = [
  { id: "ast_1", name: "HDFC Savings — Joint", category: "Bank accounts", value: 1_240_000, ownerId: "mem_1", institution: "HDFC Bank" },
  { id: "ast_2", name: "SBI Fixed Deposit", category: "Fixed deposits", value: 1_800_000, ownerId: "mem_2", institution: "State Bank of India" },
  { id: "ast_3", name: "Equity MF Portfolio", category: "Mutual funds", value: 3_450_000, ownerId: "mem_1" },
  { id: "ast_4", name: "Direct Equity Holdings", category: "Stocks", value: 980_000, ownerId: "mem_1" },
  { id: "ast_5", name: "Term & ULIP cover (surrender value)", category: "Insurance", value: 620_000, ownerId: "mem_1" },
  { id: "ast_6", name: "Apartment — Baner, Pune", category: "Real estate", value: 14_500_000, ownerId: "mem_1" },
  { id: "ast_7", name: "Ancestral house — Nagpur", category: "Real estate", value: 5_200_000, ownerId: "mem_5" },
  { id: "ast_8", name: "Gold & jewellery", category: "Gold", value: 2_150_000, ownerId: "mem_2" },
  { id: "ast_9", name: "Rao Consulting LLP stake", category: "Business interests", value: 3_000_000, ownerId: "mem_1" },
];

export const demoLiabilities: Liability[] = [
  { id: "lia_1", name: "Home loan — Baner apartment", category: "Home loan", outstanding: 6_850_000, monthlyObligation: 62_400, ownerId: "mem_1", institution: "ICICI Bank" },
  { id: "lia_2", name: "Car loan", category: "Personal loan", outstanding: 480_000, monthlyObligation: 18_200, ownerId: "mem_1" },
  { id: "lia_3", name: "Credit card — revolving", category: "Credit card", outstanding: 96_000, monthlyObligation: 12_000, ownerId: "mem_2" },
  { id: "lia_4", name: "Education loan (planned drawdown)", category: "Education loan", outstanding: 350_000, monthlyObligation: 8_500, ownerId: "mem_3" },
];

export const demoDocuments: FamilyDocument[] = [
  { id: "doc_1", name: "Aadhaar — Abhishek Rao", category: "Identity", ownerId: "mem_1", uploadedAt: "2026-03-15", status: "Verified" },
  { id: "doc_2", name: "PAN — Abhishek Rao", category: "Identity", ownerId: "mem_1", uploadedAt: "2026-03-15", status: "Verified" },
  { id: "doc_3", name: "Passport — Sneha Rao", category: "Travel", ownerId: "mem_2", uploadedAt: "2026-03-16", expiresAt: "2026-09-30", status: "Expiring Soon" },
  { id: "doc_4", name: "Family health insurance policy", category: "Insurance", ownerId: "mem_1", uploadedAt: "2026-04-02", expiresAt: "2026-09-12", status: "Expiring Soon" },
  { id: "doc_5", name: "Term life policy — Abhishek", category: "Insurance", ownerId: "mem_1", uploadedAt: "2026-04-02", expiresAt: "2027-01-20", status: "Verified" },
  { id: "doc_6", name: "Sale deed — Baner apartment", category: "Property", ownerId: "mem_1", uploadedAt: "2026-04-10", status: "Verified" },
  { id: "doc_7", name: "Home loan agreement — ICICI", category: "Legal", ownerId: "mem_1", uploadedAt: "2026-04-10", status: "Pending Review" },
  { id: "doc_8", name: "Registered will — Sushila Rao", category: "Legal", ownerId: "mem_5", uploadedAt: "2026-05-01", status: "Pending Review" },
  { id: "doc_9", name: "ITR acknowledgement FY 2024-25", category: "Tax", ownerId: "mem_1", uploadedAt: "2026-05-04", status: "Verified" },
  { id: "doc_10", name: "School fee receipts — Vihaan", category: "Education", ownerId: "mem_3", uploadedAt: "2026-05-18", status: "Verified" },
  { id: "doc_11", name: "Vaccination records — Ira", category: "Healthcare", ownerId: "mem_4", uploadedAt: "2026-05-18", status: "Verified" },
  { id: "doc_12", name: "Senior citizen health cover", category: "Insurance", ownerId: "mem_5", uploadedAt: "2026-06-01", expiresAt: "2026-08-30", status: "Expiring Soon" },
  { id: "doc_13", name: "Rao Consulting LLP deed", category: "Business", ownerId: "mem_1", uploadedAt: "2026-06-06", status: "Verified" },
  { id: "doc_14", name: "Rental agreement — Nagpur", category: "Property", ownerId: "mem_5", uploadedAt: "2026-06-11", expiresAt: "2026-07-31", status: "Expired" },
  { id: "doc_15", name: "Marriage certificate", category: "Family", ownerId: "mem_1", uploadedAt: "2026-06-14", status: "Verified" },
  { id: "doc_16", name: "Aadhaar — Sneha Rao", category: "Identity", ownerId: "mem_2", uploadedAt: "2026-06-14", status: "Verified" },
  { id: "doc_17", name: "Birth certificate — Ira", category: "Identity", ownerId: "mem_4", uploadedAt: "2026-06-20", status: "Pending Review" },
  { id: "doc_18", name: "Mutual fund consolidated statement", category: "Financial", ownerId: "mem_1", uploadedAt: "2026-07-01", status: "Verified" },
  { id: "doc_19", name: "Demat holding statement", category: "Financial", ownerId: "mem_1", uploadedAt: "2026-07-01", status: "Verified" },
  { id: "doc_20", name: "Property tax receipt — Pune", category: "Tax", ownerId: "mem_1", uploadedAt: "2026-07-12", status: "Verified" },
  { id: "doc_21", name: "Passport — Vihaan Rao", category: "Travel", ownerId: "mem_3", uploadedAt: "2026-07-19", expiresAt: "2026-10-15", status: "Expiring Soon" },
  { id: "doc_22", name: "Locker nomination form", category: "Financial", ownerId: "mem_2", uploadedAt: "2026-08-02", status: "Pending Review" },
  { id: "doc_23", name: "Medical reports — Sushila", category: "Healthcare", ownerId: "mem_5", uploadedAt: "2026-08-05", status: "Verified" },
  { id: "doc_24", name: "School admission letter — Ira", category: "Education", ownerId: "mem_4", uploadedAt: "2026-08-11", status: "Verified" },
];

export const demoTasks: FamilyTask[] = [
  { id: "tsk_1", title: "Renew family health insurance", ownerId: "mem_1", assigneeId: "mem_2", priority: "High", dueDate: "2026-09-12", status: "In Progress", category: "Insurance" },
  { id: "tsk_2", title: "Pay Q2 school fee — Vihaan", ownerId: "mem_2", assigneeId: "mem_2", priority: "High", dueDate: "2026-09-05", status: "To Do", category: "Education" },
  { id: "tsk_3", title: "Renew passport — Sneha", ownerId: "mem_1", assigneeId: "mem_1", priority: "Medium", dueDate: "2026-09-30", status: "To Do", category: "Travel" },
  { id: "tsk_4", title: "Review Nagpur rental agreement", ownerId: "mem_1", assigneeId: "mem_5", priority: "High", dueDate: "2026-08-31", status: "Waiting", category: "Property" },
  { id: "tsk_5", title: "File advance tax instalment", ownerId: "mem_1", assigneeId: "mem_1", priority: "Medium", dueDate: "2026-09-15", status: "To Do", category: "Tax" },
  { id: "tsk_6", title: "Schedule mother's annual health check", ownerId: "mem_1", assigneeId: "mem_2", priority: "Medium", dueDate: "2026-09-20", status: "To Do", category: "Healthcare" },
  { id: "tsk_7", title: "Digitise property papers — Baner", ownerId: "mem_1", assigneeId: "mem_1", priority: "Low", dueDate: "2026-10-10", status: "In Progress", category: "Property" },
  { id: "tsk_8", title: "Update nominee details across accounts", ownerId: "mem_1", assigneeId: "mem_2", priority: "Medium", dueDate: "2026-10-01", status: "To Do", category: "Financial" },
];

export const demoApprovals: Approval[] = [
  {
    id: "apr_1",
    request: "Approve legal consultation — will review",
    requestedById: "mem_5",
    amount: 12_000,
    date: "2026-08-22",
    status: "Pending",
    detail: "Engage a property lawyer to review the registered will and Nagpur title papers.",
  },
  {
    id: "apr_2",
    request: "Approve sharing of sale deed with lawyer",
    requestedById: "mem_2",
    date: "2026-08-23",
    status: "Pending",
    detail: "Time-limited access to the Baner sale deed for the assigned legal professional.",
  },
];

export const demoProfessionals: Professional[] = [
  { id: "pro_1", name: "Adv. Meera Kulkarni", profession: "Legal", specialization: "Property & succession", experienceYears: 14, location: "Pune", rating: 4.8, availability: "Within 2 days", indicativeFee: "₹3,500 / consultation" },
  { id: "pro_2", name: "CA Rohit Deshpande", profession: "CA / Tax", specialization: "Personal & LLP taxation", experienceYears: 11, location: "Pune", rating: 4.7, availability: "Within 3 days", indicativeFee: "₹2,500 / consultation" },
  { id: "pro_3", name: "Nandini Iyer, CFP", profession: "Financial Planning", specialization: "Family cashflow planning", experienceYears: 9, location: "Mumbai (remote)", rating: 4.6, availability: "Next week", indicativeFee: "₹5,000 / plan review" },
  { id: "pro_4", name: "Sameer Khan", profession: "Insurance", specialization: "Health & term cover", experienceYears: 12, location: "Pune", rating: 4.5, availability: "Same day", indicativeFee: "No consultation fee" },
];

export const demoServiceRequests: ServiceRequest[] = [
  { id: "req_1", category: "Legal", summary: "Review ancestral property title and will", memberId: "mem_5", urgency: "High", preferredDate: "2026-08-28", budgetRange: "₹10,000 – ₹25,000", status: "Awaiting Family Approval", professionalId: "pro_1" },
  { id: "req_2", category: "Insurance", summary: "Compare health cover renewal options", memberId: "mem_1", urgency: "Medium", preferredDate: "2026-09-02", budgetRange: "No fee", status: "Professional Assigned", professionalId: "pro_4" },
  { id: "req_3", category: "CA / Tax", summary: "Advance tax computation FY 2026-27", memberId: "mem_1", urgency: "Medium", preferredDate: "2026-09-10", budgetRange: "₹2,000 – ₹5,000", status: "Created" },
];

export const demoEvents: CalendarEvent[] = [
  { id: "evt_1", title: "Health insurance renewal", date: "2026-09-12", type: "Renewal", memberId: "mem_1" },
  { id: "evt_2", title: "School fee deadline — Vihaan", date: "2026-09-05", type: "Deadline", memberId: "mem_3" },
  { id: "evt_3", title: "Passport renewal window opens", date: "2026-08-30", type: "Deadline", memberId: "mem_2" },
  { id: "evt_4", title: "Home loan EMI", date: "2026-09-01", type: "Payment", memberId: "mem_1" },
  { id: "evt_5", title: "Property document review with lawyer", date: "2026-08-28", type: "Appointment", memberId: "mem_5" },
];

export const demoConversations: Conversation[] = [
  { id: "con_1", title: "Family", participant: "Sneha, Sushila", lastMessage: "Shared the school fee receipt in the vault.", lastAt: "2026-08-23", unread: 2 },
  { id: "con_2", title: "Adv. Meera Kulkarni", participant: "Legal Advisor", lastMessage: "Please authorise access to the sale deed.", lastAt: "2026-08-23", unread: 1 },
  { id: "con_3", title: "CA Rohit Deshpande", participant: "CA", lastMessage: "Advance tax working attached.", lastAt: "2026-08-21", unread: 0 },
  { id: "con_4", title: "FamilyOS Support", participant: "Support", lastMessage: "Your family workspace is ready.", lastAt: "2026-08-19", unread: 0 },
];

export const netWorthTrend = [
  { month: "Mar", value: 21_800_000 },
  { month: "Apr", value: 22_150_000 },
  { month: "May", value: 22_460_000 },
  { month: "Jun", value: 23_020_000 },
  { month: "Jul", value: 23_390_000 },
  { month: "Aug", value: 24_164_000 },
];

export function memberById(id?: string) {
  return demoMembers.find((m) => m.id === id);
}

export const totals = {
  get assets() {
    return demoAssets.reduce((s, a) => s + a.value, 0);
  },
  get liabilities() {
    return demoLiabilities.reduce((s, l) => s + l.outstanding, 0);
  },
  get netWorth() {
    return this.assets - this.liabilities;
  },
  get monthlyObligations() {
    return demoLiabilities.reduce((s, l) => s + l.monthlyObligation, 0);
  },
};
