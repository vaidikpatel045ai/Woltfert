import ImageReveal from "@/components/animation/ImageReveal";
import SplitReveal from "@/components/animation/SplitReveal";
import Button from "@/components/ui/Button";
import { img, premier } from "@/lib/data";

export default function Premier() {
  return (
    <section aria-labelledby="premier-title" className="relative overflow-hidden bg-blush/60 py-24 md:py-40">
      <div className="container-luxe grid grid-cols-12 items-center gap-y-12">
        <div className="relative col-span-12 md:col-span-5">
          <ImageReveal src={img.premier} alt="A light-filled private suite with sheer curtains and soft seating" className="aspect-[4/5]" sizes="(min-width: 768px) 40vw, 100vw" parallax={6} />
          <div className="absolute -bottom-6 -right-4 bg-espresso px-6 py-5 text-ivory md:-right-10">
            <p className="font-display text-5xl font-light leading-none">{premier.price}</p>
            <p className="label mt-2 text-[0.5625rem] text-gold">Up to 5 guests</p>
          </div>
        </div>

        <div className="relative col-span-12 md:col-span-6 md:col-start-7">
          {/* Double gold hairline frame */}
          <div className="relative border border-gold/60 p-8 md:p-14">
            <div className="pointer-events-none absolute inset-2 border border-gold/30" aria-hidden="true" />
            <p className="label text-gold-ink">An exclusive experience</p>
            <SplitReveal as="h2" id="premier-title" className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[0.95]">
              The <em className="text-gold-deep">Premier</em> Appointment
            </SplitReveal>
            <p className="mt-6 text-taupe md:text-lg">{premier.lede}</p>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2" aria-label="At a glance">
              {premier.facts.map((f) => (
                <li key={f} className="label flex items-center gap-2 text-espresso">
                  <span className="h-1 w-1 rotate-45 bg-gold" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>

            <h3 className="label mt-10 border-t border-gold/40 pt-8 text-gold-ink">Included</h3>
            <ul className="mt-5 space-y-4">
              {premier.included.map((x) => (
                <li key={x} className="flex gap-4">
                  <span className="mt-[0.7em] h-px w-5 shrink-0 bg-gold" aria-hidden="true" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm text-taupe">
              {premier.price} {premier.priceNote}. {premier.fine}
            </p>
            <div className="mt-10">
              <Button href="/appointment?type=premier">Reserve the Premier</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
