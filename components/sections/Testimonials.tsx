"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { Stars } from "@/components/ui/Icons";
import { testimonials } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const INTERVAL = 7000;

/** Auto-advancing quote slider. Pauses on hover / focus; fully keyboard operable. */
export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const quote = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const n = testimonials.length;

  const go = useCallback((dir: number) => setI((x) => (x + dir + n) % n), [n]);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(id);
  }, [i, paused, go]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".t-line", { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.06 });
      gsap.fromTo(progress.current, { scaleX: 0 }, { scaleX: 1, duration: INTERVAL / 1000, ease: "none" });
    },
    { dependencies: [i], scope: quote },
  );

  useEffect(() => {
    if (!progress.current) return;
    gsap.getTweensOf(progress.current).forEach((t) => (paused ? t.pause() : t.resume()));
  }, [paused]);

  const t = testimonials[i];

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby="t-title"
      className="relative overflow-hidden bg-ivory py-24 md:py-40"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <span className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 select-none font-display text-[22rem] leading-none text-gold/15 md:text-[34rem]" aria-hidden="true">
        &ldquo;
      </span>
      <div className="container-luxe relative" ref={quote}>
        <div className="flex flex-col items-center text-center">
          <h2 id="t-title" className="label text-gold-ink">
            Kind words from our brides
          </h2>
          <div className="mt-6">
            <Stars className="h-4 w-4" />
          </div>

          <div className="mt-10 min-h-[14rem] max-w-5xl md:min-h-[16rem]" aria-live={paused ? "polite" : "off"} aria-atomic="true">
            <blockquote key={i}>
              <p className="overflow-hidden">
                <span className="t-line block font-display text-[clamp(1.9rem,4.4vw,4rem)] font-light italic leading-[1.12]">&ldquo;{t.quote}&rdquo;</span>
              </p>
              <footer className="mt-10 overflow-hidden">
                <cite className="t-line label block not-italic text-espresso">— {t.name}</cite>
              </footer>
            </blockquote>
          </div>

          <div className="mt-12 flex w-full max-w-md items-center gap-6">
            <button onClick={() => go(-1)} className="flex h-11 w-11 shrink-0 items-center justify-center border border-espresso/20 hover:border-gold" aria-label="Previous review">
              ←
            </button>
            <div className="flex-1">
              <div className="h-px w-full bg-espresso/10">
                <div ref={progress} className="h-px w-full origin-left bg-gold" />
              </div>
              <p className="label mt-3 text-center text-[0.625rem] text-taupe">
                {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </p>
            </div>
            <button onClick={() => go(1)} className="flex h-11 w-11 shrink-0 items-center justify-center border border-espresso/20 hover:border-gold" aria-label="Next review">
              →
            </button>
          </div>

          <div className="mt-14">
            <Button href="/appointment">Begin your story</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
