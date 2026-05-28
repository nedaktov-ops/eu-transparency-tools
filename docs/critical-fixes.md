## 2026-05-28: Tailwind v4 CSS Not Rendering

**Root Cause:** Vite config missing `@tailwindcss/vite` plugin. In Tailwind v4, `@import "tailwindcss"` in CSS requires the official Vite plugin to process it into actual utility classes. Without it, the built CSS contained unprocessed `@tailwind utilities;` directive that browsers ignore.

**Fix Applied:**
1. `npm install @tailwindcss/vite` in each project
2. Add `import tailwindcss from '@tailwindcss/vite'` + `plugins: [tailwindcss(), react()]` to `vite.config.ts`
3. `npm install @tailwindcss/oxide-linux-x64-gnu` manually (npm bug with optional deps on Node 18)

**Files Changed:**
- `ecb-dashboard/vite.config.ts`
- `mep-dashboard/vite.config.ts`

**Verification:** Built CSS now starts with `/*! tailwindcss v4.3.0 */` and has actual `.rounded-xl`, `.bg-white` etc. utility classes.

**Affected Projects:** Both ECB and MEP dashboards.
