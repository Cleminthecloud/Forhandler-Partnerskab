# Push to GitHub + deploy on Vercel

The project is committed locally and the remote already points at your repo. Three short steps from here.

## 1. Push to GitHub

Open Terminal and run:

```bash
cd "/Users/clem/Library/Application Support/Claude/local-agent-mode-sessions/40b45e08-4ac4-4f8f-be18-aec0c1c9f70d/4740e650-8ebe-4c06-9148-4596977bc76c/local_8a329e39-e689-4757-87e5-ddb2f9d04668/outputs/forhandler-partnerskab"
git push -u origin main
```

If git asks for credentials, use either:
- Your GitHub personal-access-token (Settings → Developer settings → Personal access tokens) as the password, or
- The GitHub CLI: `gh auth login` once, then re-run the push.

## 2. Connect Vercel to the GitHub repo

1. Go to https://vercel.com/new
2. Sign in with GitHub (one-click if you have an account, or sign up — free tier is plenty).
3. Click **Import** next to `Cleminthecloud/Forhandler-Partnerskab`.
4. Vercel auto-detects Next.js. Leave all defaults. Click **Deploy**.
5. ~60 seconds later you get a live URL like `forhandler-partnerskab.vercel.app`.

Every `git push` from now on auto-deploys. Open the project in Cursor, tweak UI, commit, push — site updates within a minute.

## 3. Run it locally (optional, for development)

```bash
cd "/Users/clem/Library/Application Support/Claude/local-agent-mode-sessions/40b45e08-4ac4-4f8f-be18-aec0c1c9f70d/4740e650-8ebe-4c06-9148-4596977bc76c/local_8a329e39-e689-4757-87e5-ddb2f9d04668/outputs/forhandler-partnerskab"
npm install   # ~30 s the first time
npm run dev
```

Open `http://localhost:3000` → demo lands on `/partner`.

---

## What's in this build

**`/` → `/partner`** — demo opens in the partner's logged-in universe (Hornbæk Låseservice, Sølv-partner).

**Partner universe** (sidebar):
- Oversigt — dashboard
- Kampagner — co-brand configurator with live preview (auto-pulls logo + firma + telefon from profile)
- Leads — inbox with claim/status workflow (Ny → Kontaktet → Vundet/Tabt)
- Events & kalender — Faglige Fredage and regionsmøder, with tilmelding
- Certificering — held + available, with progress
- Tal med Carl Ras — specialist chat
- Forum — peer discussion + "find ligesindede partnere"
- Nyheder — blog from Carl Ras specialists

**Carl Ras admin** (sidebar):
- Oversigt — KPI tiles + region heatmap + activity feed + top performers
- Partnere — filterable list of all 12+ partners
- Kalender, Certificering, Kampagner, Indhold — management screens
- Beskeder — targeted messaging with segment-size preview
- Data & rapport — partner growth, leads-flow, tier donut, region bars

**Customer-facing** at `/find` (renders on a carl-ras.dk skin, not the demo chrome):
- Hero search builder: tema + faggruppe + region + postnr
- Denmark map with partner pins + result cards
- Partner profile pages with case stories + contact form
- **Round-trip**: contact form on `/find/[partnerId]` → new lead lands in `/partner/leads`

**Theme switcher** (top-right of demo bar) rotates Sommerhussikring (sommer · Sikring) → Vinterklargøring (efterår · Byg) → Indbrudssikring efterår. Accents flip across all surfaces — that's the engine moment for Peter.

## Editing in Cursor

Open this folder in Cursor and you can:
- Edit any `src/app/.../page.tsx` to tweak content.
- Edit `src/lib/data.ts` to add partners, leads, events, blog posts.
- Edit `src/lib/themes.ts` to add a new BU theme (it auto-appears in the switcher).
- Edit `src/app/globals.css` for design tokens.
- Edit `DESIGN.md` (from getdesign apple) — Cursor will respect it when generating UI.

Commit → push → Vercel auto-deploys.
