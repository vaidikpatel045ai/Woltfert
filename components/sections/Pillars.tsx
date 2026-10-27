import ImageReveal from "@/components/animation/ImageReveal";
import Parallax from "@/components/animation/Parallax";
import SplitReveal from "@/components/animation/SplitReveal";
import Button from "@/components/ui/Button";
import { pillars } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Trust · Service · Convenience — oversized words with editorial image pairings. */
export default function Pillars() {
  return (
    <section aria-labelledby="pillars-title" className="relative overflow-hidden py-24 md:py-40">
      <div className="container-luxe">
        <div className="mb-16 flex flex-col gap-6 md:mb-28 md:flex-row md:items-end md:justify-between">
          <p className="label text-gold-ink">The Wolsfelt&rsquo;s Difference</p>
          <h2 id="pillars-title" className="max-w-xl text-h3 font-light text-taupe md:text-right">
            More than a bridal salon — a defining moment, shared with the people you love.
          </h2>
        </div>

        <div className="space-y-24 md:space-y-40">
          {pillars.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={p.word} className="grid grid-cols-12 items-center gap-y-10 md:gap-x-10">
                <div className={cn("col-span-12 md:col-span-7", flip && "md:order-2 md:col-start-6")}>
                  <p className="label mb-4 flex items-center gap-4 text-gold-ink">
                    <span className="font-display text-base italic tracking-normal normal-case">0{i + 1}</span>
                    <span className="h-px w-10 bg-gold" aria-hidden="true" />
                    {p.eyebrow}
                  </p>
                  <SplitReveal as="h3" type="chars" className="text-[clamp(3.25rem,10.5vw,8.75rem)] leading-[0.85] font-light">
                    {p.word}
                  </SplitReveal>
                  <p className="mt-8 max-w-md text-taupe md:text-lg">{p.body}</p>
                </div>
                <div className={cn("relative col-span-10 col-start-2 md:col-span-4", flip ? "md:order-1 md:col-start-1" : "md:col-start-9")}>
                  <Parallax speed={flip ? 0.12 : 0.2}>
                    <ImageReveal src={p.image} alt={p.alt} className="aspect-[4/5]" sizes="(min-width: 768px) 33vw, 80vw" from={flip ? "left" : "right"} parallax={8} />
                  </Parallax>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-24 flex justify-center md:mt-32">
          <Button href="/appointment">Experience it in person</Button>
        </div>
      </div>
    </section>
  );
}
