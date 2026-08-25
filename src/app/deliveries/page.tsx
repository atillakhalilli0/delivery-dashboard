"use client";

import React, { useMemo, useState } from "react";
import { deliveries as initialDeliveries } from "@/lib/mockData";
import type { Delivery, DeliveryStatus, Priority } from "@/lib/types";
import FilterBar from "@/components/FilterBar";
import DeliveryTable from "@/components/DeliveryTable";
import DeliveryCard from "@/components/DeliveryCard";
import Drawer from "@/components/Drawer";
import DeliveryDetail from "@/components/DeliveryDetail";

const STATUS_FLOW: DeliveryStatus[] = ["Pending", "Assigned", "Picked up", "In transit", "Delivered"];

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");
  const [selected, setSelected] = useState<Delivery | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return deliveries.filter((d) => {
      if (statusFilter !== "All" && d.status !== statusFilter) return false;
      if (priorityFilter !== "All" && d.priority !== priorityFilter) return false;
      if (
        q &&
        !d.id.toLowerCase().includes(q) &&
        !d.customer.toLowerCase().includes(q) &&
        !d.destination.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [deliveries, search, statusFilter, priorityFilter]);

  function handleAdvanceStatus(id: string) {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const idx = STATUS_FLOW.indexOf(d.status);
        if (idx === -1 || idx >= STATUS_FLOW.length - 1) return d;
        const nextStatus = STATUS_FLOW[idx + 1] as DeliveryStatus;
        const label: Record<DeliveryStatus, string> = {
          Pending: "Order received",
          Assigned: "Driver assigned",
          "Picked up": "Package picked up",
          "In transit": "En route to destination",
          Delivered: "Delivered to recipient",
          Delayed: "Delay reported",
          Failed: "Delivery attempt failed",
        };
        const updated: Delivery = {
          ...d,
          status: nextStatus,
          eta: nextStatus === "Delivered" ? "Completed" : d.eta,
          timeline: [
            ...d.timeline,
            { status: nextStatus, label: label[nextStatus], timestamp: "Just now" },
          ],
        };
        return updated;
      })
    );
    setSelected((prev) => {
      if (!prev || prev.id !== id) return prev;
      const idx = STATUS_FLOW.indexOf(prev.status);
      if (idx === -1 || idx >= STATUS_FLOW.length - 1) return prev;
      const nextStatus = STATUS_FLOW[idx + 1] as DeliveryStatus;
      const label: Record<DeliveryStatus, string> = {
        Pending: "Order received",
        Assigned: "Driver assigned",
        "Picked up": "Package picked up",
        "In transit": "En route to destination",
        Delivered: "Delivered to recipient",
        Delayed: "Delay reported",
        Failed: "Delivery attempt failed",
      };
      return {
        ...prev,
        status: nextStatus,
        eta: nextStatus === "Delivered" ? "Completed" : prev.eta,
        timeline: [...prev.timeline, { status: nextStatus, label: label[nextStatus], timestamp: "Just now" }],
      };
    });
  }

  return (
    <div className="animate-fade-in space-y-4">
      <FilterBar
        search={search}
        onSearch={setSearch}
        activeStatus={statusFilter}
        onStatus={setStatusFilter}
        priority={priorityFilter}
        onPriority={setPriorityFilter}
      />

      <p className="text-[12.5px] text-muted">
        Showing <span className="font-semibold text-ink">{filtered.length}</span> of {deliveries.length} deliveries
      </p>

      <DeliveryTable rows={filtered} onSelect={setSelected} />
      <DeliveryCard rows={filtered} onSelect={setSelected} />

      <Drawer open={!!selected} onClose={() => setSelected(null)}>
        {selected && <DeliveryDetail delivery={selected} onAdvanceStatus={handleAdvanceStatus} />}
      </Drawer>
    </div>
  );
}
