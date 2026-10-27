"use client";

import { useRef } from "react";
import { timeline } from "@/lib/data";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Vertical history timeline: the gold spine draws with scroll, entries rise in. */
export default function Timeline() {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(".tl-spine", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 70%", scrub: true } });
        gsap.utils.toArray<HTMLElement>(".tl-item").forEach((el) => {
          gsap.from(el.querySelectorAll(".tl-anim"), {
            y: 50,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          });
          gsap.fromTo(el.querySelector(".tl-dot"), { scale: 0 }, { scale: 1, duration: 0.8, ease: "back.out(2)", scrollTrigger: { trigger: el, start: "top 70%", once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative">
      <span className="absolute left-3 top-0 h-full w-px bg-espresso/10 md:left-1/2" aria-hidden="true" />
      <span className="tl-spine absolute left-3 top-0 h-full w-px origin-top bg-gold md:left-1/2" aria-hidden="true" />
      {timeline.map((t, i) => (
        <li key={t.year} className="tl-item relative grid grid-cols-1 pb-20 pl-12 md:grid-cols-2 md:gap-24 md:pl-0 md:pb-28">
          <span className="tl-dot absolute left-3 top-4 h-3 w-3 -translate-x-1/2 rotate-45 border border-gold bg-ivory md:left-1/2" aria-hidden="true" />
          <div className={cn("md:text-right", i % 2 === 1 && "md:order-2 md:text-left")}>
            <p className="tl-anim font-display text-[clamp(3rem,7vw,6rem)] font-light italic leading-none text-gold-deep">{t.year}</p>
          </div>
          <div className={cn(i % 2 === 1 && "md:order-1 md:text-right")}>
            <h3 className="tl-anim mt-4 font-display text-3xl font-light md:mt-2 md:text-4xl">{t.title}</h3>
            <p className="tl-anim mt-3 max-w-md text-taupe md:inline-block">{t.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
