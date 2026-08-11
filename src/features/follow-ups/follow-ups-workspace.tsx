"use client";

import Link from "next/link";
import { toast } from "sonner";
import { CalendarClock, Check, Phone, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PriorityBadge, StatusBadge } from "@/components/shared/status-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLeadById } from "@/mock-data";
import { getFollowUpsGrouped } from "@/lib/selectors";
import { formatDateTime, formatPhone } from "@/lib/utils";
import type { FollowUp } from "@/types";

export function FollowUpsWorkspace() {
  const groups = getFollowUpsGrouped();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Follow-ups"
        description="Clear overdue items first, then work today's scheduled callbacks."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <FollowUpSection
          title="Overdue"
          description="Visibly prioritized without alarmist styling"
          items={groups.overdue}
          tone="overdue"
        />
        <FollowUpSection title="Today" description="Due before end of day" items={groups.today} />
        <FollowUpSection
          title="Tomorrow"
          description="Prepare scripts and objections"
          items={groups.tomorrow}
        />
        <FollowUpSection
          title="Upcoming"
          description="Later this week"
          items={groups.upcoming}
        />
      </div>
    </div>
  );
}

function FollowUpSection({
  title,
  description,
  items,
  tone,
}: {
  title: string;
  description: string;
  items: FollowUp[];
  tone?: "overdue";
}) {
  return (
    <Card className={tone === "overdue" ? "border-amber-200" : undefined}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-[var(--muted-foreground)]" />
              {title}
            </CardTitle>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">{description}</p>
          </div>
          <span className="rounded-md bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold tabular-nums">
            {items.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 ? (
          <EmptyState
            title={`No ${title.toLowerCase()} follow-ups`}
            description="You're clear in this bucket."
            className="border-0 bg-transparent py-8"
          />
        ) : (
          items.map((item) => {
            const lead = getLeadById(item.leadId);
            if (!lead) return null;
            return (
              <div
                key={item.id}
                className={`rounded-md border px-3 py-3 ${
                  tone === "overdue"
                    ? "border-amber-200/90 bg-amber-50/40"
                    : "border-[var(--border)] bg-white"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {formatPhone(lead.phone)} · {lead.city}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {formatDateTime(item.scheduledAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <StatusBadge status={lead.status} />
                    <PriorityBadge priority={lead.priority} />
                  </div>
                </div>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.notes}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success("Follow-up marked complete")}
                  >
                    <Check className="h-3.5 w-3.5" />
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.message("Reschedule picker opened")}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reschedule
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.message("Dialing…", { description: formatPhone(lead.phone) })}
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/leads/${lead.id}`}>View Lead</Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
