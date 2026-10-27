import { z } from "zod";
import { appointmentTypes, hours } from "./data";
import { minutesToHHMM, toMinutes } from "./utils";

const typeIds = appointmentTypes.map((t) => t.id) as [string, ...string[]];

export const appointmentSchema = z.object({
  type: z.enum(typeIds, { errorMap: () => ({ message: "Choose an appointment type" }) }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time"),
  weddingDate: z.string().optional().or(z.literal("")),
  budget: z.string().optional(),
  styles: z.array(z.string()).default([]),
  guests: z.coerce.number().int().min(0).max(10),
  name: z.string().trim().min(2, "Please share your name").max(80),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+.-]{10,20}$/, "Please enter a valid phone number"),
  notes: z.string().max(1000).optional().or(z.literal("")),
  gown: z.string().optional().or(z.literal("")),
  // Honeypot — real visitors never see or fill this.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type AppointmentInput = z.input<typeof appointmentSchema>;
export type Appointment = z.output<typeof appointmentSchema>;

/** Server-side guard: date is bookable for the type, and the slot fits in store hours. */
export function validateSlot(a: Pick<Appointment, "type" | "date" | "time">) {
  const t = appointmentTypes.find((x) => x.id === a.type);
  if (!t) return "Unknown appointment type";
  const [y, m, d] = a.date.split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  if (!(t.days as readonly number[]).includes(day)) return "That day isn't available for this appointment";
  const slots = slotsFor(a.type, a.date);
  if (!slots.includes(a.time)) return "That time isn't available";
  return null;
}

/** Start times (every 30 min) where the full appointment ends by closing. */
export function slotsFor(typeId: string, isoDate: string) {
  const t = appointmentTypes.find((x) => x.id === typeId);
  if (!t || !isoDate) return [];
  const [y, m, d] = isoDate.split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  if (!(t.days as readonly number[]).includes(day)) return [];
  const h = hours[day];
  if (!h.open || !h.close) return [];
  const close = toMinutes(m === 12 && h.december ? h.december : h.close);
  const out: string[] = [];
  for (let s = toMinutes(h.open); s + t.minutes <= close; s += 30) out.push(minutesToHHMM(s));
  return out;
}
