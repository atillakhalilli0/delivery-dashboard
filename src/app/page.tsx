import React from "react";
import StatCard from "@/components/StatCard";
import BarChart from "@/components/charts/BarChart";
import DonutChart from "@/components/charts/DonutChart";
import LineChart from "@/components/charts/LineChart";
import ActivityFeed from "@/components/ActivityFeed";
import { TbPackage, TbCircleCheck, TbAlertTriangle, TbUsers } from "react-icons/tb";
import { weeklyMetrics, deliveries, driverLeaderboard } from "@/lib/mockData";

const revenueTrend = [
  { label: "W1", value: 68200 },
  { label: "W2", value: 71400 },
  { label: "W3", value: 66800 },
  { label: "W4", value: 79300 },
  { label: "W5", value: 84100 },
  { label: "W6", value: 88950 },
];

export default function OverviewPage() {
  const statusCounts = deliveries.reduce<Record<string, number>>((acc, d) => {
    acc[d.status] = (acc[d.status] ?? 0) + 1;
    return acc;
  }, {});

  const donutSegments = [
    { label: "In transit", value: statusCounts["In transit"] ?? 0, color: "#FF7A1A" },
    { label: "Delivered", value: statusCounts["Delivered"] ?? 0, color: "#33C481" },
    { label: "Assigned", value: statusCounts["Assigned"] ?? 0, color: "#2FB6A6" },
    { label: "Pending", value: statusCounts["Pending"] ?? 0, color: "#8A93A6" },
    { label: "Delayed", value: statusCounts["Delayed"] ?? 0, color: "#FF4D4D" },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Active deliveries"
          value="248"
          delta="4.2%"
          trend="up"
          icon={TbPackage}
          accent="#FF7A1A"
          sublabel="vs. yesterday"
        />
        <StatCard
          label="Delivered today"
          value="1,482"
          delta="8.1%"
          trend="up"
          icon={TbCircleCheck}
          accent="#33C481"
          sublabel="vs. yesterday"
        />
        <StatCard
          label="Delayed"
          value="23"
          delta="2.6%"
          trend="down"
          icon={TbAlertTriangle}
          accent="#FF4D4D"
          sublabel="of active load"
        />
        <StatCard
          label="Drivers active"
          value="182"
          delta="1.4%"
          trend="up"
          icon={TbUsers}
          accent="#2FB6A6"
          sublabel="on route now"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-[15px] font-semibold">Delivery volume</h2>
              <p className="text-[12.5px] text-muted">Delivered vs. delayed, last 7 days</p>
            </div>
            <select className="cursor-pointer rounded-lg border border-border bg-raised px-2.5 py-1.5 text-[12px] font-medium text-muted focus:outline-none">
              <option>This week</option>
              <option>Last week</option>
              <option>This month</option>
            </select>
          </div>
          <BarChart data={weeklyMetrics} />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
          <h2 className="font-display text-[15px] font-semibold">Status breakdown</h2>
          <p className="mb-4 text-[12.5px] text-muted">Across {deliveries.length} tracked shipments</p>
          <DonutChart segments={donutSegments} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 xl:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <div>
              <h2 className="font-display text-[15px] font-semibold">Revenue</h2>
              <p className="text-[12.5px] text-muted">Weekly gross across all regions</p>
            </div>
            <div className="text-right">
              <p className="tabular font-display text-xl font-semibold">$88,950</p>
              <p className="text-[11.5px] font-medium text-success">+5.8% this week</p>
            </div>
          </div>
          <LineChart data={revenueTrend} unit="$" />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
          <h2 className="font-display text-[15px] font-semibold">Top performers</h2>
          <p className="mb-4 text-[12.5px] text-muted">On-time rate this week</p>
          <div className="space-y-3.5">
            {driverLeaderboard.slice(0, 5).map((d, i) => (
              <div key={d.id} className="flex items-center gap-3">
                <span className="w-4 shrink-0 text-[12px] font-semibold text-faint">{i + 1}</span>
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10.5px] font-semibold text-white"
                  style={{ background: d.avatarColor }}
                >
                  {d.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium">{d.name}</p>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-raised">
                    <div
                      className="h-full rounded-full bg-transit transition-all duration-700"
                      style={{ width: `${d.onTimeRate}%` }}
                    />
                  </div>
                </div>
                <span className="tabular shrink-0 text-[12px] font-semibold text-ink">{d.onTimeRate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ActivityFeed />
    </div>
  );
}
