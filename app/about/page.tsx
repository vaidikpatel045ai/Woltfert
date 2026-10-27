import type { Metadata } from "next";
import ImageReveal from "@/components/animation/ImageReveal";
import SplitReveal from "@/components/animation/SplitReveal";
import Awards from "@/components/sections/Awards";
import FinalCta from "@/components/sections/FinalCta";
import PageHeader from "@/components/ui/PageHeader";
import Timeline from "@/components/ui/Timeline";
import { hosts, img } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Story — A Family Bridal Salon Since 1973",
  description:
    "Founded in 1973 by Don and Donna Wolsfelt and run today by their daughters Vicki and Dawn, Wolsfelt's has dressed three generations of brides in the Chicago suburbs.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title={
          <>
            Since <em className="text-gold-deep">1973</em>
          </>
        }
        intro={
          <p>
            What began as a flourishing floral business became a full-service bridal salon — and, five decades later, a 10,000-square-foot destination on three acres in Aurora, where
            the daughters of our first brides now bring daughters of their own.
          </p>
        }
        image={img.trust}
        imageAlt="Black and white photograph of a couple beneath a sweeping veil"
      />

      <section aria-labelledby="history-title" className="container-luxe py-16 md:py-28">
        <SplitReveal as="h2" id="history-title" className="mb-20 text-center text-h2 font-light">
          Five decades, <em className="text-gold-deep">one family</em>
        </SplitReveal>
        <Timeline />
      </section>

      <section id="hosts" aria-labelledby="hosts-title" className="scroll-mt-28 bg-pearl py-24 md:py-36">
        <div className="container-luxe grid grid-cols-12 gap-y-14 md:gap-x-12">
          <div className="col-span-12 md:col-span-5">
            <ImageReveal src={img.hands} alt="Hands joined in soft evening light" className="aspect-[4/5]" sizes="(min-width: 768px) 40vw, 100vw" parallax={6} />
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <p className="label mb-6 text-gold-ink">Meet your hosts</p>
            <SplitReveal as="h2" id="hosts-title" className="text-h2 font-light">
              Vicki &amp; <em className="text-gold-deep">Dawn</em>
            </SplitReveal>
            <p className="mt-8 text-taupe md:text-lg">
              Part of the salon since the day it opened, the second generation of Wolsfelts now own and operate the business their parents built. Their knowledge — and their
              reputation for service — far exceed industry standards.
            </p>
            <ul className="mt-12 space-y-10 border-t border-gold/40 pt-10">
              {hosts.map((h) => (
                <li key={h.name}>
                  <h3 className="font-display text-3xl font-light">{h.name}</h3>
                  <p className="label mt-1 text-gold-ink">{h.role}</p>
                  <p className="mt-3 text-taupe">{h.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Awards />
      <FinalCta />
    </>
  );
}
