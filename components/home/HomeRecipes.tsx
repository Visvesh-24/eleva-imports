/** Recipes teaser on the home page: the Paloma and the Margarita. */
import { GlassArt } from "@/components/content/GlassArt";
import { getEntry, isGuide } from "@/lib/recipes";
import { RecipesTeaser, type TeaserRecipe } from "./HomeSections";

const SLUGS = ["eleva-paloma", "classic-margarita"];

export function HomeRecipes() {
  const recipes: TeaserRecipe[] = SLUGS.map((s) => getEntry(s))
    .filter((e) => e !== undefined && !isGuide(e))
    .map((e) => ({
      href: `/recipes/${e!.slug}`,
      title: e!.title,
      kicker: e!.subtitle,
      blurb: e!.excerpt,
      accent: e!.theme.accent,
      glow: e!.theme.glow,
      art: <GlassArt kind={e!.glass} liquid={e!.liquid} garnish={e!.garnish} ice={e!.ice} className="size-full" />,
    }));
  return <RecipesTeaser recipes={recipes} />;
}
