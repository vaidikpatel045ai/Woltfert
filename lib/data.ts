/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Wolsfelt's Bridal & Tuxedos — site content
 *  Every piece of copy, every image, the hours, designers, gowns and reviews
 *  live in this one file so the boutique can edit without touching components.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ── Images ──────────────────────────────────────────────────────────────────
 * Placeholder photography from Unsplash. To swap in the boutique's own photos:
 *   1. Put files in /public/images (e.g. /public/images/hero.jpg)
 *   2. Replace the value here with "/images/hero.jpg"
 * That is the only change needed — every component reads from this map.
 */
const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const img = {
  hero: u("1585241920473-b472eb9ffbae"), // bride in lace, back view by the window
  trust: u("1460978812857-470ed1c77af0"),
  service: u("1525772764200-be829a350797"),
  convenience: u("1594552072238-b8a33785b261"),
  // SWAP: a mother–daughter (or grandmother–bride) portrait from the salon
  generationsMain: u("1525258946800-98cfd641d0de"),
  generationsInset: u("1494955870715-979ca4f13bf0"),
  bridal: u("1537633552985-df8429e8048b"),
  bridesmaid: u("1583939003579-730e3918a45a"),
  mothers: u("1566174053879-31528523f8ae"),
  tuxedos: u("1600091166971-7f9faad6c1e2"),
  flowerGirl: u("1509927083803-4bd519298ac4"),
  accessories: u("1590099033615-be195f8d575c"),
  premier: u("1513278974582-3e1b4a4fa21e"),
  boutique: u("1513278974582-3e1b4a4fa21e"),
  finalCta: u("1607190074257-dd4b7af0309f"),
  aisle: u("1505944357431-27579db47558"),
  rings: u("1606800052052-a08af7148866"),
  roses: u("1515934751635-c81c6bc9a2d8"),
  bouquetDark: u("1519741497674-611481863552"),
  hands: u("1520854221256-17451cc331bf"),
  coupleVeil: u("1546032996-6dfacbacbf3f"),
  coupleBeach: u("1544078751-58fee2d8a03b"),
  coupleCliff: u("1541250848049-b4f7141dca3f"),
  coupleHill: u("1604017011826-d3b4c23f8914"),
  coupleClose: u("1621621667797-e06afc217fb0"),
  coupleWalk: u("1606216794074-735e91aa2c92"),
  coupleTux: u("1591604466107-ec97de577aff"),
  coupleDetail: u("1550005809-91ad75fb315f"),
  celebration: u("1595407753234-0882f1e77954"),
  bouquetSleeve: u("1529636798458-92182e662485"),
  suitNavy: u("1617137968427-85924c800a22"),
  suitCheck: u("1594938298603-c8148c4dae35"),
  menswearFlat: u("1593030761757-71fae45fa0e7"),
  ivorySuit: u("1571513800374-df1bbe650e56"),
  venue: u("1510076857177-7470076d4098"),
} as const;

/** Build a sized Unsplash URL (used for WebGL textures, which bypass next/image). */
export const sized = (src: string, w: number) =>
  src.startsWith("http") ? `${src}?w=${w}&q=72&auto=format&fit=crop` : src;

/* ── Business ───────────────────────────────────────────────────────────── */
export const business = {
  name: "Wolsfelt's Bridal & Tuxedos",
  shortName: "Wolsfelt's",
  founded: 1973,
  tagline: "Designer bridal gowns in the Chicago area since 1973",
  phone: "(630) 896-7166",
  phoneHref: "tel:+16308967166",
  fax: "(630) 896-3605",
  email: "info@wolsfelts.com", // TODO: confirm the boutique's public inbox
  address: {
    street: "1025 South Lincoln Avenue",
    city: "Aurora",
    region: "IL",
    regionName: "Illinois",
    postal: "60505",
    country: "US",
  },
  // TODO: confirm exact coordinates from Google Business Profile
  geo: { lat: 41.7467, lng: -88.3168 },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wolsfelts.com",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=1025+South+Lincoln+Avenue,+Aurora,+IL+60505",
  mapEmbed:
    "https://www.google.com/maps?q=Wolsfelt's+Bridal,+1025+South+Lincoln+Avenue,+Aurora,+IL+60505&output=embed",
  social: {
    instagram: "https://www.instagram.com/wolsfeltsbridal/",
    instagramHandle: "@wolsfeltsbridal",
    hashtag: "#wolsfeltsbride",
    facebook: "https://www.facebook.com/wolsfelts.bridal",
    youtube: "https://www.youtube.com/@wolsfeltsbridal",
  },
  sister: {
    prom: "https://www.wolsfeltsprom.com",
    quince: "https://www.quincecouturebywolsfelts.com",
  },
  pillars: ["Trust", "Service", "Convenience"],
  /**
   * Structured-data rating. Google requires these figures to be real and
   * visible to users. Fill in from The Knot / Google, then set verified: true
   * and the aggregateRating block is emitted in the JSON-LD.
   */
  rating: { value: 4.9, count: 0, verified: false },
};

