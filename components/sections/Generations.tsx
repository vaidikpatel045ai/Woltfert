import Counter from "@/components/animation/Counter";
import ImageReveal from "@/components/animation/ImageReveal";
import Parallax from "@/components/animation/Parallax";
import SplitReveal from "@/components/animation/SplitReveal";
import { TransitionLink } from "@/components/animation/PageTransition";
import Button from "@/components/ui/Button";
import { generations, img } from "@/lib/data";

export default function Generations() {
  return (
    <section aria-labelledby="gen-title" className="relative bg-pearl py-24 md:py-40">
      <div className="container-luxe grid grid-cols-12 gap-y-16 md:gap-x-12">
        {/* Overlapping image composition */}
        <div className="relative col-span-12 md:col-span-6 lg:col-span-5">
          <ImageReveal
            src={img.generationsMain}
            alt="A bride holding a bouquet of peach roses against an embellished bodice"
            className="aspect-[3/4] w-[82%]"
            sizes="(min-width: 768px) 40vw, 80vw"
            parallax={6}
          />
          <Parallax speed={0.35} className="absolute -bottom-10 right-0 w-[48%] md:-bottom-16">
            <div className="border-[10px] border-pearl">
              <ImageReveal src={img.generationsInset} alt="A bride's hands holding a bouquet beside her groom" className="aspect-[4/5]" sizes="25vw" from="top" />
            </div>
          </Parallax>
          <p className="label absolute left-0 top-full mt-4 hidden text-gold-ink md:block">Aurora, Illinois</p>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7 md:pt-12">
          <p className="label mb-8 flex items-center gap-4 text-gold-ink">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            {generations.eyebrow}
          </p>
          <SplitReveal as="h2" id="gen-title" className="text-h2 font-light">
            Three generations. <br />
            One <em className="text-gold-deep">family</em>.
          </SplitReveal>
          <div className="mt-10 max-w-lg space-y-5 text-taupe md:text-lg">
            {generations.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-10 gap-y-12 border-t border-gold/40 pt-10 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-12">
            {generations.stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="label order-2 mt-3 text-[0.625rem] text-taupe">{s.label}</dt>
                <dd className="order-1 font-display text-4xl font-light leading-none lg:text-5xl">
                  <Counter value={s.value} from={"from" in s ? s.from : 0} suffix={s.suffix} plain={"plain" in s} />
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 flex flex-wrap items-center gap-8">
            <Button href="/appointment">Book Your Appointment</Button>
            <TransitionLink href="/about#hosts" className="label link-underline text-espresso" data-cursor="Meet">
              Meet Your Hosts →
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
