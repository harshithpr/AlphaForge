"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PricePoint } from "@/lib/types";

export function PriceChart({ data }: { data: PricePoint[] }) {
  return (
    <div className="h-80 w-full min-w-0 overflow-hidden">
      <AreaChart
        data={data}
        width={900}
        height={320}
        margin={{ top: 12, right: 16, left: 0, bottom: 0 }}
        style={{ width: "100%", height: "100%" }}
      >
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="date"
            minTickGap={28}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
          />
          <YAxis
            domain={["dataMin - 5", "dataMax + 5"]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
            width={48}
          />
          <Tooltip
            contentStyle={{
              background: "#09090b",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              color: "#fafafa",
            }}
            labelStyle={{ color: "#d4d4d8" }}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Close"]}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#priceFill)"
            isAnimationActive={false}
            activeDot={{ r: 4, fill: "#38bdf8", stroke: "#09090b" }}
          />
        </AreaChart>
    </div>
  );
}
