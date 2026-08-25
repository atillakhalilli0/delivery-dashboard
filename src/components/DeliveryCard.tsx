"use client";

import React from "react";
import { TbMapPin, TbUser, TbClockHour4 } from "react-icons/tb";
import type { Delivery } from "@/lib/types";
import { StatusBadge, PriorityBadge } from "./StatusBadge";
import { getDriverById } from "@/lib/mockData";

export default function DeliveryCard({ rows, onSelect }: { rows: Delivery[]; onSelect: (d: Delivery) => void }) {
  return (
    <div className="space-y-3 lg:hidden">
      {rows.map((d) => {
        const driver = getDriverById(d.driverId);
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d)}
            className="w-full cursor-pointer rounded-xl border border-border bg-surface p-4 text-left transition-transform active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[11.5px] text-faint">{d.id}</p>
                <p className="mt-0.5 text-[14px] font-semibold">{d.customer}</p>
              </div>
              <PriorityBadge priority={d.priority} />
            </div>
            <div className="mt-3 space-y-1.5">
              <p className="flex items-center gap-1.5 text-[12.5px] text-muted">
                <TbMapPin className="shrink-0 text-[14px]" /> {d.destination}
              </p>
              <p className="flex items-center gap-1.5 text-[12.5px] text-muted">
                <TbUser className="shrink-0 text-[14px]" /> {driver?.name ?? "Unassigned"}
              </p>
              <p className="flex items-center gap-1.5 text-[12.5px] text-muted">
                <TbClockHour4 className="shrink-0 text-[14px]" /> ETA {d.eta}
              </p>
            </div>
            <div className="mt-3">
              <StatusBadge status={d.status} />
            </div>
          </button>
        );
      })}
      {rows.length === 0 && (
        <div className="rounded-xl border border-border bg-surface px-4 py-14 text-center text-[13px] text-muted">
          No deliveries match your filters.
        </div>
      )}
    </div>
  );
}
