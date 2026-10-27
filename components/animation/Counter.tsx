"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/** Number that counts up when scrolled into view. Renders the final value on the server. */
export default function Counter({
  value,
  from = 0,
  suffix = "",
  plain = false,
  className,
}: {
  value: number;
  from?: number;
  suffix?: string;
  /** No thousands separator (for years) */
  plain?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => (plain ? String(Math.round(n)) : Math.round(n).toLocaleString("en-US"));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const obj = { n: from };
        gsap.to(obj, {
          n: value,
          duration: 2.4,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
          onUpdate: () => {
            if (ref.current) ref.current.textContent = fmt(obj.n);
          },
          onStart: () => {
            if (ref.current) ref.current.textContent = fmt(from);
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span className={className}>
      <span ref={ref} className="tabular-nums">
        {fmt(value)}
      </span>
      {suffix && <span className="text-gold-deep">{suffix}</span>}
    </span>
  );
}
