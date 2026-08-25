import React from "react";
import type { DeliveryStatus, DriverStatus, MaintenanceStatus, Priority } from "@/lib/types";

const DELIVERY_STYLES: Record<DeliveryStatus, string> = {
  Pending: "bg-idle/15 text-idle border-idle/30",
  Assigned: "bg-transit/10 text-transit border-transit/30",
  "Picked up": "bg-[#7C8CFF]/10 text-[#7C8CFF] border-[#7C8CFF]/30",
  "In transit": "bg-signal/10 text-signal border-signal/30",
  Delivered: "bg-success/10 text-success border-success/30",
  Delayed: "bg-alert/10 text-alert border-alert/30",
  Failed: "bg-alert/20 text-alert border-alert/40",
};

const DRIVER_STYLES: Record<DriverStatus, string> = {
  "On route": "bg-signal/10 text-signal border-signal/30",
  Idle: "bg-idle/15 text-idle border-idle/30",
  "Off duty": "bg-faint/15 text-faint border-faint/30",
  Break: "bg-transit/10 text-transit border-transit/30",
};

const MAINTENANCE_STYLES: Record<MaintenanceStatus, string> = {
  Operational: "bg-success/10 text-success border-success/30",
  "Due soon": "bg-signal/10 text-signal border-signal/30",
  "In service": "bg-transit/10 text-transit border-transit/30",
  Flagged: "bg-alert/10 text-alert border-alert/30",
};

const PRIORITY_STYLES: Record<Priority, string> = {
  Standard: "bg-idle/15 text-idle border-idle/30",
  Express: "bg-transit/10 text-transit border-transit/30",
  Critical: "bg-alert/10 text-alert border-alert/30",
};

function Dot({ className }: { className: string }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${className}`} />;
}

export function StatusBadge({ status }: { status: DeliveryStatus }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium ${DELIVERY_STYLES[status]}`}
    >
      <Dot className="bg-current" />
      {status}
    </span>
  );
}

export function DriverStatusBadge({ status }: { status: DriverStatus }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium ${DRIVER_STYLES[status]}`}
    >
      <Dot className="bg-current" />
      {status}
    </span>
  );
}

export function MaintenanceBadge({ status }: { status: MaintenanceStatus }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium ${MAINTENANCE_STYLES[status]}`}
    >
      <Dot className="bg-current" />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${PRIORITY_STYLES[priority]}`}
    >
      {priority}
    </span>
  );
}
