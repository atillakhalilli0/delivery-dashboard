"use client";

import React from "react";
import { TbStar, TbChevronRight } from "react-icons/tb";
import type { Driver } from "@/lib/types";
import { DriverStatusBadge } from "./StatusBadge";
import { getVehicleById } from "@/lib/mockData";

export default function DriverTable({ rows, onSelect }: { rows: Driver[]; onSelect: (d: Driver) => void }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-surface lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-raised/60">
              {["Driver", "Status", "Deliveries today", "Rating", "Vehicle", ""].map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-faint">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const vehicle = getVehicleById(d.vehicleId);
              return (
                <tr
                  key={d.id}
                  onClick={() => onSelect(d)}
                  className="group cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-raised/60"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                        style={{ background: d.avatarColor }}
                      >
                        {d.initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium">{d.name}</p>
                        <p className="text-[11.5px] text-faint">{d.region}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <DriverStatusBadge status={d.status} />
                  </td>
                  <td className="tabular whitespace-nowrap px-4 py-3 text-[13px] text-muted">{d.deliveriesToday} stops</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="flex items-center gap-1 text-[13px] font-medium">
                      <TbStar className="text-[13px] text-signal" /> {d.rating}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-muted">{vehicle?.name ?? "Unassigned"}</td>
                  <td className="px-4 py-3 text-right">
                    <TbChevronRight className="ml-auto text-[16px] text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
        {rows.map((d) => {
          const vehicle = getVehicleById(d.vehicleId);
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d)}
              className="cursor-pointer rounded-xl border border-border bg-surface p-4 text-left transition-transform active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                  style={{ background: d.avatarColor }}
                >
                  {d.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold">{d.name}</p>
                  <p className="text-[11.5px] text-faint">{vehicle?.name ?? "Unassigned"}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <DriverStatusBadge status={d.status} />
                <span className="flex items-center gap-1 text-[12.5px] font-medium">
                  <TbStar className="text-[12px] text-signal" /> {d.rating}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
