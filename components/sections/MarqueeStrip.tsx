import Marquee from "@/components/ui/Marquee";
import { marquee } from "@/lib/data";

export default function MarqueeStrip() {
  return (
    <section aria-label="Highlights" className="border-y border-gold/40 bg-ivory py-6 md:py-8">
      <Marquee
        items={marquee}
        duration={45}
        separator="✦"
        itemClassName="font-display text-3xl font-light italic text-gold-deep md:text-5xl"
      />
    </section>
  );
}
