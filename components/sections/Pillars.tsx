"use client";

import { useRef } from "react";
import ImageReveal from "@/components/animation/ImageReveal";
import SplitReveal from "@/components/animation/SplitReveal";
import Button from "@/components/ui/Button";
import { pillars } from "@/lib/data";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/** Trust · Service · Convenience — three editorial cards side by side. */
export default function Pillars() {
  const grid = useRef<HTMLDivElement>(null);

  // Per card: gold rule draws in, then subtitle and body rise, staggered across the row.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-pillar]").forEach((card, i) => {
          const tl = gsap.timeline({
            delay: i * 0.15,
            scrollTrigger: { trigger: card, start: "top 80%", once: true },
          });
          tl.fromTo(card.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0.4)
            .fromTo(card.querySelector("[data-num]"), { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 1 }, 0.5)
            .fromTo(card.querySelectorAll("[data-rise]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.12 }, 0.8);
        });
      });
      return () => mm.revert();
    },
    { scope: grid },
  );

  return (
    <section aria-labelledby="pillars-title" className="relative overflow-hidden py-20 md:py-28">
      <div className="container-luxe">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <p className="label text-gold-ink">The Wolsfelt&rsquo;s Difference</p>
          <h2 id="pillars-title" className="max-w-xl text-h3 font-light text-taupe md:text-right">
            More than a bridal salon — a defining moment, shared with the people you love.
          </h2>
        </div>

        <div ref={grid} className="grid gap-14 md:grid-cols-3 md:gap-8 lg:gap-12">
          {pillars.map((p, i) => (
            <article key={p.word} data-pillar className="group flex flex-col">
              <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2">
                <ImageReveal
                  src={p.image}
                  alt={p.alt}
                  className="aspect-[4/5]"
                  imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  sizes="(min-width: 768px) 30vw, 90vw"
                  from="bottom"
                  parallax={6}
                />
              </div>
              <div className="mt-8 flex items-center gap-4 text-gold-ink">
                <span data-num className="label">0{i + 1}</span>
                <span data-rule className="h-px flex-1 origin-left bg-gold/40 transition-colors duration-500 group-hover:bg-gold" aria-hidden="true" />
              </div>
              <SplitReveal
                as="h3"
                type="chars"
                className="mt-5 text-[clamp(2rem,3vw,2.75rem)] leading-[1] font-light tracking-[-0.01em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2"
              >
                {p.word}
              </SplitReveal>
              <p data-rise className="mt-2 font-display text-lg italic text-gold-ink">{p.eyebrow}</p>
              <p data-rise className="mt-4 text-[0.9375rem] leading-relaxed text-taupe">{p.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex justify-center md:mt-20">
          <Button href="/appointment">Experience it in person</Button>
        </div>
      </div>
    </section>
  );
}
