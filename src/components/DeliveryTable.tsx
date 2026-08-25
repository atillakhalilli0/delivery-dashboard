"use client";

import React from "react";
import { TbChevronRight } from "react-icons/tb";
import type { Delivery } from "@/lib/types";
import { StatusBadge, PriorityBadge } from "./StatusBadge";
import { getDriverById } from "@/lib/mockData";

interface DeliveryTableProps {
  rows: Delivery[];
  onSelect: (d: Delivery) => void;
}

export default function DeliveryTable({ rows, onSelect }: DeliveryTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-border bg-surface lg:block">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-raised/60">
            {["Delivery ID", "Customer", "Driver", "Destination", "Status", "ETA", "Priority", ""].map((h) => (
              <th
                key={h}
                className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-faint"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => {
            const driver = getDriverById(d.driverId);
            return (
              <tr
                key={d.id}
                onClick={() => onSelect(d)}
                className="group cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-raised/60"
              >
                <td className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] text-ink">{d.id}</td>
                <td className="max-w-[180px] truncate px-4 py-3 text-[13px] font-medium">{d.customer}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[13px] text-muted">{driver?.name ?? "Unassigned"}</td>
                <td className="max-w-[170px] truncate px-4 py-3 text-[13px] text-muted">{d.destination}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={d.status} />
                </td>
                <td className="tabular whitespace-nowrap px-4 py-3 font-mono text-[12.5px] text-muted">{d.eta}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <PriorityBadge priority={d.priority} />
                </td>
                <td className="px-4 py-3 text-right">
                  <TbChevronRight className="ml-auto text-[16px] text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="px-4 py-14 text-center text-[13px] text-muted">
          No deliveries match your filters.
        </div>
      )}
    </div>
  );
}
