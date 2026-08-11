"use client";

import {
  Flame,
  Phone,
  PhoneIncoming,
  TrendingUp,
  UserPlus,
  Wallet,
  CalendarClock,
  GraduationCap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badges";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { activities, dailyActivity, getLeadById, getUserById } from "@/mock-data";
import {
  getCampaignPerformance,
  getFollowUpsGrouped,
  getFunnelCounts,
  getLeadSourceBreakdown,
  getOverviewKpis,
  getTeamInsights,
} from "@/lib/selectors";
import { leadStatusLabels } from "@/lib/labels";
import { formatRelative, formatPercent } from "@/lib/utils";

const FUNNEL_COLORS = ["#0b1220", "#243247", "#3d4f6a", "#c49210", "#d4a017", "#1f7a4d"];

export function OverviewDashboard() {
  const kpis = getOverviewKpis();
  const funnel = getFunnelCounts();
  const followUps = getFollowUpsGrouped();
  const sources = getLeadSourceBreakdown();
  const campaigns = getCampaignPerformance();
  const team = getTeamInsights();
  const chartData = dailyActivity.map((point) => ({
    ...point,
    label: format(parseISO(point.date), "dd MMM"),
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Overview"
        description="Operational pulse for Trade Orbit telecalling and enrollment teams."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/reports">Open reports</Link>
            </Button>
            <Button variant="accent" asChild>
              <Link href="/calling">Start calling</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 2xl:grid-cols-8">
        <KpiCard label="New Leads Today" value={kpis.newLeadsToday} icon={UserPlus} trend="+12%" />
        <KpiCard label="Calls Today" value={kpis.callsToday} icon={Phone} trend="On track" />
        <KpiCard label="Connected" value={kpis.connected} icon={PhoneIncoming} tone="success" />
        <KpiCard
          label="Follow-ups Due"
          value={kpis.followUpsDue}
          icon={CalendarClock}
          tone="warning"
        />
        <KpiCard label="Hot Leads" value={kpis.hotLeads} icon={Flame} tone="accent" />
        <KpiCard label="Payment Pending" value={kpis.paymentPending} icon={Wallet} tone="warning" />
        <KpiCard label="Enrollments" value={kpis.enrollments} icon={GraduationCap} tone="success" />
        <KpiCard
          label="Conversion Rate"
          value={formatPercent(kpis.conversionRate, 1)}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Lead Funnel</CardTitle>
            <CardDescription>New → Attempted → Connected → Interested → Hot → Enrolled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {funnel.map((item, index) => (
                <div
                  key={item.stage}
                  className="rounded-md border border-[var(--border)] bg-[var(--workspace)] p-3"
                >
                  <div
                    className="mb-2 h-1 rounded-full"
                    style={{ background: FUNNEL_COLORS[index] }}
                  />
                  <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
                    {leadStatusLabels[item.stage]}
                  </p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">{item.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Volume by acquisition channel</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sources} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e6e8ee" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={78}
                  tick={{ fontSize: 11, fill: "#5c6b82" }}
                />
                <Tooltip
                  cursor={{ fill: "#f6f5f2" }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e6e8ee",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {sources.map((entry) => (
                    <Cell
                      key={entry.source}
                      fill={entry.source === "meta_ads" ? "#0b1220" : "#d4a017"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Today&apos;s Follow-ups</CardTitle>
              <CardDescription>{followUps.today.length} scheduled</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/follow-ups">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {followUps.today.slice(0, 5).map((item) => {
              const lead = getLeadById(item.leadId);
              if (!lead) return null;
              return (
                <Link
                  key={item.id}
                  href={`/leads/${lead.id}`}
                  className="flex items-center justify-between rounded-md border border-[var(--border)] px-3 py-2 transition-colors hover:bg-[var(--workspace)]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{lead.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {formatRelative(item.scheduledAt)}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overdue Follow-ups</CardTitle>
            <CardDescription>Needs attention before new dials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {followUps.overdue.slice(0, 5).map((item) => {
              const lead = getLeadById(item.leadId);
              if (!lead) return null;
              return (
                <Link
                  key={item.id}
                  href={`/leads/${lead.id}`}
                  className="flex items-center justify-between rounded-md border border-amber-200/80 bg-amber-50/50 px-3 py-2 transition-colors hover:bg-amber-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{lead.name}</p>
                    <p className="text-xs text-amber-800/80">{formatRelative(item.scheduledAt)}</p>
                  </div>
                  <PriorityBadge priority={lead.priority} />
                </Link>
              );
            })}
            {followUps.overdue.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">No overdue follow-ups.</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest team actions across leads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activities.slice(0, 6).map((activity) => {
              const user = getUserById(activity.userId);
              const lead = getLeadById(activity.leadId);
              return (
                <div key={activity.id} className="flex gap-3">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px]">
                      {user?.avatarInitials ?? "TO"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{activity.title}</p>
                    <p className="truncate text-xs text-[var(--muted-foreground)]">
                      {lead?.name} · {activity.description}
                    </p>
                    <p className="text-[10px] text-[var(--muted)]">
                      {formatRelative(activity.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>7-Day Calling Activity</CardTitle>
            <CardDescription>Calls, connections, and interest signals</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="callsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0b1220" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0b1220" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="connectedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a017" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d4a017" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ee" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#5c6b82" }} />
                <YAxis tick={{ fontSize: 11, fill: "#5c6b82" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e6e8ee",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stroke="#0b1220"
                  fill="url(#callsFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="connected"
                  stroke="#d4a017"
                  fill="url(#connectedFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Live conversion by active campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-md border border-[var(--border)] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{campaign.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {campaign.liveLeads} leads · {campaign.city}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-[var(--navy)]">
                    {formatPercent(campaign.conversion, 1)}
                  </p>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${Math.min(campaign.conversion * 4, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Telecaller Performance</CardTitle>
          <CardDescription>Operational rates — not a vanity leaderboard</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Team member</th>
                <th>Calls</th>
                <th>Connected</th>
                <th>Interested</th>
                <th>Follow-ups</th>
                <th>Enrollments</th>
                <th>Connect rate</th>
                <th>Interest rate</th>
                <th>Conversion</th>
              </tr>
            </thead>
            <tbody>
              {team.map((row) => (
                <tr key={row.userId}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">
                          {row.user.avatarInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{row.user.name}</p>
                        <p className="text-[11px] text-[var(--muted-foreground)] capitalize">
                          {row.user.role}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="tabular-nums">{row.calls}</td>
                  <td className="tabular-nums">{row.connected}</td>
                  <td className="tabular-nums">{row.interested}</td>
                  <td className="tabular-nums">{row.followUps}</td>
                  <td className="tabular-nums">{row.enrollments}</td>
                  <td className="tabular-nums">{formatPercent(row.connectRate, 1)}</td>
                  <td className="tabular-nums">{formatPercent(row.interestRate, 1)}</td>
                  <td className="tabular-nums">{formatPercent(row.conversionRate, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
