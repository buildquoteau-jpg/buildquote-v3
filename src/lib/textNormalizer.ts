// Text normalization helpers
// OWNS: text cleanup for display and search
// DOES NOT DECIDE: never modifies builder intent or meaning

export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}
