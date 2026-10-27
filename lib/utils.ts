import { hours, timezone, type DayHours } from "./data";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ── Time & hours ─────────────────────────────────────────────────────── */

/** "17:00" → "5 pm", "09:30" → "9:30 am" */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
}

export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToHHMM(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

/** Wall-clock parts for "now" in the boutique's timezone. */
export function storeNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    month: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { weekday, minutes: Number(get("hour")) * 60 + Number(get("minute")), month: Number(get("month")) };
}

/** Close time for a day, honoring the December override. */
export function closeFor(d: DayHours, month: number) {
  return month === 12 && d.december ? d.december : d.close;
}

export function hoursLabel(d: DayHours, month?: number) {
  if (!d.open || !d.close) return "Closed";
  const close = month ? closeFor(d, month)! : d.close;
  return `${formatTime(d.open)} – ${formatTime(close)}`;
}

export type OpenStatus = { open: boolean; label: string; weekday: number };

export function openStatus(date = new Date()): OpenStatus {
  const { weekday, minutes, month } = storeNow(date);
  const today = hours[weekday];
  const close = closeFor(today, month);
  if (today.open && close && minutes >= toMinutes(today.open) && minutes < toMinutes(close)) {
    return { open: true, label: `Open now · until ${formatTime(close)}`, weekday };
  }
  // Find next opening
  for (let i = 0; i < 8; i++) {
    const idx = (weekday + i) % 7;
    const d = hours[idx];
    if (!d.open) continue;
    if (i === 0 && minutes >= toMinutes(d.open)) continue;
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : d.day;
    return { open: false, label: `Closed now · opens ${when} at ${formatTime(d.open)}`, weekday };
  }
  return { open: false, label: "Closed now", weekday };
}

/* ── Device capability ────────────────────────────────────────────────── */

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isTouch() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

let webglCache: boolean | null = null;

/**
 * Should we mount WebGL at all? False for reduced motion, data-saver,
 * low-core / low-memory devices, or when a context can't be created.
 */
export function canUseWebGL() {
  if (typeof window === "undefined") return false;
  if (webglCache !== null) return webglCache;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (prefersReducedMotion()) return (webglCache = false);
  if (nav.connection?.saveData) return (webglCache = false);
  if ((nav.hardwareConcurrency ?? 8) < 4) return (webglCache = false);
  if ((nav.deviceMemory ?? 8) < 4) return (webglCache = false);
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    webglCache = !!gl;
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglCache = false;
  }
  return webglCache;
}

/* ── Preloader handshake ──────────────────────────────────────────────── */

declare global {
  interface Window {
    __wolsPreloaded?: boolean;
  }
}

export const PRELOADER_EVENT = "wols:preloaded";

/** Run `cb` once the preloader has lifted (immediately if it already has). */
export function onPreloaderDone(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if (window.__wolsPreloaded) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(PRELOADER_EVENT, handler, { once: true });
  return () => window.removeEventListener(PRELOADER_EVENT, handler);
}

export function formatPrice(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}
