# JourneySpan demo — build plan to strengthen the DoD PCRP application

Hand this whole file to Claude Code in the repo root. Execute the workstreams in
order. Workstream 1 is the only one that changes the application's strength; 2–4
are credibility hygiene. Keep all existing conventions (scoped `<style>` prefixes,
colors from `theme.js`, synthetic-data honesty, no browser storage).

The guiding principle: **each view must map to one specific aim, and the demo must
visibly contain Aim 3's deliverable** — a recovery-risk model plus a clinician
review workflow. Today the demo shows Aims 1 and 2 but not Aim 3.

Aim → view map after this plan is done:
- Status quo  → the problem (sparse EPIC-26, the care cliff)
- Patient experience → **Aim 2** (prospective multimodal capture, 0–12 mo)
- Surgeon & post-care → **Aim 1** (operative/technique factors ↔ recovery)
- Clinician review queue → **Aim 3** (risk model + review workflow)  ← NEW

---

## WORKSTREAM 1 — Build the clinician review queue (Aim 3). HIGHEST PRIORITY.

### 1a. Add data to `src/data/mockData.js`

Append this block (it reuses the existing synthetic patient PT-0418 as the
"on-track" exemplar so the cohort is internally consistent):

```js
// ── CLINICIAN RECOVERY-RISK MODEL (Aim 3) ────────────────────────────────
// Synthetic cohort for the clinician review queue. The model flags patients
// whose 12-month continence recovery is deviating from their expected
// trajectory. It IDENTIFIES for review; it does not direct treatment.

// What the illustrative model combines — mirrors the Aim 3 input set verbatim
// so a reviewer maps the demo to the aim instantly.
export const riskModelCard = {
  primaryOutcome: "Urinary continence recovery at 12 months",
  inputs: [
    "Baseline characteristics (age, baseline continence, comorbidities)",
    "Operative factors (nerve-sparing, reconstruction, urethral length, EBL)",
    "Longitudinal PROMs (EPIC-26 at clinical intervals)",
    "Short digital recovery assessments (pad counts, triggers, energy)",
    "Multimodal signals (voice distress language, photo-derived pad burden)",
  ],
  validation: "Internally validated (illustrative). Apparent AUC 0.81; optimism-corrected via bootstrap resampling.",
  boundary: "Flags patients for clinician review only. Does not diagnose, direct treatment, or assign intervention. Testing whether intervention changes outcomes would require a subsequent prospective trial.",
};

// Expected continence band (% pad-free) the model compares each patient against.
export const continenceBand = [
  { t: "Wk 0",  lo: 0,  hi: 10, exp: 3 },
  { t: "Wk 4",  lo: 22, hi: 52, exp: 34 },
  { t: "Wk 8",  lo: 38, hi: 68, exp: 52 },
  { t: "Mo 3",  lo: 52, hi: 80, exp: 66 },
  { t: "Mo 6",  lo: 64, hi: 88, exp: 78 },
  { t: "Mo 12", lo: 74, hi: 94, exp: 86 },
];

// tier: "on-track" | "watch" | "off-trajectory". deviation = pts vs expected.
// points = the patient's observed % pad-free at the timepoints they've reached.
export const riskCohort = [
  {
    id: "PT-0377", initials: "DW", age: 70, technique: "Non nerve-sparing",
    window: "Wk 4–6", tier: "off-trajectory", deviation: -22,
    points: [{ t: "Wk 0", you: 1 }, { t: "Wk 4", you: 14 }, { t: "Wk 8", you: 19 }],
    drivers: [
      "Continence far below expected band since Wk 4",
      "Voice signal: rising distress and isolation language",
      "Engagement dropped Wk 4–6 (two windows missed)",
      "Pad count not declining (still 3+/day)",
    ],
    review: "Surface for proactive outreach. Recovery deviating early and multimodal signals corroborate. Clinician decision required — consider early PT referral and a check-in call.",
  },
  {
    id: "PT-0392", initials: "RC", age: 67, technique: "Unilateral NS",
    window: "Wk 6–8", tier: "watch", deviation: -9,
    points: [{ t: "Wk 0", you: 2 }, { t: "Wk 4", you: 24 }, { t: "Wk 8", you: 38 }],
    drivers: [
      "Below expected band since Wk 4",
      "Pad count plateaued at 3/day",
      "Survey: rising nocturia",
    ],
    review: "Flag for review at next visit. Consider earlier pelvic-floor PT referral if no improvement by Mo 3.",
  },
  {
    id: "PT-0361", initials: "HK", age: 64, technique: "Unilateral NS",
    window: "Wk 6–8", tier: "watch", deviation: -7,
    points: [{ t: "Wk 0", you: 2 }, { t: "Wk 4", you: 30 }, { t: "Wk 8", you: 44 }],
    drivers: [
      "Slightly below expected band",
      "Good engagement (logs consistently)",
      "Photo: moderate pad burden persisting",
    ],
    review: "Monitor. Re-check at Mo 3; no referral yet.",
  },
  {
    id: "PT-0418", initials: "JM", age: 61, technique: "Bilateral NS",
    window: "Wk 4–6", tier: "on-track", deviation: 6,
    points: [{ t: "Wk 0", you: 3 }, { t: "Wk 4", you: 40 }, { t: "Wk 8", you: 56 }],
    drivers: [
      "Tracking above expected band",
      "High engagement (5+ logs/week)",
      "Voice signal: improving week-over-week",
    ],
    review: "No action. Continue standard follow-up.",
  },
  {
    id: "PT-0405", initials: "TS", age: 58, technique: "Bilateral NS",
    window: "Mo 3", tier: "on-track", deviation: 3,
    points: [{ t: "Wk 0", you: 4 }, { t: "Wk 4", you: 46 }, { t: "Mo 3", you: 70 }],
    drivers: [
      "Within expected band",
      "Consistent logging",
      "No adverse voice signals",
    ],
    review: "No action. On expected arc.",
  },
];
```

