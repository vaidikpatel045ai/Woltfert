import type { ReactNode } from "react";
import ImageReveal from "@/components/animation/ImageReveal";
import SplitReveal from "@/components/animation/SplitReveal";
import Button from "./Button";
import { Stars } from "./Icons";

/** Editorial header shared by inner pages: big serif title, intro, CTA + trust line, optional image. */
export default function PageHeader({
  eyebrow,
  title,
  intro,
  image,
  imageAlt = "",
  cta = { href: "/appointment", label: "Book Your Appointment" },
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  imageAlt?: string;
  cta?: { href: string; label: string } | null;
}) {
  return (
    <header className="container-luxe grid grid-cols-12 items-end gap-y-12 pb-16 pt-12 md:pb-24 md:pt-20">
      <div className={image ? "col-span-12 lg:col-span-7" : "col-span-12 lg:col-span-10"}>
        <p className="label mb-6 flex items-center gap-4 text-gold-ink">
          <span className="h-px w-10 bg-gold" aria-hidden="true" />
          {eyebrow}
        </p>
        <SplitReveal as="h1" className="text-[clamp(3.25rem,9vw,8rem)] font-light leading-[0.9]">
          {title}
        </SplitReveal>
        {intro && <div className="mt-8 max-w-xl text-taupe md:text-lg">{intro}</div>}
        {cta && (
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Button href={cta.href}>{cta.label}</Button>
            <span className="flex items-center gap-3 text-sm text-taupe">
              <Stars /> Since 1973 · The Knot Hall of Fame
            </span>
          </div>
        )}
      </div>
      {image && (
        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <ImageReveal src={image} alt={imageAlt} priority className="aspect-[4/5]" sizes="(min-width: 1024px) 33vw, 100vw" />
        </div>
      )}
    </header>
  );
}
