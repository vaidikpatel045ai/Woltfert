import type { Metadata } from "next";
import SplitReveal from "@/components/animation/SplitReveal";
import FinalCta from "@/components/sections/FinalCta";
import Premier from "@/components/sections/Premier";
import { ServiceGlyph } from "@/components/ui/Icons";
import PageHeader from "@/components/ui/PageHeader";
import { img, packages, services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Bridal Services — Alterations, Storage & Heirlooming",
  description:
    "On-site bridal alterations, hand-pressed gowns, free gown storage, heirlooming, curbside pickup and tuxedo rental at Wolsfelt's Bridal in Aurora, IL.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            Taken care of, <em className="text-gold-deep">start to finish</em>
          </>
        }
        intro={<p>Everything your gown needs happens under our roof — measured, altered, pressed and stored by the people who helped you choose it.</p>}
        image={img.convenience}
        imageAlt="An ivory ball gown laid across a bed"
      />

      <section aria-label="Services" className="container-luxe pb-24 md:pb-36">
        <ul className="divide-y divide-gold/40 border-y border-gold/40">
          {services.map((s, i) => (
            <li key={s.title} className="grid grid-cols-12 gap-y-4 py-10 md:py-14">
              <span className="label col-span-2 text-gold-ink md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <ServiceGlyph name={s.icon} className="col-span-10 h-12 w-12 text-gold md:col-span-1" />
              <h2 className="col-span-12 font-display text-4xl font-light md:col-span-4 md:col-start-4">{s.title}</h2>
              <div className="col-span-12 text-taupe md:col-span-5">
                <p className="md:text-lg">{s.body}</p>
                {s.detail && <p className="mt-3 text-sm">{s.detail}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Premier />

      <section id="packages" aria-labelledby="pk-title" className="container-luxe py-24 md:py-36">
        <SplitReveal as="h2" id="pk-title" className="text-h2 font-light">
          Packages &amp; <em className="text-gold-deep">savings</em>
        </SplitReveal>
        <ul className="mt-14 grid gap-px border border-gold/40 bg-gold/40 sm:grid-cols-2">
          {packages.map((p) => (
            <li key={p.title} className="bg-ivory p-8 md:p-12">
              <h3 className="font-display text-3xl font-light">{p.title}</h3>
              <p className="mt-3 text-taupe">{p.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-taupe">Call (630) 896-7166 for package details and availability.</p>
      </section>

      <FinalCta />
    </>
  );
}
