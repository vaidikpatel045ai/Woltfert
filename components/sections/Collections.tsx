import SplitReveal from "@/components/animation/SplitReveal";
import Parallax from "@/components/animation/Parallax";
import { TransitionLink } from "@/components/animation/PageTransition";
import Button from "@/components/ui/Button";
import DistortTile from "@/components/ui/DistortTile";
import { collectionTiles, moreCategories } from "@/lib/data";
import { cn } from "@/lib/utils";

// Asymmetric editorial grid: one tall hero tile, three offset companions.
const layout = [
  "md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto md:h-full",
  "md:col-span-5 aspect-[4/3]",
  "md:col-span-5 aspect-[4/3]",
  "md:col-span-7 md:col-start-6 aspect-[16/10]",
];

export default function Collections() {
  return (
    <section id="collections" aria-labelledby="col-title" className="py-24 md:py-40">
      <div className="container-luxe">
        <div className="mb-14 grid grid-cols-12 items-end gap-y-6 md:mb-20">
          <div className="col-span-12 md:col-span-8">
            <p className="label mb-6 text-gold-ink">The Collections</p>
            <SplitReveal as="h2" id="col-title" className="text-h2 font-light">
              Dressed for every <em className="text-gold-deep">moment</em>
            </SplitReveal>
          </div>
          <p className="col-span-12 max-w-sm text-taupe md:col-span-4 md:justify-self-end">
            Gowns for the bride, her bridesmaids and her mother — and tuxedos for the gentlemen — all under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:grid-rows-[auto_auto_auto] md:gap-6">
          {collectionTiles.map((c, i) => (
            <div key={c.href} className={cn("relative", layout[i])}>
              <Parallax speed={i % 2 ? 0.1 : 0} className="h-full">
                <DistortTile href={c.href} src={c.image} alt={c.alt} sizes={i === 0 ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 42vw, 100vw"} className="h-full min-h-[22rem]">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent" aria-hidden="true" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-ivory md:p-8">
                    <div>
                      <span className="label text-gold">{c.index}</span>
                      <h3 className="mt-2 font-display text-4xl font-light md:text-5xl">{c.title}</h3>
                      <p className="mt-1 text-sm text-ivory/80">{c.blurb}</p>
                    </div>
                    <span className="label hidden translate-y-2 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 sm:block">Discover →</span>
                  </div>
                </DistortTile>
              </Parallax>
            </div>
          ))}
          {/* Editorial note filling the open cell beside the Tuxedos tile */}
          <div className="flex flex-col justify-end gap-6 py-6 md:col-span-4 md:col-start-1 md:row-start-3 md:py-0 md:pr-6">
            <p className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] font-light italic leading-tight text-espresso">
              &ldquo;Bring your mother, your sisters, your best friend. This is a moment worth sharing.&rdquo;
            </p>
            <dl className="grid grid-cols-3 gap-4 border-t border-gold/40 pt-5">
              {[
                ["6 – 26", "Sample sizes"],
                ["$1,499", "Gowns from"],
                ["$999", "Sale from"],
              ].map(([v, l]) => (
                <div key={l} className="flex flex-col">
                  <dt className="label order-2 mt-1 text-[0.5625rem] text-taupe">{l}</dt>
                  <dd className="order-1 font-display text-2xl">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-10 border-t border-gold/40 pt-10 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {moreCategories.map((c) => (
              <li key={c.title}>
                {c.external ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="font-display text-2xl italic link-underline">
                    {c.title} <span className="sr-only">(opens in a new tab)</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <TransitionLink href={c.href} className="font-display text-2xl italic link-underline">
                    {c.title}
                  </TransitionLink>
                )}
              </li>
            ))}
          </ul>
          <Button href="/appointment">Book a Try-On</Button>
        </div>
      </div>
    </section>
  );
}
