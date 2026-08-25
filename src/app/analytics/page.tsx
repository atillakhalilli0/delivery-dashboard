import React from "react";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { weeklyMetrics, monthlyDeliveryTime, driverLeaderboard, deliveries } from "@/lib/mockData";
import { TbTrendingUp, TbTrendingDown, TbClockHour4, TbAlertTriangle } from "react-icons/tb";

const delayedTrend = weeklyMetrics.map((m) => ({ label: m.day, value: m.delayed }));

export default function AnalyticsPage() {
  const totalDelivered = weeklyMetrics.reduce((a, m) => a + m.delivered, 0);
  const totalDelayed = weeklyMetrics.reduce((a, m) => a + m.delayed, 0);
  const delayRate = ((totalDelayed / (totalDelivered + totalDelayed)) * 100).toFixed(1);
  const avgTime = Math.round(
    monthlyDeliveryTime.reduce((a, m) => a + m.avgMinutes, 0) / monthlyDeliveryTime.length
  );

  return (
    <div className="animate-fade-in space-y-4">
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <MiniStat icon={TbTrendingUp} label="Delivered (7d)" value={totalDelivered.toLocaleString()} tone="success" />
        <MiniStat icon={TbAlertTriangle} label="Delayed (7d)" value={totalDelayed.toString()} tone="alert" />
        <MiniStat icon={TbClockHour4} label="Avg delivery time" value={`${avgTime} min`} tone="transit" />
        <MiniStat icon={TbTrendingDown} label="Delay rate" value={`${delayRate}%`} tone="signal" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
          <h2 className="font-display text-[15px] font-semibold">Deliveries per day</h2>
          <p className="mb-4 text-[12.5px] text-muted">Volume and delay overlay, last 7 days</p>
          <BarChart data={weeklyMetrics} />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
          <h2 className="font-display text-[15px] font-semibold">Average delivery time</h2>
          <p className="mb-4 text-[12.5px] text-muted">Minutes from pickup to drop-off, by week</p>
          <LineChart data={monthlyDeliveryTime.map((m) => ({ label: m.week, value: m.avgMinutes }))} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
          <h2 className="font-display text-[15px] font-semibold">Delayed deliveries</h2>
          <p className="mb-4 text-[12.5px] text-muted">Daily delay count across the network</p>
          <LineChart data={delayedTrend} unit="orders" />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
          <h2 className="font-display text-[15px] font-semibold">Driver performance</h2>
          <p className="mb-4 text-[12.5px] text-muted">Ranked by on-time delivery rate</p>
          <div className="space-y-3">
            {driverLeaderboard.map((d, i) => (
              <div key={d.id} className="flex items-center gap-3">
                <span className="w-4 shrink-0 text-[12px] font-semibold text-faint">{i + 1}</span>
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10.5px] font-semibold text-white"
                  style={{ background: d.avatarColor }}
                >
                  {d.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-[12.5px] font-medium">{d.name}</p>
                    <span className="tabular shrink-0 text-[12px] font-semibold">{d.onTimeRate}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-raised">
                    <div className="h-full rounded-full bg-signal transition-all duration-700" style={{ width: `${d.onTimeRate}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
        <h2 className="font-display text-[15px] font-semibold">Status distribution across all shipments</h2>
        <p className="mb-4 text-[12.5px] text-muted">{deliveries.length} shipments currently tracked</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {(["Pending", "Assigned", "Picked up", "In transit", "Delivered", "Delayed", "Failed"] as const).map((s) => {
            const count = deliveries.filter((d) => d.status === s).length;
            const pct = Math.round((count / deliveries.length) * 100);
            return (
              <div key={s} className="rounded-lg border border-border bg-raised p-3">
                <p className="text-[11px] text-faint">{s}</p>
                <p className="tabular mt-0.5 font-display text-lg font-semibold">{count}</p>
                <p className="text-[10.5px] text-faint">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "success" | "alert" | "transit" | "signal";
}) {
  const toneMap = {
    success: "bg-success/10 text-success",
    alert: "bg-alert/10 text-alert",
    transit: "bg-transit/10 text-transit",
    signal: "bg-signal/10 text-signal",
  } as const;
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneMap[tone]}`}>
        <Icon className="text-[15px]" />
      </div>
      <p className="tabular mt-3 font-display text-xl font-semibold">{value}</p>
      <p className="text-[12px] text-muted">{label}</p>
    </div>
  );
}
