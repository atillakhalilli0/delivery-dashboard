"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TbLayoutDashboard,
  TbPackage,
  TbMap2,
  TbUsers,
  TbTruck,
  TbChartHistogram,
  TbActivityHeartbeat,
  TbX,
} from "react-icons/tb";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: TbLayoutDashboard },
  { href: "/deliveries", label: "Deliveries", icon: TbPackage },
  { href: "/map", label: "Live map", icon: TbMap2 },
  { href: "/drivers", label: "Drivers", icon: TbUsers },
  { href: "/vehicles", label: "Vehicles", icon: TbTruck },
  { href: "/analytics", label: "Analytics", icon: TbChartHistogram },
];

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-300 ease-out lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-signal">
            <span className="absolute inset-0 animate-pulse-ring rounded-md bg-signal/60" />
            <TbActivityHeartbeat className="relative z-10 text-[17px] text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-[15px] font-semibold tracking-tight">FleetFlow</p>
            <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-faint">
              Dispatch Console
            </p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="cursor-pointer rounded-md p-1.5 text-muted hover:bg-raised lg:hidden"
          aria-label="Close navigation"
        >
          <TbX className="text-lg" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`group relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-150 ${
                active
                  ? "bg-signal/10 text-signal"
                  : "text-muted hover:bg-raised hover:text-ink"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-signal" />
              )}
              <Icon className={`text-[17px] transition-transform duration-150 ${active ? "" : "group-hover:scale-110"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-lg border border-border bg-raised p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">
            Network status
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <p className="text-[12.5px] font-medium text-ink">All regions operational</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