### 1b. Create `src/views/RiskPanel.jsx` (CSS prefix `rp-`)

Build a view that renders the kept Aim 3 deliverable. Requirements:

- **Header**: mono eyebrow `CLINICIAN REVIEW QUEUE`, a heading, and one subtitle
  line: *"The recovery-risk model flags patients deviating from their expected
  12-month continence trajectory — for clinician review, not automated action."*
- **Two-column layout** (stack on narrow screens):
  - **Left — the queue.** One row per `riskCohort` patient, **sorted
    off-trajectory → watch → on-track** (review priority). Each row: initials
    avatar, id, `age · technique`, current `window`, a tier chip, and the signed
    `deviation` in pts. Clicking a row selects it. Default-select the
    off-trajectory patient (PT-0377) so the most important case is open on load.
  - **Right — selected-patient detail**, four stacked blocks:
    1. **Trajectory chart** (recharts): shaded band area from `continenceBand`
       lo→hi (fill `C.mist`), expected line dashed (`C.dim`), and the patient's
       `points` as a solid `C.accent` line with dots. Y = "% pad-free", X = the
       band timepoints.
    2. **"Why flagged"** — render `drivers` as a list, each with a small square
       marker. This is the model's explainability (the answer to the SuRep
       "scorecards alone don't work" critique — it shows reasons, not a number).
    3. **"Recommended review"** — the `review` string in a bordered callout.
       Label it clearly as a review prompt, NOT an order.
    4. **Model card** — render `riskModelCard`: `primaryOutcome`, the `inputs`
       as small chips, then `validation` and `boundary` as fine print.
- **Tier colors** — stay within the palette; do NOT add a traffic-light scheme:
  - `on-track` → accent blue chip (`C.accent` bg, `C.bark` text)
  - `watch` → outlined chip (`C.stone` text, `C.line` border, transparent bg)
  - `off-trajectory` → solid near-black chip (`C.bark` bg, white text)
  You may add ONE muted warn token to `theme.js` if you find monochrome
  insufficient, but try the above first.
- **Footer disclaimer** (always visible): *"Synthetic cohort. The model is
  illustrative and internally validated for demonstration only. JourneySpan flags
  for clinician review; it does not diagnose, direct treatment, or assign
  intervention."*

