"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dailyActivity } from "@/mock-data";
import {
  getCallOutcomeBreakdown,
  getCampaignPerformance,
  getFunnelCounts,
  getLeadSourceBreakdown,
  getTeamInsights,
} from "@/lib/selectors";
import { leadStatusLabels } from "@/lib/labels";

const PIE_COLORS = ["#0b1220", "#d4a017", "#3d4f6a", "#1f7a4d", "#c0352b"];

export function ReportsView() {
  const [range, setRange] = useState("7d");

  const funnel = getFunnelCounts().map((item) => ({
    name: leadStatusLabels[item.stage],
    count: item.count,
  }));
  const sources = getLeadSourceBreakdown();
  const campaigns = getCampaignPerformance().map((item) => ({
    name: item.name.replace(" Trading Bootcamp", "").replace(" Mentorship", ""),
    leads: item.liveLeads,
    enrollments: item.enrolled,
  }));
  const outcomes = getCallOutcomeBreakdown();
  const team = getTeamInsights().map((row) => ({
    name: row.user.name.split(" ")[0],
    calls: row.calls,
    connected: row.connected,
    enrollments: row.enrollments,
  }));

  const activityPoints =
    range === "3d" ? dailyActivity.slice(-3) : dailyActivity;
  const activity = activityPoints.map((point) => ({
    ...point,
    label: format(parseISO(point.date), "dd MMM"),
  }));

  const conversions = activity.map((point) => ({
    label: point.label,
    enrollments: point.enrollments,
    interested: point.interested,
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports"
        description="Sales-ops reporting for calling volume, funnel health, and conversions."
        actions={
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3d">Last 3 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="14d">Campaign period</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Lead Funnel" description="Stage distribution across active pipeline">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ee" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5c6b82" }} />
              <YAxis tick={{ fontSize: 11, fill: "#5c6b82" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#0b1220" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Leads by Source" description="Channel mix">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sources}
                dataKey="count"
                nameKey="label"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {sources.map((entry, index) => (
                  <Cell key={entry.source} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Leads by Campaign" description="Lead volume and enrollments">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaigns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ee" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5c6b82" }} />
              <YAxis tick={{ fontSize: 11, fill: "#5c6b82" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="leads" fill="#3d4f6a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="enrollments" fill="#d4a017" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Call Outcomes" description="Disposition mix from recent dials">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={outcomes} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e6e8ee" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="outcome"
                width={100}
                tick={{ fontSize: 11, fill: "#5c6b82" }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#0b1220" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily Calling Activity" description={`Range: ${range}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ee" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#5c6b82" }} />
              <YAxis tick={{ fontSize: 11, fill: "#5c6b82" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="calls" stroke="#0b1220" fill="#0b122033" />
              <Area type="monotone" dataKey="connected" stroke="#d4a017" fill="#d4a01733" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Conversions" description="Interest vs enrollments">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={conversions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ee" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#5c6b82" }} />
              <YAxis tick={{ fontSize: 11, fill: "#5c6b82" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="interested" stroke="#3d4f6a" fill="#3d4f6a22" />
              <Area type="monotone" dataKey="enrollments" stroke="#1f7a4d" fill="#1f7a4d33" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Team Comparison" description="Calls, connects, and enrollments by operator">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={team}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ee" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#5c6b82" }} />
            <YAxis tick={{ fontSize: 12, fill: "#5c6b82" }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="calls" fill="#0b1220" radius={[4, 4, 0, 0]} />
            <Bar dataKey="connected" fill="#d4a017" radius={[4, 4, 0, 0]} />
            <Bar dataKey="enrollments" fill="#1f7a4d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e6e8ee",
  fontSize: 12,
};

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[280px]">{children}</CardContent>
    </Card>
  );
}
