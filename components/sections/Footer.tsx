import { TransitionLink } from "@/components/animation/PageTransition";
import { IconFacebook, IconInstagram, IconYoutube } from "@/components/ui/Icons";
import Newsletter from "@/components/ui/Newsletter";
import { business, categories, designers, fullAddress } from "@/lib/data";

const cols = [
  {
    title: "Shop",
    links: [
      ...categories.map((c) => ({ label: c.title, href: `/collections/${c.slug}` })),
      { label: "Tuxedos", href: "/tuxedos" },
    ],
  },
  {
    title: "Designers",
    links: designers.slice(0, 6).map((d) => ({ label: d.name, href: `/collections/${d.slug}` })),
  },
  {
    title: "The Boutique",
    links: [
      { label: "About & History", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Premier Appointment", href: "/appointment?type=premier" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Book Appointment", href: "/appointment" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-[#14100e] pt-20 text-ivory md:pt-28">
      <div className="container-luxe">
        <div className="grid grid-cols-12 gap-y-14 md:gap-x-10">
          <div className="col-span-12 lg:col-span-4">
            <p className="font-display text-5xl font-light leading-none md:text-6xl">
              Wolsfelt<em className="text-gold">&rsquo;</em>s
            </p>
            <p className="label mt-3 text-ivory/60">Bridal &amp; Tuxedos · Since 1973</p>
            <div className="mt-10 max-w-sm">
              <h2 className="label mb-4 text-gold">Trunk shows &amp; private events</h2>
              <Newsletter />
            </div>
          </div>
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title} className="col-span-6 md:col-span-4 lg:col-span-2">
              <h2 className="label mb-5 text-gold">{c.title}</h2>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <TransitionLink href={l.href} className="text-sm text-ivory/75 transition-colors hover:text-gold">
                      {l.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="col-span-6 md:col-span-4 lg:col-span-2">
            <h2 className="label mb-5 text-gold">Visit</h2>
            <address className="space-y-2.5 text-sm not-italic text-ivory/75">
              <p>{fullAddress}</p>
              <p>
                <a href={business.phoneHref} className="hover:text-gold">
                  {business.phone}
                </a>
              </p>
              <p>Fax {business.fax}</p>
            </address>
            <ul className="mt-6 flex gap-4">
              <li>
                <a href={business.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-ivory/75 hover:text-gold">
                  <IconInstagram className="h-5 w-5" />
                </a>
              </li>
              <li>
                <a href={business.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-ivory/75 hover:text-gold">
                  <IconFacebook className="h-5 w-5" />
                </a>
              </li>
              <li>
                <a href={business.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-ivory/75 hover:text-gold">
                  <IconYoutube className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-20 select-none overflow-hidden whitespace-nowrap text-center font-display text-[clamp(2.75rem,10vw,11rem)] font-light leading-[0.8] text-ivory/[0.06]" aria-hidden="true">
          Say <em>yes</em> since 1973
        </p>

        <div className="flex flex-col gap-4 border-t border-ivory/10 py-8 text-xs text-ivory/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {business.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a href={business.sister.prom} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                Wolsfelt&rsquo;s Prom
              </a>
            </li>
            <li>
              <a href={business.sister.quince} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                Quince Couture
              </a>
            </li>
            <li>
              <TransitionLink href="/privacy" className="hover:text-gold">
                Privacy
              </TransitionLink>
            </li>
            <li>
              <TransitionLink href="/terms" className="hover:text-gold">
                Terms
              </TransitionLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
