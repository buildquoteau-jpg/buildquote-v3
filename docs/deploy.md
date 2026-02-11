# BuildQuote V3 Deployment Notes (Dev → Domain)

## 1) Vercel deployment
1. Connect repo to Vercel project.
2. Set framework preset to Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.

## 2) Environment variables
Set in Vercel (Preview + Production):
- Clerk: `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- Convex: `VITE_CONVEX_URL`, `CONVEX_DEPLOY_KEY`
- Admin: `VITE_ADMIN_EMAILS`, `ADMIN_EMAILS`
- R2: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL`
- Google Places: `VITE_GOOGLE_MAPS_API_KEY`

## 3) Clerk redirect URLs
In Clerk dashboard configure:
- Allowed redirect URLs:
  - `https://<your-preview>.vercel.app/*`
  - `https://buildquote.com.au/*` (or chosen production host)
- Sign-in URL: `/sign-in`
- After sign-in redirect: `/`

## 4) Custom domain mapping
1. Add domain in Vercel project (e.g. `app.buildquote.com.au`).
2. Point DNS records from registrar/Cloudflare to Vercel target.
3. Verify TLS cert issued and HTTPS active.

## 5) Cloudflare notes (if used)
- If proxying through Cloudflare, start with SSL mode `Full (strict)`.
- Avoid aggressive HTML caching on authenticated routes.
- Keep API/Webhook paths bypassed from cache.

## 6) Smoke test checklist
- Sign in/out works on mobile + desktop.
- Dashboard loads with projects/sandbox.
- S2→S7 flow navigates correctly.
- Settings logo upload works and displays in dashboard/profile.
- Preview “Download PDF” opens printable layout.
- No console errors on primary flow screens.
