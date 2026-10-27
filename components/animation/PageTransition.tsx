"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ComponentProps, type MouseEvent, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

type Ctx = { navigate: (href: string) => void };
const TransitionCtx = createContext<Ctx>({ navigate: () => {} });

/**
 * Gold curtain wipe between routes. The curtain rises to cover the page,
 * we navigate, then it continues upward to reveal the new route.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const covering = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      if (prefersReducedMotion() || !curtain.current) {
        router.push(href);
        return;
      }
      covering.current = true;
      gsap.killTweensOf(curtain.current);
      gsap.fromTo(
        curtain.current,
        { yPercent: 100, visibility: "visible" },
        {
          yPercent: 0,
          duration: 0.75,
          ease: "expo.inOut",
          onComplete: () => router.push(href),
        },
      );
    },
    [router],
  );

  useEffect(() => {
    if (!covering.current || !curtain.current) return;
    covering.current = false;
    gsap.to(curtain.current, {
      yPercent: -100,
      duration: 0.9,
      delay: 0.1,
      ease: "expo.inOut",
      onComplete: () => gsap.set(curtain.current, { visibility: "hidden" }),
    });
  }, [pathname]);

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}
      <div
        ref={curtain}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-[150] flex items-center justify-center bg-gold"
        style={{ transform: "translateY(100%)" }}
      >
        <span className="font-display text-5xl italic text-espresso/80">W</span>
      </div>
    </TransitionCtx.Provider>
  );
}

export const usePageTransition = () => useContext(TransitionCtx);

type LinkProps = ComponentProps<typeof Link> & { href: string };

/** next/link that plays the curtain for internal route changes. */
export function TransitionLink({ href, onClick, children, ...rest }: LinkProps) {
  const { navigate } = usePageTransition();
  const pathname = usePathname();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (!href.startsWith("/") || href.startsWith("//")) return;
    const [path] = href.split(/[?#]/);
    if (path === pathname) return; // same page (or hash) → let the browser handle it
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