Match the High-Integrity Minimalist design language: heavy near-black frames,
squared corners, no drop shadows, mono uppercase labels, `STEP 04` treatment
consistent with the other views.

### 1c. Wire it in

- `src/components/Nav.jsx` — replace the `STEPS` array with the reordered set
  (this also removes `journey` from the walkthrough; see Workstream 2):
  ```js
  export const STEPS = [
    { id: "status",  n: "01", label: "Status quo",         hint: "today's tool" },
    { id: "patient", n: "02", label: "Patient experience", hint: "the recovery span" },
    { id: "surgeon", n: "03", label: "Surgeon & post-care", hint: "the OR-to-recovery link" },
    { id: "risk",    n: "04", label: "Clinician review",    hint: "the recovery-risk model" },
  ];
  ```
- `src/App.jsx` — import `RiskPanel`; set
  `const VIEWS = { status: StatusQuo, patient: PatientRoad, surgeon: Surgeon, risk: RiskPanel };`
  Remove `journey` from `VIEWS`. You may keep the `JourneySnapshot` import
  commented out, or drop it (see Workstream 3).

---

## WORKSTREAM 2 — Reorder already handled above

The `STEPS`/`VIEWS` edits in 1c put the demo in aim order
(`status → patient → surgeon → risk`) and remove the gamified Journey Snapshot
from the funder walkthrough. Verify the prev/next bar in `App.jsx` still works
off `STEPS` (it should — it derives order from `STEPS`).

---

## WORKSTREAM 3 — Resolve the gamification tension

Default (recommended): **park `JourneySnapshot`.** It is already out of the nav
after Workstream 1. Leave the file in the repo so it can be revived for an
investor/consumer demo, but it is NOT part of the research walkthrough.

If the team instead wants a patient-record view kept in the walkthrough,
de-gamify it in place:
- In `src/data/mockData.js`: delete `journey.grade`; in `recommendations` remove
  competitive framing ("top 20% of finishers", percentile language) and reword as
  plain guidance; drop the `streak` emphasis from how `exercisesDone` is described.
- In `src/views/JourneySnapshot.jsx`: remove the `GradeRing` component and its
  usage, the letter grade, and the percentile ring; remove "tracking better than
  X% of men" comparative copy; keep the narrative `story` and a NON-comparative
  personal trajectory only.
Rationale: comparison/benchmarking is a **clinician-facing** function (it now
lives in RiskPanel). Patient-facing surfaces stay non-graded — this protects the
IRB posture and avoids a consumer/patient reviewer reading a letter grade on
cancer recovery as tone-deaf.

---

## WORKSTREAM 4 — Finish the JourneySpan rebrand

- `index.html` — the `<title>` and any meta tags / `<h1>` carry the JourneySpan
  brand (e.g. `JourneySpan: recovery, measured the way it is lived`). Confirm no
  legacy brand name remains.
- `README.md` — use `journeydemo` in the file tree and the Mac/terminal
  instructions, and keep the project/branch phrasing on the JourneySpan brand.
  Update the "three views" description to the four-view research arc above and
  note that Journey Snapshot is parked as a consumer preview.
- `CLAUDE.md` — keep it as the updated JourneySpan orientation doc.
- Repo-wide check: run a case-insensitive search for the legacy brand name and
  fix any remaining strings so only JourneySpan branding appears.
- **GUARDRAIL — do NOT rename these:** the color-token aliases in `theme.js`
  (`canopy`, `bark`, `moss`, `leaf`, `clay`, `void`, `bare`). They are internal
  names already remapped to the blue accent system; renaming them touches every
  view for zero user-visible benefit. Leave them.

---

## Acceptance check (run before deploy)

1. `npm run dev` — four steps in nav, in order: Status quo / Patient experience /
   Surgeon & post-care / Clinician review.
2. Clinician review loads with PT-0377 (off-trajectory) selected; its trajectory
   sits visibly below the band; drivers and a review prompt show; the model card
   lists the five inputs and the boundary statement.
3. Browser tab reads "JourneySpan".
4. No letter grade / percentile / streak anywhere in the walkthrough.
5. Every view still carries its synthetic-data disclaimer.
