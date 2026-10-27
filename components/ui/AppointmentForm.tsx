"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import type { z } from "zod";
import { TransitionLink } from "@/components/animation/PageTransition";
import { scrollToTarget } from "@/components/animation/SmoothScroll";
import { appointmentSchema, slotsFor } from "@/lib/appointment";
import { appointmentTypes, budgets, business, designerName, designers, gowns, stylePrefs } from "@/lib/data";
import { gsap } from "@/lib/gsap";
import { downloadIcs, googleCalendarUrl } from "@/lib/ics";
import { cn, formatTime, prefersReducedMotion } from "@/lib/utils";

type In = z.input<typeof appointmentSchema>;
type Out = z.output<typeof appointmentSchema>;

const STEPS: { title: string; fields: FieldPath<In>[] }[] = [
  { title: "Appointment", fields: ["type"] },
  { title: "Date & Time", fields: ["date", "time"] },
  { title: "Your Wedding", fields: ["weddingDate", "budget", "styles", "guests"] },
  { title: "Your Details", fields: ["name", "email", "phone"] },
];

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const prettyDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
};

const field = "w-full border-b border-espresso/25 bg-transparent py-3 font-display text-2xl placeholder:text-taupe/50 focus:border-gold focus:outline-none";
const Err = ({ msg }: { msg?: string }) => (msg ? <p role="alert" className="mt-2 text-sm text-[#9b3b2f]">{msg}</p> : null);

