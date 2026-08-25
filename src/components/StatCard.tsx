import React from "react";
import type { IconType } from "react-icons";
import { TbArrowUpRight, TbArrowDownRight } from "react-icons/tb";

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: IconType;
  accent: string;
  sublabel: string;
}

export default function StatCard({ label, value, delta, trend, icon: Icon, accent, sublabel }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-panel sm:p-5">
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.08] transition-transform duration-500 group-hover:scale-125"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <p className="text-[12.5px] font-medium text-muted">{label}</p>
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${accent}1A`, color: accent }}
        >
          <Icon className="text-[15px]" />
        </div>
      </div>
      <p className="tabular mt-2 font-display text-[28px] font-semibold leading-none tracking-tight sm:text-[30px]">
        {value}
      </p>
      <div className="mt-2.5 flex items-center gap-1.5">
        <span
          className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11.5px] font-semibold ${
            trend === "up" ? "bg-success/10 text-success" : "bg-alert/10 text-alert"
          }`}
        >
          {trend === "up" ? <TbArrowUpRight /> : <TbArrowDownRight />}
          {delta}
        </span>
        <span className="text-[11.5px] text-faint">{sublabel}</span>
      </div>
    </div>
  );
}
