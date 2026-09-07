"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TbBox,
  TbMapPin,
  TbTruck,
  TbUser,
  TbClockHour4,
  TbCircleCheck,
  TbPlayerTrackNext,
  TbRoute,
} from "react-icons/tb";
import type { Delivery, DeliveryStatus } from "@/lib/types";
import { StatusBadge, PriorityBadge } from "./StatusBadge";
import { getDriverById, getVehicleById } from "@/lib/mockData";

const STATUS_FLOW: DeliveryStatus[] = ["Pending", "Assigned", "Picked up", "In transit", "Delivered"];

interface DeliveryDetailProps {
  delivery: Delivery;
  onAdvanceStatus: (id: string) => void;
}

export default function DeliveryDetail({ delivery, onAdvanceStatus }: DeliveryDetailProps) {
  const [justUpdated, setJustUpdated] = useState(false);
  const driver = getDriverById(delivery.driverId);
  const vehicle = getVehicleById(delivery.vehicleId);

  const currentIdx = STATUS_FLOW.indexOf(delivery.status);
  const canAdvance = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1;

  function handleAdvance() {
    onAdvanceStatus(delivery.id);
    setJustUpdated(true);
    window.setTimeout(() => setJustUpdated(false), 1600);
  }

  return (
    <div className="flex h-full flex-col bg-slate-200/80 dark:bg-slate-900/90">
      <div className="border-b border-border px-6 py-5">
        <p className="font-mono text-[12px] text-faint">{delivery.id}</p>
        <div className="mt-1 flex items-center gap-2">
          <h2 className="font-display text-xl font-semibold tracking-tight">{delivery.customer}</h2>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <StatusBadge status={delivery.status} />
          <PriorityBadge priority={delivery.priority} />
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        <section className="grid grid-cols-2 gap-3">
          <InfoTile icon={TbBox} label="Package" value={delivery.package} />
          <InfoTile icon={TbClockHour4} label="ETA" value={delivery.eta} />
          <InfoTile icon={TbMapPin} label="Destination" value={delivery.destination} />
          <InfoTile icon={TbRoute} label="Distance" value={`${delivery.distanceKm} km`} />
        </section>

        <section>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-faint">Assignment</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-raised p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal">
                <TbUser className="text-[16px]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">{driver?.name ?? "Unassigned"}</p>
                <p className="text-[11.5px] text-faint">{driver ? driver.region : "Awaiting dispatch"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-raised p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-transit/10 text-transit">
                <TbTruck className="text-[16px]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">{vehicle?.name ?? "Not assigned"}</p>
                <p className="font-mono text-[11.5px] text-faint">{vehicle?.plate ?? "—"}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-faint">Timeline</p>
          <ol className="space-y-0">
            {delivery.timeline.map((event, i) => (
              <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
                {i < delivery.timeline.length - 1 && (
                  <span className="absolute left-[7px] top-4 h-full w-px bg-border" />
                )}
                <span
                  className={`relative z-10 mt-1 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full ${
                    i === delivery.timeline.length - 1 ? "bg-signal" : "bg-success"
                  }`}
                >
                  <span className="h-[6px] w-[6px] rounded-full bg-surface" />
                </span>
                <div>
                  <p className="text-[13px] font-medium text-ink">{event.label}</p>
                  <p className="font-mono text-[11px] text-faint">{event.timestamp}</p>
                  {event.note && <p className="mt-0.5 text-[12px] text-alert">{event.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-faint">Package details</p>
          <div className="grid grid-cols-2 gap-3 text-[12.5px]">
            <div className="rounded-lg border border-border bg-raised p-3">
              <p className="text-faint">Weight</p>
              <p className="mt-0.5 font-medium">{delivery.weightKg} kg</p>
            </div>
            <div className="rounded-lg border border-border bg-raised p-3">
              <p className="text-faint">Declared value</p>
              <p className="mt-0.5 font-medium">${delivery.value.toFixed(2)}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="border-t border-border px-6 py-4">
        {canAdvance ? (
          <button
            onClick={handleAdvance}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-signal py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-signal/90"
          >
            {justUpdated ? (
              <motion.span initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2">
                <TbCircleCheck className="text-[16px]" /> Status updated
              </motion.span>
            ) : (
              <>
                <TbPlayerTrackNext className="text-[16px]" />
                Advance to “{STATUS_FLOW[currentIdx + 1]}”
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-raised py-2.5 text-[13px] font-medium text-muted">
            <TbCircleCheck className="text-[16px] text-success" />
            {delivery.status === "Delivered" ? "Delivery complete" : "No further simulated updates"}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-raised p-3">
      <div className="flex items-center gap-1.5 text-faint">
        <Icon className="text-[13px]" />
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 truncate text-[13px] font-medium text-ink">{value}</p>
    </div>
  );
}