export default function AppointmentForm() {
  const params = useSearchParams();
  const qpType = params.get("type");
  const gownId = params.get("gown") ?? "";
  const designer = params.get("designer");
  const gown = gowns.find((g) => g.id === gownId);

  const [step, setStep] = useState(0);
  const [done, setDone] = useState<Out | null>(null);
  const [serverError, setServerError] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<In, unknown, Out>({
    resolver: zodResolver(appointmentSchema),
    mode: "onTouched",
    defaultValues: {
      type: appointmentTypes.some((t) => t.id === qpType) ? (qpType as string) : "bridal",
      date: "",
      time: "",
      weddingDate: "",
      budget: "",
      styles: gown ? [gown.silhouette] : [],
      guests: 2,
      name: "",
      email: "",
      phone: "",
      notes: designer && designers.some((d) => d.slug === designer) ? `I'd love to try ${designerName(designer)}.` : "",
      gown: gownId,
      company: "",
    },
  });

  const type = watch("type");
  const date = watch("date");
  const t = appointmentTypes.find((x) => x.id === type) ?? appointmentTypes[0];
  const slots = useMemo(() => slotsFor(type, date), [type, date]);

  // Clear a date/time that no longer fits when the type changes
  useEffect(() => {
    if (date && !slotsFor(type, date).length) setValue("date", "");
    setValue("time", "");
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  const animateIn = () => {
    if (prefersReducedMotion() || !panel.current) return;
    gsap.fromTo(panel.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: "expo.out" });
  };

  const goTo = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => {
      animateIn();
      if (top.current) scrollToTarget(top.current);
      panel.current?.querySelector<HTMLElement>("legend, h2")?.focus();
    });
  };

  const next = async () => {
    const ok = await trigger(STEPS[step].fields);
    if (ok) goTo(step + 1);
  };

  const onSubmit = async (data: Out) => {
    setServerError("");
    try {
      const res = await fetch("/api/appointment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) {
        if (json.errors) {
          for (const [k, v] of Object.entries(json.errors as Record<string, string[]>)) setError(k as FieldPath<In>, { message: v[0] });
          const firstStep = STEPS.findIndex((s) => s.fields.some((f) => (json.errors as Record<string, unknown>)[f]));
          if (firstStep >= 0 && firstStep !== step) goTo(firstStep);
        } else setServerError("Something went wrong. Please call us at " + business.phone);
        return;
      }
      setDone(data);
      requestAnimationFrame(() => top.current && scrollToTarget(top.current));
    } catch {
      setServerError("We couldn't reach the boutique. Please try again or call " + business.phone);
    }
  };

  if (done) return <Success data={done} />;

  return (
    <div ref={top}>
      {/* Progress */}
      <ol className="mb-12 grid grid-cols-4 gap-3" aria-label="Booking progress">
        {STEPS.map((s, i) => (
          <li key={s.title} aria-current={i === step ? "step" : undefined}>
            <div className="h-px w-full bg-espresso/15">
              <div className="h-px origin-left bg-gold transition-transform duration-700 ease-[var(--ease-luxe)]" style={{ transform: `scaleX(${i <= step ? 1 : 0})` }} />
            </div>
            <p className={cn("label mt-3 text-[0.5625rem] md:text-[0.625rem]", i === step ? "text-gold-ink" : "text-taupe")}>
              <span className="font-display text-sm normal-case tracking-normal">0{i + 1}</span>
              <span className="ml-2 hidden sm:inline">{s.title}</span>
            </p>
          </li>
        ))}
      </ol>

      {gown && (
        <div className="mb-10 flex items-center justify-between gap-4 border border-gold/50 px-5 py-4">
          <p className="text-sm">
            <span className="label mr-3 text-gold-ink">Gown to try</span>
            <span className="font-display text-xl">
              {gown.name} · {designerName(gown.designer)}
            </span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Honeypot */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label>
            Company
            <input tabIndex={-1} autoComplete="off" {...register("company")} />
          </label>
        </div>

        <div ref={panel}>
          {step === 0 && (
            <fieldset>
              <legend tabIndex={-1} className="font-display text-4xl font-light md:text-5xl">
                What are we <em className="text-gold-deep">celebrating?</em>
              </legend>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {appointmentTypes.map((x) => (
                  <label key={x.id} className={cn("group relative cursor-pointer border p-6 transition-colors duration-500", type === x.id ? "border-gold bg-pearl" : "border-espresso/15 hover:border-gold/60")}>
                    <input type="radio" value={x.id} {...register("type")} className="sr-only" />
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-3xl">{x.title}</span>
                      <span className={cn("h-3 w-3 rotate-45 border border-gold transition-colors", type === x.id && "bg-gold")} aria-hidden="true" />
                    </span>
                    <span className="mt-2 block text-sm text-taupe">{x.body}</span>
                  </label>
                ))}
              </div>
              <Err msg={errors.type?.message} />
            </fieldset>
          )}

          {step === 1 && (
            <fieldset>
              <legend tabIndex={-1} className="font-display text-4xl font-light md:text-5xl">
                Choose a <em className="text-gold-deep">date</em>
              </legend>
              <p className="mt-3 text-sm text-taupe">
                {t.title} appointments are {t.minutes >= 60 ? `${t.minutes / 60} ${t.minutes === 60 ? "hour" : "hours"}` : `${t.minutes} minutes`}.
                {type === "premier" ? " Available Tuesday – Friday; book at least a week ahead." : " We're closed Sundays and Mondays."}
              </p>
              <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
                <Controller
                  control={control}
                  name="date"
                  render={({ field: f }) => <Calendar value={f.value} onChange={(v) => { f.onChange(v); setValue("time", ""); }} days={t.days as readonly number[]} minLead={type === "premier" ? 7 : 1} />}
                />
                <div>
                  <p className="label text-gold-ink">{date ? prettyDate(date) : "Select a date to see times"}</p>
                  {date && (
                    <div className="mt-5 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Available times">
                      {slots.map((s) => (
                        <label key={s} className="cursor-pointer">
                          <input type="radio" value={s} {...register("time")} className="peer sr-only" />
                          <span className="block border border-espresso/15 py-3 text-center text-sm tabular-nums transition-colors peer-checked:border-gold peer-checked:bg-espresso peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-gold hover:border-gold">
                            {formatTime(s)}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  <Err msg={errors.date?.message || errors.time?.message} />
                  <p className="mt-6 text-xs text-taupe">Times are confirmed by our team by phone or email within one business day.</p>
                </div>
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="space-y-10">
              <legend tabIndex={-1} className="font-display text-4xl font-light md:text-5xl">
                Tell us about the <em className="text-gold-deep">day</em>
              </legend>
              <div className="grid gap-10 sm:grid-cols-2">
                <div>
                  <label htmlFor="weddingDate" className="label text-gold-ink">
                    Wedding date <span className="normal-case tracking-normal text-taupe">(optional)</span>
                  </label>
                  <input id="weddingDate" type="date" {...register("weddingDate")} className={field} />
                </div>
                <div>
                  <label htmlFor="guests" className="label text-gold-ink">
                    Guests joining you
                  </label>
                  <Controller
                    control={control}
                    name="guests"
                    render={({ field: f }) => {
                      const n = Number(f.value ?? 0);
                      return (
                        <div className="flex items-center gap-6 border-b border-espresso/25 py-2">
                          <button type="button" onClick={() => f.onChange(Math.max(0, n - 1))} className="h-10 w-10 border border-espresso/20 hover:border-gold" aria-label="Fewer guests">
                            −
                          </button>
                          <output id="guests" aria-live="polite" className="w-10 text-center font-display text-3xl tabular-nums">
                            {n}
                          </output>
                          <button type="button" onClick={() => f.onChange(Math.min(t.maxGuests, n + 1))} className="h-10 w-10 border border-espresso/20 hover:border-gold" aria-label="More guests">
                            +
                          </button>
                          <span className="text-xs text-taupe">up to {t.maxGuests}</span>
                        </div>
                      );
                    }}
                  />
                  <Err msg={errors.guests?.message} />
                </div>
              </div>

              <div role="radiogroup" aria-labelledby="budget-l">
                <p id="budget-l" className="label text-gold-ink">
                  Budget
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {budgets.map((b) => (
                    <label key={b} className="cursor-pointer">
                      <input type="radio" value={b} {...register("budget")} className="peer sr-only" />
                      <span className="block border border-espresso/15 px-4 py-2.5 text-sm transition-colors peer-checked:border-gold peer-checked:bg-espresso peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-gold hover:border-gold">{b}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-xs text-taupe">Most of our gowns are $1,499 – $3,000; the sale collection starts at $999.</p>
              </div>

              <div role="group" aria-labelledby="style-l">
                <p id="style-l" className="label text-gold-ink">
                  Styles you love
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stylePrefs.map((s) => (
                    <label key={s} className="cursor-pointer">
                      <input type="checkbox" value={s} {...register("styles")} className="peer sr-only" />
                      <span className="block border border-espresso/15 px-4 py-2.5 text-sm transition-colors peer-checked:border-gold peer-checked:bg-pearl peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-gold hover:border-gold">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="space-y-8">
              <legend tabIndex={-1} className="font-display text-4xl font-light md:text-5xl">
                And finally, <em className="text-gold-deep">you</em>
              </legend>
              <div>
                <label htmlFor="name" className="label text-gold-ink">
                  Full name
                </label>
                <input id="name" autoComplete="name" {...register("name")} className={field} aria-invalid={!!errors.name} />
                <Err msg={errors.name?.message} />
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="label text-gold-ink">
                    Email
                  </label>
                  <input id="email" type="email" autoComplete="email" {...register("email")} className={field} aria-invalid={!!errors.email} />
                  <Err msg={errors.email?.message} />
                </div>
                <div>
                  <label htmlFor="phone" className="label text-gold-ink">
                    Phone
                  </label>
                  <input id="phone" type="tel" autoComplete="tel" {...register("phone")} className={field} aria-invalid={!!errors.phone} />
                  <Err msg={errors.phone?.message} />
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="label text-gold-ink">
                  Anything we should know? <span className="normal-case tracking-normal text-taupe">(optional)</span>
                </label>
                <textarea id="notes" rows={3} {...register("notes")} className={cn(field, "resize-none text-xl")} />
              </div>
            </fieldset>
          )}
        </div>

        {serverError && (
          <p role="alert" className="mt-8 border border-[#9b3b2f]/40 p-4 text-sm text-[#9b3b2f]">
            {serverError}
          </p>
        )}

        <div className="mt-14 flex items-center justify-between gap-4 border-t border-gold/40 pt-8">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className="label link-underline">
              ← Back
            </button>
          ) : (
            <a href={business.phoneHref} className="label link-underline text-taupe">
              Prefer to call?
            </a>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="label inline-flex items-center gap-3 bg-espresso px-8 py-4 text-ivory transition-colors hover:bg-gold hover:text-espresso">
              Continue →
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} data-cursor="Book" className="label inline-flex items-center gap-3 bg-espresso px-8 py-4 text-ivory transition-colors hover:bg-gold hover:text-espresso disabled:opacity-60">
              {isSubmitting ? "Sending…" : "Request appointment"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/* ── Calendar ───────────────────────────────────────────────────────────── */
function Calendar({ value, onChange, days, minLead }: { value: string; onChange: (v: string) => void; days: readonly number[]; minLead: number }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const first = new Date(today);
  first.setDate(first.getDate() + minLead);
  const last = new Date(today);
  last.setMonth(last.getMonth() + 9);

  const [view, setView] = useState(() => new Date(first.getFullYear(), first.getMonth(), 1));
  const grid = useRef<HTMLDivElement>(null);

  const cells = useMemo(() => {
    const start = new Date(view);
    start.setDate(1 - start.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [view]);

  const enabled = (d: Date) => d >= first && d <= last && days.includes(d.getDay());
  const canPrev = view > new Date(first.getFullYear(), first.getMonth(), 1);
  const canNext = view < new Date(last.getFullYear(), last.getMonth(), 1);

  // Arrow-key navigation between enabled days
  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, d: Date) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = new Date(d);
    n.setDate(n.getDate() + map[e.key]);
    if (n.getMonth() !== view.getMonth()) setView(new Date(n.getFullYear(), n.getMonth(), 1));
    requestAnimationFrame(() => grid.current?.querySelector<HTMLButtonElement>(`[data-date="${iso(n)}"]`)?.focus());
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <button type="button" disabled={!canPrev} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} className="h-10 w-10 border border-espresso/15 hover:border-gold disabled:opacity-30" aria-label="Previous month">
          ←
        </button>
        <p className="font-display text-2xl" aria-live="polite">
          {view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <button type="button" disabled={!canNext} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} className="h-10 w-10 border border-espresso/15 hover:border-gold disabled:opacity-30" aria-label="Next month">
          →
        </button>
      </div>
      <div className="mt-6 grid grid-cols-7 text-center" aria-hidden="true">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="label pb-3 text-[0.625rem] text-taupe">
            {d}
          </span>
        ))}
      </div>
      <div ref={grid} className="grid grid-cols-7 gap-1" role="group" aria-label="Choose a date">
        {cells.map((d) => {
          const k = iso(d);
          const inMonth = d.getMonth() === view.getMonth();
          const ok = enabled(d) && inMonth;
          const sel = value === k;
          return (
            <button
              key={k}
              type="button"
              data-date={k}
              disabled={!ok}
              onClick={() => onChange(k)}
              onKeyDown={(e) => onKey(e, d)}
              aria-pressed={sel}
              aria-label={d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + (ok ? "" : ", unavailable")}
              className={cn(
                "aspect-square text-sm tabular-nums transition-colors",
                !inMonth && "invisible",
                ok ? "hover:bg-pearl" : "text-taupe/35 line-through decoration-taupe/20",
                sel && "bg-espresso text-ivory hover:bg-espresso",
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Success ────────────────────────────────────────────────────────────── */
function Success({ data }: { data: Out }) {
  const ref = useRef<HTMLDivElement>(null);
  const t = appointmentTypes.find((x) => x.id === data.type)!;

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>("h2")?.focus();
    if (prefersReducedMotion()) return;
    gsap.from(ref.current!.children, { y: 40, opacity: 0, duration: 1.2, stagger: 0.08, ease: "expo.out" });
  }, []);

  return (
    <div ref={ref} className="py-6" role="status">
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-gold" fill="none" stroke="currentColor" aria-hidden="true">
        <circle cx="32" cy="32" r="30" strokeWidth="0.75" />
        <path d="M20 33l8 8 16-18" strokeWidth="1.2" />
      </svg>
      <h2 tabIndex={-1} className="mt-8 font-display text-5xl font-light md:text-6xl">
        Thank you, <em className="text-gold-deep">{data.name.split(" ")[0]}</em>.
      </h2>
      <p className="mt-6 max-w-lg text-taupe md:text-lg">
        Your request for a {t.title.toLowerCase()} appointment on <strong className="font-medium text-espresso">{prettyDate(data.date)}</strong> at{" "}
        <strong className="font-medium text-espresso">{formatTime(data.time)}</strong> is with our team. We&rsquo;ll confirm by phone or email within one business day.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <button type="button" onClick={() => downloadIcs(data)} className="label bg-espresso px-7 py-4 text-ivory hover:bg-gold hover:text-espresso">
          Add to calendar (.ics)
        </button>
        <a href={googleCalendarUrl(data)} target="_blank" rel="noopener noreferrer" className="label border border-espresso/25 px-7 py-4 hover:border-gold">
          Google Calendar
        </a>
      </div>
      <div className="mt-14 border-t border-gold/40 pt-8 text-sm text-taupe">
        <p className="label mb-4 text-gold-ink">Before your visit</p>
        <ul className="space-y-2">
          <li>Bring photos of gowns you love, and shoes near your wedding-day heel height.</li>
          <li>Light-colored undergarments and any shapewear you like.</li>
          <li>Champagne is welcome on the main floor — we&rsquo;ll have some ready, too.</li>
        </ul>
        <TransitionLink href="/faq" className="label link-underline mt-6 inline-block text-espresso">
          Read the FAQ →
        </TransitionLink>
      </div>
    </div>
  );
}
