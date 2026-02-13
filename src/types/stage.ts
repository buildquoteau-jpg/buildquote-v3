export const BUILD_STAGES = [
  "Slab / Footings",
  "Wall Framing",
  "Roof Framing",
  "Roofing",
  "External Cladding",
  "Internal Linings",
  "Services",
  "Decking / Pergola / Outdoor",
  "Windows & Doors",
  "Insulation / Sarking / Wraps",
  "Builder Custom Stage",
] as const;

export type BuildStage = (typeof BUILD_STAGES)[number];
