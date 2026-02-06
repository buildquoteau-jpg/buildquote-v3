// AI client — future integration point for Cloudflare Workers
// OWNS: AI request formatting, response parsing
// DOES NOT DECIDE: anything — passes suggestions only

export async function suggestComponentGroups(
  _stage: string,
  _scopeText: string
): Promise<{ name: string; source: "ai_suggested" }[]> {
  // TODO: call AI endpoint
  // For now, return empty array
  return [];
}

export async function suggestLineItems(
  _componentGroupName: string,
  _stage: string,
  _scopeText: string
): Promise<{ description: string; spec?: string }[]> {
  // TODO: call AI endpoint
  return [];
}
