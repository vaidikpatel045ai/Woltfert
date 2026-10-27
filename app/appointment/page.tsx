import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import AppointmentForm from "@/components/ui/AppointmentForm";
import { OpenNow } from "@/components/ui/HoursStatus";
import { Stars } from "@/components/ui/Icons";
import { business, img } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book a Bridal Appointment",
  description:
    "Book your bridal, Premier, bridesmaid, mothers or tuxedo appointment at Wolsfelt's Bridal in Aurora, IL. Private stylist, champagne service, up to four guests.",
  alternates: { canonical: "/appointment" },
};

export default function AppointmentPage() {
  return (
    <div className="grid lg:min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="on-dark relative overflow-hidden bg-espresso text-ivory">
        <div className="absolute inset-0 opacity-35" aria-hidden="true">
          <Image src={img.hero} alt="" fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/60 via-espresso/80 to-espresso" aria-hidden="true" />
        <div className="relative flex h-full flex-col px-[clamp(1rem,4vw,4rem)] py-14 lg:sticky lg:top-0 lg:max-h-screen lg:py-20">
          <p className="label text-gold">Reserve your visit</p>
          <h1 className="mt-6 text-[clamp(3rem,6vw,5.5rem)] font-light leading-[0.92]">
            Your <em className="text-gold">yes</em> begins here
          </h1>
          <ul className="mt-10 space-y-3 text-ivory/80">
            {["A private stylist for 90 minutes", "Up to four guests on the couch", "Champagne, of course", "Samples sizes 6 – 26"].map((x) => (
              <li key={x} className="flex gap-4">
                <span className="mt-[0.75em] h-px w-5 shrink-0 bg-gold" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
          <div className="mt-auto space-y-4 pt-12">
            <p className="flex items-center gap-3 text-sm">
              <Stars /> The Knot Hall of Fame · Since 1973
            </p>
            <OpenNow className="text-ivory/85" />
            <p className="text-sm text-ivory/70">
              Prefer to talk?{" "}
              <a href={business.phoneHref} className="text-gold link-underline">
                {business.phone}
              </a>
            </p>
          </div>
        </div>
      </aside>
      <section aria-label="Booking form" className="px-[clamp(1rem,4vw,4rem)] py-14 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <Suspense fallback={<p className="label text-taupe">Loading…</p>}>
            <AppointmentForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
