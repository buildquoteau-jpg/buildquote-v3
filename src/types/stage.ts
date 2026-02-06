export const BUILD_STAGES = [
  "Slab / Footings",
  "Wall Framing",
  "Roof Framing",
  "Roofing",
  "External Cladding",
  "Internal Lining",
  "Insulation",
  "Brickies Corner",
  "Decking / Pergola / Outdoor Structures",
  "Builder Custom Stage",
] as const;

export type BuildStage = (typeof BUILD_STAGES)[number];
