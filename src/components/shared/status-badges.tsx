import { Badge } from "@/components/ui/badge";
import {
  callOutcomeLabels,
  leadPriorityLabels,
  leadSourceLabels,
  leadStatusLabels,
  paymentStatusLabels,
} from "@/lib/labels";
import type {
  CallOutcome,
  LeadPriority,
  LeadSource,
  LeadStatus,
  PaymentStatus,
} from "@/types";

const statusVariant: Record<
  LeadStatus,
  "secondary" | "success" | "warning" | "danger" | "accent" | "info" | "muted"
> = {
  new_lead: "info",
  attempted: "secondary",
  connected: "info",
  interested: "accent",
  follow_up: "warning",
  hot: "accent",
  nurturing: "info",
  payment_pending: "warning",
  enrolled: "success",
  lost: "muted",
  not_interested: "muted",
  wrong_number: "danger",
};

const priorityVariant: Record<LeadPriority, "secondary" | "warning" | "danger"> = {
  cold: "secondary",
  warm: "warning",
  hot: "danger",
};

const paymentVariant: Record<PaymentStatus, "secondary" | "warning" | "success" | "danger" | "info"> =
  {
    not_started: "secondary",
    partial: "warning",
    pending: "warning",
    completed: "success",
    refunded: "danger",
  };

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <Badge variant={statusVariant[status]}>{leadStatusLabels[status]}</Badge>;
}

export function PriorityBadge({ priority }: { priority: LeadPriority }) {
  return <Badge variant={priorityVariant[priority]}>{leadPriorityLabels[priority]}</Badge>;
}

export function SourceBadge({ source }: { source: LeadSource }) {
  return <Badge variant="outline">{leadSourceLabels[source]}</Badge>;
}

export function OutcomeBadge({ outcome }: { outcome: CallOutcome }) {
  return <Badge variant="secondary">{callOutcomeLabels[outcome]}</Badge>;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={paymentVariant[status]}>{paymentStatusLabels[status]}</Badge>;
}
