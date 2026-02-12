export const BUILD_STAGES = [
  "Slab",
  "Framing",
  "Cladding",
  "Roofing",
  "Decking / Pergola / Outdoor",
  "Services",
  "Builder Custom Stage",
] as const;

export type BuildStage = (typeof BUILD_STAGES)[number];
