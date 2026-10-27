import { cn } from "@/lib/utils";

/** Typographic wordmark — swap for the boutique's vector logo if preferred. */
export default function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex flex-col items-center leading-none", className)}>
      <span className="font-display text-[1.75rem] font-normal tracking-[0.02em] md:text-[2.1rem]">
        Wolsfelt<span className="italic text-gold-deep">&rsquo;</span>s
      </span>
      {!compact && <span className="label mt-1.5 text-[0.5625rem] tracking-[0.35em] opacity-70">Bridal &amp; Tuxedos · 1973</span>}
    </span>
  );
}
