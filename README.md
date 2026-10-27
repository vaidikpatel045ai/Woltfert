# Wolsfelt's Bridal & Tuxedos — website

A redesign of the website for **Wolsfelt's Bridal & Tuxedos**, a family-run bridal boutique in Aurora, IL (since 1973). The site is built to drive one action: **booking an in-store appointment**.

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind CSS v4 · Three.js via React Three Fiber + drei · GSAP (ScrollTrigger, SplitText) · Lenis · React Hook Form + Zod.

---

## 1. Setup

You need Node 20 or later.

```bash
npm install
cp .env.example .env.local   # optional for local dev
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run typecheck
```

## 2. Project structure

```
app/
  layout.tsx              fonts, metadata, JSON-LD, preloader, nav, footer, cursor, grain
  page.tsx                homepage (sections in order)
  appointment/            multi-step booking form
  collections/[slug]/     category + designer pages (filters, gown modal)
  tuxedos/ services/ about/ faq/ contact/ privacy/ terms/
  api/appointment/        Zod-validated route handler (email TODO)
  api/newsletter/         footer signup (list TODO)
  sitemap.ts robots.ts opengraph-image.tsx icon.svg
components/
  three/        SilkHero, GoldParticles, DistortImage, CurvedCarousel, glsl
  animation/    Preloader, SplitReveal, ImageReveal, Parallax, Magnetic, Counter,
                PageTransition (TransitionLink), SmoothScroll (Lenis)
  sections/     one file per homepage section + Navigation, Footer, AnnouncementBar
  ui/           Button, Cursor, Marquee, StickyMobileBar, HoursStatus, AppointmentForm,
                GownBrowser, DistortTile, PageHeader, Timeline, Accordion, Icons, Logo
lib/
  data.ts       ALL copy, images, hours, designers, gowns, reviews, FAQs
  utils.ts      hours / open-now logic (America/Chicago), WebGL capability check
  gsap.ts       client-only plugin registration
  appointment.ts  shared Zod schema + time-slot rules (used by the form AND the API)
  ics.ts        .ics download and Google Calendar link
  schema.ts     LocalBusiness + FAQPage JSON-LD
```

## 3. Editing content

All content lives in **`lib/data.ts`**. Components only read from that file.

| To change… | Edit in `lib/data.ts` |
| --- | --- |
| Promotions and closing notices in the top bar | `announcements`. Add `until: "YYYY-MM-DD"` and the notice hides itself after that date. |
| Hours | `hours`. The `december` field overrides Thursday's closing time in December. |
| Designers, gowns, prices | `designers`, `gowns` |
| Reviews | `testimonials` |
| FAQ | `faqs`. The FAQ page's JSON-LD updates automatically. |
| Appointment types, guest limits, bookable days | `appointmentTypes` |
| Premier package, other packages | `premier`, `packages` |

### Swapping in the boutique's own photos

The placeholders come from Unsplash. To replace them:

1. Put the photos in `public/images/` (for example `public/images/hero.jpg`).
2. In `lib/data.ts`, change the matching entry in the `img` map to `"/images/hero.jpg"`.
3. Once no Unsplash URLs are left, you can remove the `remotePatterns` entry in `next.config.ts`.

Every image on the site, including the WebGL textures, comes from that one map. Lines marked `SWAP` are the most important ones to replace: the generations photo (a mother and daughter, ideally) and the Instagram grid.

## 4. Connecting the form to email (Resend)

`app/api/appointment/route.ts` already does the following:

- validates the request with the same Zod schema the form uses
- checks the date and time against store hours (no Mondays or Sundays; Premier is Tuesday to Friday only)
- checks the guest limit
- drops spam using a honeypot field

Email delivery is the one step left to wire up. It is marked `TODO`:

```bash
npm i resend
```

1. Create a Resend account and verify the `wolsfelts.com` domain.
2. Add these environment variables in Vercel (Project → Settings → Environment Variables):
   - `RESEND_API_KEY`
   - `APPOINTMENT_TO_EMAIL`: the boutique inbox
   - `APPOINTMENT_FROM_EMAIL`: for example `Wolsfelt's <appointments@wolsfelts.com>`
3. Uncomment the Resend block in the route handler.

The newsletter route (`app/api/newsletter/route.ts`) has a similar TODO for your mailing-list provider.

## 5. Deploying to Vercel

1. Push this folder to GitHub.
2. In Vercel, choose **Add New → Project** and import the repo. No settings need to change.
3. Set `NEXT_PUBLIC_SITE_URL=https://www.wolsfelts.com`, plus the email variables above.
4. Deploy, then add the domain under Project → Domains.

## 6. Motion, WebGL and performance

- **WebGL loads only where it helps.** The silk hero mounts once the browser is idle. The hover-ripple canvas is created on the first hover. The carousel mounts when it scrolls near the viewport. Each canvas stops rendering when it is off screen, and DPR is capped at 1.75.
- **Fallbacks.** WebGL is skipped for reduced-motion users, Data Saver, devices with fewer than 4 cores or less than 4 GB of memory, and browsers without WebGL. Those visitors get a CSS silk gradient, plain images and a scrollable designer list instead.
- **Reduced motion.** Preloader, Lenis, the custom cursor, split-text reveals and the pinned horizontal section are all turned off. Content renders statically.
- **Preloader** runs once per browser session. A CSS failsafe hides it if JavaScript fails.
- **Cleanup.** All ScrollTriggers are created inside `useGSAP` / `gsap.matchMedia()` and clean up on unmount.

## 7. Before launch — checklist

- [ ] **Review rating.** Fill `business.rating` with real, verified numbers from The Knot or Google, then set `verified: true`. The JSON-LD `aggregateRating` is only emitted when that flag is set, because Google penalizes made-up rating markup.
- [ ] **Coordinates.** Confirm `business.geo` against the Google Business Profile.
- [ ] **Email address.** Confirm `business.email`.
- [ ] **Gowns.** Replace the placeholder sample gowns (names, prices, photos) in `gowns`.
- [ ] **Host bios.** Confirm the wording of the host bios (`hosts`) with Vicki and Dawn.
- [ ] **Legal pages.** Replace the privacy and terms placeholder text.
- [ ] **Award badges.** If the boutique has licensed badge artwork, swap it in for the typographic badges in `components/sections/Awards.tsx`.
- [ ] **Email.** Wire up Resend (section 4).
