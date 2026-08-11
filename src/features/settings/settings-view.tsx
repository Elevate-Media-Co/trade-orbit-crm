"use client";

import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currentUser } from "@/mock-data";
import { userRoleLabels } from "@/lib/labels";

export function SettingsView() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        description="Prototype preferences for Trade Orbit CRM. Auth and persistence arrive in the next phase."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Signed-in operator details (mock)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue={currentUser.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={currentUser.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue={currentUser.phone} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={userRoleLabels[currentUser.role]} disabled />
            </div>
            <Button onClick={() => toast.success("Profile saved (prototype)")}>Save profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calling preferences</CardTitle>
            <CardDescription>Defaults for My Calling workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Default follow-up offset</Label>
              <Select defaultValue="1d">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2h">2 hours</SelectItem>
                  <SelectItem value="1d">Next day</SelectItem>
                  <SelectItem value="2d">In 2 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Queue sorting</Label>
              <Select defaultValue="followup">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="followup">Next follow-up</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="created">Newest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <Button variant="outline" onClick={() => toast.message("Preferences saved")}>
              Save preferences
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>Organization-level settings (read-only in prototype)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Info label="Organization" value="Trade Orbit" />
            <Info label="Timezone" value="Asia/Kolkata (IST)" />
            <Info label="Currency" value="INR (₹)" />
            <Info label="Default campaigns" value="4 active" />
            <Info label="Data mode" value="Centralized mock data" />
            <Info label="Next phase" value="Supabase + auth" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--workspace)] px-3 py-2.5">
      <p className="text-[11px] uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
