"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { PRELOADER_EVENT } from "@/lib/utils";
import { getLenis } from "./SmoothScroll";

function finish() {
  window.__wolsPreloaded = true;
  document.documentElement.classList.remove("is-loading");
  try {
    sessionStorage.setItem("wols-preloaded", "1");
  } catch {}
  // Dispatch outside this component's gsap.context so listeners resolve their own selectors.
  setTimeout(() => window.dispatchEvent(new Event(PRELOADER_EVENT)), 0);
}

/**
 * Gold "W" monogram draws in, counter runs 0 → 100, then a two-layer curtain
 * wipes up into the hero. Shown once per session; skipped for reduced motion
 * (the inline script in layout.tsx hides it before first paint in both cases).
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (html.classList.contains("preloaded") || html.classList.contains("reduced-motion")) {
        finish();
        setGone(true);
        return;
      }
      requestAnimationFrame(() => getLenis()?.stop());

      const paths = gsap.utils.toArray<SVGGeometryElement>(".pl-stroke", root.current);
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const counter = { n: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => setGone(true),
      });

      tl.to(paths, { strokeDashoffset: 0, duration: 1.5, stagger: 0.12 }, 0)
        .to(
          counter,
          {
            n: 100,
            duration: 1.7,
            ease: "power1.inOut",
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.n)).padStart(3, "0");
            },
          },
          0,
        )
        .to(".pl-fill", { opacity: 1, duration: 0.6 }, 1.1)
        .to(".pl-content", { yPercent: -30, opacity: 0, duration: 0.7, ease: "power3.in" }, 1.85)
        .add(() => {
          getLenis()?.start();
          finish();
        }, 2.2)
        .to(".pl-panel-dark", { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 2.05)
        .to(".pl-panel-gold", { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 2.15);
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="preloader fixed inset-0 z-[200]" aria-hidden="true">
      <div className="pl-panel-gold absolute inset-0 bg-gold" />
      <div className="pl-panel-dark absolute inset-0 flex items-center justify-center bg-espresso text-gold">
        <div className="pl-content flex flex-col items-center gap-8">
          <svg viewBox="0 0 120 120" className="h-28 w-28 md:h-36 md:w-36" fill="none">
            <circle className="pl-stroke" cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="0.75" />
            <circle className="pl-stroke" cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="0.4" />
            <path
              className="pl-stroke"
              d="M28 38 L44 86 L60 46 L76 86 L92 38"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path className="pl-stroke" d="M22 38 H36 M84 38 H98" stroke="currentColor" strokeWidth="1" />
            <path className="pl-fill opacity-0" d="M28 38 L44 86 L60 46 L76 86 L92 38" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
          </svg>
          <div className="flex items-baseline gap-4">
            <span className="label text-ivory/60">Est. 1973</span>
            <span ref={count} className="font-display text-3xl font-light tabular-nums text-ivory">
              000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
