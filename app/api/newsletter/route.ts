import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ email: z.string().trim().email() });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 422 });

  // TODO: add the address to your list (Resend Audiences, Mailchimp, Klaviyo…).
  return NextResponse.json({ ok: true });
}
