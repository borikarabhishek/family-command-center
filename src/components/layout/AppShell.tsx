import { Link, useRouterState } from "@tanstack/react-router";
import {
  Banknote,
  CalendarDays,
  FolderLock,
  Home,
  LayoutGrid,
  MessageSquare,
  Settings,
  ShieldCheck,
  Users,
  Briefcase,
  ListChecks,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { demoFamily } from "@/data/demo";

const desktopNav = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/family", label: "Family", icon: Users },
  { to: "/financial", label: "Financial Overview", icon: Banknote },
  { to: "/vault", label: "Document Vault", icon: FolderLock },
  { to: "/services", label: "Services", icon: Briefcase },
  { to: "/tasks", label: "Tasks & Approvals", icon: ListChecks },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const mobileNav = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/family", label: "Family", icon: Users },
  { to: "/vault", label: "Vault", icon: FolderLock },
  { to: "/services", label: "Services", icon: Briefcase },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/more", label: "More", icon: LayoutGrid },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="border-b border-sidebar-border px-6 py-6">
          <p className="font-display text-xl text-sidebar-accent-foreground">FamilyOS</p>
          <p className="mt-1 text-xs text-sidebar-foreground/70">
            Your family&apos;s private operating system.
          </p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {desktopNav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(`${to}/`);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className={cn("size-4", active && "text-sidebar-primary")} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border px-6 py-4 text-xs text-sidebar-foreground/70">
          <p className="flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-sidebar-primary" />
            {demoFamily.name}
          </p>
          <p className="mt-1">Prototype workspace · simulated data</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-display text-lg leading-none">FamilyOS</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{demoFamily.name}</p>
            </div>
            <Link
              to="/settings"
              className="rounded-md border border-border p-2 text-muted-foreground"
              aria-label="Settings"
            >
              <Settings className="size-4" />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-16 lg:pt-8">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <ul className="grid grid-cols-6">
          {mobileNav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(`${to}/`);
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className={cn("size-[18px]", active && "text-accent")} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
