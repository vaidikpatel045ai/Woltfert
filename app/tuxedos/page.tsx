import type { Metadata } from "next";
import ImageReveal from "@/components/animation/ImageReveal";
import SplitReveal from "@/components/animation/SplitReveal";
import Visit from "@/components/sections/Visit";
import Button from "@/components/ui/Button";
import Marquee from "@/components/ui/Marquee";
import PageHeader from "@/components/ui/PageHeader";
import { img, tuxBrands, tuxNotes, tuxStyles, tuxSteps } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tuxedo Rental in Aurora, IL",
  description:
    "On-site tuxedo and suit rental in Aurora, IL — Kenneth Cole, Ike Behar, David Major and more. In-house fittings, slim-fit styles, free groom rental with 5+ rentals.",
  alternates: { canonical: "/tuxedos" },
};

export default function TuxedosPage() {
  return (
    <>
      <PageHeader
        eyebrow="On-site rental"
        title={
          <>
            Tuxedos, <em className="text-gold-deep">tailored</em>
          </>
        }
        intro={<p>Rent for the groom, his groomsmen and every special occasion. Vest and tie colors in stock to match your palette, fitted and adjusted in-house.</p>}
        image={img.tuxedos}
        imageAlt="A grey windowpane tuxedo with a black bow tie on a tailor's form"
        cta={{ href: "/appointment?type=tuxedo", label: "Book a Tux Fitting" }}
      />

      <section aria-label="Brands" className="border-y border-gold/40 py-6">
        <Marquee items={tuxBrands} separator="✦" duration={35} itemClassName="font-display text-3xl font-light italic text-gold-deep md:text-4xl" />
      </section>

      <section aria-labelledby="styles-title" className="container-luxe py-24 md:py-36">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SplitReveal as="h2" id="styles-title" className="text-h2 font-light">
            The <em className="text-gold-deep">styles</em>
          </SplitReveal>
          <p className="max-w-sm text-taupe">A selection of what&rsquo;s available — see the full range in the boutique.</p>
        </div>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {tuxStyles.map((s, i) => (
            <li key={s.name} className={i % 3 === 1 ? "lg:mt-20" : ""}>
              <ImageReveal src={s.image} alt={s.alt} className="aspect-[3/4]" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
              <p className="mt-5 font-display text-3xl">{s.name}</p>
              <p className="label mt-1 text-taupe">{s.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-title" className="bg-espresso py-24 text-ivory md:py-36">
        <div className="container-luxe">
          <p className="label mb-5 text-gold">How rental works</p>
          <SplitReveal as="h2" id="how-title" className="text-h2 font-light">
            Three simple <em className="text-gold">steps</em>
          </SplitReveal>
          <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
            {tuxSteps.map((s) => (
              <li key={s.n} className="border-t border-gold/40 pt-8">
                <span className="font-display text-7xl font-light text-gold">{s.n}</span>
                <h3 className="mt-4 font-display text-3xl font-light">{s.title}</h3>
                <p className="mt-3 text-ivory/75">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-20 grid gap-10 border-t border-ivory/10 pt-12 md:grid-cols-2">
            <ul className="space-y-3">
              {tuxNotes.map((n) => (
                <li key={n} className="flex gap-4">
                  <span className="mt-[0.75em] h-px w-5 shrink-0 bg-gold" aria-hidden="true" />
                  {n}
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-start gap-5 md:items-end">
              <Button href="/appointment?type=tuxedo" variant="light">
                Book a Tux Fitting
              </Button>
              <p className="text-xs text-ivory/55 md:text-right">
                Wolsfelt&rsquo;s isn&rsquo;t responsible for outside measurement errors, weight changes or incorrect requested sizes. Special freight charges may apply. Rental payments are non-refundable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Visit id="tux-visit" />
    </>
  );
}
