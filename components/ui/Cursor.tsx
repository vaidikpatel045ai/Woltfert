"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { isTouch, prefersReducedMotion } from "@/lib/utils";

/**
 * Small gold dot that grows into a labelled ring ("View", "Book", "Discover"…)
 * over any element carrying data-cursor="Label". Plain links/buttons get a
 * subtle grow. Disabled on touch devices and for reduced motion.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current) return;
    const el = dot.current;
    document.documentElement.classList.add("has-cursor");
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { scale: 1, duration: 0.4 });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const over = (e: Event) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setLabel(labelled.dataset.cursor || "");
        gsap.to(el, { width: 88, height: 88, backgroundColor: "rgba(201,169,110,0.92)", duration: 0.5, ease: "expo.out" });
        return;
      }
      setLabel("");
      const interactive = t.closest("a, button, [role='button'], label, summary");
      gsap.to(el, {
        width: interactive ? 36 : 8,
        height: interactive ? 36 : 8,
        backgroundColor: interactive ? "rgba(201,169,110,0.25)" : "rgba(201,169,110,1)",
        duration: 0.5,
        ease: "expo.out",
      });
    };

    const leaveWindow = () => {
      gsap.to(el, { scale: 0, duration: 0.3 });
      shown = false;
    };
    const down = () => gsap.to(el, { scale: 0.8, duration: 0.2 });
    const up = () => gsap.to(el, { scale: 1, duration: 0.3 });

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leaveWindow);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leaveWindow);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[300] flex h-2 w-2 items-center justify-center rounded-full bg-gold mix-blend-normal"
    >
      <span className="label whitespace-nowrap text-[0.625rem] text-espresso transition-opacity duration-300" style={{ opacity: label ? 1 : 0 }}>
        {label}
      </span>
    </div>
  );
}
