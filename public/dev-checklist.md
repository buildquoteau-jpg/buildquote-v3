# BuildQuote V3 Dev Checklist (Missing Variables + Schema Alignment)

## Environment variables required
- `VITE_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `VITE_CONVEX_URL`
- `CONVEX_DEPLOY_KEY` (CI/deploy)
- `VITE_ADMIN_EMAILS` (comma-separated, for admin-only screens)
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_BASE_URL`
- `VITE_GOOGLE_MAPS_API_KEY`
- `ADMIN_EMAILS` (server side if needed in workers/functions)

## Convex schema key tables
- `builders`: profile, logo, marketing + passkey preference
- `projects`: project shell and archive flags
- `quoteRequests`: stage, scopes[], fulfilment, dates, supplier message, status
- `componentGroups`: S4 include/toggle/order
- `lineItems`: S5 driver + item specs + quantities
- `suppliers`: supplier contact + account refs + terms
- `supplierRFQs`: send lifecycle tracking
- `documents`: guide/doc references
- `savedBuilderItems`: reusable custom line items
- Manufacturer portal tables: `manufacturers`, `manufacturerUsers`, `systems`, `components`, `systemComponents`, etc.

## Screen read/write mapping
- `DashboardScreen` reads builders/projects/RFQ summary (currently scaffolded with mock data)
- `ProjectSetupScreen` writes draft context locally (pending Convex createProject wiring)
- `ScopeInputScreen` writes scope draft text (pending Convex quoteRequest mutation)
- `ComponentGroupsScreen` expects componentGroups query/mutations (currently TODO)
- `BuildUpScreen` expects line item query/mutations (currently TODO)
- `ReviewScreen` writes fulfilment/supplier metadata (currently local state)
- `PreviewScreen` reads quote payload and sends RFQ (currently local sample + send TODO)
- `SettingsScreen` wired to Convex mutations but blocked by auth context placeholder builderId

## Type/schema mismatches to resolve
- Several screens still use local placeholders where Convex IDs and records should be loaded.
- `quoteRequests.scopeText` moved to `quoteRequests.scopes[]` in schema; ensure frontend types and mutations consistently use scopes array.
- Dashboard project tile RFQ counts should derive from `supplierRFQs` and/or status fields, not static fixtures.

## PDF data readiness checklist
- Available now in schema: builder/company, project, stage, scopes, lineItems, dates.
- Missing runtime wiring: fetch builder logo URL and include in preview/PDF call.
- Missing send pipeline: immutable payload snapshot at send time for exact PDF/email parity.

## TODO hotspots (manual review)
- Convex query wiring in S2-S7 core flow.
- Auth identity to builderId mapping in settings and dashboard.
- Admin gating via `VITE_ADMIN_EMAILS` currently client-side only; enforce server-side checks for sensitive operations.
