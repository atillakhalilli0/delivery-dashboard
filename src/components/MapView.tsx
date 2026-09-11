"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
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

// Leaflet touches `window` at module load time, which crashes during
// server-side rendering — load it only in the browser.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-2 text-faint">
        <TbTruck className="animate-pulse text-[24px]" />
        <p className="text-[12px]">Loading live map…</p>
      </div>
    </div>
  ),
});

export default function MapView() {
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
        <div className="absolute left-3 top-3 z-[500] flex flex-wrap items-center gap-2">
          <FilterToggle active={showDrivers} onClick={() => setShowDrivers((v) => !v)} icon={TbTruck} label="Drivers" />
          <FilterToggle active={showDeliveries} onClick={() => setShowDeliveries((v) => !v)} icon={TbPackage} label="Deliveries" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Driver["status"] | "All")}
            className="cursor-pointer rounded-full border border-border bg-surface/90 px-3 py-1.5 text-[11.5px] font-medium text-muted shadow-sm backdrop-blur focus:outline-none"
          >
            <option value="All" className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
              All statuses
            </option>
            <option value="On route" className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
              On route
            </option>
            <option value="Idle" className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
              Idle
            </option>
            <option value="Break" className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
              Break
            </option>
            <option value="Off duty" className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
              Off duty
            </option>
          </select>
        </div>

        {/* Real interactive map */}
        <LeafletMap
          drivers={visibleDrivers}
          activeDeliveries={activeDeliveries}
          showDrivers={showDrivers}
          showDeliveries={showDeliveries}
          selectedDriverId={selectedDriverId}
          onSelectDriver={(id) => setSelectedDriverId(id)}
        />
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
