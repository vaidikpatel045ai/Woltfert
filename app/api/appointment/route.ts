import { NextResponse } from "next/server";
import { appointmentSchema, validateSlot } from "@/lib/appointment";
import { appointmentTypes } from "@/lib/data";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const a = parsed.data;

  // Honeypot filled → pretend success, drop silently.
  if (a.company) return NextResponse.json({ ok: true });

  const slotError = validateSlot(a);
  if (slotError) return NextResponse.json({ ok: false, errors: { time: [slotError] } }, { status: 422 });

  const type = appointmentTypes.find((t) => t.id === a.type)!;
  if (a.guests > type.maxGuests) {
    return NextResponse.json({ ok: false, errors: { guests: [`Up to ${type.maxGuests} guests for this appointment`] } }, { status: 422 });
  }

  /*
   * TODO: deliver the request by email (Resend).
   *   1. npm i resend
   *   2. Set RESEND_API_KEY, APPOINTMENT_TO_EMAIL, APPOINTMENT_FROM_EMAIL in Vercel
   *   3. Uncomment:
   *
   * import { Resend } from "resend";
   * const resend = new Resend(process.env.RESEND_API_KEY);
   * await resend.emails.send({
   *   from: process.env.APPOINTMENT_FROM_EMAIL!,      // e.g. "Wolsfelt's <appointments@wolsfelts.com>"
   *   to: process.env.APPOINTMENT_TO_EMAIL!,          // the boutique inbox
   *   replyTo: a.email,
   *   subject: `New ${type.title} appointment request — ${a.name}, ${a.date} ${a.time}`,
   *   text: Object.entries(a).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v ?? ""}`).join("\n"),
   * });
   *
   * Optionally send the bride a confirmation from the same API.
   */
  if (process.env.NODE_ENV !== "production") console.info("[appointment]", a);

  return NextResponse.json({ ok: true, id: crypto.randomUUID() });
}
