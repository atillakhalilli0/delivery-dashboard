"use client";

import React from "react";
import { TbSearch, TbFilterOff } from "react-icons/tb";
import type { DeliveryStatus, Priority } from "@/lib/types";

const STATUS_OPTIONS: DeliveryStatus[] = [
  "Pending",
  "Assigned",
  "Picked up",
  "In transit",
  "Delivered",
  "Delayed",
  "Failed",
];

interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  activeStatus: DeliveryStatus | "All";
  onStatus: (s: DeliveryStatus | "All") => void;
  priority: Priority | "All";
  onPriority: (p: Priority | "All") => void;
}

export default function FilterBar({ search, onSearch, activeStatus, onStatus, priority, onPriority }: FilterBarProps) {
  const hasFilters = activeStatus !== "All" || priority !== "All" || search.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <TbSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-faint" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by ID, customer, or destination…"
            className="w-full cursor-text rounded-lg border border-border bg-raised py-2.5 pl-9 pr-3 text-[13px] placeholder:text-faint focus:border-signal/60 focus:outline-none focus:ring-2 focus:ring-signal/15"
          />
        </div>
        <select
          value={priority}
          onChange={(e) => onPriority(e.target.value as Priority | "All")}
          className="cursor-pointer rounded-lg border border-border bg-raised px-3 py-2.5 text-[13px] font-medium text-muted focus:outline-none sm:w-44"
        >
          <option value="All">All priorities</option>
          <option value="Standard">Standard</option>
          <option value="Express">Express</option>
          <option value="Critical">Critical</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => {
              onSearch("");
              onStatus("All");
              onPriority("All");
            }}
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-raised px-3 py-2.5 text-[12.5px] font-medium text-muted transition-colors hover:text-ink sm:w-auto"
          >
            <TbFilterOff className="text-[14px]" /> Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onStatus("All")}
          className={`cursor-pointer rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
            activeStatus === "All"
              ? "border-signal bg-signal/10 text-signal"
              : "border-border bg-surface text-muted hover:text-ink"
          }`}
        >
          All statuses
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onStatus(s)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
              activeStatus === s
                ? "border-signal bg-signal/10 text-signal"
                : "border-border bg-surface text-muted hover:text-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
