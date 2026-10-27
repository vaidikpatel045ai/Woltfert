import type { SVGProps } from "react";
import type { ServiceIcon } from "@/lib/data";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconPhone = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2" />
  </svg>
);

export const IconPin = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const IconInstagram = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);

export const IconFacebook = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" />
  </svg>
);

export const IconYoutube = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="4" />
    <path d="m10 9 5 3-5 3V9Z" />
  </svg>
);

export const Star = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...p}>
    <path d="m12 2.8 2.7 6 6.5.6-4.9 4.3 1.5 6.4L12 16.8 6.2 20.1l1.5-6.4L2.8 9.4l6.5-.6L12 2.8Z" />
  </svg>
);

export function Stars({ className = "h-3.5 w-3.5", label = "Five stars" }: { className?: string; label?: string }) {
  return (
    <span className="inline-flex gap-1 text-gold" role="img" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={className} />
      ))}
    </span>
  );
}

/* ── Fine-line service icons ─────────────────────────────────────────── */
const serviceIcons: Record<ServiceIcon, React.ReactNode> = {
  needle: (
    <>
      <path d="M8 40 38 10" />
      <ellipse cx="40" cy="8" rx="3" ry="1.6" transform="rotate(-45 40 8)" />
      <path d="M38 10c-6 2-10 8-8 14s10 6 12 12-4 10-10 8" strokeDasharray="1.5 2.5" />
    </>
  ),
  iron: (
    <>
      <path d="M6 34h34c0-10-6-16-16-16H16" />
      <path d="M6 34c0-6 4-10 10-10h24" />
      <path d="M18 18v-6h16" />
      <path d="M10 40h30" strokeDasharray="1.5 2.5" />
    </>
  ),
  heirloom: (
    <>
      <rect x="7" y="18" width="34" height="22" />
      <path d="M7 18 24 8l17 10" />
      <path d="M24 8v32" />
      <path d="M18 26c2-3 4-3 6 0 2-3 4-3 6 0-1 4-6 7-6 7s-5-3-6-7Z" />
    </>
  ),
  hanger: (
    <>
      <path d="M24 12a3 3 0 1 1 3 3c-2 0-3 1-3 3v2" />
      <path d="M24 20 6 32h36L24 20Z" />
      <path d="M12 32v10h24V32" />
    </>
  ),
  car: (
    <>
      <path d="M6 30v-6l5-9h26l5 9v6" />
      <path d="M6 30h36v6H6z" />
      <circle cx="14" cy="38" r="3" />
      <circle cx="34" cy="38" r="3" />
      <path d="M11 24h26" />
    </>
  ),
  bowtie: (
    <>
      <path d="M8 16v16l12-5V21L8 16Z" />
      <path d="M40 16v16l-12-5V21l12-5Z" />
      <rect x="20" y="20" width="8" height="8" />
    </>
  ),
  parking: (
    <>
      <rect x="8" y="8" width="32" height="32" />
      <path d="M19 34V14h7a6 6 0 0 1 0 12h-7" />
    </>
  ),
};

export function ServiceGlyph({ name, className }: { name: ServiceIcon; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round">
      {serviceIcons[name]}
    </svg>
  );
}
