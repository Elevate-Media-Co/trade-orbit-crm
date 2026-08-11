import type {
  CallOutcome,
  LeadPriority,
  LeadSource,
  LeadStatus,
  PaymentStatus,
  UserRole,
} from "@/types";

export const leadStatusLabels: Record<LeadStatus, string> = {
  new_lead: "New Lead",
  attempted: "Attempted",
  connected: "Connected",
  interested: "Interested",
  follow_up: "Follow-up",
  hot: "Hot Lead",
  nurturing: "Nurturing",
  payment_pending: "Payment Pending",
  enrolled: "Enrolled",
  lost: "Lost",
  not_interested: "Not Interested",
  wrong_number: "Wrong Number",
};

export const leadPriorityLabels: Record<LeadPriority, string> = {
  cold: "Cold",
  warm: "Warm",
  hot: "Hot",
};

export const leadSourceLabels: Record<LeadSource, string> = {
  meta_ads: "Meta Ads",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  website: "Website",
  referral: "Referral",
};

export const callOutcomeLabels: Record<CallOutcome, string> = {
  no_answer: "No Answer",
  busy: "Busy",
  connected: "Connected",
  interested: "Interested",
  call_back: "Call Back",
  not_interested: "Not Interested",
  wrong_number: "Wrong Number",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  not_started: "Not Started",
  partial: "Partial",
  pending: "Pending",
  completed: "Completed",
  refunded: "Refunded",
};

export const userRoleLabels: Record<UserRole, string> = {
  admin: "Admin / Manager",
  telecaller: "Telecaller",
  nurturing: "Nurturing / Closer",
};

export const funnelStages: LeadStatus[] = [
  "new_lead",
  "attempted",
  "connected",
  "interested",
  "hot",
  "enrolled",
];
