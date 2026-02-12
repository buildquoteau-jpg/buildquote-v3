import type { QueryCtx, MutationCtx } from "../_generated/server";

// ------------------------------------------------------------------
// RBAC helpers for Manufacturer Portal & Admin Review
// ------------------------------------------------------------------

type Ctx = QueryCtx | MutationCtx;

/**
 * Get the authenticated user's email from the Clerk-provided identity.
 * Throws if no identity is present (unauthenticated).
 */
export async function getIdentityEmail(ctx: Ctx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const email = identity.email ?? identity.tokenIdentifier;
  if (!email) {
    throw new Error("No email found on identity");
  }
  return email;
}

/**
 * Look up a manufacturerUser row by email. Returns null if none found.
 */
export async function getManufacturerUserByEmail(ctx: Ctx, email: string) {
  return await ctx.db
    .query("manufacturerUsers")
    .withIndex("by_email", (q) => q.eq("email", email))
    .first();
}

/**
 * Require that the caller is an active manufacturer user.
 * Returns the manufacturerUser row and the associated manufacturer.
 */
export async function requireManufacturerUser(ctx: Ctx) {
  const email = await getIdentityEmail(ctx);
  const mfgUser = await getManufacturerUserByEmail(ctx, email);
  if (!mfgUser || !mfgUser.active) {
    throw new Error("Not an active manufacturer user");
  }
  const manufacturer = await ctx.db.get(mfgUser.manufacturerId);
  if (!manufacturer) {
    throw new Error("Manufacturer account not found");
  }
  return { mfgUser, manufacturer };
}

/**
 * Assert the manufacturer user has one of the required roles.
 */
export async function assertManufacturerRole(
  ctx: Ctx,
  allowedRoles: Array<"admin" | "editor">
) {
  const { mfgUser, manufacturer } = await requireManufacturerUser(ctx);
  if (!allowedRoles.includes(mfgUser.role)) {
    throw new Error(
      `Manufacturer role "${mfgUser.role}" not in allowed roles: ${allowedRoles.join(", ")}`
    );
  }
  return { mfgUser, manufacturer };
}

/**
 * Check if the caller is a BuildQuote admin.
 * Uses ADMIN_EMAILS env var (comma-separated list of emails).
 */
export async function requireAdmin(ctx: Ctx) {
  const email = await getIdentityEmail(ctx);
  const adminEmails = ((globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!adminEmails.includes(email.toLowerCase())) {
    throw new Error("Not an admin");
  }
  return email;
}
