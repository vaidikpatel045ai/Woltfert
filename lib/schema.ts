import { business, hours, faqs } from "./data";

const dayUrl = (d: string) => `https://schema.org/${d}`;

/** LocalBusiness / ClothingStore JSON-LD (schema.org has no BridalShop type; additionalType names it). */
export function localBusinessSchema() {
  const regular = hours
    .filter((h) => h.open && h.close)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayUrl(h.day),
      opens: h.open,
      closes: h.close,
    }));

  const year = new Date().getFullYear();
  const december = hours
    .filter((h) => h.december)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayUrl(h.day),
      opens: h.open,
      closes: h.december,
      validFrom: `${year}-12-01`,
      validThrough: `${year}-12-31`,
    }));

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ClothingStore"],
    additionalType: "https://en.wikipedia.org/wiki/Bridal_shop",
    "@id": `${business.url}/#business`,
    name: business.name,
    alternateName: "Wolsfelt's Bridal",
    description: "Family-run designer bridal boutique and tuxedo rental in Aurora, Illinois, serving the Chicago suburbs since 1973.",
    url: business.url,
    telephone: "+1-630-896-7166",
    faxNumber: "+1-630-896-3605",
    foundingDate: String(business.founded),
    priceRange: "$$-$$$",
    image: [`${business.url}/opengraph-image`],
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postal,
      addressCountry: business.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
    areaServed: ["Aurora", "Naperville", "Oswego", "Batavia", "Geneva", "St. Charles", "Chicago suburbs"],
    openingHoursSpecification: [...regular, ...december],
    sameAs: [business.social.instagram, business.social.facebook, business.social.youtube],
    award: ["The Knot Hall of Fame", "The Knot Best of Weddings 2022", "Justin Alexander Diamond Partner"],
    ...(business.rating.verified && business.rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: business.rating.value,
            reviewCount: business.rating.count,
            bestRating: 5,
          },
        }
      : {}),
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
