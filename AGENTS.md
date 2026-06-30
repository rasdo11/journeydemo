# JourneySpan demo — orientation for Codex

## What this is
A single-page demo of JourneySpan, a patient-reported-outcomes platform for prostate-cancer
(radical prostatectomy) recovery. It presents four views in a fixed narrative order, each
mapped to one research aim:

1. **Status quo** (`src/views/StatusQuo.jsx`) — the EPIC-26 instrument as used today.
   Shows the patient form (faithful 26 items, live 0–100 domain scoring) and the
   clinician output (5 domains at 5 timepoints). Purpose: establish how limited the
   current state is.
2. **Patient experience** (`src/views/PatientRoad.jsx`) — **Aim 2.** The recovery "span":
   optional, multimodal, non-linear submissions (photo / voice / survey) within time
   windows, densest in the first 90 days and thinning through month 12. Includes
   milestone videos and a non-emergency concern inbox.
3. **Surgeon & post-care** (`src/views/Surgeon.jsx`) — **Aim 1.** The EMR operative note
   (baseline) with optional My Intuitive / Touch Surgery imports, and an interactive link
   from each surgical decision to the recovery domain it may be associated with, plus a
   cohort pattern.
4. **Clinician review** (`src/views/RiskPanel.jsx`) — **Aim 3.** A recovery-risk model
   that flags patients deviating from their expected 12-month continence trajectory, with
   per-patient explainable drivers and a recommended review action. It flags for clinician
   review only; it does not direct treatment.

**Parked (not in the walkthrough):** `src/views/JourneySnapshot.jsx` is a consumer/patient
preview kept in the repo but removed from `STEPS` / `VIEWS`. It is not part of the research
demo.

## Stack
- React 18 + Vite 5, plain JavaScript/JSX (no TypeScript).
- `recharts` for charts, `lucide-react` for icons.
- No router library — `App.jsx` swaps views with `useState`. `STEPS` in `Nav.jsx`
  defines the order.

## Conventions (please follow these)
- **All synthetic data lives in `src/data/mockData.js`.** Prefer editing data there over
  hardcoding values inside views. The same `recoveryTrajectory` and `DOMAINS` feed both
  the status-quo clinician chart and the surgeon view — keep them consistent.
- **Colors come from `src/theme.js`** (the `C` object). Don't introduce new hex codes in
  components; add to `theme.js` if needed.
- **Each view scopes its CSS** in a `<style>` block using a unique class prefix so styles
  never collide: `eq-` (StatusQuo), `wr-` (PatientRoad), `wc-` (Surgeon), `rp-` (RiskPanel),
  `js-` (JourneySnapshot, parked), `nv-` (Nav). Keep that discipline if you add components.
- **Fonts** (Inter / Lora) load once in `src/index.css`. Don't re-import.
- No browser storage (localStorage/sessionStorage) — keep state in React.

## Design language
High-Integrity Minimalist — authoritative, institutional, structural (enterprise
software meets a premium consultancy like Bain/McKinsey). Stark white blocks
encased in heavy near-black frames (`border`), sharp squared corners, NO drop
shadows or organic shapes. One disciplined accent (`accent`, electric blue) for
active / selected / primary-data states; everything else is black, white, and
gray. Geometric sans (Inter, bold weights, tight tracking) for authoritative
headings; Lora (serif) — uppercase, tracked, small — for UI labels, steps
("STEP 01"), and data callouts. The recovery "span" fills geometrically (square
nodes filling with the accent) rather than blooming. No points/badges.

## Honesty
Everything is synthetic and labeled as such. The surgical-decision → recovery links and the
recovery-risk model are illustrative and hypothesis-generating, not validated causal claims;
keep the "may be associated with" / "internally validated, illustrative" / "not validated"
language intact. The risk model flags for clinician review only — never present it as
diagnosing, directing treatment, or assigning intervention. EPIC-26 is University-of-Michigan
copyrighted but free to use with no license. Keep these disclaimers intact.

## Common tasks
- **Change the patient / numbers:** edit `src/data/mockData.js`.
- **Add a recovery-road window or submission slot:** edit `roadWindows` in `mockData.js`.
- **Add a surgical decision link:** add to `decisions` in `mockData.js` (give it `target`
  domain keys, a `cohort` block, and an optional `phaseMatch` string).
- **Reorder or rename the demo steps:** edit `STEPS` in `src/components/Nav.jsx`.
- **Add a view:** create `src/views/NewView.jsx`, add it to `VIEWS` and `STEPS`, and give
  it a unique CSS prefix.

## Run / build
- `npm install` then `npm run dev` (local), `npm run build` (production to `dist/`).
