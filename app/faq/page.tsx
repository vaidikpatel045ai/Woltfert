import type { Metadata } from "next";
import FinalCta from "@/components/sections/FinalCta";
import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { business, faqs } from "@/lib/data";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQ — Appointments, Sizes, Pricing & Alterations",
  description:
    "How long appointments last, how many guests to bring, gown prices and sizes, alterations and delivery times at Wolsfelt's Bridal in Aurora, IL.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }} />
      <PageHeader
        eyebrow="Before you visit"
        title={
          <>
            Questions, <em className="text-gold-deep">answered</em>
          </>
        }
        intro={<p>Everything brides ask before their first appointment. Anything else, our stylists are a phone call away.</p>}
      />
      <section aria-label="Frequently asked questions" className="container-luxe grid grid-cols-12 gap-y-12 pb-24 md:pb-36">
        <div className="col-span-12 lg:col-span-8">
          <Accordion items={faqs} />
        </div>
        <aside className="col-span-12 lg:col-span-3 lg:col-start-10">
          <div className="border border-gold/50 p-8 lg:sticky lg:top-32">
            <p className="font-display text-3xl font-light leading-tight">
              Still <em className="text-gold-deep">wondering?</em>
            </p>
            <p className="mt-4 text-sm text-taupe">Call us Tuesday through Saturday.</p>
            <a href={business.phoneHref} className="mt-4 block font-display text-2xl link-underline">
              {business.phone}
            </a>
            <div className="mt-8">
              <Button href="/appointment" className="w-full">
                Book
              </Button>
            </div>
          </div>
        </aside>
      </section>
      <FinalCta />
    </>
  );
}
