"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--workspace)] text-[var(--foreground)]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-200",
          collapsed ? "lg:pl-[68px]" : "lg:pl-[240px]"
        )}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-7">{children}</main>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
