"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Flame,
  LayoutDashboard,
  PhoneCall,
  Settings,
  Users,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/calling", label: "My Calling", icon: PhoneCall },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/follow-ups", label: "Follow-ups", icon: CalendarClock },
  { href: "/nurturing", label: "Nurturing", icon: Flame },
  { href: "/team", label: "Team", icon: UsersRound },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-14 items-center border-b border-white/10 px-3",
          collapsed ? "justify-center" : "justify-between gap-2"
        )}
      >
        <Link href="/overview" className="flex min-w-0 items-center gap-2.5" onClick={onMobileClose}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--navy)]">
            <span className="text-xs font-bold tracking-tight">TO</span>
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-white">Trade Orbit</p>
              <p className="truncate text-[10px] uppercase tracking-[0.14em] text-white/50">CRM</p>
            </div>
          ) : null}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="hidden h-8 w-8 text-white/70 hover:bg-white/10 hover:text-white lg:inline-flex"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 space-y-0.5 p-2">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/overview" && pathname.startsWith(item.href));
            const link = (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                  collapsed && "justify-center px-2",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", active && "text-[var(--accent)]")} />
                {!collapsed ? <span className="truncate font-medium">{item.label}</span> : null}
                {!collapsed && active ? (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                ) : null}
              </Link>
            );

            if (!collapsed) return link;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>

      <div className="border-t border-white/10 p-3">
        {!collapsed ? (
          <div className="rounded-md bg-white/5 px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/45">
              Shift focus
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/70">
              Call queue first. Convert follow-ups before noon.
            </p>
          </div>
        ) : (
          <div className="mx-auto h-2 w-2 rounded-full bg-[var(--accent)]" />
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-[var(--navy)] bg-[var(--navy)] transition-[width] duration-200 lg:flex lg:flex-col",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {content}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation"
            onClick={onMobileClose}
          />
          <aside className="absolute inset-y-0 left-0 w-[260px] bg-[var(--navy)] shadow-xl">
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
}
