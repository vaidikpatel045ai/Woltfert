"use client";

import { useEffect, useMemo, useState } from "react";
import { TransitionLink } from "@/components/animation/PageTransition";
import { announcements } from "@/lib/data";

const KEY = "wols-announce-dismissed";

/** Rotating promotion / closing-notice bar. Dismissal is remembered per browser. */
export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [i, setI] = useState(0);

  const items = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return announcements.filter((a) => !a.until || today < a.until);
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "1") setDismissed(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (items.length < 2 || dismissed) return;
    const id = setInterval(() => setI((n) => (n + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length, dismissed]);

  if (dismissed || !items.length) return null;
  const a = items[i];

  const close = () => {
    setDismissed(true);
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  };

  return (
    <div className="relative z-[70] bg-espresso text-ivory" role="region" aria-label="Announcements">
      <div className="container-luxe flex min-h-10 items-center justify-center gap-4 py-2 pr-10 text-center">
        <p key={i} className="label animate-[fade_0.8s_ease] text-[0.625rem] leading-relaxed md:text-[0.6875rem]" aria-live="polite">
          {a.text}
          {a.href && a.cta && (
            <>
              {" "}
              <TransitionLink href={a.href} className="ml-2 text-gold underline decoration-gold/50 underline-offset-4 hover:decoration-gold">
                {a.cta}
              </TransitionLink>
            </>
          )}
        </p>
        <button
          onClick={close}
          aria-label="Dismiss announcements"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-ivory/60 transition-colors hover:text-gold md:right-6"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M1 1l8 8M9 1 1 9" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>
      <style>{`@keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
