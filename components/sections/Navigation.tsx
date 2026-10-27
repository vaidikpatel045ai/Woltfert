"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "@/components/animation/PageTransition";
import Magnetic from "@/components/animation/Magnetic";
import { getLenis } from "@/components/animation/SmoothScroll";
import Logo from "@/components/ui/Logo";
import { OpenNow } from "@/components/ui/HoursStatus";
import { business, fullAddress, navLeft, navMobileExtra, navRight } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";

/**
 * Centered logo, links either side, "Book Appointment" always visible.
 * Becomes a compact frosted bar after scrolling. Mobile: full-screen menu.
 */
export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .set(menu.current, { visibility: "visible" })
        .fromTo(menu.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 })
        .from(".menu-link", { yPercent: 110, duration: 1, stagger: 0.06, ease: "expo.out" }, 0.35)
        .from(".menu-meta", { opacity: 0, y: 12, duration: 0.6, stagger: 0.05, ease: "power2.out" }, 0.6);
    },
    { scope: menu },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      getLenis()?.stop();
      if (prefersReducedMotion()) t.progress(1);
      else t.timeScale(1).play();
      const first = menu.current?.querySelector<HTMLElement>("a");
      setTimeout(() => first?.focus(), 400);
    } else {
      getLenis()?.start();
      if (t.progress() > 0) t.timeScale(1.6).reverse();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      // Keep focus within the dialog
      if (e.key === "Tab" && menu.current) {
        const f = menu.current.querySelectorAll<HTMLElement>("a, button");
        const first = f[0];
        const last = toggle.current!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkCls = (href: string) =>
    cn("label link-underline py-1 transition-colors hover:text-gold-ink", pathname.startsWith(href) && "text-gold-ink");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[60] transition-[background-color,border-color,padding] duration-700 ease-[var(--ease-luxe)]",
          scrolled || open ? "border-b border-gold/25 bg-ivory/85 backdrop-blur-md" : "border-b border-transparent bg-transparent",
          open && "md:bg-ivory",
        )}
      >
        <div className={cn("container-luxe grid grid-cols-[1fr_auto_1fr] items-center transition-[padding] duration-700", scrolled ? "py-3" : "py-5 md:py-6")}>
          <nav aria-label="Collections" className="hidden items-center gap-8 lg:flex">
            {navLeft.map((l) => (
              <TransitionLink key={l.href} href={l.href} className={linkCls(l.href)}>
                {l.label}
              </TransitionLink>
            ))}
          </nav>
          <button
            ref={toggle}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="relative z-[65] flex items-center gap-3 justify-self-start lg:hidden"
          >
            <span className="flex w-6 flex-col gap-[5px]" aria-hidden="true">
              <span className={cn("h-px w-full bg-current transition-transform duration-500", open && "translate-y-[3px] rotate-45")} />
              <span className={cn("h-px w-full bg-current transition-transform duration-500", open && "-translate-y-[3px] -rotate-45")} />
            </span>
            <span className="label hidden xs:inline">{open ? "Close" : "Menu"}</span>
          </button>

          <TransitionLink href="/" aria-label="Wolsfelt's Bridal & Tuxedos — home" className="justify-self-center">
            <Logo compact={scrolled} />
          </TransitionLink>

          <div className="flex items-center justify-end gap-8">
            <nav aria-label="About" className="hidden items-center gap-8 lg:flex">
              {navRight.map((l) => (
                <TransitionLink key={l.href} href={l.href} className={linkCls(l.href)}>
                  {l.label}
                </TransitionLink>
              ))}
            </nav>
            <a href={business.phoneHref} className="label hidden md:inline lg:hidden xl:inline link-underline">
              {business.phone}
            </a>
            <Magnetic className="hidden md:inline-block">
              <TransitionLink
                href="/appointment"
                data-cursor="Book"
                className="label inline-flex items-center bg-espresso px-5 py-3 text-ivory transition-colors duration-500 hover:bg-gold hover:text-espresso"
              >
                Book Appointment
              </TransitionLink>
            </Magnetic>
            <a href={business.phoneHref} className="label md:hidden" aria-label={`Call ${business.phone}`}>
              Call
            </a>
          </div>
        </div>
      </header>

      {/* Mobile / tablet overlay menu */}
      <div
        ref={menu}
        id="site-menu"
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        className="invisible fixed inset-0 z-[58] flex flex-col overflow-y-auto bg-espresso pt-28 text-ivory lg:hidden"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
        {...(!open ? { inert: true } : {})}
      >
        <nav aria-label="Main" className="container-luxe flex-1">
          <ul className="space-y-1">
            {[...navLeft, ...navRight, ...navMobileExtra].map((l, i) => (
              <li key={l.href} className="overflow-hidden">
                <TransitionLink
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="menu-link flex items-baseline gap-4 font-display text-[clamp(2.75rem,11vw,5rem)] font-light leading-[1.05] hover:text-gold"
                >
                  <span className="label text-gold">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="container-luxe mt-10 space-y-5 pb-28">
          <div className="menu-meta hairline text-gold" />
          <TransitionLink href="/appointment" onClick={() => setOpen(false)} className="menu-meta label flex justify-center bg-gold px-6 py-4 text-espresso">
            Book Your Appointment
          </TransitionLink>
          <OpenNow className="menu-meta text-ivory/80" />
          <p className="menu-meta text-sm text-ivory/70">{fullAddress}</p>
          <a href={business.phoneHref} className="menu-meta block font-display text-2xl">
            {business.phone}
          </a>
        </div>
      </div>
    </>
  );
}
