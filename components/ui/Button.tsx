import type { ReactNode } from "react";
import { TransitionLink } from "@/components/animation/PageTransition";
import Magnetic from "@/components/animation/Magnetic";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "light" | "ghost";

const styles: Record<Variant, string> = {
  solid: "bg-espresso text-ivory hover:bg-gold hover:text-espresso",
  outline: "border border-espresso/30 text-espresso hover:border-gold hover:bg-gold/10",
  light: "bg-ivory text-espresso hover:bg-gold",
  ghost: "border border-ivory/40 text-ivory hover:border-gold hover:text-gold",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
  cursor?: string;
  external?: boolean;
  arrow?: boolean;
  "aria-label"?: string;
};

/** Pill-free, editorial button. Internal links use the page transition; magnetic by default. */
export default function Button({
  href,
  children,
  variant = "solid",
  className,
  magnetic = true,
  cursor = "Book",
  external,
  arrow = true,
  ...aria
}: Props) {
  const cls = cn(
    "group relative inline-flex items-center justify-center gap-3 overflow-hidden px-7 py-4 label transition-colors duration-500 ease-[var(--ease-luxe)]",
    styles[variant],
    className,
  );
  const inner = (
    <>
      <span className="relative">{children}</span>
      {arrow && (
        <svg width="18" height="8" viewBox="0 0 18 8" fill="none" aria-hidden="true" className="relative transition-transform duration-500 group-hover:translate-x-1">
          <path d="M0 4h17M13.5 0.5 17 4l-3.5 3.5" stroke="currentColor" strokeWidth="1" />
        </svg>
      )}
    </>
  );

  const isInternal = href.startsWith("/") && !external;
  const el = isInternal ? (
    <TransitionLink href={href} className={cls} data-cursor={cursor} {...aria}>
      {inner}
    </TransitionLink>
  ) : (
    <a
      href={href}
      className={cls}
      data-cursor={cursor}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...aria}
    >
      {inner}
    </a>
  );

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
