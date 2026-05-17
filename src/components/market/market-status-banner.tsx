"use client";

import { useEffect, useState } from "react";

type MarketStatus = {
  isOpen: boolean;
  status: string;
  updatedAt: string;
  warning: string;
};

export function MarketStatusBanner() {
  const [data, setData] = useState<MarketStatus | null>(null);

  useEffect(() => {
    let active = true;
    let controller = new AbortController();

    async function load(signal: AbortSignal) {
      try {
        const response = await fetch("/api/market/status", {
          cache: "no-store",
          signal,
        });
        const payload = (await response.json()) as MarketStatus;
        if (active) setData(payload);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    void load(controller.signal);
    const id = window.setInterval(() => {
      controller.abort();
      controller = new AbortController();
      void load(controller.signal);
    }, 60_000);

    return () => {
      active = false;
      window.clearInterval(id);
      controller.abort();
    };
  }, []);

  if (!data) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white/80">
      <strong className={data.isOpen ? "text-emerald-300" : "text-yellow-300"}>
        {data.status}
      </strong>
      <span className="ml-2">{data.warning}</span>
      <span className="ml-2 text-white/45">
        Updated {new Date(data.updatedAt).toLocaleTimeString()}
      </span>
    </div>
  );
}
