import { parseISO, isToday, isTomorrow, startOfDay, addDays } from "date-fns";
import {
  campaigns,
  DEMO_TODAY,
  followUps,
  getCampaignById,
  getUserById,
  leads,
  teamPerformance,
  users,
} from "@/mock-data";
import type { Lead, LeadStatus } from "@/types";
import { funnelStages, leadSourceLabels } from "@/lib/labels";

const today = parseISO(DEMO_TODAY);

export function isSameDemoDay(value: string | null | undefined) {
  if (!value) return false;
  return isToday(parseISO(value)) || value.startsWith("2026-08-11");
}

export function getOverviewKpis() {
  const newLeadsToday = leads.filter((lead) => isSameDemoDay(lead.createdAt)).length;
  const callsToday = 54;
  const connected = leads.filter((lead) =>
    ["connected", "interested", "follow_up", "hot", "nurturing", "payment_pending", "enrolled"].includes(
      lead.status
    )
  ).length;
  const followUpsDue = followUps.filter((item) => {
    const date = parseISO(item.scheduledAt);
    return item.status !== "completed" && (isToday(date) || date < startOfDay(today));
  }).length;
  const hotLeads = leads.filter((lead) => lead.status === "hot" || lead.priority === "hot").length;
  const paymentPending = leads.filter((lead) => lead.status === "payment_pending").length;
  const enrollments = leads.filter((lead) => lead.status === "enrolled").length;
  const conversionRate = leads.length
    ? Math.round((enrollments / leads.length) * 1000) / 10
    : 0;

  return {
    newLeadsToday,
    callsToday,
    connected,
    followUpsDue,
    hotLeads,
    paymentPending,
    enrollments,
    conversionRate,
  };
}

export function getFunnelCounts() {
  return funnelStages.map((stage) => ({
    stage,
    count: leads.filter((lead) => matchesFunnelStage(lead.status, stage)).length,
  }));
}

function matchesFunnelStage(status: LeadStatus, stage: LeadStatus) {
  if (stage === "enrolled") return status === "enrolled";
  if (stage === "hot") return status === "hot" || status === "nurturing" || status === "payment_pending";
  return status === stage;
}

export function getFollowUpsGrouped() {
  const overdue: typeof followUps = [];
  const todayItems: typeof followUps = [];
  const tomorrowItems: typeof followUps = [];
  const upcoming: typeof followUps = [];

  const todayStart = startOfDay(today);
  const tomorrowStart = addDays(todayStart, 1);
  const dayAfter = addDays(todayStart, 2);

  for (const item of followUps) {
    if (item.status === "completed") continue;
    const date = parseISO(item.scheduledAt);
    if (date < todayStart || item.status === "missed") overdue.push(item);
    else if (isToday(date) || (date >= todayStart && date < tomorrowStart)) todayItems.push(item);
    else if (isTomorrow(date) || (date >= tomorrowStart && date < dayAfter)) tomorrowItems.push(item);
    else upcoming.push(item);
  }

  const byTime = (a: (typeof followUps)[number], b: (typeof followUps)[number]) =>
    a.scheduledAt.localeCompare(b.scheduledAt);

  return {
    overdue: overdue.sort(byTime),
    today: todayItems.sort(byTime),
    tomorrow: tomorrowItems.sort(byTime),
    upcoming: upcoming.sort(byTime),
  };
}

export function getLeadSourceBreakdown() {
  const counts = new Map<string, number>();
  for (const lead of leads) {
    counts.set(lead.source, (counts.get(lead.source) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([source, count]) => ({
    source,
    label: leadSourceLabels[source as keyof typeof leadSourceLabels],
    count,
  }));
}

export function getCampaignPerformance() {
  return campaigns.map((campaign) => {
    const campaignLeads = leads.filter((lead) => lead.campaignId === campaign.id);
    const enrolled = campaignLeads.filter((lead) => lead.status === "enrolled").length;
    return {
      ...campaign,
      liveLeads: campaignLeads.length,
      enrolled,
      conversion: campaignLeads.length
        ? Math.round((enrolled / campaignLeads.length) * 1000) / 10
        : 0,
    };
  });
}

export function enrichLead(lead: Lead) {
  return {
    ...lead,
    owner: getUserById(lead.ownerId),
    closer: lead.closerId ? getUserById(lead.closerId) : undefined,
    campaign: getCampaignById(lead.campaignId),
  };
}

export function getTelecallerQueue(userId = "user-komal") {
  return leads
    .filter(
      (lead) =>
        lead.ownerId === userId &&
        !["enrolled", "lost", "not_interested", "wrong_number"].includes(lead.status)
    )
    .sort((a, b) => {
      const aTime = a.nextFollowUpAt ?? a.createdAt;
      const bTime = b.nextFollowUpAt ?? b.createdAt;
      return aTime.localeCompare(bTime);
    });
}

export function getNurturingLeads() {
  return leads
    .filter((lead) =>
      ["interested", "hot", "follow_up", "nurturing", "payment_pending", "enrolled", "lost"].includes(
        lead.status
      )
    )
    .map(enrichLead);
}

export function getTeamInsights() {
  return teamPerformance.map((row) => {
    const user = users.find((item) => item.id === row.userId)!;
    const connectRate = row.calls ? Math.round((row.connected / row.calls) * 1000) / 10 : 0;
    const interestRate = row.connected
      ? Math.round((row.interested / row.connected) * 1000) / 10
      : 0;
    const conversionRate = row.interested
      ? Math.round((row.enrollments / row.interested) * 1000) / 10
      : 0;
    return {
      ...row,
      user,
      connectRate,
      interestRate,
      conversionRate,
    };
  });
}

export function getCallOutcomeBreakdown() {
  return [
    { outcome: "No Answer", count: 48 },
    { outcome: "Busy", count: 21 },
    { outcome: "Connected", count: 67 },
    { outcome: "Interested", count: 34 },
    { outcome: "Call Back", count: 29 },
    { outcome: "Not Interested", count: 18 },
    { outcome: "Wrong Number", count: 7 },
  ];
}
