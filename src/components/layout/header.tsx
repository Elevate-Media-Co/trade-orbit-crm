"use client";

import { Bell, Menu, Search } from "lucide-react";
import Link from "next/link";
import { currentUser, notifications } from "@/mock-data";
import { formatRelative } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { userRoleLabels } from "@/lib/labels";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--border)] bg-[var(--workspace)]/90 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative hidden min-w-0 flex-1 md:block md:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        <Input
          placeholder="Search leads, campaigns, phone…"
          className="h-9 border-[var(--border)] bg-white pl-9"
          aria-label="Global search"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--border)] bg-[var(--surface-muted)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)] sm:inline-block">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unread > 0 ? (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary">{unread} new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((item) => (
              <DropdownMenuItem key={item.id} asChild className="cursor-pointer items-start py-2.5">
                <Link href={item.href ?? "/overview"}>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">{item.title}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{item.description}</p>
                    <p className="text-[10px] text-[var(--muted)]">{formatRelative(item.createdAt)}</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-[var(--surface-muted)]">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{currentUser.avatarInitials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
                  {userRoleLabels[currentUser.role]}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="space-y-0.5">
                <p>{currentUser.name}</p>
                <p className="text-xs font-normal text-[var(--muted-foreground)]">
                  {currentUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Profile & preferences</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/team">Team performance</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Sign out (prototype)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
