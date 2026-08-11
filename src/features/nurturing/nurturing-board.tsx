"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PaymentBadge, PriorityBadge } from "@/components/shared/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNurturingLeads } from "@/lib/selectors";
import { formatPercent, formatRelative } from "@/lib/utils";
import type { LeadStatus } from "@/types";

const stages: Array<{ key: LeadStatus; label: string }> = [
  { key: "interested", label: "Interested" },
  { key: "hot", label: "Hot" },
  { key: "follow_up", label: "Follow-up" },
  { key: "payment_pending", label: "Payment Pending" },
  { key: "enrolled", label: "Enrolled" },
  { key: "lost", label: "Lost" },
];

function normalizeStage(status: LeadStatus): LeadStatus {
  if (status === "nurturing") return "follow_up";
  if (stages.some((stage) => stage.key === status)) return status;
  return "follow_up";
}

export function NurturingBoard() {
  const leads = useMemo(() => getNurturingLeads(), []);
  const [view, setView] = useState<"board" | "list">("board");

  const grouped = stages.map((stage) => ({
    ...stage,
    leads: leads.filter((lead) => normalizeStage(lead.status) === stage.key),
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Nurturing"
        description="High-intent pipeline for closers — objections, next actions, and payment status."
        actions={
          <Tabs value={view} onValueChange={(value) => setView(value as "board" | "list")}>
            <TabsList>
              <TabsTrigger value="board" className="gap-1.5">
                <LayoutGrid className="h-3.5 w-3.5" />
                Board
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-1.5">
                <List className="h-3.5 w-3.5" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      {view === "board" ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {grouped.map((column) => (
            <div
              key={column.key}
              className="w-[280px] shrink-0 rounded-lg border border-[var(--border)] bg-[var(--workspace)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2.5">
                <p className="text-sm font-semibold">{column.label}</p>
                <span className="rounded bg-white px-1.5 py-0.5 text-[11px] font-semibold tabular-nums">
                  {column.leads.length}
                </span>
              </div>
              <div className="space-y-2 p-2">
                {column.leads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="block rounded-md border border-[var(--border)] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-[var(--border-strong)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{lead.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {lead.closer?.name ?? lead.owner?.name}
                        </p>
                      </div>
                      <PriorityBadge priority={lead.priority} />
                    </div>
                    <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                      {lead.campaign?.name}
                    </p>
                    <p className="mt-1 text-xs">
                      <span className="text-[var(--muted-foreground)]">Objection: </span>
                      {lead.objection ?? "—"}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-[var(--muted-foreground)]">
                      <span>{formatRelative(lead.lastContactAt)}</span>
                      <span className="font-medium text-[var(--navy)]">
                        {formatPercent(lead.probability ?? 0)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="truncate text-[11px] text-[var(--muted-foreground)]">
                        Next: {lead.nextFollowUpAt ? formatRelative(lead.nextFollowUpAt) : "—"}
                      </p>
                      {lead.paymentStatus ? <PaymentBadge status={lead.paymentStatus} /> : null}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nurturing list</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="crm-table min-w-[1000px]">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Assigned closer</th>
                  <th>Course / Campaign</th>
                  <th>Objection</th>
                  <th>Last interaction</th>
                  <th>Next action</th>
                  <th>Probability</th>
                  <th>Payment</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <Link href={`/leads/${lead.id}`} className="font-medium hover:underline">
                        {lead.name}
                      </Link>
                    </td>
                    <td>{lead.closer?.name ?? lead.owner?.name}</td>
                    <td>{lead.campaign?.name}</td>
                    <td>{lead.objection ?? "—"}</td>
                    <td>{formatRelative(lead.lastContactAt)}</td>
                    <td>{lead.nextFollowUpAt ? formatRelative(lead.nextFollowUpAt) : "—"}</td>
                    <td className="tabular-nums">{formatPercent(lead.probability ?? 0)}</td>
                    <td>
                      {lead.paymentStatus ? <PaymentBadge status={lead.paymentStatus} /> : "—"}
                    </td>
                    <td className="capitalize">{normalizeStage(lead.status).replaceAll("_", " ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
