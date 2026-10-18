import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideDetail } from "@/components/content/GuideDetail";
import { RecipeDetail } from "@/components/content/RecipeDetail";
import { getPortrait } from "@/lib/adriana";
import { getProduct } from "@/lib/products";
import { getEntries, getEntry, getRelatedEntries, isGuide, KIND_SINGULAR, type Recipe } from "@/lib/recipes";
import { SITE } from "@/lib/site";

/** All slugs are prerendered; opt out of instant-navigation dev validation. */
export const instant = false;

export function generateStaticParams() {
  return getEntries().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  return {
    title: `${entry.title} | ${KIND_SINGULAR[entry.kind]}`,
    description: entry.excerpt,
    alternates: { canonical: `/recipes/${entry.slug}` },
    openGraph: { title: entry.title, description: entry.excerpt, type: "article" },
  };
}

/** Recipe schema for rich results (guides get Article). */
function jsonLd(entry: ReturnType<typeof getEntry>) {
  if (!entry) return null;
  if (isGuide(entry)) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: entry.title,
      description: entry.excerpt,
      author: { "@type": "Person", name: "Adriana Martinez" },
      publisher: { "@type": "Organization", name: SITE.name },
      mainEntityOfPage: `${SITE.url}/recipes/${entry.slug}`,
    };
  }
  const r = entry as Recipe;
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: r.title,
    description: r.excerpt,
    author: { "@type": "Person", name: "Adriana Martinez" },
    recipeCategory: KIND_SINGULAR[r.kind],
    recipeYield: "1 serving",
    recipeIngredient: r.ingredients.map((i) => [i.qty !== undefined ? `${i.qty}${i.unit ? ` ${i.unit}` : ""}` : "", i.item].filter(Boolean).join(" ")),
    recipeInstructions: r.method.map((text) => ({ "@type": "HowToStep", text })),
  };
}

export default async function EntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();
  const related = getRelatedEntries(entry);
  const portrait = getPortrait("cellar");
  const ld = jsonLd(entry);

  return (
    <>
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />}
      {isGuide(entry) ? (
        <GuideDetail
          guide={entry}
          products={(await Promise.all(entry.products.map((h) => getProduct(h)))).filter((p) => p !== undefined)}
          related={related}
          portrait={portrait}
        />
      ) : (
        <RecipeDetail recipe={entry} product={await getProduct(entry.madeWith)} related={related} portrait={portrait} />
      )}
    </>
  );
}
