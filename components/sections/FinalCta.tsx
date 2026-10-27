import ImageReveal from "@/components/animation/ImageReveal";
import SplitReveal from "@/components/animation/SplitReveal";
import Button from "@/components/ui/Button";
import { Stars } from "@/components/ui/Icons";
import { business, img } from "@/lib/data";

export default function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="relative flex min-h-[92svh] items-end overflow-hidden text-ivory">
      <ImageReveal src={img.finalCta} alt="A bride walking hand in hand with her groom through golden grass at sunset" className="!absolute inset-0" sizes="100vw" parallax={10} />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/30 to-espresso/10" aria-hidden="true" />
      <div className="container-luxe relative pb-16 md:pb-24">
        <p className="label mb-6 text-gold">Tuesday – Saturday · Aurora, IL</p>
        <SplitReveal as="h2" id="final-title" className="text-display font-light">
          Your gown is <em className="text-gold">waiting</em>.
        </SplitReveal>
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <Button href="/appointment" variant="light">
            Book Your Appointment
          </Button>
          <a href={business.phoneHref} className="label link-underline">
            or call {business.phone}
          </a>
        </div>
        <p className="mt-8 flex items-center gap-4 text-sm text-ivory/80">
          <Stars /> Trusted by brides since 1973
        </p>
      </div>
    </section>
  );
}
