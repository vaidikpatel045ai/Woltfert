"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SplitReveal from "@/components/animation/SplitReveal";
import { TransitionLink } from "@/components/animation/PageTransition";
import Button from "@/components/ui/Button";
import type { CarouselApi } from "@/components/three/CurvedCarousel";
import { designers } from "@/lib/data";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { canUseWebGL } from "@/lib/utils";

const CurvedCarousel = dynamic(() => import("@/components/three/CurvedCarousel"), { ssr: false });

export default function Designers() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const api = useRef<CarouselApi | null>(null);
  const scroll = useRef(0);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"pending" | "gl" | "static">("pending");

  // Decide renderer and lazy-mount when the stage nears the viewport.
  useEffect(() => {
    if (!canUseWebGL()) {
      setMode("static");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMode("gl");
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    if (stage.current) io.observe(stage.current);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => (scroll.current = self.progress),
      });
    },
    { scope: root },
  );

  const d = designers[active];

  return (
    <section ref={root} aria-labelledby="designers-title" className="relative overflow-hidden bg-pearl py-24 md:py-36">
      <div className="container-luxe">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label mb-6 text-gold-ink">Nine collections · One salon</p>
            <SplitReveal as="h2" id="designers-title" className="text-h2 font-light">
              The <em className="text-gold-deep">Designers</em>
            </SplitReveal>
          </div>
          <p className="max-w-sm text-taupe">
            A proud Justin Alexander Diamond Partner, with the private W Collection shown only in our salon.
          </p>
        </div>
      </div>

      {mode === "static" ? (
        <ul className="container-luxe mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6" aria-label="Designer collections">
          {designers.map((x) => (
            <li key={x.slug} className="w-[72vw] shrink-0 snap-start sm:w-[40vw] lg:w-[24vw]">
              <TransitionLink href={`/collections/${x.slug}`} className="group block" data-cursor="View">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src={x.image} alt={x.alt} fill sizes="(min-width: 1024px) 24vw, 72vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                </div>
                <p className="mt-4 font-display text-2xl">{x.name}</p>
                <p className="text-sm text-taupe">{x.note}</p>
              </TransitionLink>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div ref={stage} className="relative mt-10 h-[62vh] min-h-[420px] md:h-[78vh]">
            {mode === "gl" && <CurvedCarousel designers={designers} onActive={setActive} apiRef={api} scrollRef={scroll} />}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-pearl to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-pearl to-transparent" aria-hidden="true" />
          </div>

          <div className="container-luxe mt-6 grid grid-cols-12 items-end gap-y-6">
            <div className="col-span-12 md:col-span-6" aria-live="polite">
              <p className="label text-gold-ink">
                {String(active + 1).padStart(2, "0")} / {String(designers.length).padStart(2, "0")}
              </p>
              <p className="mt-3 font-display text-4xl font-light md:text-5xl">{d.name}</p>
              <p className="mt-2 text-taupe">{d.note}</p>
            </div>
            <div className="col-span-12 flex flex-wrap items-center gap-4 md:col-span-6 md:justify-end">
              <button onClick={() => api.current?.go(-1)} className="flex h-12 w-12 items-center justify-center border border-espresso/20 transition-colors hover:border-gold hover:bg-gold/10" aria-label="Previous designer">
                ←
              </button>
              <button onClick={() => api.current?.go(1)} className="flex h-12 w-12 items-center justify-center border border-espresso/20 transition-colors hover:border-gold hover:bg-gold/10" aria-label="Next designer">
                →
              </button>
              <Button href={`/collections/${d.slug}`} variant="outline" cursor="View" magnetic={false}>
                View collection
              </Button>
              <Button href={`/appointment?type=bridal&designer=${d.slug}`}>Book to try</Button>
            </div>
          </div>

          {/* Crawlable, keyboard-reachable list behind the canvas */}
          <nav aria-label="All designer collections" className="container-luxe mt-10">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {designers.map((x, i) => (
                <li key={x.slug}>
                  <TransitionLink
                    href={`/collections/${x.slug}`}
                    onFocus={() => api.current?.to(i)}
                    onPointerEnter={() => api.current?.to(i)}
                    className={`label link-underline transition-colors ${i === active ? "text-gold-ink" : "text-taupe"}`}
                  >
                    {x.name}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </section>
  );
}
