"use client";

import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarClock,
  MessageCircle,
  Phone,
  RefreshCcw,
  UserRoundCog,
} from "lucide-react";
import { PriorityBadge, SourceBadge, StatusBadge, PaymentBadge } from "@/components/shared/status-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  getActivitiesForLead,
  getCallsForLead,
  getFollowUpsForLead,
  getLeadById,
} from "@/mock-data";
import { enrichLead } from "@/lib/selectors";
import { callOutcomeLabels, leadStatusLabels } from "@/lib/labels";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPhone,
  formatRelative,
} from "@/lib/utils";

export function LeadDetailView({ leadId }: { leadId: string }) {
  const raw = getLeadById(leadId);
  if (!raw) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-white p-8 text-center">
        <h1 className="text-lg font-semibold">Lead not found</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          This lead ID is not in the prototype dataset.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/leads">Back to leads</Link>
        </Button>
      </div>
    );
  }
  const lead = enrichLead(raw);
  const timeline = getActivitiesForLead(lead.id);
  const callHistory = getCallsForLead(lead.id);
  const leadFollowUps = getFollowUpsForLead(lead.id);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/leads">
            <ArrowLeft className="h-4 w-4" />
            Back to leads
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-[var(--border)] bg-white px-5 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
                <StatusBadge status={lead.status} />
                <PriorityBadge priority={lead.priority} />
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted-foreground)]">
                <span>{formatPhone(lead.phone)}</span>
                <span>{lead.city}</span>
                <span>{lead.campaign?.name}</span>
                <span className="inline-flex items-center gap-1.5">
                  Source <SourceBadge source={lead.source} />
                </span>
                <span>Owner: {lead.owner?.name ?? "Unassigned"}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="accent"
                onClick={() => toast.message("Dialing…", { description: formatPhone(lead.phone) })}
              >
                <Phone className="h-4 w-4" />
                Call
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("WhatsApp draft opened")}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.message("Schedule follow-up")}
              >
                <CalendarClock className="h-4 w-4" />
                Schedule Follow-up
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.message("Change status")}
              >
                <RefreshCcw className="h-4 w-4" />
                Change Status
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.message("Reassign lead")}
              >
                <UserRoundCog className="h-4 w-4" />
                Reassign
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Activity timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {timeline.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">No activity logged yet.</p>
            ) : (
              <ol className="space-y-4">
                {timeline.map((activity, index) => (
                  <li key={activity.id} className="relative flex gap-3 pb-1">
                    {index < timeline.length - 1 ? (
                      <span className="absolute left-[11px] top-6 h-[calc(100%-8px)] w-px bg-[var(--border)]" />
                    ) : null}
                    <span className="mt-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--workspace)] text-[10px] font-semibold uppercase text-[var(--muted-foreground)]">
                      {activity.type.slice(0, 1)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{activity.description}</p>
                      <p className="mt-1 text-[11px] text-[var(--muted)]">
                        {formatRelative(activity.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow label="Email" value={lead.email ?? "—"} />
              <InfoRow label="City" value={lead.city} />
              <InfoRow label="Campaign" value={lead.campaign?.name ?? "—"} />
              <InfoRow label="Course interest" value={lead.courseInterest ?? "—"} />
              <InfoRow label="Created" value={formatDateTime(lead.createdAt)} />
              <InfoRow label="Last contact" value={formatDateTime(lead.lastContactAt)} />
              <InfoRow label="Assigned telecaller" value={lead.owner?.name ?? "—"} />
              <InfoRow label="Closer" value={lead.closer?.name ?? "—"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Follow-up information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Next follow-up" value={formatDateTime(lead.nextFollowUpAt)} />
              {leadFollowUps.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">No follow-up history.</p>
              ) : (
                leadFollowUps.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-[var(--border)] px-3 py-2 text-sm"
                  >
                    <p className="font-medium">{formatDateTime(item.scheduledAt)}</p>
                    <p className="text-[var(--muted-foreground)]">{item.notes}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-[var(--muted)]">
                      {item.status}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow
                label="Probability"
                value={lead.probability != null ? `${lead.probability}%` : "—"}
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--muted-foreground)]">Payment status</span>
                {lead.paymentStatus ? <PaymentBadge status={lead.paymentStatus} /> : "—"}
              </div>
              <InfoRow label="Primary objection" value={lead.objection ?? "—"} />
              <InfoRow
                label="Est. course value"
                value={formatCurrency(lead.campaign?.budget ? Math.round(lead.campaign.budget / 40) : 24999)}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Call history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {callHistory.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">No calls logged.</p>
            ) : (
              callHistory.map((call) => (
                <div key={call.id} className="rounded-md border border-[var(--border)] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{callOutcomeLabels[call.outcome]}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {Math.round(call.durationSeconds / 60)}m {call.durationSeconds % 60}s
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{call.notes}</p>
                  <p className="mt-2 text-[11px] text-[var(--muted)]">
                    {formatRelative(call.createdAt)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-[var(--border)] bg-[var(--workspace)] p-3 text-sm leading-relaxed">
              {lead.notes ?? "No notes yet."}
            </div>
            <Separator className="my-4" />
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px]">
                  {lead.owner?.avatarInitials ?? "TO"}
                </AvatarFallback>
              </Avatar>
              <span>
                Current status: {leadStatusLabels[lead.status]} · Updated{" "}
                {formatDate(lead.updatedAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[var(--muted-foreground)]">{label}</span>
      <span className="text-right font-medium text-[var(--foreground)]">{value}</span>
    </div>
  );
}
