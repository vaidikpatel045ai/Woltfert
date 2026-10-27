"use client";

import Image from "next/image";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import { experience } from "@/lib/data";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/** "The Wolsfelt's Experience" — five steps on a pinned horizontal track (desktop). */
export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 768px) and ${MOTION_OK}`, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });

        // Images drift inside their frames as the track moves (containerAnimation)
        gsap.utils.toArray<HTMLElement>(".exp-img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            { xPercent: 8, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="exp-title" className="relative overflow-hidden bg-espresso text-ivory md:h-screen">
      <div className="flex h-full flex-col">
        {/* Top padding clears the sticky nav while pinned */}
        <div className="container-luxe flex items-end justify-between gap-6 pt-20 md:pt-28">
          <div>
            <p className="label mb-4 text-gold">What to expect</p>
            <h2 id="exp-title" className="text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-none">
              The Wolsfelt&rsquo;s <em className="text-gold">Experience</em>
            </h2>
          </div>
          <div className="hidden w-64 md:block" aria-hidden="true">
            <div className="h-px w-full bg-ivory/15">
              <div ref={bar} className="h-px w-full origin-left bg-gold" />
            </div>
          </div>
        </div>

        <ol ref={track} className="flex flex-1 flex-col gap-16 px-4 py-14 md:w-max md:flex-row md:items-center md:gap-0 md:px-[clamp(1rem,4vw,4rem)] md:py-0">
          {experience.map((s, i) => (
            <li key={s.n} className="relative grid grid-cols-1 gap-8 md:h-[56vh] md:w-[min(72vw,58rem)] md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12 md:pr-24">
              <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-full">
                <div className="exp-img absolute -inset-x-[10%] inset-y-0">
                  <Image src={s.image} alt={s.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
                </div>
              </div>
              <div>
                <span className="font-display text-[clamp(4rem,8vw,7.5rem)] font-light leading-none text-gold/90">{s.n}</span>
                <h3 className="mt-4 font-display text-4xl font-light md:text-5xl">{s.title}</h3>
                <p className="mt-5 max-w-sm text-ivory/75">{s.body}</p>
                {i === 0 && (
                  <div className="mt-8">
                    <Button href="/appointment" variant="light">
                      Book now
                    </Button>
                  </div>
                )}
              </div>
            </li>
          ))}
          <li className="flex flex-col items-start justify-center gap-8 md:h-[56vh] md:w-[44rem] md:pl-8">
            <p className="font-display text-[clamp(2.75rem,5vw,5rem)] font-light leading-[0.95]">
              Your moment, <br />
              <em className="text-gold">beautifully</em> planned.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/appointment" variant="light">
                Book Your Appointment
              </Button>
              <Button href="/faq" variant="ghost" cursor="Read" magnetic={false}>
                Read the FAQ
              </Button>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
