import SplitReveal from "@/components/animation/SplitReveal";
import Button from "@/components/ui/Button";
import { ServiceGlyph } from "@/components/ui/Icons";
import { services } from "@/lib/data";

export default function Services() {
  return (
    <section aria-labelledby="services-title" className="py-24 md:py-40">
      <div className="container-luxe">
        <div className="grid grid-cols-12 gap-y-8">
          <div className="col-span-12 md:col-span-5">
            <p className="label mb-6 text-gold-ink">Services</p>
            <SplitReveal as="h2" id="services-title" className="text-h2 font-light">
              Every detail, <em className="text-gold-deep">in-house</em>
            </SplitReveal>
          </div>
          <div className="col-span-12 flex flex-col justify-end gap-8 md:col-span-5 md:col-start-8">
            <p className="text-taupe md:text-lg">
              From the first fitting to the morning of your wedding, we take care of the gown — so you can enjoy everything else.
            </p>
            <div>
              <Button href="/services" variant="outline" cursor="View" magnetic={false}>
                All services
              </Button>
            </div>
          </div>
        </div>

        <ul className="mt-16 grid grid-cols-1 border-l border-t border-gold/40 sm:grid-cols-2 lg:grid-cols-4 md:mt-24">
          {services.map((s, i) => (
            <li key={s.title} className="group relative border-b border-r border-gold/40 p-8 transition-colors duration-700 hover:bg-pearl md:p-10">
              <span className="label absolute right-6 top-6 text-taupe/70">{String(i + 1).padStart(2, "0")}</span>
              <ServiceGlyph name={s.icon} className="h-12 w-12 text-gold transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:-translate-y-1" />
              <h3 className="mt-10 font-display text-3xl font-light">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-taupe">{s.body}</p>
            </li>
          ))}
          <li className="flex flex-col justify-between gap-8 border-b border-r border-gold/40 bg-espresso p-8 text-ivory md:p-10">
            <p className="font-display text-3xl font-light leading-tight">
              Ready when <em className="text-gold">you</em> are.
            </p>
            <div>
              <Button href="/appointment" variant="light">
                Book
              </Button>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
