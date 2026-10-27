"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

function Item({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const el = panel.current!;
    const next = !open;
    setOpen(next);
    if (prefersReducedMotion()) {
      el.style.height = next ? "auto" : "0px";
      return;
    }
    gsap.to(el, { height: next ? "auto" : 0, duration: 0.8, ease: "expo.out" });
  };

  return (
    <li className="border-b border-gold/40">
      <h3>
        <button
          id={`faq-q-${i}`}
          aria-expanded={open}
          aria-controls={`faq-a-${i}`}
          onClick={toggle}
          className="flex w-full items-center justify-between gap-6 py-7 text-left font-display text-2xl font-light transition-colors hover:text-gold-ink md:text-3xl"
        >
          {q}
          <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
            <span className="absolute left-0 top-1/2 h-px w-4 bg-gold" />
            <span className={`absolute left-0 top-1/2 h-px w-4 bg-gold transition-transform duration-500 ${open ? "rotate-0" : "rotate-90"}`} />
          </span>
        </button>
      </h3>
      <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} ref={panel} className="h-0 overflow-hidden" hidden={false} inert={!open}>
        <p className="max-w-2xl pb-8 text-taupe md:text-lg">{a}</p>
      </div>
    </li>
  );
}

export default function Accordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <ul className="border-t border-gold/40">
      {items.map((f, i) => (
        <Item key={f.q} q={f.q} a={f.a} i={i} />
      ))}
    </ul>
  );
}
