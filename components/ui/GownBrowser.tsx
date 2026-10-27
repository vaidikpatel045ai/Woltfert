"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "./Button";
import { getLenis } from "@/components/animation/SmoothScroll";
import { designerName, necklines, priceRanges, silhouettes, type Gown } from "@/lib/data";
import { gsap } from "@/lib/gsap";
import { cn, formatPrice, prefersReducedMotion } from "@/lib/utils";

type Filters = { silhouette: string; neckline: string; price: string };
const empty: Filters = { silhouette: "", neckline: "", price: "" };

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  const id = `f-${label.toLowerCase()}`;
  return (
    <div className="flex min-w-[10rem] flex-1 flex-col gap-2">
      <label htmlFor={id} className="label text-gold-ink">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none border-b border-espresso/25 bg-transparent bg-[length:10px] bg-[right_0.25rem_center] bg-no-repeat py-2 pr-8 font-display text-xl focus:border-gold"
        style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%239c7c45' fill='none'/></svg>\")" }}
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function GownBrowser({ gowns, showDesigner }: { gowns: Gown[]; showDesigner: boolean }) {
  const [f, setF] = useState<Filters>(empty);
  const [open, setOpen] = useState<Gown | null>(null);
  const grid = useRef<HTMLUListElement>(null);

  const list = useMemo(() => {
    const range = priceRanges.find((r) => r.id === f.price);
    return gowns.filter(
      (g) =>
        (!f.silhouette || g.silhouette === f.silhouette) &&
        (!f.neckline || g.neckline === f.neckline) &&
        (!range || (g.price >= range.min && g.price <= range.max)),
    );
  }, [gowns, f]);

  useEffect(() => {
    if (!grid.current || prefersReducedMotion()) return;
    gsap.fromTo(grid.current.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.05, ease: "expo.out" });
  }, [list]);

  const available = (key: "silhouette" | "neckline") => [...new Set(gowns.map((g) => g[key]))];

  return (
    <>
      <div className="flex flex-wrap items-end gap-6 border-y border-gold/40 py-6 md:gap-10">
        <Select label="Silhouette" value={f.silhouette} onChange={(v) => setF({ ...f, silhouette: v })} options={silhouettes.filter((s) => available("silhouette").includes(s)).map((s) => ({ value: s, label: s }))} />
        <Select label="Neckline" value={f.neckline} onChange={(v) => setF({ ...f, neckline: v })} options={necklines.filter((s) => available("neckline").includes(s)).map((s) => ({ value: s, label: s }))} />
        <Select label="Price" value={f.price} onChange={(v) => setF({ ...f, price: v })} options={priceRanges.map((r) => ({ value: r.id, label: r.label }))} />
        <div className="flex items-center gap-6 pb-2">
          <p className="label text-taupe" aria-live="polite">
            {list.length} {list.length === 1 ? "style" : "styles"}
          </p>
          {(f.silhouette || f.neckline || f.price) && (
            <button onClick={() => setF(empty)} className="label link-underline text-espresso">
              Clear
            </button>
          )}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl italic">Nothing matches just yet.</p>
          <p className="mt-3 text-taupe">Our stylists can pull similar gowns in the salon — many styles aren&rsquo;t online.</p>
          <div className="mt-8">
            <Button href="/appointment">Book a styling appointment</Button>
          </div>
        </div>
      ) : (
        <ul ref={grid} className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
          {list.map((g, i) => (
            <li key={g.id} className={i % 4 === 1 || i % 4 === 3 ? "lg:mt-16" : ""}>
              <button onClick={() => setOpen(g)} className="group block w-full text-left" data-cursor="View" aria-haspopup="dialog">
                <div className="relative aspect-[3/4] overflow-hidden bg-pearl">
                  <Image src={g.images[0]} alt={`${g.name} — ${g.silhouette.toLowerCase()} gown with ${g.neckline.toLowerCase()} neckline`} fill sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-105" />
                  {g.images[1] && <Image src={g.images[1]} alt="" fill sizes="(min-width: 1024px) 24vw, 48vw" className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />}
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <p className="font-display text-2xl">{g.name}</p>
                  <p className="text-sm tabular-nums text-taupe">{formatPrice(g.price)}</p>
                </div>
                <p className="label mt-1 text-[0.625rem] text-taupe">
                  {showDesigner ? `${designerName(g.designer)} · ` : ""}
                  {g.silhouette}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && <GownModal gown={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function GownModal({ gown, onClose }: { gown: Gown; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [img, setImg] = useState(0);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const d = ref.current!;
    if (!d.open) d.showModal();
    getLenis()?.stop();
    if (!prefersReducedMotion()) gsap.fromTo(d, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" });
    const close = () => onCloseRef.current();
    d.addEventListener("close", close);
    return () => {
      d.removeEventListener("close", close);
      getLenis()?.start();
    };
  }, []);

  const href = `/appointment?type=${gown.category === "bridal" ? "bridal" : gown.category === "bridesmaid" ? "bridesmaid" : gown.category === "mothers" ? "mothers" : "bridal"}&gown=${gown.id}`;

  return (
    <dialog
      ref={ref}
      aria-labelledby="gown-title"
      data-lenis-prevent
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-auto max-h-[92svh] w-[min(68rem,94vw)] overflow-y-auto bg-ivory p-0 text-espresso backdrop:bg-espresso/70 backdrop:backdrop-blur-sm"
    >
      <div className="grid md:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="relative aspect-[4/5] bg-pearl">
            <Image src={gown.images[img]} alt={`${gown.name}, view ${img + 1}`} fill sizes="(min-width: 768px) 50vw, 94vw" className="object-cover" />
          </div>
          <div className="flex gap-2 p-3" role="group" aria-label="Gallery">
            {gown.images.map((src, i) => (
              <button key={src + i} onClick={() => setImg(i)} aria-label={`View image ${i + 1}`} aria-pressed={i === img} className={cn("relative h-20 w-16 overflow-hidden border", i === img ? "border-gold" : "border-transparent opacity-70")}>
                <Image src={src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col p-8 md:p-12">
          <div className="flex items-start justify-between gap-4">
            <p className="label text-gold-ink">{designerName(gown.designer)}</p>
            <button onClick={() => ref.current?.close()} className="label -mr-2 -mt-2 p-2 hover:text-gold-ink" aria-label="Close">
              Close ✕
            </button>
          </div>
          <h2 id="gown-title" className="mt-4 font-display text-6xl font-light leading-none">
            {gown.name}
          </h2>
          <p className="mt-4 font-display text-2xl text-gold-deep">{formatPrice(gown.price)}</p>
          <p className="mt-6 text-taupe">{gown.description}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-gold/40 pt-6 text-sm">
            <div>
              <dt className="label text-[0.625rem] text-taupe">Silhouette</dt>
              <dd className="mt-1 font-display text-xl">{gown.silhouette}</dd>
            </div>
            <div>
              <dt className="label text-[0.625rem] text-taupe">Neckline</dt>
              <dd className="mt-1 font-display text-xl">{gown.neckline}</dd>
            </div>
          </dl>
          <div className="mt-auto pt-10">
            <Button href={href} className="w-full">
              Book to try this gown
            </Button>
            <p className="mt-4 text-center text-xs text-taupe">90-minute appointment · personal stylist · champagne service</p>
          </div>
        </div>
      </div>
    </dialog>
  );
}
