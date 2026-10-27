import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TransitionLink } from "@/components/animation/PageTransition";
import FinalCta from "@/components/sections/FinalCta";
import GownBrowser from "@/components/ui/GownBrowser";
import PageHeader from "@/components/ui/PageHeader";
import { collections, designers, gownsFor } from "@/lib/data";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = collections.find((x) => x.slug === slug);
  if (!c) return {};
  const title = c.kind === "designer" ? `${c.title} Wedding Dresses` : `${c.title} in Aurora, IL`;
  return {
    title,
    description: `${c.intro} Wedding dress boutique in Aurora, IL — serving the Chicago suburbs since 1973.`,
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { title, images: [{ url: `${c.image}?w=1200&h=630&fit=crop` }] },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const c = collections.find((x) => x.slug === slug);
  if (!c) notFound();
  const list = gownsFor(c);
  const showDesignerNav = c.slug === "bridal" || c.kind === "designer";

  return (
    <>
      <PageHeader
        eyebrow={c.kind === "designer" ? "Designer collection" : "Collection"}
        title={c.title}
        intro={<p>{c.intro}</p>}
        image={c.image}
        imageAlt={`${c.title} at Wolsfelt's Bridal`}
        cta={{ href: `/appointment?type=${["bridesmaid", "mothers"].includes(c.category) ? c.category : "bridal"}${c.kind === "designer" ? `&designer=${c.slug}` : ""}`, label: "Book to try these gowns" }}
      />

      <section aria-label="Gowns" className="container-luxe pb-24 md:pb-36">
        {showDesignerNav && (
          <nav aria-label="Designers" className="mb-10 flex gap-x-6 gap-y-3 overflow-x-auto whitespace-nowrap pb-2 md:flex-wrap">
            <TransitionLink href="/collections/bridal" className={cn("label link-underline", c.slug === "bridal" ? "text-gold-ink" : "text-taupe")}>
              All bridal
            </TransitionLink>
            {designers.map((d) => (
              <TransitionLink key={d.slug} href={`/collections/${d.slug}`} className={cn("label link-underline", d.slug === c.slug ? "text-gold-ink" : "text-taupe")} aria-current={d.slug === c.slug ? "page" : undefined}>
                {d.name}
              </TransitionLink>
            ))}
          </nav>
        )}
        <GownBrowser gowns={list} showDesigner={c.slug === "bridal"} />
        <p className="mt-16 text-center text-sm text-taupe">
          Online styles are a sampling — the salon carries hundreds more. Samples sizes 6–26; gowns from $1,499, sale collection from $999.
        </p>
      </section>

      <FinalCta />
    </>
  );
}
