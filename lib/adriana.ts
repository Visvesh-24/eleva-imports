/**
 * Adriana's portraits. Drop the photographs into /public/adriana using these
 * names (jpg, jpeg, webp or png). Until a file exists, an art-directed
 * placeholder frame is shown instead. Detection runs server-side.
 */
import fs from "node:fs";
import path from "node:path";

export const ADRIANA_SHOTS = {
  /** White dress, glass raised, agave field behind. Hero / Meet Adriana. */
  agave: { file: "adriana-agave-field", alt: "Adriana Martinez raising a glass of tequila in a blue agave field", focal: "50% 30%" },
  /** Black dress in a wine cellar, holding a glass of aged tequila. */
  cellar: { file: "adriana-cellar", alt: "Adriana Martinez in a cellar holding a glass of aged tequila", focal: "40% 35%" },
  /** Standing among stacked oak barrels at a distillery. */
  barrels: { file: "adriana-barrels", alt: "Adriana Martinez among stacked oak barrels at a tequila distillery", focal: "45% 40%" },
} as const;

export type AdrianaShot = keyof typeof ADRIANA_SHOTS;

export interface Portrait {
  src: string | null;
  alt: string;
  focal: string;
}

const DIR = path.join(process.cwd(), "public", "adriana");

export function getPortrait(shot: AdrianaShot): Portrait {
  const meta = ADRIANA_SHOTS[shot];
  for (const ext of ["webp", "jpg", "jpeg", "png"]) {
    if (fs.existsSync(path.join(DIR, `${meta.file}.${ext}`))) return { src: `/adriana/${meta.file}.${ext}`, alt: meta.alt, focal: meta.focal };
  }
  return { src: null, alt: meta.alt, focal: meta.focal };
}
