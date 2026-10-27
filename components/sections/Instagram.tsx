import Image from "next/image";
import SplitReveal from "@/components/animation/SplitReveal";
import { IconInstagram } from "@/components/ui/Icons";
import { business, instagram } from "@/lib/data";

export default function Instagram() {
  return (
    <section aria-labelledby="ig-title" className="py-24 md:py-36">
      <div className="container-luxe">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label mb-5 text-gold-ink">{business.social.hashtag}</p>
            <SplitReveal as="h2" id="ig-title" className="text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-none">
              Our <em className="text-gold-deep">brides</em>
            </SplitReveal>
          </div>
          <a href={business.social.instagram} target="_blank" rel="noopener noreferrer" className="label link-underline flex items-center gap-3 self-start md:self-end">
            <IconInstagram className="h-5 w-5 text-gold-ink" />
            Follow {business.social.instagramHandle}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-6">
          {instagram.map((p, i) => (
            <li key={p.image} className={i % 2 ? "lg:translate-y-10" : ""}>
              <a href={business.social.instagram} target="_blank" rel="noopener noreferrer" data-cursor="View" className="group relative block aspect-square overflow-hidden">
                <Image src={p.image} alt={p.alt} fill sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-110" />
                <span className="absolute inset-0 flex items-center justify-center bg-espresso/0 transition-colors duration-500 group-hover:bg-espresso/40" aria-hidden="true">
                  <IconInstagram className="h-7 w-7 text-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <span className="sr-only">View on Instagram (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
