import SplitReveal from "@/components/animation/SplitReveal";
import Button from "@/components/ui/Button";
import HoursTable, { OpenNow } from "@/components/ui/HoursStatus";
import { business } from "@/lib/data";

export default function Visit({ id = "visit" }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="on-dark relative bg-espresso py-24 text-ivory md:py-36">
      <div className="container-luxe grid grid-cols-12 gap-y-14 md:gap-x-12">
        <div className="col-span-12 lg:col-span-5">
          <p className="label mb-6 text-gold">Visit the boutique</p>
          <SplitReveal as="h2" id={`${id}-title`} className="text-[clamp(2.75rem,6vw,5.5rem)] font-light leading-[0.95]">
            Come <em className="text-gold">see us</em> in Aurora
          </SplitReveal>

          <OpenNow className="mt-10 text-ivory" />

          <address className="mt-8 not-italic">
            <p className="font-display text-2xl leading-snug md:text-3xl">
              {business.address.street}
              <br />
              {business.address.city}, {business.address.regionName} {business.address.postal}
            </p>
            <a href={business.phoneHref} className="mt-4 inline-block font-display text-2xl text-gold link-underline md:text-3xl">
              {business.phone}
            </a>
          </address>
          <p className="mt-4 text-sm text-ivory/65">Free parking on site · Appointments recommended · Accessible fitting rooms on the main floor</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={business.directionsUrl} external variant="light" cursor="Go">
              Get Directions
            </Button>
            <Button href={business.phoneHref} variant="ghost" cursor="Call" magnetic={false} arrow={false}>
              Call the Boutique
            </Button>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-3 lg:col-start-7">
          <h3 className="label mb-4 text-gold">Hours</h3>
          <HoursTable dark />
          <div className="mt-8">
            <Button href="/appointment" variant="light">
              Book Appointment
            </Button>
          </div>
        </div>

        <div className="relative col-span-12 min-h-[22rem] md:col-span-6 lg:col-span-3">
          <iframe
            title="Map showing Wolsfelt's Bridal at 1025 South Lincoln Avenue, Aurora"
            src={business.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_sepia(0.35)_contrast(0.95)_brightness(0.92)]"
          />
          <div className="pointer-events-none absolute -inset-2 border border-gold/40" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