export const fullAddress = `${business.address.street}, ${business.address.city}, ${business.address.regionName} ${business.address.postal}`;

/* ── Hours ────────────────────────────────────────────────────────────────
 * 24h "HH:MM" in America/Chicago. null = closed.
 * `december` overrides the regular close time during December.
 */
export type DayHours = { day: string; short: string; open: string | null; close: string | null; december?: string };

export const hours: DayHours[] = [
  { day: "Sunday", short: "Sun", open: null, close: null },
  { day: "Monday", short: "Mon", open: null, close: null },
  { day: "Tuesday", short: "Tue", open: "10:00", close: "17:00" },
  { day: "Wednesday", short: "Wed", open: "10:00", close: "17:00" },
  { day: "Thursday", short: "Thu", open: "10:00", close: "20:00", december: "17:00" },
  { day: "Friday", short: "Fri", open: "10:00", close: "17:00" },
  { day: "Saturday", short: "Sat", open: "09:30", close: "17:00" },
];

export const timezone = "America/Chicago";

/* ── Announcements ────────────────────────────────────────────────────────
 * Rotate in the top bar. `until` (YYYY-MM-DD, exclusive) hides a notice
 * automatically once it has passed.
 */
export const announcements: { text: string; href?: string; cta?: string; until?: string }[] = [
  {
    text: "Wild Weekdays — $500 off select aisle-ready gowns, Tuesday through Friday",
    href: "/appointment",
    cta: "Reserve a weekday",
  },
  { text: "Closing at 3 pm on Saturday, October 31st. Happy Halloween.", until: "2026-11-01" },
  { text: "Bridesmaids save 20% when the bride says yes at Wolsfelt's", href: "/services#packages", cta: "Details" },
];

