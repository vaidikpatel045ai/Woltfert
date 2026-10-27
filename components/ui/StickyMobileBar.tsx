import { TransitionLink } from "@/components/animation/PageTransition";
import { business } from "@/lib/data";
import { IconPhone, IconPin } from "./Icons";

/** Mobile-only bottom bar: Call · Book · Directions. Always visible. */
export default function StickyMobileBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-[80] grid grid-cols-[1fr_1.6fr_1fr] border-t border-gold/40 bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <a href={business.phoneHref} className="flex flex-col items-center justify-center gap-1 py-3 label text-[0.625rem]">
        <IconPhone className="h-4 w-4 text-gold-ink" />
        Call
      </a>
      <TransitionLink href="/appointment" className="flex items-center justify-center bg-espresso label text-ivory">
        Book Appointment
      </TransitionLink>
      <a
        href={business.directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-1 py-3 label text-[0.625rem]"
      >
        <IconPin className="h-4 w-4 text-gold-ink" />
        Directions
      </a>
    </nav>
  );
}
