"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CheckCircle2,
  ChevronRight,
  Flame,
  MapPin,
  Phone,
  PhoneCall,
  Save,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { PriorityBadge, SourceBadge, StatusBadge } from "@/components/shared/status-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { callOutcomeLabels, leadStatusLabels } from "@/lib/labels";
import { enrichLead, getTelecallerQueue } from "@/lib/selectors";
import { formatPhone } from "@/lib/utils";
import type { CallOutcome, LeadStatus } from "@/types";

const outcomes: CallOutcome[] = [
  "no_answer",
  "busy",
  "connected",
  "interested",
  "call_back",
  "not_interested",
  "wrong_number",
];

const statusOptions: LeadStatus[] = [
  "new_lead",
  "attempted",
  "connected",
  "interested",
  "follow_up",
  "hot",
  "not_interested",
  "wrong_number",
];

export function CallingWorkspace() {
  const initialQueue = useMemo(() => getTelecallerQueue().map(enrichLead), []);
  const [queue, setQueue] = useState(initialQueue);
  const [index, setIndex] = useState(0);
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("2026-08-12");
  const [followUpTime, setFollowUpTime] = useState("11:00");
  const [status, setStatus] = useState<LeadStatus>(initialQueue[0]?.status ?? "new_lead");
  const [selectedOutcome, setSelectedOutcome] = useState<CallOutcome | null>(null);
  const [completed, setCompleted] = useState(0);
  const [connectedCount, setConnectedCount] = useState(0);

  const active = queue[index];
  const remaining = queue.slice(index + 1, index + 6);

  const stats = {
    assigned: queue.length,
    completed,
    connected: connectedCount,
    followUps: queue.filter((lead) => lead.nextFollowUpAt?.startsWith("2026-08-11")).length,
    hot: queue.filter((lead) => lead.priority === "hot" || lead.status === "hot").length,
  };

  function selectLead(nextIndex: number) {
    const lead = queue[nextIndex];
    if (!lead) return;
    setIndex(nextIndex);
    setStatus(lead.status);
    setNotes(lead.notes ?? "");
    setSelectedOutcome(null);
    if (lead.nextFollowUpAt) {
      const [datePart, timePart] = lead.nextFollowUpAt.split("T");
      setFollowUpDate(datePart);
      setFollowUpTime(timePart.slice(0, 5));
    }
  }

  function handleOutcome(outcome: CallOutcome) {
    setSelectedOutcome(outcome);
    if (outcome === "no_answer" || outcome === "busy") setStatus("attempted");
    if (outcome === "connected") setStatus("connected");
    if (outcome === "interested") setStatus("interested");
    if (outcome === "call_back") setStatus("follow_up");
    if (outcome === "not_interested") setStatus("not_interested");
    if (outcome === "wrong_number") setStatus("wrong_number");
  }

  function handleSaveAndNext() {
    if (!active) return;
    if (!selectedOutcome) {
      toast.message("Select a call outcome before saving.");
      return;
    }

    const nextQueue = [...queue];
    nextQueue[index] = {
      ...active,
      status,
      notes,
      lastContactAt: "2026-08-11T10:35:00+05:30",
      nextFollowUpAt: `${followUpDate}T${followUpTime}:00+05:30`,
      updatedAt: "2026-08-11T10:35:00+05:30",
    };
    setQueue(nextQueue);
    setCompleted((value) => value + 1);
    if (["connected", "interested", "call_back"].includes(selectedOutcome)) {
      setConnectedCount((value) => value + 1);
    }
    toast.success(`Saved ${active.name}`, {
      description: `${callOutcomeLabels[selectedOutcome]} · ${leadStatusLabels[status]}`,
    });

    if (index < queue.length - 1) {
      selectLead(index + 1);
    } else {
      toast.message("Queue complete for now.");
    }
  }

  if (!active) {
    return (
      <div className="space-y-5">
        <PageHeader title="My Calling" description="No leads in your queue right now." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Calling"
        description="Process assigned leads quickly — outcome, note, follow-up, next."
        actions={
          <Button variant="outline" asChild>
            <Link href={`/leads/${active.id}`}>Open lead profile</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiCard label="Assigned" value={stats.assigned} />
        <KpiCard label="Completed" value={stats.completed} tone="success" />
        <KpiCard label="Connected" value={stats.connected} />
        <KpiCard label="Follow-ups" value={stats.followUps} tone="warning" />
        <KpiCard label="Hot Leads" value={stats.hot} tone="accent" icon={Flame} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden">
          <div className="border-b border-[var(--border)] bg-[var(--navy)] px-5 py-4 text-white">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">
                  Active lead · {index + 1} of {queue.length}
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">{active.name}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/75">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {formatPhone(active.phone)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {active.city}
                  </span>
                </div>
              </div>
              <Button
                size="xl"
                variant="accent"
                className="min-w-[140px]"
                onClick={() =>
                  toast.message("Dialing…", {
                    description: `Connecting to ${formatPhone(active.phone)}`,
                  })
                }
              >
                <PhoneCall className="h-4 w-4" />
                Call Now
              </Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Meta label="Campaign" value={active.campaign?.name ?? "—"} />
              <Meta label="Source" value={<SourceBadge source={active.source} />} />
              <Meta label="Status" value={<StatusBadge status={active.status} />} />
              <Meta label="Priority" value={<PriorityBadge priority={active.priority} />} />
            </div>
          </div>

          <CardContent className="space-y-5 p-5">
            <div>
              <Label className="mb-2 block">Quick call outcomes</Label>
              <div className="flex flex-wrap gap-2">
                {outcomes.map((outcome) => (
                  <Button
                    key={outcome}
                    type="button"
                    size="sm"
                    variant={selectedOutcome === outcome ? "default" : "outline"}
                    onClick={() => handleOutcome(outcome)}
                  >
                    {callOutcomeLabels[outcome]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Call notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="What did the lead say? Objection? Next step?"
                  className="min-h-[110px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="follow-date">Next follow-up date</Label>
                <Input
                  id="follow-date"
                  type="date"
                  value={followUpDate}
                  onChange={(event) => setFollowUpDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="follow-time">Next follow-up time</Label>
                <Input
                  id="follow-time"
                  type="time"
                  value={followUpTime}
                  onChange={(event) => setFollowUpTime(event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Lead status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as LeadStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {leadStatusLabels[item]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
              <p className="text-xs text-[var(--muted-foreground)]">
                Tip: choose outcome → note → save. Keyboard-friendly buttons keep cadence high.
              </p>
              <Button size="lg" variant="accent" onClick={handleSaveAndNext}>
                <Save className="h-4 w-4" />
                Save & Next Lead
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Upcoming in queue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {remaining.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">End of queue.</p>
              ) : (
                remaining.map((lead, offset) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => selectLead(index + 1 + offset)}
                    className="flex w-full items-start justify-between rounded-md border border-[var(--border)] px-3 py-2.5 text-left transition-colors hover:bg-[var(--workspace)]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{lead.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {lead.city} · {formatPhone(lead.phone)}
                      </p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Session checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <ChecklistItem done={completed > 0} label="Log every attempt" />
              <ChecklistItem done={Boolean(selectedOutcome)} label="Capture outcome" />
              <ChecklistItem done={notes.length > 8} label="Write a usable note" />
              <ChecklistItem done={Boolean(followUpDate)} label="Set next follow-up" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.08em] text-white/45">{label}</p>
      <div className="mt-1 text-sm text-white/90">{value}</div>
    </div>
  );
}

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className={`h-4 w-4 ${done ? "text-emerald-600" : "text-[var(--border-strong)]"}`} />
      <span className={done ? "text-[var(--foreground)]" : undefined}>{label}</span>
    </div>
  );
}
