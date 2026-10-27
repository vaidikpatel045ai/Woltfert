"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SplitReveal from "@/components/animation/SplitReveal";
import Button from "@/components/ui/Button";
import { Stars } from "@/components/ui/Icons";
import { img } from "@/lib/data";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { canUseWebGL, onPreloaderDone } from "@/lib/utils";

const SilkHero = dynamic(() => import("@/components/three/SilkHero"), { ssr: false });

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [webgl, setWebgl] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  // Mount WebGL after the browser is idle so it never competes with first paint.
  useEffect(() => {
    if (!canUseWebGL()) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const go = () => setWebgl(true);
    if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 1500 });
    else setTimeout(go, 600);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Resolve elements now: the intro plays later, outside this context's scope.
        const q = gsap.utils.selector(root);
        const fades = q(".hero-fade");
        const frame = q(".hero-frame");
        const image = q(".hero-img");
        gsap.set(fades, { opacity: 0, y: 24 });
        gsap.set(frame, { clipPath: "inset(12% 12% 12% 12%)" });
        const off = onPreloaderDone(() => {
          gsap
            .timeline({ delay: 0.15 })
            .to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.inOut" }, 0)
            .fromTo(image, { scale: 1.25 }, { scale: 1, duration: 2.4, ease: "expo.out" }, 0)
            .to(fades, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" }, 0.7);
        });

        // Scroll: content lifts away, image drifts slower (layered parallax)
        gsap.to(".hero-content", {
          yPercent: -18,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-frame", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        return off;
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative -mt-24 flex min-h-[100svh] items-end overflow-hidden pt-28 md:-mt-28">
      {/* Background: CSS silk always, WebGL silk fades in on capable devices */}
      <div className="silk-fallback absolute inset-0" aria-hidden="true" />
      {webgl && (
        <div className="absolute inset-0 transition-opacity duration-[2000ms]" style={{ opacity: canvasReady ? 1 : 0 }} aria-hidden="true">
          <SilkHero onReady={() => setCanvasReady(true)} />
        </div>
      )}

      <div className="container-luxe relative grid w-full grid-cols-12 items-end gap-y-10 pb-10 md:pb-16">
        <div className="hero-content col-span-12 lg:col-span-8">
          <p className="hero-fade label mb-6 flex items-center gap-4 text-gold-ink md:mb-8">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            Aurora, Illinois · Est. 1973
          </p>
          <SplitReveal as="h1" id="hero-title" onLoad className="text-display font-light text-espresso">
            Where Generations <br className="hidden sm:block" />
            Say <em className="text-gold-deep">Yes</em>
          </SplitReveal>
          <p className="hero-fade mt-8 max-w-md text-base leading-relaxed text-taupe md:text-lg">
            Designer bridal gowns in the Chicago area since 1973 — with champagne, a personal stylist and alterations under one roof.
          </p>
          <div className="hero-fade mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Button href="/appointment">Book Your Appointment</Button>
            <Button href="/collections/bridal" variant="outline" cursor="View" magnetic={false}>
              Explore Collections
            </Button>
          </div>
          <div className="hero-fade mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-taupe">
            <Stars />
            <span>The Knot Hall of Fame</span>
            <span className="h-3 w-px bg-gold" aria-hidden="true" />
            <span>50+ years, three generations</span>
          </div>
        </div>

        <div className="relative col-span-8 col-start-5 hidden aspect-[3/4] md:block lg:col-span-4 lg:col-start-9 lg:-mb-4">
          <div className="hero-frame absolute inset-0 overflow-hidden">
            <Image
              src={img.hero}
              alt="A bride in a long-sleeved lace gown, photographed from behind beside a sunlit window"
              fill
              priority
              sizes="(min-width: 1024px) 30vw, 60vw"
              className="hero-img object-cover"
            />
          </div>
          <span className="label absolute -left-14 top-6 hidden origin-left -rotate-90 text-gold-ink lg:block">The W Collection</span>
          <div className="pointer-events-none absolute -inset-3 border border-gold/50" aria-hidden="true" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-fade absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" aria-hidden="true">
        <span className="label text-[0.5625rem] text-taupe">Scroll</span>
        <span className="relative h-14 w-px overflow-hidden bg-espresso/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(.19,1,.22,1)_infinite] bg-gold" />
        </span>
        <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
      </div>
    </section>
  );
}
