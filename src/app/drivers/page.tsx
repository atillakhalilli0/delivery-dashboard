"use client";

import React, { useMemo, useState } from "react";
import { drivers } from "@/lib/mockData";
import type { Driver, DriverStatus } from "@/lib/types";
import DriverTable from "@/components/DriverTable";
import Drawer from "@/components/Drawer";
import DriverDetail from "@/components/DriverDetail";
import { TbSearch } from "react-icons/tb";

const STATUS_OPTIONS: (DriverStatus | "All")[] = ["All", "On route", "Idle", "Break", "Off duty"];

export default function DriversPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DriverStatus | "All">("All");
  const [selected, setSelected] = useState<Driver | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return drivers.filter((d) => {
      if (status !== "All" && d.status !== status) return false;
      if (q && !d.name.toLowerCase().includes(q) && !d.region.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, status]);

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <TbSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drivers or region…"
            className="w-full cursor-text rounded-lg border border-border bg-raised py-2.5 pl-9 pr-3 text-[13px] placeholder:text-faint focus:border-signal/60 focus:outline-none focus:ring-2 focus:ring-signal/15"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                status === s ? "border-signal bg-signal/10 text-signal" : "border-border bg-surface text-muted hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[12.5px] text-muted">
        <span className="font-semibold text-ink">{filtered.length}</span> of {drivers.length} drivers
      </p>

      <DriverTable rows={filtered} onSelect={setSelected} />

      <Drawer open={!!selected} onClose={() => setSelected(null)} width="max-w-lg">
        {selected && <DriverDetail driver={selected} />}
      </Drawer>
    </div>
  );
}
