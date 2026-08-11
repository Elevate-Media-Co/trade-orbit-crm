"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getTeamInsights } from "@/lib/selectors";
import { formatPercent } from "@/lib/utils";
import { userRoleLabels } from "@/lib/labels";

export function TeamPerformanceView() {
  const team = getTeamInsights();
  const [selectedId, setSelectedId] = useState(team[0]?.userId ?? "");
  const selected = team.find((row) => row.userId === selectedId) ?? team[0];

  const chartData = team.map((row) => ({
    name: row.user.name.split(" ")[0],
    calls: row.calls,
    connected: row.connected,
    enrollments: row.enrollments,
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Team"
        description="Operational performance for telecallers and closers — rates, volume, and conversion."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Team calls"
          value={team.reduce((sum, row) => sum + row.calls, 0)}
        />
        <KpiCard
          label="Team connected"
          value={team.reduce((sum, row) => sum + row.connected, 0)}
          tone="success"
        />
        <KpiCard
          label="Team interested"
          value={team.reduce((sum, row) => sum + row.interested, 0)}
          tone="accent"
        />
        <KpiCard
          label="Team enrollments"
          value={team.reduce((sum, row) => sum + row.enrollments, 0)}
          tone="success"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Team overview</CardTitle>
            <CardDescription>Volume comparison across active operators</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ee" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#5c6b82" }} />
                <YAxis tick={{ fontSize: 12, fill: "#5c6b82" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e6e8ee",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="calls" fill="#0b1220" radius={[4, 4, 0, 0]} />
                <Bar dataKey="connected" fill="#d4a017" radius={[4, 4, 0, 0]} />
                <Bar dataKey="enrollments" fill="#1f7a4d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Individual performance</CardTitle>
            <CardDescription>Select a teammate for rate detail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {team.map((row) => (
                <Button
                  key={row.userId}
                  size="sm"
                  variant={selectedId === row.userId ? "default" : "outline"}
                  onClick={() => setSelectedId(row.userId)}
                >
                  {row.user.name.split(" ")[0]}
                </Button>
              ))}
            </div>

            {selected ? (
              <div className="rounded-md border border-[var(--border)] p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{selected.user.avatarInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selected.user.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {userRoleLabels[selected.user.role]} · {selected.user.city}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Metric label="Calls" value={selected.calls} />
                  <Metric label="Connected" value={selected.connected} />
                  <Metric label="Interested" value={selected.interested} />
                  <Metric label="Follow-ups" value={selected.followUps} />
                  <Metric label="Enrollments" value={selected.enrollments} />
                  <Metric label="Call → Connect" value={formatPercent(selected.connectRate, 1)} />
                  <Metric
                    label="Connect → Interest"
                    value={formatPercent(selected.interestRate, 1)}
                  />
                  <Metric
                    label="Conversion"
                    value={formatPercent(selected.conversionRate, 1)}
                  />
                </div>
                <p className="mt-4 text-xs leading-relaxed text-[var(--muted-foreground)]">
                  Focus coaching on the weakest rate link. Volume without connect quality or
                  interest conversion rarely improves enrollments.
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team roster metrics</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Calls</th>
                <th>Connected</th>
                <th>Interested</th>
                <th>Follow-ups</th>
                <th>Enrollments</th>
                <th>Call-to-connect</th>
                <th>Connect-to-interest</th>
                <th>Conversion</th>
              </tr>
            </thead>
            <tbody>
              {team.map((row) => (
                <tr key={row.userId}>
                  <td className="font-medium">{row.user.name}</td>
                  <td>{userRoleLabels[row.user.role]}</td>
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

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-[var(--workspace)] px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-1 font-semibold tabular-nums">{value}</p>
    </div>
  );
}
