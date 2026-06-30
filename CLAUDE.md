# JourneySpan demo — orientation for Claude Code

## What this is
A single-page demo of JourneySpan, a patient-reported-outcomes platform for
prostate-cancer (radical prostatectomy) recovery. It is the visual companion to a
DoD PCRP grant application built around three specific aims. **Every view maps to
one aim — keep that mapping intact when editing.**

## The narrative arc (and the aim each view supports)
Fixed order, defined by `STEPS` in `src/components/Nav.jsx`:

1. **Status quo** (`src/views/StatusQuo.jsx`) — the EPIC-26 instrument as used
   today: faithful 26 items with live 0–100 domain scoring, plus the sparse
   clinician administration schedule with an explicit "0–8 weeks: no survey" void.
   Purpose: establish the problem (the care cliff). Sets up Aims 1–3.
2. **Patient experience** (`src/views/PatientRoad.jsx`) — **Aim 2.** The recovery
   "span": optional, multimodal (photo / voice / survey), non-linear submissions
   within time windows, densest in the first 90 days and thinning through month
   12. Includes milestone videos and a non-emergency concern inbox. This is the
   prospective longitudinal capture engine.
3. **Surgeon & post-care** (`src/views/Surgeon.jsx`) — **Aim 1.** The structured
   EMR operative note (baseline) with optional My Intuitive / Touch Surgery
   imports, and an interactive link from each operative/technique decision to the
   recovery domain it may be associated with, plus a cohort pattern. This is the
   "factors associated with recovery" exploration.
4. **Clinician review queue** (`src/views/RiskPanel.jsx`) — **Aim 3.** A
   recovery-risk model that flags patients deviating from their expected 12-month
   continence trajectory, with per-patient explainable drivers, a recommended
   *review* action, and a model card. This is the kept Aim 3 deliverable: a model
   that IDENTIFIES at-risk patients plus a clinician workflow. It does not direct
   treatment.

**Parked (not in the walkthrough):** `src/views/JourneySnapshot.jsx` is a
consumer/patient-experience preview kept in the repo but removed from `STEPS`/
`VIEWS`. It is NOT part of the research demo. Do not re-add it to the nav without
first removing its grade/percentile/streak gamification (see "Honesty" below).

## Stack
- React 18 + Vite 5, plain JavaScript/JSX (no TypeScript).
- `recharts` for charts, `lucide-react` for icons.
- No router library — `App.jsx` swaps views with `useState`. `STEPS` in `Nav.jsx`
  defines the order; `VIEWS` in `App.jsx` maps ids to components. Keep them in sync.

## Conventions (please follow these)
- **All synthetic data lives in `src/data/mockData.js`.** Prefer editing data
  there over hardcoding in views. `recoveryTrajectory` / `DOMAINS` feed both the
  status-quo chart and the surgeon view; `continenceBand` / `riskCohort` /
  `riskModelCard` feed the clinician review queue — keep them consistent.
- **Colors come from `src/theme.js`** (the `C` object). Don't introduce new hex
  codes in components; add to `theme.js` if truly needed. The arboreal token names
  (`canopy`, `bark`, `moss`, `leaf`, `clay`, `void`, `bare`) are LEGACY ALIASES
  already remapped to the blue accent system — do not rename them and do not
  rabbit-hole into a cosmetic token migration.
- **Each view scopes its CSS** in a `<style>` block with a unique class prefix so
  styles never collide: `eq-` (StatusQuo), `wr-` (PatientRoad), `wc-` (Surgeon),
  `rp-` (RiskPanel), `js-` (JourneySnapshot, parked), `nv-` (Nav). Keep this
  discipline if you add components.
- **Fonts** (Inter / IBM Plex Mono) load once in `src/index.css`. Don't re-import.
- No browser storage (localStorage/sessionStorage) — keep state in React.

## Design language
High-Integrity Minimalist — authoritative, institutional, structural (enterprise
software meets a premium consultancy). Warm editorial paper background, stark
white blocks encased in heavy near-black frames, sharp squared corners, NO drop
shadows or organic shapes. One disciplined accent (`accent`, prostate-cancer-
ribbon blue) for active / selected / primary-data states; everything else is
near-black, paper, and gray. Geometric sans (Inter, bold weights, tight tracking)
for headings; IBM Plex Mono — uppercase, tracked, small — for UI labels, steps
("STEP 01"), and data callouts. The recovery "span" fills geometrically (square
nodes filling with the accent) — it does NOT bloom or use a branch/leaf metaphor.
No points, badges, letter grades, or competitive percentile rankings anywhere
patient-facing.

## Honesty (load-bearing for the grant — do not weaken)
- Everything is synthetic and must stay labeled as such on every view.
- Surgical-decision → recovery links and the risk model are **illustrative and
  hypothesis-generating, not validated causal claims.** Keep the "may be
  associated with" / "internally validated, illustrative" / "not validated"
  language intact.
- The risk model **flags for clinician review only.** It must never be presented
  as diagnosing, directing treatment, or assigning intervention. The demo must
  not imply an interventional claim the aims explicitly disclaim.
- **Comparison/benchmarking is clinician-facing only** (it lives in RiskPanel and
  the Surgeon cohort view). Patient-facing surfaces stay non-graded and
  non-competitive. No letter grades or "better than X% of men" framing for
  patients — it risks IRB concerns and reads as tone-deaf to a patient reviewer.
- EPIC-26 is University-of-Michigan copyrighted but free to use with no license.
  Keep that note.

## Common tasks
- **Change the patient / numbers:** edit `src/data/mockData.js`.
- **Add a recovery-road window or submission slot:** edit `roadWindows`.
- **Add a surgical decision link:** add to `decisions` (give it `target` domain
  keys, a `cohort` block, optional `phaseMatch`).
- **Adjust the risk cohort or band:** edit `riskCohort` / `continenceBand` /
  `riskModelCard`. Keep tiers to on-track / watch / off-trajectory.
- **Reorder or rename the demo steps:** edit `STEPS` in `Nav.jsx` (and `VIEWS` in
  `App.jsx`).
- **Add a view:** create `src/views/NewView.jsx`, add it to `VIEWS` and `STEPS`,
  give it a unique CSS prefix, and map it to an aim in this file.
