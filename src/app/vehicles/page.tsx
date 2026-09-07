"use client";

import React, { useMemo, useState } from "react";
import { vehicles, getDriverById } from "@/lib/mockData";
import type { Vehicle, VehicleType } from "@/lib/types";
import { MaintenanceBadge } from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { TbTruck, TbSearch, TbGasStation, TbBox, TbChevronRight, TbX, TbTool } from "react-icons/tb";

const TYPES: (VehicleType | "All")[] = ["All", "Van", "Truck", "Cargo bike", "Refrigerated truck"];

export default function VehiclesPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<VehicleType | "All">("All");
  const [selected, setSelected] = useState<Vehicle | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vehicles.filter((v) => {
      if (type !== "All" && v.type !== type) return false;
      if (q && !v.name.toLowerCase().includes(q) && !v.plate.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, type]);

  const selectedDriver = getDriverById(selected?.driverId ?? null);

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <TbSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vehicle or plate…"
            className="w-full cursor-text rounded-lg border border-border bg-raised py-2.5 pl-9 pr-3 text-[13px] placeholder:text-faint focus:border-signal/60 focus:outline-none focus:ring-2 focus:ring-signal/15"
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as VehicleType | "All")}
          className="cursor-pointer rounded-lg border border-border bg-raised px-3 py-2.5 text-[13px] font-medium text-muted focus:outline-none sm:w-48"
        >
          {TYPES.map((t) => (
            <option className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" key={t} value={t}>
              {t === "All" ? "All vehicle types" : t}
            </option>
          ))}
        </select>
      </div>

      <p className="text-[12.5px] text-muted">
        <span className="font-semibold text-ink">{filtered.length}</span> of {vehicles.length} vehicles
      </p>

      <div className="hidden overflow-hidden rounded-xl border border-border bg-surface lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-raised/60">
              {["Vehicle", "Type", "Plate", "Driver", "Mileage", "Maintenance", ""].map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-faint">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => {
              const driver = getDriverById(v.driverId);
              return (
                <tr
                  key={v.id}
                  onClick={() => setSelected(v)}
                  className="group cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-raised/60"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-transit/10 text-transit">
                        <TbTruck className="text-[15px]" />
                      </div>
                      <span className="text-[13px] font-medium">{v.name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-muted">{v.type}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px]">{v.plate}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-muted">{driver?.name ?? "Unassigned"}</td>
                  <td className="tabular whitespace-nowrap px-4 py-3 text-[13px] text-muted">{v.mileage.toLocaleString()} mi</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <MaintenanceBadge status={v.maintenance} />
                  </td>
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
        {filtered.map((v) => {
          const driver = getDriverById(v.driverId);
          return (
            <button
              key={v.id}
              onClick={() => setSelected(v)}
              className="cursor-pointer rounded-xl border border-border bg-surface p-4 text-left transition-transform active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-transit/10 text-transit">
                  <TbTruck className="text-[16px]" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold">{v.name}</p>
                  <p className="font-mono text-[11.5px] text-faint">{v.plate}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <MaintenanceBadge status={v.maintenance} />
                <span className="text-[12px] text-muted">{driver?.name ?? "Unassigned"}</span>
              </div>
            </button>
          );
        })}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} widthClass="max-w-lg bg-slate-200/80 dark:bg-slate-900/90">
        {selected && (
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-transit/10 text-transit">
                  <TbTruck className="text-[19px]" />
                </div>
                <div>
                  <h3 className="font-display text-[16px] font-semibold">{selected.name}</h3>
                  <p className="font-mono text-[12px] text-faint">{selected.plate} · {selected.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="cursor-pointer rounded-full border border-border bg-raised p-1.5 text-muted hover:text-ink"
              >
                <TbX className="text-[15px]" />
              </button>
            </div>

            <div className="mt-4">
              <MaintenanceBadge status={selected.maintenance} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-raised p-3">
                <p className="text-[11px] text-faint">Driver</p>
                <p className="mt-0.5 truncate text-[13px] font-medium">{getDriverById(selected.driverId)?.name ?? "Unassigned"}</p>
              </div>
              <div className="rounded-lg border border-border bg-raised p-3">
                <p className="text-[11px] text-faint">Mileage</p>
                <p className="tabular mt-0.5 text-[13px] font-medium">{selected.mileage.toLocaleString()} mi</p>
              </div>
              <div className="rounded-lg border border-border bg-raised p-3">
                <p className="flex items-center gap-1 text-[11px] text-faint">
                  <TbTool className="text-[12px]" /> Next service
                </p>
                <p className="tabular mt-0.5 text-[13px] font-medium">{selected.nextServiceInMiles} mi</p>
              </div>
              <div className="rounded-lg border border-border bg-raised p-3">
                <p className="text-[11px] text-faint">Type</p>
                <p className="mt-0.5 text-[13px] font-medium">{selected.type}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-1.5 text-muted">
                    <TbGasStation className="text-[13px]" /> Fuel level
                  </span>
                  <span className="font-semibold">{selected.fuelLevel}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-raised">
                  <div
                    className="h-full rounded-full bg-signal transition-all duration-700"
                    style={{ width: `${selected.fuelLevel}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-1.5 text-muted">
                    <TbBox className="text-[13px]" /> Cargo capacity used
                  </span>
                  <span className="font-semibold">{selected.capacityUsed}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-raised">
                  <div
                    className="h-full rounded-full bg-transit transition-all duration-700"
                    style={{ width: `${selected.capacityUsed}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
