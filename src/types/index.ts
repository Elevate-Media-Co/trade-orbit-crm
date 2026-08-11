export type UserRole = "admin" | "telecaller" | "nurturing";

export type LeadStatus =
  | "new_lead"
  | "attempted"
  | "connected"
  | "interested"
  | "follow_up"
  | "hot"
  | "nurturing"
  | "payment_pending"
  | "enrolled"
  | "lost"
  | "not_interested"
  | "wrong_number";

export type LeadPriority = "cold" | "warm" | "hot";

export type LeadSource =
  | "meta_ads"
  | "instagram"
  | "whatsapp"
  | "website"
  | "referral";

export type CallOutcome =
  | "no_answer"
  | "busy"
  | "connected"
  | "interested"
  | "call_back"
  | "not_interested"
  | "wrong_number";

export type ActivityType =
  | "call"
  | "note"
  | "status_change"
  | "follow_up"
  | "assignment"
  | "whatsapp"
  | "payment";

export type PaymentStatus =
  | "not_started"
  | "partial"
  | "pending"
  | "completed"
  | "refunded";

export type FollowUpStatus = "pending" | "completed" | "missed" | "rescheduled";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarInitials: string;
  isActive: boolean;
  city: string;
}

export interface Campaign {
  id: string;
  name: string;
  city: string;
  status: "active" | "completed" | "upcoming";
  startDate: string;
  endDate: string;
  leadsCount: number;
  enrollments: number;
  budget: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  city: string;
  campaignId: string;
  source: LeadSource;
  ownerId: string;
  status: LeadStatus;
  priority: LeadPriority;
  lastContactAt: string | null;
  nextFollowUpAt: string | null;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  objection?: string;
  probability?: number;
  paymentStatus?: PaymentStatus;
  courseInterest?: string;
  closerId?: string;
}

export interface Call {
  id: string;
  leadId: string;
  userId: string;
  outcome: CallOutcome;
  durationSeconds: number;
  notes: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  userId: string;
  scheduledAt: string;
  status: FollowUpStatus;
  notes: string;
  completedAt?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  leadId: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string;
  createdAt: string;
  metadata?: Record<string, string>;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface DailyActivityPoint {
  date: string;
  calls: number;
  connected: number;
  interested: number;
  enrollments: number;
}

export interface TeamPerformance {
  userId: string;
  calls: number;
  connected: number;
  interested: number;
  followUps: number;
  enrollments: number;
}
