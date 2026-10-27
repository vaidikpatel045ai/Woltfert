import type { Metadata } from "next";
import Visit from "@/components/sections/Visit";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { business, fullAddress, img } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact & Directions",
  description: `Visit Wolsfelt's Bridal & Tuxedos at ${fullAddress}. Call ${business.phone}. Open Tuesday – Saturday with free parking.`,
  alternates: { canonical: "/contact" },
};

const cards = [
  { label: "Call", value: business.phone, href: business.phoneHref, cta: "Call the boutique", external: false },
  { label: "Visit", value: fullAddress, href: business.directionsUrl, cta: "Get directions", external: true },
  { label: "Write", value: business.email, href: `mailto:${business.email}`, cta: "Send an email", external: false },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            We&rsquo;d love to <em className="text-gold-deep">meet you</em>
          </>
        }
        intro={<p>Appointments are the best way to shop — your stylist will have the salon ready for you. For anything else, we&rsquo;re a call away.</p>}
        image={img.boutique}
        imageAlt="A bright, airy salon interior with sheer curtains"
      />
      <section aria-label="Ways to reach us" className="container-luxe pb-24 md:pb-32">
        <ul className="grid gap-px border border-gold/40 bg-gold/40 md:grid-cols-3">
          {cards.map((c) => (
            <li key={c.label} className="flex flex-col gap-6 bg-ivory p-8 md:p-12">
              <p className="label text-gold-ink">{c.label}</p>
              <p className="font-display text-3xl font-light leading-snug">{c.value}</p>
              <div className="mt-auto">
                <Button href={c.href} external={c.external} variant="outline" cursor={c.label} magnetic={false}>
                  {c.cta}
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-taupe">Fax {business.fax}</p>
      </section>
      <Visit id="contact-visit" />
    </>
  );
}
