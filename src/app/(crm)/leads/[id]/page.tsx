import { LeadDetailView } from "@/features/leads/lead-detail";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LeadDetailView leadId={id} />;
}
