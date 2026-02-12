/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminApprovals from "../adminApprovals.js";
import type * as builderPreferences from "../builderPreferences.js";
import type * as builders from "../builders.js";
import type * as compatibility from "../compatibility.js";
import type * as componentGroups from "../componentGroups.js";
import type * as devPanel from "../devPanel.js";
import type * as documents from "../documents.js";
import type * as lib_rbac from "../lib/rbac.js";
import type * as lineItems from "../lineItems.js";
import type * as manufacturerPortal from "../manufacturerPortal.js";
import type * as projects from "../projects.js";
import type * as quoteRequests from "../quoteRequests.js";
import type * as seed from "../seed.js";
import type * as supplierRFQs from "../supplierRFQs.js";
import type * as suppliers from "../suppliers.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminApprovals: typeof adminApprovals;
  builderPreferences: typeof builderPreferences;
  builders: typeof builders;
  compatibility: typeof compatibility;
  componentGroups: typeof componentGroups;
  devPanel: typeof devPanel;
  documents: typeof documents;
  "lib/rbac": typeof lib_rbac;
  lineItems: typeof lineItems;
  manufacturerPortal: typeof manufacturerPortal;
  projects: typeof projects;
  quoteRequests: typeof quoteRequests;
  seed: typeof seed;
  supplierRFQs: typeof supplierRFQs;
  suppliers: typeof suppliers;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
