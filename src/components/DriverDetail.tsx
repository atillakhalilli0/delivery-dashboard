"use client";

import React from "react";
import { TbStar, TbPhone, TbMapPin2, TbTruck, TbCircleCheck } from "react-icons/tb";
import type { Driver } from "@/lib/types";
import { DriverStatusBadge } from "./StatusBadge";
import { deliveries, getVehicleById } from "@/lib/mockData";

export default function DriverDetail({ driver }: { driver: Driver }) {
  const vehicle = getVehicleById(driver.vehicleId);
  const routeStops = deliveries.filter((d) => d.driverId === driver.id).slice(0, 6);
  const maxDeliveries = Math.max(...driver.history.map((h) => h.deliveries));

  return (
    <div className="flex h-full flex-col bg-slate-200/80 dark:bg-slate-900/90">
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white"
            style={{ background: driver.avatarColor }}
          >
            {driver.initials}
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">{driver.name}</h2>
            <p className="text-[12.5px] text-faint">
              {driver.id} · {driver.region}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <DriverStatusBadge status={driver.status} />
          <span className="flex items-center gap-1 rounded-full border border-border bg-raised px-2.5 py-1 text-[11.5px] font-medium">
            <TbStar className="text-[12px] text-signal" /> {driver.rating}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        <section className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg border border-border bg-raised p-3">
            <p className="tabular font-display text-lg font-semibold">{driver.deliveriesToday}</p>
            <p className="text-[11px] text-faint">Stops today</p>
          </div>
          <div className="rounded-lg border border-border bg-raised p-3">
            <p className="tabular font-display text-lg font-semibold">{driver.onTimeRate}%</p>
            <p className="text-[11px] text-faint">On-time rate</p>
          </div>
          <div className="rounded-lg border border-border bg-raised p-3">
            <p className="tabular font-display text-lg font-semibold">{driver.deliveriesTotal}</p>
            <p className="text-[11px] text-faint">All-time</p>
          </div>
        </section>

        <section className="flex items-center gap-3 rounded-lg border border-border bg-raised p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-transit/10 text-transit">
            <TbTruck className="text-[16px]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{vehicle?.name ?? "No vehicle assigned"}</p>
            <p className="font-mono text-[11.5px] text-faint">{vehicle?.plate ?? "—"}</p>
          </div>
          <button className="cursor-pointer rounded-md border border-border bg-surface p-2 text-muted transition-colors hover:text-ink">
            <TbPhone className="text-[14px]" />
          </button>
        </section>

        <section>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-faint">Weekly performance</p>
          <div className="flex items-end gap-2" style={{ height: 90 }}>
            {driver.history.map((h) => (
              <div key={h.date} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full items-end justify-center" style={{ height: 70 }}>
                  <div
                    className="w-[60%] rounded-t-[4px] bg-transit/80 transition-all duration-500"
                    style={{ height: `${(h.deliveries / maxDeliveries) * 70}px` }}
                  />
                </div>
                <span className="text-[10px] text-faint">{h.date}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-faint">Today's route</p>
          <ol className="space-y-0">
            {routeStops.length === 0 && (
              <p className="text-[12.5px] text-muted">No stops assigned yet today.</p>
            )}
            {routeStops.map((stop, i) => (
              <li key={stop.id} className="relative flex gap-3 pb-4 last:pb-0">
                {i < routeStops.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-border" />}
                <span className="relative z-10 mt-1 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full bg-transit">
                  <TbMapPin2 className="text-[8px] text-surface" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{stop.customer}</p>
                  <p className="truncate text-[11.5px] text-faint">{stop.destination}</p>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-faint">{stop.eta}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-faint">Delivery history</p>
          <div className="space-y-2">
            {driver.history.slice(0, 4).map((h) => (
              <div key={h.date} className="flex items-center justify-between rounded-lg border border-border bg-raised px-3 py-2 text-[12.5px]">
                <span className="flex items-center gap-2 text-muted">
                  <TbCircleCheck className="text-[14px] text-success" /> {h.date}
                </span>
                <span className="font-medium">{h.deliveries} delivered</span>
                <span className="tabular text-faint">{h.onTimeRate}% on time</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
