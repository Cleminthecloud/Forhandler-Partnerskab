# Carl Ras Forhandler Partnerskab — working notes

These are notes-to-self for any future session picking this project back up.
Read this first before changing anything.

---

## 1. What we are building

A **demo web app** that pitches Carl Ras Gruppen on a *Forhandler Partnerskab*
— a partner-loyalty/program platform that sits next to the existing
carl-ras.dk B2B webshop. The platform helps local installers (locksmiths,
electricians, builders) get certified, get leads, run co-branded marketing,
and report up to Carl Ras.

Live deploy: <https://forhandler-partnerskab.vercel.app>
Repo: <https://github.com/Cleminthecloud/Forhandler-Partnerskab>
Stack: Next.js 16 (App Router) · React 19 · Tailwind v4 · Recharts 3 ·
TypeScript · Inter via next/font.

**This is a presentation tool, not a real product.** Everything is
demo/in-memory data. The point is to make Dennis and Peter say "yes,
that's exactly what this should feel like".

---

## 2. Audience — speak to both lenses in every section

- **Dennis** — regional sales / territory. Cares about: partner growth,
  who's active where, leads per partner, conversion, region coverage,
  Faglige Fredage attendance.
- **Peter** — digital/platform/brand. Cares about: brand consistency
  (logos, colors, ad templates), self-serve ad-builder, asset packaging
  for digital channels, scalable certification workflow.

When in doubt, every screen should answer something for *both* of them.

---

## 3. Symbiose framing — DO NOT pitch this as a pivot

The Forhandler Partnerskabet is **additive**, not a replacement:
- carl-ras.dk webshop still does the heavy B2B lifting
- The partner platform adds: leads, marketing toolkit, certification,
  community/forum, specialist chat, events
- Copy reads "Vi sælger mere — sammen med dem" not "Ny vej til markedet"
- The carl-ras.dk navigation is mirrored across the /find experience so
  end-customers feel one continuous brand

---

## 4. Brand — what's allowed where

Source: Brand Guide v1.1 INTERNT (in `outputs/_brand/`)

- **Carl Ras Blå** — Pantone 300 C · `#1158A3` — the only accent we
  use in the partner platform UI itself (buttons, links, focus)
- **Carl Ras Mørk Blå** — Pantone 648 C · `#002C5B` — used for darker
  surfaces (footer-style co-brand badges, navy hero areas)
- **Kampagne Orange** — Pantone 2012 C · `#F49100` — used ONLY as the
  Sommerhussikring theme accent; never for primary UI

### About red

Red (`#E30613`) is **not** in the brand guide. BUT — the live carl-ras.dk
nav uses red as the SIKRING sister-brand color. So:

- ✅ Allowed: red on the SIKRING segment pill inside `CarlRasHeader.tsx`
  (it mirrors the live site)
- ❌ Not allowed: red anywhere else in our partner platform UI
  (no red buttons, no red badges, no red status chips)

Same nuance for **green** (ENGROS BESLAG `#5B7F2C`) and
**yellow-on-dark** (3 AKTIVE `#1F262A` + `#FFED00`). These exist
*only* inside the carl-ras.dk header replica.

---

## 5. Theme system (årshjul)

`src/lib/themes.ts` defines campaign themes that rotate with Carl Ras'
BU årshjul. The platform is constant; the theme is seasonal accent.

Current themes: sommerhussikring (default), vinterklargøring, etc.
Each theme has `accent`, `accentSoft`, `id`, `label`, `kategoriSplit`.

`useTheme()` exposes current theme + setter. `theme-dot` className
renders the small color chip. Theme color shows up in:
- the `theme-dot` chip in eyebrows
- the campaign card icon backgrounds (`accentSoft`)
- nowhere else — accent is the rule, theme is the exception

---

## 6. Design system tokens (globals.css)

Built around three rules:
1. **60-30-10**: 60% canvas, 30% structure/ink, 10% accent
2. **8pt grid**: spacing in 4/8/12/16/24/32/48/64/96/128
3. **5-level type hierarchy**: t-display / t-h2 / t-h3 / t-body / t-caption + t-eyebrow

