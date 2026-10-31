import { awards } from "@/lib/data";

/** Monochrome gold typographic badges (swap for official badge artwork if licensed). */
export default function Awards() {
  return (
    <section aria-label="Awards and recognition" className="border-y border-gold/40 bg-pearl">
      <ul className="container-luxe grid grid-cols-2 lg:grid-cols-4">
        {awards.map((a, i) => (
          <li key={a.title} className={`flex flex-col items-center justify-center gap-3 px-3 py-8 text-center text-gold-ink sm:flex-row sm:gap-5 sm:px-4 sm:py-10 sm:text-left md:py-14 ${i % 2 === 0 ? "border-r border-gold/30" : ""} ${i < 2 ? "border-b border-gold/30 lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}>
            <svg viewBox="0 0 64 64" className="h-11 w-11 shrink-0 text-gold sm:h-14 sm:w-14 md:h-16 md:w-16" aria-hidden="true" fill="none" stroke="currentColor">
              <circle cx="32" cy="32" r="30" strokeWidth="0.75" />
              <circle cx="32" cy="32" r="25" strokeWidth="0.5" strokeDasharray="1 2.5" />
              <path d="M32 18l3.6 8 8.4.6-6.4 5.4 2 8.4-7.6-4.6-7.6 4.6 2-8.4-6.4-5.4 8.4-.6L32 18Z" strokeWidth="0.75" />
              <path d="M18 46h28" strokeWidth="0.5" />
            </svg>
            <div>
              <p className="label text-[0.5625rem]">{a.top}</p>
              <p className="mt-1 font-display text-lg leading-tight text-espresso sm:text-xl md:text-2xl">{a.title}</p>
              <p className="mt-0.5 text-xs text-taupe">{a.sub}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
