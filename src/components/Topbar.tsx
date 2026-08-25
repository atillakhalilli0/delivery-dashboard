"use client";

import React, { useState } from "react";
import { TbMenu2, TbSearch, TbBell, TbSun, TbMoon } from "react-icons/tb";
import { useTheme } from "@/lib/ThemeContext";
import { usePathname } from "next/navigation";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Operations overview", subtitle: "Real-time snapshot across every active region" },
  "/deliveries": { title: "Deliveries", subtitle: "Track, filter, and manage every shipment in flight" },
  "/map": { title: "Live map", subtitle: "Driver and delivery positions across the network" },
  "/drivers": { title: "Drivers", subtitle: "Roster, performance, and current assignments" },
  "/vehicles": { title: "Vehicles", subtitle: "Fleet health, capacity, and maintenance status" },
  "/analytics": { title: "Analytics", subtitle: "Delivery throughput and performance trends" },
};

export default function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const copy = TITLES[pathname] ?? TITLES["/"];

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <button
          onClick={onOpenMobileNav}
          className="cursor-pointer rounded-md p-1.5 text-muted hover:bg-raised lg:hidden"
          aria-label="Open navigation"
        >
          <TbMenu2 className="text-xl" />
        </button>

        <div className="hidden flex-col lg:flex">
          <h1 className="font-display text-[17px] font-semibold tracking-tight">{copy?.title}</h1>
          <p className="text-[12.5px] text-muted">{copy?.subtitle}</p>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block">
            <TbSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-faint" />
            <input
              type="text"
              placeholder="Search delivery, driver, plate…"
              className="w-56 cursor-text rounded-lg border border-border bg-raised py-2 pl-9 pr-3 text-[13px] text-ink placeholder:text-faint focus:border-signal/60 focus:outline-none focus:ring-2 focus:ring-signal/15 lg:w-72"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative cursor-pointer rounded-lg border border-border bg-raised p-2.5 text-muted transition-colors hover:text-ink"
              aria-label="Notifications"
            >
              <TbBell className="text-[16px]" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-signal" />
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                <div className="animate-slide-up absolute right-0 z-20 mt-2 w-72 rounded-xl border border-border bg-surface p-2 shadow-pop">
                  <p className="px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-faint">
                    Recent alerts
                  </p>
                  {[
                    { text: "FF-48231 flagged as delayed — Harbor District", time: "4m ago" },
                    { text: "Vehicle VH-1004 due for service in 180 mi", time: "22m ago" },
                    { text: "Driver Priya Patel completed 30 deliveries today", time: "1h ago" },
                  ].map((n, i) => (
                    <div key={i} className="cursor-pointer rounded-lg px-2.5 py-2 text-[12.5px] hover:bg-raised">
                      <p className="text-ink">{n.text}</p>
                      <p className="mt-0.5 text-[11px] text-faint">{n.time}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative flex h-9 w-16 cursor-pointer items-center rounded-full border border-border bg-raised px-1 transition-colors"
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-surface shadow-sm transition-transform duration-300 ease-out ${
                theme === "dark" ? "translate-x-7" : "translate-x-0"
              }`}
            >
              {theme === "dark" ? (
                <TbMoon className="text-[13px] text-transit" />
              ) : (
                <TbSun className="text-[13px] text-signal" />
              )}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