/* ── Navigation ───────────────────────────────────────────────────────── */
export const navLeft = [
  { label: "Bridal", href: "/collections/bridal" },
  { label: "Bridesmaids", href: "/collections/bridesmaid" },
  { label: "Mothers", href: "/collections/mothers" },
  { label: "Tuxedos", href: "/tuxedos" },
];
export const navRight = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];
export const navMobileExtra = [
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/* ── Marquee ──────────────────────────────────────────────────────────── */
export const marquee = [
  "Since 1973",
  "The Knot Hall of Fame",
  "Champagne Service",
  "On-Site Alterations",
  "Justin Alexander Diamond Partner",
  "Free Gown Storage",
];

/* ── Brand pillars ────────────────────────────────────────────────────── */
export const pillars = [
  {
    word: "Trust",
    eyebrow: "Five decades",
    body: "For more than fifty years, brides across Chicagoland have trusted our family with the most personal purchase of their lives. A family-run salon since 1973 — and still the place mothers send their daughters.",
    image: img.trust,
    alt: "Black and white photograph of a couple beneath a sweeping bridal veil",
  },
  {
    word: "Service",
    eyebrow: "Champagne, and a stylist all your own",
    body: "A custom-tailored appointment, champagne poured on arrival, and a bridal stylist who treats your search as if it were her own. Unhurried, attentive, never pushy.",
    image: img.service,
    alt: "A candlelit table set with blush roses, crystal and champagne glasses",
  },
  {
    word: "Convenience",
    eyebrow: "Everything, under one roof",
    body: "On-site alterations, hand-pressing, complimentary gown storage, tuxedo rental and curbside pickup — on three acres with ample free parking in Aurora.",
    image: img.convenience,
    alt: "An ivory ball gown with a cathedral train laid across a bed in soft daylight",
  },
];

/* ── Generations story ────────────────────────────────────────────────── */
export const generations = {
  eyebrow: "Generations of brides know",
  title: ["Three generations.", "One <em>family</em>."],
  body: [
    "In 1973, Don and Donna Wolsfelt turned their flourishing floral business into a full-service bridal salon. Their daughters, Vicki and Dawn, have been part of it since the doors opened — and run it today.",
    "Mothers and grandmothers who found their gowns here now return with daughters and granddaughters. When you say yes at Wolsfelt's, you join the family.",
  ],
  stats: [
    { value: 1973, from: 1900, label: "Founded in Aurora", suffix: "", plain: true },
    { value: 50, label: "Years of bridal", suffix: "+" },
    { value: 3, label: "Generations of brides", suffix: "" },
    { value: 1000, label: "Brides & counting", suffix: "s" },
  ],
};

/* ── Collections (homepage tiles) ─────────────────────────────────────── */
export const collectionTiles = [
  { title: "Bridal Gowns", index: "01", href: "/collections/bridal", image: img.bridal, alt: "Bride in a flowing gown and cathedral veil on a windswept beach", blurb: "Nine designer collections, sizes 6 to 26" },
  { title: "Bridesmaids", index: "02", href: "/collections/bridesmaid", image: img.bridesmaid, alt: "Newlyweds celebrating among bridesmaids in dusty blue", blurb: "Morilee & Kanali K" },
  { title: "Mothers", index: "03", href: "/collections/mothers", image: img.mothers, alt: "Woman in an off-the-shoulder plum evening gown", blurb: "Special occasion & evening" },
  { title: "Tuxedos", index: "04", href: "/tuxedos", image: img.tuxedos, alt: "A grey windowpane tuxedo with bow tie on a tailor's form", blurb: "On-site rental & fittings" },
];

export const moreCategories = [
  { title: "Flower Girl", href: "/collections/flower-girl" },
  { title: "Veils & Accessories", href: "/collections/accessories" },
  { title: "Prom", href: business.sister.prom, external: true },
  { title: "Quince", href: business.sister.quince, external: true },
];

/* ── Designers ────────────────────────────────────────────────────────── */
export type Designer = { slug: string; name: string; note: string; image: string; alt: string };

export const designers: Designer[] = [
  { slug: "the-w-collection", name: "The W Collection", note: "Our private label, shown in a private salon", image: img.hero, alt: "Lace gown with an open back, photographed from behind" },
  { slug: "justin-alexander", name: "Justin Alexander", note: "Diamond Partner — timeless structure, modern ease", image: img.bridal, alt: "Bride with a long tulle veil on the shore" },
  { slug: "justin-alexander-signature", name: "Justin Alexander Signature", note: "Couture fabrics and sculpted silhouettes", image: img.finalCta, alt: "Bride walking through golden grass at sunset" },
  { slug: "lillian-west", name: "Lillian West", note: "Romantic, light and effortlessly feminine", image: img.coupleVeil, alt: "Couple embracing beneath a sheer veil" },
  { slug: "calla-blanche", name: "Calla Blanche", note: "Hand-placed lace and detail-rich bodices", image: img.generationsMain, alt: "Embellished bodice with a peach rose bouquet" },
  { slug: "la-perle", name: "La Perle", note: "Polished elegance with a European sensibility", image: img.convenience, alt: "Ivory ball gown with a long train" },
  { slug: "morilee", name: "Morilee", note: "Statement ball gowns and fit-and-flare", image: img.coupleBeach, alt: "Couple dancing on a black sand beach" },
  { slug: "enzoani", name: "Enzoani", note: "Glamour, sparkle and dramatic trains", image: img.bouquetSleeve, alt: "Sheer sleeve and bouquet against the sky" },
  { slug: "plus-size", name: "Plus Size Gowns", note: "Samples to size 26, styled with care", image: img.coupleCliff, alt: "Bride and groom among rocks and trees" },
];

/* ── Collection pages ─────────────────────────────────────────────────── */
export type Category = "bridal" | "bridesmaid" | "mothers" | "flower-girl" | "accessories";

export type Collection = {
  slug: string;
  title: string;
  kind: "category" | "designer";
  category: Category;
  intro: string;
  image: string;
};

export const categories: Collection[] = [
  { slug: "bridal", title: "Bridal Gowns", kind: "category", category: "bridal", image: img.bridal, intro: "Nine designer collections, from the private W Collection to Justin Alexander Signature. Samples from size 6 to 26 — most gowns between $1,499 and $3,000, with a sale collection from $999." },
  { slug: "bridesmaid", title: "Bridesmaids", kind: "category", category: "bridesmaid", image: img.bridesmaid, intro: "Morilee and Kanali K in a spectrum of colors and fabrics. Brides who say yes at Wolsfelt's receive up to 20% off their bridesmaids' dresses." },
  { slug: "mothers", title: "Mothers & Special Occasion", kind: "category", category: "mothers", image: img.mothers, intro: "Evening gowns and polished separates for the mothers of the bride and groom — and every special occasion after." },
  { slug: "flower-girl", title: "Flower Girl", kind: "category", category: "flower-girl", image: img.flowerGirl, intro: "Tulle, lace and satin for the smallest members of the bridal party." },
  { slug: "accessories", title: "Veils & Accessories", kind: "category", category: "accessories", image: img.accessories, intro: "Cathedral veils, belts, headpieces and the finishing touches, styled with your gown in the salon." },
];

export const collections: Collection[] = [
  ...categories,
  ...designers.map((d) => ({
    slug: d.slug,
    title: d.name,
    kind: "designer" as const,
    category: "bridal" as const,
    image: d.image,
    intro: `${d.note}. Try ${d.name} in our Aurora salon with a personal stylist and champagne service.`,
  })),
];

/* ── Gowns ───────────────────────────────────────────────────────────────
 * Placeholder sample styles. Replace names, prices and photos with the
 * boutique's current in-store samples.
 */
export const silhouettes = ["Ball Gown", "A-Line", "Fit & Flare", "Mermaid", "Sheath"] as const;
export const necklines = ["Sweetheart", "V-Neck", "Off-the-Shoulder", "Illusion", "Square", "Halter"] as const;
export const priceRanges = [
  { id: "under-1500", label: "Under $1,500", min: 0, max: 1499 },
  { id: "1500-2500", label: "$1,500 – $2,500", min: 1500, max: 2500 },
  { id: "2500-3500", label: "$2,500 – $3,500", min: 2501, max: 3500 },
  { id: "3500-plus", label: "$3,500 +", min: 3501, max: Infinity },
] as const;

export type Gown = {
  id: string;
  name: string;
  designer: string; // designer slug, or a brand name for non-bridal
  category: Category;
  silhouette: (typeof silhouettes)[number];
  neckline: (typeof necklines)[number];
  price: number;
  images: string[];
  description: string;
};

const G = (
  id: string,
  name: string,
  designer: string,
  category: Category,
  silhouette: Gown["silhouette"],
  neckline: Gown["neckline"],
  price: number,
  images: string[],
  description: string,
): Gown => ({ id, name, designer, category, silhouette, neckline, price, images, description });

const pool = [img.hero, img.bridal, img.finalCta, img.convenience, img.generationsMain, img.coupleVeil, img.bouquetSleeve, img.coupleBeach, img.coupleCliff, img.coupleHill, img.coupleClose, img.coupleWalk];
const pick = (i: number) => [pool[i % pool.length], pool[(i + 3) % pool.length], pool[(i + 7) % pool.length]];

export const gowns: Gown[] = [
  G("w-aurelia", "Aurelia", "the-w-collection", "bridal", "Fit & Flare", "Illusion", 2890, pick(0), "Re-embroidered Chantilly lace over a whisper of nude tulle, finished with an open back and covered buttons to the end of the train."),
  G("w-maren", "Maren", "the-w-collection", "bridal", "A-Line", "V-Neck", 2250, pick(1), "Soft crepe with a deep V and clean architectural seams. Quietly modern, endlessly wearable."),
  G("w-odette", "Odette", "the-w-collection", "bridal", "Ball Gown", "Off-the-Shoulder", 3450, pick(2), "Layers of silk tulle beneath a draped off-the-shoulder bodice — made for a grand aisle."),
  G("ja-celeste", "Celeste", "justin-alexander", "bridal", "Ball Gown", "Sweetheart", 2690, pick(3), "Structured mikado with pockets and a sweeping chapel train. Classic Justin Alexander construction."),
  G("ja-vivienne", "Vivienne", "justin-alexander", "bridal", "Fit & Flare", "Square", 2390, pick(4), "Matte satin with a square neckline and a sculpted bodice that flares just below the hip."),
  G("ja-noor", "Noor", "justin-alexander", "bridal", "A-Line", "Illusion", 1990, pick(5), "Floral lace scattered over soft tulle, with sheer long sleeves and a scalloped hem."),
  G("jas-seraphine", "Seraphine", "justin-alexander-signature", "bridal", "Mermaid", "Sweetheart", 3890, pick(6), "Hand-beaded lace on a fully corseted bodice, ending in a dramatic cathedral train."),
  G("jas-isolde", "Isolde", "justin-alexander-signature", "bridal", "Sheath", "Halter", 3290, pick(7), "Liquid crepe in a high halter, cut on the bias for a silhouette that moves like water."),
  G("lw-rosalind", "Rosalind", "lillian-west", "bridal", "A-Line", "V-Neck", 1790, pick(8), "Airy tulle with delicate floral appliqués climbing the skirt. Romantic and light."),
  G("lw-juniper", "Juniper", "lillian-west", "bridal", "Sheath", "Square", 1590, pick(9), "Minimal crepe sheath with a detachable sheer overskirt for an effortless change after the ceremony."),
  G("cb-esme", "Esmé", "calla-blanche", "bridal", "Fit & Flare", "Illusion", 2190, pick(10), "Hand-placed lace on an illusion bodice with a keyhole back."),
  G("cb-marguerite", "Marguerite", "calla-blanche", "bridal", "A-Line", "Off-the-Shoulder", 1890, pick(11), "Off-the-shoulder lace with a soft A-line skirt and a court train."),
  G("lp-clementine", "Clémentine", "la-perle", "bridal", "Mermaid", "V-Neck", 2590, pick(12), "Satin mermaid with a plunging V and a sculpted, figure-defining seam."),
  G("lp-anais", "Anaïs", "la-perle", "bridal", "A-Line", "Square", 2290, pick(13), "Structured satin with a square neckline and box pleats — polished and timeless."),
  G("ml-thea", "Thea", "morilee", "bridal", "Ball Gown", "Sweetheart", 1690, pick(14), "Glittering tulle ball gown with a corset bodice and a statement train."),
  G("ml-lyra", "Lyra", "morilee", "bridal", "Fit & Flare", "Off-the-Shoulder", 1490, pick(15), "Lace fit-and-flare with an off-the-shoulder neckline. Aisle-ready and available off the rack."),
  G("ez-valentina", "Valentina", "enzoani", "bridal", "Mermaid", "Illusion", 2990, pick(16), "Sparkling beaded lace, an illusion neckline and a sweeping, multi-layered train."),
  G("ez-solenne", "Solenne", "enzoani", "bridal", "Ball Gown", "V-Neck", 3190, pick(17), "Shimmering tulle with a deep V and a voluminous, romantic skirt."),
  G("ps-amara", "Amara", "plus-size", "bridal", "A-Line", "V-Neck", 1890, pick(18), "Supportive built-in structure, a flattering V and a soft lace A-line. Sampled to size 26."),
  G("ps-delphine", "Delphine", "plus-size", "bridal", "Fit & Flare", "Sweetheart", 2090, pick(19), "Corseted sweetheart with a gentle flare and optional sleeves — fitted in-house."),
  G("bm-sage", "Sage Chiffon", "Morilee", "bridesmaid", "A-Line", "V-Neck", 219, [img.bridesmaid, img.celebration], "Flowing chiffon with a wrap V-neckline. Available in over 40 colors."),
  G("bm-dune", "Dune Satin", "Kanali K", "bridesmaid", "Sheath", "Square", 249, [img.celebration, img.bridesmaid], "Fluid satin column with a square neckline and adjustable straps."),
  G("bm-mist", "Mist Tulle", "Morilee", "bridesmaid", "A-Line", "Off-the-Shoulder", 239, [img.bridesmaid, img.coupleWalk], "Soft tulle with an off-the-shoulder neckline — romantic in every shade."),
  G("bm-ember", "Ember Crepe", "Kanali K", "bridesmaid", "Fit & Flare", "Halter", 259, [img.celebration, img.coupleDetail], "Stretch crepe halter with a gentle flare and a clean, modern line."),
  G("mo-plum", "Plum Evening", "Special Occasion", "mothers", "Sheath", "Off-the-Shoulder", 389, [img.mothers, img.ivorySuit], "Off-the-shoulder jersey gown with a draped bodice."),
  G("mo-ivory", "Ivory Tailored", "Special Occasion", "mothers", "Sheath", "V-Neck", 329, [img.ivorySuit, img.mothers], "A tailored jacket and column skirt, softly structured."),
  G("mo-champagne", "Champagne Lace", "Special Occasion", "mothers", "A-Line", "Illusion", 429, [img.mothers, img.service], "Beaded lace with illusion sleeves and a flowing A-line skirt."),
  G("fg-petal", "Petal Tulle", "Flower Girl", "flower-girl", "Ball Gown", "Square", 149, [img.flowerGirl, img.roses], "Layered tulle with a satin bodice and sash."),
  G("fg-lace", "Little Lace", "Flower Girl", "flower-girl", "A-Line", "Illusion", 169, [img.roses, img.flowerGirl], "Lace bodice with cap sleeves and a twirl-ready skirt."),
  G("ac-cathedral", "Cathedral Veil", "Accessories", "accessories", "A-Line", "Sweetheart", 289, [img.bridal, img.coupleVeil], "Single-tier cathedral veil edged in fine lace."),
  G("ac-crystal", "Crystal Belt", "Accessories", "accessories", "Sheath", "V-Neck", 189, [img.accessories, img.rings], "Hand-beaded crystal belt on a satin ribbon."),
];

export const gownsFor = (c: Collection) =>
  c.kind === "designer" ? gowns.filter((g) => g.designer === c.slug) : gowns.filter((g) => g.category === c.category);

export const designerName = (slug: string) => designers.find((d) => d.slug === slug)?.name ?? slug;

/* ── The Experience ───────────────────────────────────────────────────── */
export const experience = [
  { n: "01", title: "Book", body: "Reserve a 90-minute appointment online or by phone. Bring up to four of your favorite people — and a few photos of gowns you love.", image: img.rings, alt: "Two gold wedding bands resting on silk" },
  { n: "02", title: "Champagne Welcome", body: "Check in at the boutique and settle into a private fitting room with your guests. The champagne is already poured.", image: img.service, alt: "Candlelit table with roses and crystal glassware" },
  { n: "03", title: "Personal Stylist", body: "Your stylist is yours for the whole appointment. Share your vision, your venue and your budget — she will pull the gowns, five to twenty of them.", image: img.hero, alt: "A bride in lace gazing out a bright window" },
  { n: "04", title: "Say Yes", body: "The moment arrives. We measure for the perfect fit and place your order — special orders take six to nine months, or choose off the rack.", image: img.celebration, alt: "A joyful couple surrounded by friends and confetti" },
  { n: "05", title: "Alterations & Pickup", body: "Our in-house seamstresses tailor every detail, hand-press your gown, and store it free of charge until the week of your wedding.", image: img.convenience, alt: "An ivory gown laid out, pressed and ready" },
];

/* ── Premier Appointment ──────────────────────────────────────────────── */
export const premier = {
  title: "The Premier Appointment",
  lede: "Make your yes unforgettable. A private, extended session in our bridal suite with food and drink served on china — for the bride who wants to celebrate with her closest people.",
  price: "$350",
  priceNote: "for up to 5 guests · $25 per additional guest, up to 10",
  facts: ["3 hours", "Tuesday – Friday", "By appointment"],
  included: [
    "A private three-hour appointment in the bridal suite",
    "Champagne, mimosas, finger sandwiches, desserts and a charcuterie board",
    "Intimate readings from family and friends",
    "Special personal touches, arranged in advance",
  ],
  fine: "Book at least one week ahead with payment in full so we can arrange catering and personal touches. The booking fee is non-refundable.",
};

export const packages = [
  { title: "Bridesmaids & Bubbly", body: "Champagne and a sweet treat while your party chooses their dresses. 90 minutes, Tuesday – Friday." },
  { title: "Make It Sweet", body: "Add a champagne-and-candy cart to a 90-minute appointment for $100. Tuesday – Friday." },
  { title: "Bridesmaid Savings", body: "Up to 20% off bridesmaid dresses when you purchase your wedding gown." },
  { title: "Tuxedo Savings", body: "The groom rents free with five or more rentals, plus $40 off each rental with a wedding gown purchase." },
];

/* ── Services ─────────────────────────────────────────────────────────── */
export type ServiceIcon = "needle" | "iron" | "heirloom" | "hanger" | "car" | "bowtie" | "parking";

export const services: { title: string; body: string; icon: ServiceIcon; detail?: string }[] = [
  { title: "On-Site Alterations", icon: "needle", body: "Full-service alterations by our in-house seamstresses — bustles, hems, straps and the fit of your dreams.", detail: "Charges depend on the work required. Please allow up to three months for alterations once your gown arrives." },
  { title: "Hand-Pressed Gowns", icon: "iron", body: "Every gown is hand-pressed by our professional seamstresses as a final touch before you take it home." },
  { title: "Gown Heirlooming", icon: "heirloom", body: "Preservation that keeps your dress's color and fabric intact for the next generation. Call for pricing." },
  { title: "Complimentary Storage", icon: "hanger", body: "We store your gown safely, free of charge, until it's time for your wedding." },
  { title: "Curbside Pickup", icon: "car", body: "Collecting a tuxedo or bridesmaid dress? We'll bring it to your car." },
  { title: "On-Site Tuxedo Rental", icon: "bowtie", body: "Rent for the groom, the groomsmen and every special occasion — measured, fitted and adjusted in-house." },
  { title: "Free Parking", icon: "parking", body: "Three acres and ample parking for a relaxed, stress-free visit." },
];

/* ── Testimonials (paraphrased from public reviews) ────────────────────── */
export const testimonials = [
  { name: "Nicole H", quote: "Sarah found my dress almost before I knew what I wanted — and Ula's alterations, especially the bustle, were flawless." },
  { name: "Meghan M", quote: "After trying more than fifty dresses elsewhere, I finally felt understood. Expert, patient, and genuinely kind." },
  { name: "Mindy G", quote: "Amy made the whole afternoon feel like a celebration. The atmosphere is warm and completely unhurried." },
  { name: "Britany K", quote: "Skilled, gracious stylists and a selection unlike anywhere else. The first dress really was the one." },
  { name: "Kristin K", quote: "I arrived late and still had Amy's full attention. Not a moment of pressure — just care." },
  { name: "Jackie C", quote: "Jessica knew every gown in the salon and found me the one, well within my budget." },
  { name: "Paul M", quote: "Professional from the tuxedos to the wedding dress. Donna and the team took care of every detail." },
];

/* ── Awards ───────────────────────────────────────────────────────────── */
export const awards = [
  { top: "The Knot", title: "Hall of Fame", sub: "Wedding Boutique" },
  { top: "The Knot", title: "Best of Weddings", sub: "2022" },
  { top: "WeddingWire", title: "Couples' Reviews", sub: "Bridal Salon" },
  { top: "Justin Alexander", title: "Diamond Partner", sub: "Authorized Retailer" },
];

/* ── Instagram ────────────────────────────────────────────────────────── */
// SWAP: replace with the boutique's latest posts (or wire to the Instagram Basic Display API)
export const instagram = [
  { image: img.coupleClose, alt: "Couple sharing a quiet moment, bouquet of dried grasses" },
  { image: img.coupleDetail, alt: "Bride and groom side by side with a peach and sage bouquet" },
  { image: img.coupleVeil, alt: "Couple wrapped in a sheer veil in a golden field" },
  { image: img.coupleWalk, alt: "Newlyweds laughing as they walk beneath palms" },
  { image: img.bouquetSleeve, alt: "A sheer sleeve holding a garden bouquet" },
  { image: img.coupleHill, alt: "Couple embracing on a hillside at golden hour" },
];

/* ── Tuxedos ──────────────────────────────────────────────────────────── */
export const tuxBrands = ["Kenneth Cole", "Ike Behar", "David Major", "Ted Stanford", "MOD", "Couture 1910"];

export const tuxStyles = [
  { name: "True Navy Simon", note: "Metro slim fit", image: img.suitNavy, alt: "Man in a navy suit and brown shoes" },
  { name: "Marquis Black Weave", note: "Classic tuxedo", image: img.tuxedos, alt: "Tuxedo jacket and bow tie on a form" },
  { name: "Brown Archer", note: "Modern slim fit", image: img.menswearFlat, alt: "Flat lay of menswear: tan jacket, shirt, tie and shoes" },
  { name: "Ike Behar Collection", note: "Tailored rental", image: img.suitCheck, alt: "Blue windowpane three-piece suit" },
  { name: "Chocolate Brown Metro", note: "Slim fit wedding suit", image: img.coupleDetail, alt: "Groom in a taupe suit beside the bride" },
  { name: "Black Dante Suit", note: "Ike Behar", image: img.coupleTux, alt: "Groom in a black tuxedo with the bride" },
];

export const tuxSteps = [
  { n: "01", title: "Choose your look", body: "Visit the boutique to see the styles in person. Vest and tie colors are in stock, so we can match your palette on the spot." },
  { n: "02", title: "Get measured", body: "We measure the groom here; groomsmen can be measured at partner tuxedo locations nationwide and send us their sizes." },
  { n: "03", title: "Fit & pick up", body: "Final fitting in-house with minor adjustments by our tailors. Curbside pickup available — shoes can be rented or purchased." },
];

export const tuxNotes = [
  "Rent pieces separately — ideal for destination weddings",
  "Several slim-fit styles and a wide range of sizes",
  "Free groom rental with five or more rentals",
  "$40 off each rental with a wedding gown purchase",
];

/* ── About / timeline ─────────────────────────────────────────────────── */
export const timeline = [
  { year: "1973", title: "From flowers to gowns", body: "Don and Donna Wolsfelt turn their flourishing floral business into a full-service bridal salon in Aurora, Illinois." },
  { year: "The early years", title: "A family affair", body: "Daughters Vicki and Dawn are part of the salon from the day the doors open — learning every seam, every customer, every detail." },
  { year: "Growing roots", title: "Three acres, one destination", body: "The salon grows to more than 10,000 square feet on three acres, with tuxedos and wedding services added so couples can shop in one place." },
  { year: "Recognition", title: "Hall of Fame", body: "Inducted into The Knot Hall of Fame and named a Justin Alexander Diamond Partner." },
  { year: "2022", title: "Best of Weddings", body: "Honored with The Knot Best of Weddings — chosen by the couples we dressed." },
  { year: "Today", title: "The second generation", body: "Vicki and Dawn own and operate Wolsfelt's, welcoming the daughters and granddaughters of brides they dressed decades ago." },
];

export const hosts = [
  { name: "Vicki Wolsfelt", role: "Owner · Second generation", body: "Raised in the salon, Vicki has guided brides through their search for as long as Wolsfelt's has existed." },
  { name: "Dawn Wolsfelt", role: "Owner · Second generation", body: "Dawn's eye for fit and fabric — and her famous patience — set the standard for every stylist on our team." },
];

/* ── FAQ ──────────────────────────────────────────────────────────────── */
export const faqs = [
  { q: "Do I need to make an appointment?", a: "Yes. Appointments are required so you can work one-on-one with a bridal stylist; walk-ins can't be guaranteed. Book online or call (630) 896-7166." },
  { q: "How long is my appointment?", a: "A standard bridal appointment is 90 minutes with a private stylist. The Premier Appointment is three hours." },
  { q: "How many guests can I bring?", a: "Up to four guests for a standard appointment, and up to ten with the Premier Appointment." },
  { q: "What is the price range of your gowns?", a: "Gowns start at $1,499 and most fall between $1,499 and $3,000. Our sale collection starts at $999." },
  { q: "What sizes are your samples?", a: "Samples range from size 6 to 26, most often 12–14. Bridal sizing usually runs one to two sizes smaller than everyday sizing." },
  { q: "What should I wear to try on gowns?", a: "Light-colored undergarments and any shapewear you like. Bring shoes close to the heel height you plan to wear on the day." },
  { q: "Are photographs allowed?", a: "Yes — except in the private W Collection salon." },
  { q: "Are there private dressing rooms?", a: "Yes. Large private rooms seat your guests on a couch while you try on gowns, and they can step out whenever you'd like. Accessible rooms are on the main floor." },
  { q: "Can I bring champagne?", a: "You may — please open it outside the fitting rooms and keep it on the main floor. Drinks aren't permitted in the fitting rooms." },
  { q: "How can I pay for my gown?", a: "Gowns $900 and above may be paid by credit card, debit card, cash or check. Gowns $899 and below are cash only." },
  { q: "How long will my dress take to arrive?", a: "Special orders take about six to nine months, though some designers offer rush options. Many gowns can also be purchased off the rack." },
  { q: "Do you offer alterations?", a: "Yes, by our in-house seamstresses. Charges depend on the work required; please allow up to three months." },
  { q: "Are there savings on bridesmaid dresses?", a: "Yes — up to 20% off bridesmaid dresses once you've purchased your wedding gown with us." },
];

/* ── Appointment form ─────────────────────────────────────────────────── */
export const appointmentTypes = [
  { id: "bridal", title: "Bridal", body: "90 minutes with a personal stylist, up to 4 guests", minutes: 90, maxGuests: 4, days: [2, 3, 4, 5, 6] },
  { id: "premier", title: "Premier", body: "3 hours in the bridal suite with food & champagne · $350", minutes: 180, maxGuests: 10, days: [2, 3, 4, 5] },
  { id: "bridesmaid", title: "Bridesmaid", body: "Dress your party — Morilee & Kanali K", minutes: 90, maxGuests: 8, days: [2, 3, 4, 5, 6] },
  { id: "mothers", title: "Mothers", body: "Special occasion & evening wear", minutes: 60, maxGuests: 3, days: [2, 3, 4, 5, 6] },
  { id: "tuxedo", title: "Tuxedo", body: "Rental fitting for the groom & groomsmen", minutes: 30, maxGuests: 6, days: [2, 3, 4, 5, 6] },
] as const;

export type AppointmentTypeId = (typeof appointmentTypes)[number]["id"];

export const budgets = ["Under $1,500", "$1,500 – $2,500", "$2,500 – $3,500", "$3,500 +", "Not sure yet"];
export const stylePrefs = ["Ball Gown", "A-Line", "Fit & Flare", "Mermaid", "Sheath", "Lace", "Sparkle", "Minimal", "Sleeves", "Off-the-Shoulder"];

/* ── SEO ──────────────────────────────────────────────────────────────── */
export const seo = {
  title: "Wolsfelt's Bridal & Tuxedos — Wedding Dress Boutique in Aurora, IL",
  description:
    "Family-run bridal boutique in the Chicago suburbs since 1973. Designer wedding gowns, bridesmaids, mothers and tuxedo rental in Aurora, IL — champagne service, on-site alterations and free gown storage.",
  keywords: [
    "wedding dress boutique Aurora IL",
    "bridal shop Chicago suburbs",
    "tuxedo rental Aurora",
    "bridal gowns Aurora Illinois",
    "Justin Alexander retailer Illinois",
  ],
};