Key tokens (don't invent new ones, use these):
- Canvas: `--canvas` (white) / `--canvas-2` (parchment #F5F5F7) / `--canvas-3` (pearl #FAFAFC)
- Ink: `--ink` / `--ink-2` / `--ink-3` / `--ink-4` (decreasing emphasis)
- Lines: `--line` (default hairline) / `--line-2` (lighter divider)
- Accent: `--accent` / `--accent-press` / `--accent-tint`
- Theme: `--theme` / `--theme-soft` / `--theme-ink`
- Shadows: `--shadow-1` through `--shadow-4` (whisper-soft Apple-style)
- Radii: `--r-sm/md/lg/xl/2xl/pill`
- Topbar: 48px

Component classes: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`,
`.card`, `.card-flat`, `.card-pearl`, `.card-lg`, `.field`, `.tag-*`.

Tooltip via `[data-tt="..."]` + optional `data-tt-pos="right"`.

---

## 7. App structure

```
src/
├── app/
│   ├── layout.tsx            top-level shell + AppStateProvider + ThemeProvider
│   ├── page.tsx              landing — links to /partner, /admin, /find
│   ├── partner/              "I'm a partner installer logging in"
│   │   ├── layout.tsx        + PartnerSidebar
│   │   ├── page.tsx          dashboard (KPIs, charts, recent activity)
│   │   ├── kampagner/        ad-builder (canvas-app pattern)
│   │   ├── leads/            inbox + lead detail drawer (720px)
│   │   ├── events/           kalender (Faglige Fredage)
│   │   ├── certificering/    badges + available courses
│   │   ├── specialister/     chat with Carl Ras specialists
│   │   ├── forum/            chat-style threads
│   │   └── nyheder/          blog
│   ├── admin/                "I'm Carl Ras HQ"
│   │   ├── layout.tsx        + AdminSidebar
│   │   ├── page.tsx          oversigt
│   │   ├── data/             reporting
│   │   ├── partnere/         list + [partnerId] profile
│   │   ├── kalender, certificering, kampagner, indhold, beskeder
│   └── find/                 "I'm an end-customer on carl-ras.dk"
│       ├── layout.tsx        + CarlRasHeader (mirrors live nav)
│       ├── page.tsx          Airbnb-feel partner finder
│       └── [partnerId]/      partner detail
└── components/
    ├── AppState.tsx          context: leads, toast, addLead, updateLeadStatus
    ├── ThemeProvider.tsx     current theme + setter
    ├── Shell.tsx             top app bar (48px) with Cmd+K trigger
    ├── PartnerSidebar.tsx    sticky collapsible nav for /partner/*
    ├── AdminSidebar.tsx      sticky collapsible nav for /admin/*
    ├── SidebarToggle.tsx     useSidebarCollapsed hook + collapse btn
    ├── CommandPalette.tsx    Cmd+K modal — global jump-to
    ├── CarlRasHeader.tsx     live carl-ras.dk nav replica (used on /find)
    ├── CampaignPreview.tsx   8 real ad layouts (no UI chrome, real photos)
    ├── Charts.tsx            SVG-based primitives (Sparkline, AreaChart, Radial, Donut, BarMini)
    ├── ChartsInteractive.tsx Recharts-based (InteractiveArea, InteractiveBar, InteractivePie, MiniArea)
    └── DenmarkMap.tsx        SVG silhouette w/ region pins
└── lib/
    ├── data.ts               PARTNERS, CAMPAIGNS, EVENTS, FORUM_THREADS, PRODUCTS, salesFor()
    └── themes.ts             theme catalog
```

---

## 8. Design principles applied

When making changes, lean on these (in order):
1. **Progressive disclosure** — show the headline, hide the detail (use drawers, modals, expand-on-click)
2. **Clear visual hierarchy** — size/weight/color tells you what's important
3. **60-30-10 color discipline** — accent is a privilege, not a default
4. **Consistent 8pt spacing** — never `mt-7` when `mt-6` or `mt-8` fits
5. **Instant feedback** — every action should yield visible response in <120ms
6. **Reduce cognitive load** — kill chrome, kill duplicate nav, let content breathe

---

## 9. Canvas-app pattern (the new Kampagner UX)

This is the visual pattern for any "editor" page going forward:
- **No card chrome on the canvas itself** — full bleed with subtle dot grid
- **Floating top bar** — pill-shaped, frosted (`bg-white/85 backdrop-blur-md`), shadow-1
- **Floating bottom dock** — frosted card holding format selector + actions
- **Edit drawer slides from right** when user wants to fine-tune (420px wide, ESC + click-outside closes)
- Reference: `src/app/partner/kampagner/page.tsx`

Apply this anywhere we have "preview a thing + edit its properties":
candidates are admin/kampagner, admin/indhold.

---

## 10. Charts

Two layers, used together:
- `Charts.tsx` — SVG primitives, lightweight, used for tiny KPI cards
  (Sparkline, BarMini, Radial)
- `ChartsInteractive.tsx` — Recharts-backed with tooltips + gradients
  (`InteractiveArea`, `InteractiveBar`, `InteractivePie`, `MiniArea`)

Rule of thumb:
- Big hero chart with hover-tooltip → InteractiveArea / InteractivePie
- Small KPI sparkle, no interaction → BarMini or MiniArea
- Donut with center label → InteractivePie + absolute overlay

---

## 11. Demo data conventions

- All in-memory in `src/lib/data.ts`
- `CURRENT_PARTNER` = "Hornbæk Låseservice" (Sølv tier)
- Real Carl Ras PDPs linked via `varenr` (e.g. STROXX 40013215)
- Real product photos in `/public/products/`
- Real sommerhus photos in `/public/campaigns/`
- Lead state persists to localStorage via `AppState`
- Anything else resets per session

---

## 12. Sandbox quirks (deployment workflow)

- **`npm install` fails** in the Cowork sandbox (FUSE EPERM on unlink).
  If a new dep is needed, install to `/tmp/x` then `cp -r` into
  `node_modules/`. Vercel handles install cleanly on its end.
- **`.git` operations fail** in the sandbox. The user runs commits on
  their Mac:
  ```
  cd ~/path/to/forhandler-partnerskab
  rm -f .git/index.lock
  git add . && git commit -m "..." && git push
  ```
- Vercel auto-deploys on push to main.

---

## 13. Open ideas (not yet built)

- **Sales integration** — project planner + cross-sell + specialist booking inside lead detail (task #34)
- **Empty states** for /partner/kampagner when no theme is active
- **Skeleton loaders** on /admin/data charts
- **Mobile breakpoint** — desktop-first for now, but the lg: breakpoints exist
- **Save/draft state** on edit drawer — currently changes are in memory only
- **A/B variant per campaign** — let partners A/B test copy

---

## 14. Typography

- **Primary font: Neo Sans** — Carl Ras' brand font, served via Adobe Typekit
  (kit id `gqe3rsn`). The `<link>` is in `app/layout.tsx` `<head>`.
- **Fallback: Inter** — loaded via `next/font/google` as `--font-inter`.
  Sits in the font-stack right after `"neo-sans"` so it fills first-paint
  while Typekit loads.
- The Typekit only ships 4 cuts: regular (400), italic 400, bold (700),
  bold italic (700). Browser quantization rules: text at weight ≤500
  renders as Neo Sans 400; weight ≥600 renders as Neo Sans 700.
- Letter-spacing in `t-display`, `t-h2`, etc. has been tuned for Neo Sans
  metrics (Neo Sans is naturally tighter than Inter, so the negative
  tracking is lighter).
- If you ever need true medium weight (500) text, use `font-family: var(--font-sans-medium)` — not currently defined, but easy to add by setting the family to Inter explicitly.

## 15. Recent batches (for git blame context)

- Batch May 2026: canvas-app refactor for Kampagner + live carl-ras.dk
  nav replica + chart sweep to Recharts + context-aware Kampagner actions
  (print vs digital) + ActionConfirm modal w/ account picker

If you're reading this fresh: that's the *current* state and the latest
push is the floor, not the ceiling.
