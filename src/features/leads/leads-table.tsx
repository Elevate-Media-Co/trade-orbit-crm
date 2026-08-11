"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowDownUp,
  Download,
  Plus,
  Search,
  Upload,
  UserPlus,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PriorityBadge, SourceBadge, StatusBadge } from "@/components/shared/status-badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { campaigns, leads, users } from "@/mock-data";
import { enrichLead } from "@/lib/selectors";
import {
  leadPriorityLabels,
  leadSourceLabels,
  leadStatusLabels,
} from "@/lib/labels";
import { formatDate, formatDateTime, formatPhone, formatRelative } from "@/lib/utils";
import type { LeadPriority, LeadSource, LeadStatus } from "@/types";

type SortKey =
  | "name"
  | "city"
  | "status"
  | "priority"
  | "lastContactAt"
  | "nextFollowUpAt"
  | "createdAt";

const PAGE_SIZE = 10;

export function LeadsTable() {
  const enriched = useMemo(() => leads.map(enrichLead), []);
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState("all");
  const [status, setStatus] = useState("all");
  const [campaign, setCampaign] = useState("all");
  const [source, setSource] = useState("all");
  const [city, setCity] = useState("all");
  const [priority, setPriority] = useState("all");
  const [followUp, setFollowUp] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const cities = useMemo(
    () => Array.from(new Set(enriched.map((lead) => lead.city))).sort(),
    [enriched]
  );

  const filtered = useMemo(() => {
    let rows = [...enriched];

    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (lead) =>
          lead.name.toLowerCase().includes(q) ||
          lead.phone.includes(q) ||
          lead.city.toLowerCase().includes(q) ||
          lead.campaign?.name.toLowerCase().includes(q)
      );
    }
    if (owner !== "all") rows = rows.filter((lead) => lead.ownerId === owner);
    if (status !== "all") rows = rows.filter((lead) => lead.status === status);
    if (campaign !== "all") rows = rows.filter((lead) => lead.campaignId === campaign);
    if (source !== "all") rows = rows.filter((lead) => lead.source === source);
    if (city !== "all") rows = rows.filter((lead) => lead.city === city);
    if (priority !== "all") rows = rows.filter((lead) => lead.priority === priority);
    if (followUp === "today") {
      rows = rows.filter((lead) => lead.nextFollowUpAt?.startsWith("2026-08-11"));
    } else if (followUp === "overdue") {
      rows = rows.filter(
        (lead) => lead.nextFollowUpAt && lead.nextFollowUpAt < "2026-08-11T00:00:00+05:30"
      );
    } else if (followUp === "upcoming") {
      rows = rows.filter(
        (lead) => lead.nextFollowUpAt && lead.nextFollowUpAt >= "2026-08-12T00:00:00+05:30"
      );
    }

    rows.sort((a, b) => {
      const av = (a[sortKey] ?? "") as string;
      const bv = (b[sortKey] ?? "") as string;
      const cmp = av.localeCompare(bv);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [
    enriched,
    query,
    owner,
    status,
    campaign,
    source,
    city,
    priority,
    followUp,
    sortKey,
    sortDir,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allPageSelected =
    pageRows.length > 0 && pageRows.every((lead) => selected.includes(lead.id));

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleSelectAll() {
    if (allPageSelected) {
      setSelected((prev) => prev.filter((id) => !pageRows.some((lead) => lead.id === id)));
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...pageRows.map((lead) => lead.id)])));
    }
  }

  function toggleRow(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leads"
        description="Search, filter, and assign Trade Orbit leads across campaigns."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => toast.message("Import wizard opens in next phase.")}
            >
              <Upload className="h-4 w-4" />
              Import Leads
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Export queued", { description: `${filtered.length} leads` })}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              disabled={selected.length === 0}
              onClick={() =>
                toast.success("Assign dialog", {
                  description: `${selected.length} leads selected`,
                })
              }
            >
              <UserPlus className="h-4 w-4" />
              Assign
            </Button>
            <Button
              variant="accent"
              onClick={() => toast.message("Add Lead form opens in next phase.")}
            >
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search name, phone, city, campaign…"
                className="pl-9"
              />
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              {filtered.length} leads · {selected.length} selected
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            <FilterSelect
              value={owner}
              onChange={(value) => {
                setOwner(value);
                setPage(1);
              }}
              placeholder="Owner"
              options={[
                { value: "all", label: "All owners" },
                ...users.map((user) => ({ value: user.id, label: user.name })),
              ]}
            />
            <FilterSelect
              value={status}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              placeholder="Status"
              options={[
                { value: "all", label: "All statuses" },
                ...(Object.keys(leadStatusLabels) as LeadStatus[]).map((key) => ({
                  value: key,
                  label: leadStatusLabels[key],
                })),
              ]}
            />
            <FilterSelect
              value={campaign}
              onChange={(value) => {
                setCampaign(value);
                setPage(1);
              }}
              placeholder="Campaign"
              options={[
                { value: "all", label: "All campaigns" },
                ...campaigns.map((item) => ({ value: item.id, label: item.name })),
              ]}
            />
            <FilterSelect
              value={source}
              onChange={(value) => {
                setSource(value);
                setPage(1);
              }}
              placeholder="Source"
              options={[
                { value: "all", label: "All sources" },
                ...(Object.keys(leadSourceLabels) as LeadSource[]).map((key) => ({
                  value: key,
                  label: leadSourceLabels[key],
                })),
              ]}
            />
            <FilterSelect
              value={city}
              onChange={(value) => {
                setCity(value);
                setPage(1);
              }}
              placeholder="City"
              options={[
                { value: "all", label: "All cities" },
                ...cities.map((item) => ({ value: item, label: item })),
              ]}
            />
            <FilterSelect
              value={priority}
              onChange={(value) => {
                setPriority(value);
                setPage(1);
              }}
              placeholder="Priority"
              options={[
                { value: "all", label: "All priorities" },
                ...(Object.keys(leadPriorityLabels) as LeadPriority[]).map((key) => ({
                  value: key,
                  label: leadPriorityLabels[key],
                })),
              ]}
            />
            <FilterSelect
              value={followUp}
              onChange={(value) => {
                setFollowUp(value);
                setPage(1);
              }}
              placeholder="Follow-up"
              options={[
                { value: "all", label: "Any follow-up" },
                { value: "overdue", label: "Overdue" },
                { value: "today", label: "Today" },
                { value: "upcoming", label: "Upcoming" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {pageRows.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No leads match these filters"
                description="Clear filters or broaden your search to see more leads."
                actionLabel="Reset filters"
                onAction={() => {
                  setQuery("");
                  setOwner("all");
                  setStatus("all");
                  setCampaign("all");
                  setSource("all");
                  setCity("all");
                  setPriority("all");
                  setFollowUp("all");
                  setPage(1);
                }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="crm-table min-w-[1100px]">
                <thead>
                  <tr>
                    <th className="w-10">
                      <Checkbox
                        checked={allPageSelected}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all on page"
                      />
                    </th>
                    <SortableTh label="Name" active={sortKey === "name"} onClick={() => toggleSort("name")} />
                    <th>Phone</th>
                    <SortableTh label="City" active={sortKey === "city"} onClick={() => toggleSort("city")} />
                    <th>Campaign</th>
                    <th>Source</th>
                    <th>Owner</th>
                    <SortableTh
                      label="Status"
                      active={sortKey === "status"}
                      onClick={() => toggleSort("status")}
                    />
                    <SortableTh
                      label="Priority"
                      active={sortKey === "priority"}
                      onClick={() => toggleSort("priority")}
                    />
                    <SortableTh
                      label="Last Contact"
                      active={sortKey === "lastContactAt"}
                      onClick={() => toggleSort("lastContactAt")}
                    />
                    <SortableTh
                      label="Next Follow-up"
                      active={sortKey === "nextFollowUpAt"}
                      onClick={() => toggleSort("nextFollowUpAt")}
                    />
                    <SortableTh
                      label="Created"
                      active={sortKey === "createdAt"}
                      onClick={() => toggleSort("createdAt")}
                    />
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((lead) => (
                    <tr key={lead.id} className={selected.includes(lead.id) ? "bg-[var(--accent-soft)]/40" : undefined}>
                      <td>
                        <Checkbox
                          checked={selected.includes(lead.id)}
                          onCheckedChange={() => toggleRow(lead.id)}
                          aria-label={`Select ${lead.name}`}
                        />
                      </td>
                      <td>
                        <Link
                          href={`/leads/${lead.id}`}
                          className="font-medium text-[var(--navy)] hover:underline"
                        >
                          {lead.name}
                        </Link>
                      </td>
                      <td className="tabular-nums">{formatPhone(lead.phone)}</td>
                      <td>{lead.city}</td>
                      <td className="max-w-[160px] truncate">{lead.campaign?.name}</td>
                      <td>
                        <SourceBadge source={lead.source} />
                      </td>
                      <td>{lead.owner?.name ?? "—"}</td>
                      <td>
                        <StatusBadge status={lead.status} />
                      </td>
                      <td>
                        <PriorityBadge priority={lead.priority} />
                      </td>
                      <td className="whitespace-nowrap text-[var(--muted-foreground)]">
                        {lead.lastContactAt ? formatRelative(lead.lastContactAt) : "—"}
                      </td>
                      <td className="whitespace-nowrap text-[var(--muted-foreground)]">
                        {lead.nextFollowUpAt ? formatDateTime(lead.nextFollowUpAt) : "—"}
                      </td>
                      <td className="whitespace-nowrap text-[var(--muted-foreground)]">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--muted-foreground)]">
              Showing {(currentPage - 1) * PAGE_SIZE + (pageRows.length ? 1 : 0)}–
              {(currentPage - 1) * PAGE_SIZE + pageRows.length} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </Button>
              <span className="text-xs tabular-nums text-[var(--muted-foreground)]">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SortableTh({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <th>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 uppercase tracking-[0.04em]"
      >
        {label}
        <ArrowDownUp className={`h-3 w-3 ${active ? "text-[var(--navy)]" : "opacity-40"}`} />
      </button>
    </th>
  );
}
