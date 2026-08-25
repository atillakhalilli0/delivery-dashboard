"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbPlus,
  TbMinus,
  TbFocus2,
  TbTruck,
  TbPackage,
  TbX,
  TbStar,
  TbPhone,
  TbNavigation,
} from "react-icons/tb";
import { drivers, deliveries, getVehicleById } from "@/lib/mockData";
import type { Driver } from "@/lib/types";
import { DriverStatusBadge } from "./StatusBadge";

// Fixed abstract "road network" — decorative paths over the grid canvas.
const ROADS = [
  "M 0 18 L 100 22",
  "M 0 52 L 100 46",
  "M 0 82 L 100 78",
  "M 14 0 L 10 100",
  "M 46 0 L 52 100",
  "M 78 0 L 74 100",
  "M 0 35 L 40 35 L 55 60 L 100 60",
  "M 20 0 L 20 30 L 60 30 L 60 100",
];

export default function MapView() {
  const [zoom, setZoom] = useState(1);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [showDrivers, setShowDrivers] = useState(true);
  const [showDeliveries, setShowDeliveries] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Driver["status"] | "All">("All");

  const visibleDrivers = useMemo(
    () => drivers.filter((d) => statusFilter === "All" || d.status === statusFilter),
    [statusFilter]
  );

  const activeDeliveries = useMemo(
    () => deliveries.filter((d) => d.status === "In transit" || d.status === "Picked up").slice(0, 22),
    []
  );

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId) ?? null;
  const selectedVehicle = getVehicleById(selectedDriver?.vehicleId ?? null);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
      <div className="relative h-[560px] overflow-hidden rounded-xl border border-border bg-canvas sm:h-[640px]">
        {/* Filter bar */}
        <div className="absolute left-3 top-3 z-20 flex flex-wrap items-center gap-2">
          <FilterToggle active={showDrivers} onClick={() => setShowDrivers((v) => !v)} icon={TbTruck} label="Drivers" />
          <FilterToggle active={showDeliveries} onClick={() => setShowDeliveries((v) => !v)} icon={TbPackage} label="Deliveries" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Driver["status"] | "All")}
            className="cursor-pointer rounded-full border border-border bg-surface/90 px-3 py-1.5 text-[11.5px] font-medium text-muted shadow-sm backdrop-blur focus:outline-none"
          >
            <option value="All">All statuses</option>
            <option value="On route">On route</option>
            <option value="Idle">Idle</option>
            <option value="Break">Break</option>
            <option value="Off duty">Off duty</option>
          </select>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-3 right-3 z-20 flex flex-col overflow-hidden rounded-lg border border-border bg-surface/90 shadow-sm backdrop-blur">
          <button
            onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.2).toFixed(1)))}
            className="cursor-pointer border-b border-border p-2.5 text-muted transition-colors hover:text-ink"
            aria-label="Zoom in"
          >
            <TbPlus className="text-[15px]" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)))}
            className="cursor-pointer border-b border-border p-2.5 text-muted transition-colors hover:text-ink"
            aria-label="Zoom out"
          >
            <TbMinus className="text-[15px]" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="cursor-pointer p-2.5 text-muted transition-colors hover:text-ink"
            aria-label="Reset zoom"
          >
            <TbFocus2 className="text-[15px]" />
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-lg border border-border bg-surface/90 px-3 py-1.5 text-[11px] font-medium text-faint shadow-sm backdrop-blur">
          Zoom {Math.round(zoom * 100)}%
        </div>

        {/* Map canvas */}
        <motion.div
          animate={{ scale: zoom }}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
          className="grid-texture absolute inset-0"
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {ROADS.map((d, i) => (
              <path key={i} d={d} stroke="var(--faint)" strokeOpacity={0.35} strokeWidth={0.5} fill="none" vectorEffect="non-scaling-stroke" />
            ))}
            {/* Active route lines for in-transit deliveries */}
            {showDeliveries &&
              activeDeliveries.slice(0, 10).map((d, i) => (
                <path
                  key={d.id}
                  d={`M ${d.origin.x} ${d.origin.y} Q ${(d.origin.x + d.destinationPoint.x) / 2} ${
                    (d.origin.y + d.destinationPoint.y) / 2 - 6
                  } ${d.destinationPoint.x} ${d.destinationPoint.y}`}
                  stroke="#FF7A1A"
                  strokeOpacity={0.45}
                  strokeWidth={0.35}
                  fill="none"
                  strokeDasharray="1.4 1.4"
                  className="animate-dash-move"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
          </svg>

          {showDeliveries &&
            activeDeliveries.map((d) => (
              <div
                key={d.id}
                style={{ left: `${d.destinationPoint.x}%`, top: `${d.destinationPoint.y}%` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                title={`${d.id} · ${d.customer}`}
              >
                <div className="flex h-4 w-4 items-center justify-center rounded-[4px] border border-signal/50 bg-signal/20 text-signal shadow-sm transition-transform group-hover:scale-125">
                  <TbPackage className="text-[9px]" />
                </div>
              </div>
            ))}

          {showDrivers &&
            visibleDrivers.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDriverId(d.id)}
                style={{ left: `${d.position.x}%`, top: `${d.position.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  {d.status === "On route" && (
                    <span
                      className="absolute h-6 w-6 animate-pulse-ring rounded-full"
                      style={{ background: d.avatarColor }}
                    />
                  )}
                  <div
                    className={`relative flex h-6 w-6 items-center justify-center rounded-full border-2 text-[9px] font-bold text-white shadow-md transition-transform hover:scale-125 ${
                      selectedDriverId === d.id ? "border-ink scale-125" : "border-surface"
                    }`}
                    style={{ background: d.avatarColor }}
                  >
                    {d.initials}
                  </div>
                </div>
              </button>
            ))}
        </motion.div>
      </div>

      {/* Selected driver / legend panel */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {selectedDriver ? (
            <motion.div
              key={selectedDriver.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                    style={{ background: selectedDriver.avatarColor }}
                  >
                    {selectedDriver.initials}
                  </div>
                  <div>
                    <p className="text-[13.5px] font-semibold">{selectedDriver.name}</p>
                    <p className="text-[11.5px] text-faint">{selectedDriver.region}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDriverId(null)}
                  className="cursor-pointer rounded-md p-1 text-faint hover:bg-raised hover:text-ink"
                >
                  <TbX className="text-[15px]" />
                </button>
              </div>

              <div className="mt-3">
                <DriverStatusBadge status={selectedDriver.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5 text-[12px]">
                <div className="rounded-lg border border-border bg-raised p-2.5">
                  <p className="flex items-center gap-1 text-faint">
                    <TbStar className="text-[12px]" /> Rating
                  </p>
                  <p className="mt-0.5 font-semibold">{selectedDriver.rating}</p>
                </div>
                <div className="rounded-lg border border-border bg-raised p-2.5">
                  <p className="text-faint">On-time</p>
                  <p className="mt-0.5 font-semibold">{selectedDriver.onTimeRate}%</p>
                </div>
                <div className="rounded-lg border border-border bg-raised p-2.5">
                  <p className="text-faint">Today</p>
                  <p className="mt-0.5 font-semibold">{selectedDriver.deliveriesToday} stops</p>
                </div>
                <div className="rounded-lg border border-border bg-raised p-2.5">
                  <p className="flex items-center gap-1 text-faint">
                    <TbNavigation className="text-[12px]" /> Vehicle
                  </p>
                  <p className="mt-0.5 truncate font-semibold">{selectedVehicle?.name ?? "—"}</p>
                </div>
              </div>

              <button className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-raised py-2 text-[12.5px] font-medium text-muted transition-colors hover:text-ink">
                <TbPhone className="text-[14px]" /> {selectedDriver.phone}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-dashed border-border bg-surface p-5 text-center"
            >
              <TbTruck className="mx-auto text-[22px] text-faint" />
              <p className="mt-2 text-[12.5px] text-muted">Select a driver marker on the map to see live details.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-faint">Legend</p>
          <div className="space-y-2.5 text-[12px] text-muted">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-signal" /> Driver on route
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-idle" /> Driver idle / off duty
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 items-center justify-center rounded-[3px] border border-signal/50 bg-signal/20">
                <TbPackage className="text-[8px] text-signal" />
              </span>
              Delivery in progress
            </div>
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-3 border-t border-dashed border-signal" /> Active route
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterToggle({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium shadow-sm backdrop-blur transition-colors ${
        active
          ? "border-signal/40 bg-signal/15 text-signal"
          : "border-border bg-surface/90 text-muted hover:text-ink"
      }`}
    >
      <Icon className="text-[13px]" />
      {label}
    </button>
  );
}
