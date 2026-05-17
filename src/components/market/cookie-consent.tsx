"use client";

import { useEffect, useState } from "react";

const storageKey = "alphaforge-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const accepted = window.localStorage.getItem(storageKey);
      if (!accepted) setVisible(true);
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  function accept() {
    window.localStorage.setItem(storageKey, "accepted");
    setVisible(false);
  }

  function reject() {
    window.localStorage.setItem(storageKey, "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] rounded-lg border border-white/10 bg-[#070B14] p-4 shadow-2xl md:left-auto md:max-w-md">
      <h2 className="text-lg font-semibold">Cookie preferences</h2>
      <p className="mt-2 text-sm leading-6 text-white/70">
        AlphaForge uses cookies and local storage to remember preferences, improve performance,
        and keep saved settings.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={accept}
          className="min-h-11 rounded-lg bg-cyan-300 px-4 py-2 font-medium text-black transition hover:bg-cyan-200"
        >
          Accept
        </button>
        <button
          onClick={reject}
          className="min-h-11 rounded-lg border border-white/10 px-4 py-2 text-white/80 transition hover:border-cyan-300/50 hover:text-white"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
