/**
 * Server wrapper: detects which hero media exists in /public/hero and hands
 * the result to the client stage. See public/hero/README.md.
 */
import { getHeroAssets } from "@/lib/hero-assets";
import { HeroStage } from "./HeroStage";

export function Hero() {
  return <HeroStage assets={getHeroAssets()} />;
}
