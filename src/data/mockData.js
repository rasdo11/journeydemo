// ─────────────────────────────────────────────────────────────────────────
// JourneySpan demo — one synthetic dataset, read by all three views.
// Everything here is fictional, patterned on published radical-prostatectomy
// outcomes. Edit this file to change the demo's patient, numbers, or copy.
// EPIC-26 © University of Michigan; free to use, no license required.
// ─────────────────────────────────────────────────────────────────────────
import { C } from "../theme.js";

// The patient the whole demo follows.
export const patient = {
  id: "PT-0418",
  age: 61,
  technique: "Bilateral nerve-sparing",
  surgeon: "Dr. Mara Alvarez",
  dayPostOp: 35, // ~5 weeks out
};

// The five EPIC-26 recovery domains, with display colors.
export const DOMAINS = [
  { key: "incont", label: "Continence", color: C.canopy, mid: 8 },
  { key: "sex", label: "Sexual", color: C.clay, mid: 11 },
  { key: "irrit", label: "Urinary irritative", color: C.bark, mid: 6 },
  { key: "bowel", label: "Bowel", color: C.moss, mid: 5 },
  { key: "horm", label: "Hormonal", color: C.stone, mid: 5 },
];

// Canonical recovery trajectory (0–100, higher = better) shared by the
// status-quo clinician chart and the surgeon view.
export const recoveryTrajectory = [
  { t: "Baseline", incont: 92, sex: 60, irrit: 86, bowel: 96, horm: 91 },
  { t: "3 months", incont: 58, sex: 22, irrit: 82, bowel: 93, horm: 89 },
  { t: "6 months", incont: 76, sex: 31, irrit: 88, bowel: 95, horm: 90 },
  { t: "12 months", incont: 86, sex: 44, irrit: 90, bowel: 96, horm: 91 },
  { t: "24 months", incont: 88, sex: 49, irrit: 91, bowel: 96, horm: 90 },
];

// ── STATUS QUO (EPIC-26) ──────────────────────────────────────────────────
// The instrument, faithful to the short form. std arrays map each option to
// 0–100 (higher = better). Domains: incont(4) irrit(5) bowel(6) sex(6) horm(5).
const PROB5 = ["No problem", "Very small", "Small", "Moderate", "Big problem"];
const PROB5_STD = [100, 75, 50, 25, 0];

export const epicBlocks = [
  {
    title: "Urinary",
    items: [
      { id: "1", dom: "incont", text: "Over the past 4 weeks, how often have you leaked urine?",
        opts: ["More than once a day", "About once a day", "More than once a week", "About once a week", "Rarely or never"], std: [0, 25, 50, 75, 100] },
      { id: "2", dom: "incont", text: "Which best describes your urinary control during the last 4 weeks?",
        opts: ["No control whatsoever", "Frequent dribbling", "Occasional dribbling", "Total control"], std: [0, 33, 67, 100] },
      { id: "3", dom: "incont", text: "How many pads or adult diapers per day did you usually use to control leakage?",
        opts: ["None", "1 per day", "2 per day", "3 or more per day"], std: [100, 67, 33, 0] },
      { id: "4a", dom: "incont", text: "Problem: dripping or leaking urine", opts: PROB5, std: PROB5_STD },
      { id: "4b", dom: "irrit", text: "Problem: pain or burning on urination", opts: PROB5, std: PROB5_STD },
      { id: "4c", dom: "irrit", text: "Problem: bleeding with urination", opts: PROB5, std: PROB5_STD },
      { id: "4d", dom: "irrit", text: "Problem: weak urine stream or incomplete emptying", opts: PROB5, std: PROB5_STD },
      { id: "4e", dom: "irrit", text: "Problem: need to urinate frequently during the day", opts: PROB5, std: PROB5_STD },
      { id: "5", dom: "irrit", text: "Overall, how big a problem has your urinary function been?", opts: PROB5, std: PROB5_STD },
    ],
  },
  {
    title: "Bowel",
    items: [
      { id: "6a", dom: "bowel", text: "Problem: urgency to have a bowel movement", opts: PROB5, std: PROB5_STD },
      { id: "6b", dom: "bowel", text: "Problem: increased frequency of bowel movements", opts: PROB5, std: PROB5_STD },
      { id: "6c", dom: "bowel", text: "Problem: losing control of your stools", opts: PROB5, std: PROB5_STD },
      { id: "6d", dom: "bowel", text: "Problem: bloody stools", opts: PROB5, std: PROB5_STD },
      { id: "6e", dom: "bowel", text: "Problem: abdominal / pelvic / rectal pain", opts: PROB5, std: PROB5_STD },
      { id: "7", dom: "bowel", text: "Overall, how big a problem have your bowel habits been?", opts: PROB5, std: PROB5_STD },
    ],
  },
  {
    title: "Sexual",
    items: [
      { id: "8a", dom: "sex", text: "How would you rate your ability to have an erection?",
        opts: ["Very poor / none", "Poor", "Fair", "Good", "Very good"], std: [0, 25, 50, 75, 100] },
      { id: "8b", dom: "sex", text: "How would you rate your ability to reach orgasm (climax)?",
        opts: ["Very poor / none", "Poor", "Fair", "Good", "Very good"], std: [0, 25, 50, 75, 100] },
      { id: "9", dom: "sex", text: "How would you describe the usual QUALITY of your erections?",
        opts: ["None at all", "Not firm enough for any activity", "Firm enough for foreplay only", "Firm enough for intercourse"], std: [0, 33, 67, 100] },
      { id: "10", dom: "sex", text: "How would you describe the FREQUENCY of your erections?",
        opts: ["Never when I wanted one", "Less than half the time", "About half the time", "More than half the time", "Whenever I wanted one"], std: [0, 25, 50, 75, 100] },
      { id: "11", dom: "sex", text: "Overall, how would you rate your ability to function sexually?",
        opts: ["Very poor", "Poor", "Fair", "Good", "Very good"], std: [0, 25, 50, 75, 100] },
      { id: "12", dom: "sex", text: "Overall, how big a problem has your sexual function (or lack of it) been?", opts: PROB5, std: PROB5_STD },
    ],
  },
  {
    title: "Hormonal",
    items: [
      { id: "13a", dom: "horm", text: "Problem: hot flashes", opts: PROB5, std: PROB5_STD },
      { id: "13b", dom: "horm", text: "Problem: breast tenderness / enlargement", opts: PROB5, std: PROB5_STD },
      { id: "13c", dom: "horm", text: "Problem: feeling depressed", opts: PROB5, std: PROB5_STD },
      { id: "13d", dom: "horm", text: "Problem: lack of energy", opts: PROB5, std: PROB5_STD },
      { id: "13e", dom: "horm", text: "Problem: change in body weight", opts: PROB5, std: PROB5_STD },
    ],
  },
];

export const epicAllItems = epicBlocks.flatMap((b) => b.items);

// The sparse status-quo administration schedule.
export const epicTimeline = [
  { id: "base", label: "Baseline", sub: "pre-op", kind: "survey" },
  { id: "surg", label: "Surgery", sub: "RP", kind: "event" },
  { id: "acute", label: "0–8 weeks", sub: "no survey", kind: "void" },
  { id: "3mo", label: "3 months", sub: "post-op", kind: "survey" },
  { id: "6mo", label: "6 months", sub: "post-op", kind: "survey" },
  { id: "12mo", label: "12 months", sub: "post-op", kind: "survey" },
  { id: "24mo", label: "24 months", sub: "post-op", kind: "survey" },
];

// ── PATIENT RECOVERY ROAD ─────────────────────────────────────────────────
export const roadWindows = [
  { id: "base", label: "Before surgery", dates: "baseline", kind: "window",
    video: { who: "Dr. Mara Alvarez", role: "Urologic surgeon", dur: "2:40", note: "We set your personal baseline today — the function you're starting from. Everything after is measured against this, not against a stranger." },
    slots: [
      { type: "survey", title: "Baseline check-in", guide: "Your usual urinary, sexual, and energy levels before anything changes. This is the line we measure recovery against." },
      { type: "voice", title: "How you're feeling going in", guide: "30 seconds, your own words. Nerves, hopes, questions — it helps your team know you, not just your chart." },
    ] },
  { id: "surg", label: "Surgery", dates: "day 0", kind: "event",
    video: { who: "Dr. Mara Alvarez", role: "Urologic surgeon", dur: "3:10", note: "The first 48 hours: your catheter, what's normal, what isn't, and why a little blood in the urine is expected early on." },
    slots: [] },
  { id: "w02", label: "Weeks 0–2", dates: "days 1–14", kind: "window",
    video: { who: "Nurse Tomas Reyes", role: "Recovery nurse", dur: "4:05", note: "Living with the catheter at home: cleaning, leg-bag swaps, and the three things worth calling us about." },
    slots: [
      { type: "photo", title: "Urine color", guide: "A quick photo of your bag. Color tells us about hydration and flags blood early — far better than trying to describe it later." },
      { type: "voice", title: "First days at home", guide: "How is the catheter, sleep, and pain? Talk it through — we listen for what a 0–10 number can't carry." },
      { type: "survey", title: "Pain & comfort", guide: "Four quick questions on pain, sleep, and catheter comfort." },
    ] },
  { id: "w24", label: "Weeks 2–4", dates: "days 15–28", kind: "window",
    video: { who: "Dr. Mara Alvarez", role: "Urologic surgeon", dur: "3:30", note: "Catheter's out. Leaks now are normal and they improve. Here's what continence usually looks like at this stage." },
    slots: [
      { type: "photo", title: "Pad at day's end", guide: "An end-of-day photo of your pad helps us see leakage volume without you having to estimate it." },
      { type: "voice", title: "A leak moment", guide: "When did a leak catch you today? Walk us through the moment — standing, laughing, lifting. The trigger matters." },
      { type: "survey", title: "Pads & triggers", guide: "Pads per day and what sets leaks off. Quick." },
    ] },
  { id: "w46", label: "Weeks 4–6", dates: "days 29–42", kind: "window",
    video: { who: "Priya Shah, PT", role: "Pelvic floor therapist", dur: "5:20", note: "The pelvic-floor work that actually moves continence now — with a demo you can follow along at home." },
    slots: [
      { type: "photo", title: "Incision check (optional)", guide: "Only if something looks off — redness, opening, drainage. Otherwise skip it." },
      { type: "voice", title: "How the exercises feel", guide: "Are you finding the right muscles? Describe it — we can correct technique from how you talk about it." },
      { type: "survey", title: "Continence & energy", guide: "Progress on leaks, plus energy and mood this week." },
    ] },
  { id: "w68", label: "Weeks 6–8", dates: "days 43–56", kind: "window",
    video: { who: "Dr. Mara Alvarez", role: "Urologic surgeon", dur: "2:55", note: "Returning to activity: lifting, driving, work, intimacy — what's safe now and what to wait on." },
    slots: [
      { type: "photo", title: "Your choice", guide: "Pad, urine color, or anything you want a second set of eyes on." },
      { type: "voice", title: "What's still limiting you", guide: "The thing that's most in your way right now. Naming it helps us target support." },
      { type: "survey", title: "Activity & early function", guide: "Activity level, continence, and the first signs of sexual function." },
    ] },
  { id: "m3", label: "Month 3", dates: "~day 90", kind: "window",
    video: { who: "Dr. Mara Alvarez", role: "Urologic surgeon", dur: "3:15", note: "The three-month mark — where most men land, and what the next stretch of recovery tends to bring." },
    slots: [
      { type: "voice", title: "Reflect on the month", guide: "Looking back over the last month, what changed? Good and hard." },
      { type: "survey", title: "Recovery domains", guide: "A lighter check across urinary, sexual, and wellbeing." },
    ] },
  { id: "m6", label: "Month 6", dates: "~day 180", kind: "window",
    video: { who: "Dr. Mara Alvarez", role: "Urologic surgeon", dur: "2:30", note: "Six months in: what continued recovery looks like, and the options if any area is lagging." },
    slots: [
      { type: "voice", title: "Where you are now", guide: "Your own summary of how recovery feels at six months." },
      { type: "survey", title: "Recovery domains", guide: "The half-year check across your key domains." },
    ] },
  { id: "m12", label: "Month 12", dates: "~day 365", kind: "window",
    video: { who: "Dr. Mara Alvarez", role: "Urologic surgeon", dur: "2:10", note: "One year. We review the whole arc together and set what, if anything, comes next." },
    slots: [
      { type: "survey", title: "One-year review", guide: "The full picture, one year on." },
    ] },
];

// The patient's current window, and the submissions already made (seeds the
// road so it loads partly in bloom).
export const roadCurrent = "w46";
export const roadSeedSubs = {
  base: { survey: true, voice: true },
  w02: { photo: true, voice: true, survey: true },
  w24: { photo: true, voice: true },
  w46: { voice: true },
};

export const seedConcerns = [
  { from: "you", text: "Is it normal that leaks are worse in the evening?", when: "4 days ago" },
  { from: "team", text: "Very common — pelvic-floor fatigue builds over the day. Try a set of exercises after lunch. Flagged for Dr. Alvarez to review at your next visit.", when: "3 days ago" },
];

// ── SURGEON / POST-CARE ───────────────────────────────────────────────────
// Baseline source: the structured EMR operative note (always present).
export const opNote = {
  procedure: "Robot-assisted laparoscopic radical prostatectomy",
  platform: "da Vinci Xi · Intuitive",
  source: "Epic EMR · structured operative note",
  fields: [
    ["Approach", "Transperitoneal, 6-port robotic"],
    ["Nerve-sparing", "Bilateral, high (intrafascial)"],
    ["Bladder neck", "Preserved"],
    ["Posterior reconstruction", "Performed (Rocco stitch)"],
    ["Urethral length preserved", "16 mm"],
    ["Lymph node dissection", "Bilateral extended PLND"],
    ["Estimated blood loss", "120 mL"],
    ["Console time", "142 min"],
    ["Total operative time", "178 min"],
    ["Intra-op complications", "None"],
  ],
  impression: "Intrafascial bilateral nerve-sparing achieved without compromise; both neurovascular bundles preserved. Posterior reconstruction and bladder-neck preservation performed to support early continence. Anticipate favorable functional recovery.",
};

// Optional import: My Intuitive case export (loaded only when the surgeon
// chooses to import it).
export const intuitiveMetrics = [
  ["Console time", "142 min"],
  ["Instrument exchanges", "23"],
  ["Energy activations", "186"],
  ["Economy of motion", "0.81 (top quartile)"],
  ["Camera-out time", "4.2 min"],
];

// Optional import: Touch Surgery auto-segmented phases.
export const surgeryPhases = [
  ["Bladder mobilization", "11:20"],
  ["Bladder neck dissection", "18:05"],
  ["NVB preservation — left", "22:40"],
  ["NVB preservation — right", "24:15"],
  ["Apical dissection", "16:50"],
  ["Posterior reconstruction", "9:10"],
  ["Urethrovesical anastomosis", "21:30"],
];

// Surgical decisions and the recovery they shape.
export const decisions = [
  {
    id: "nerve", label: "Bilateral nerve-sparing", value: "Both NVBs preserved (intrafascial)",
    target: ["sex"], phaseMatch: "NVB",
    note: "Both neurovascular bundles preserved — this patient's sexual-function recovery is tracking ~8 points above the surgeon's cohort by month 6.",
    cohort: { cats: ["None", "Unilateral", "Bilateral"], vals: [18, 31, 49], hi: 2, y: "12-mo sexual fn", lowerBetter: false },
  },
  {
    id: "recon", label: "Posterior reconstruction", value: "Rocco stitch performed",
    target: ["incont"], phaseMatch: "reconstruction",
    note: "Posterior musculofascial reconstruction is associated with faster early continence — pad-free reached ~5 weeks sooner than non-reconstruction cases.",
    cohort: { cats: ["No recon", "Reconstruction"], vals: [3.4, 2.1], hi: 1, y: "months to pad-free", lowerBetter: true },
  },
  {
    id: "bnp", label: "Bladder-neck preservation", value: "Preserved",
    target: ["incont"], phaseMatch: "Bladder neck",
    note: "Bladder neck preserved — supports earlier continence and lower stress leakage in the first 3 months.",
    cohort: { cats: ["Resected", "Preserved"], vals: [58, 72], hi: 1, y: "3-mo continence", lowerBetter: false },
  },
  {
    id: "apex", label: "Urethral length", value: "16 mm preserved",
    target: ["incont"], phaseMatch: "Apical",
    note: "Greater preserved urethral length correlates with stronger continence recovery at 12 months.",
    cohort: { cats: ["<12 mm", "12–15 mm", "≥16 mm"], vals: [78, 84, 90], hi: 2, y: "12-mo continence", lowerBetter: false },
  },
  {
    id: "ebl", label: "Blood loss & efficiency", value: "EBL 120 mL · 142 min console",
    target: ["incont", "sex"], phaseMatch: null,
    note: "Low blood loss and efficient console time — fewer early complications and a smoother overall recovery pace.",
    cohort: { cats: ["High EBL", "Mid", "Low EBL"], vals: [71, 79, 86], hi: 2, y: "6-mo recovery index", lowerBetter: false },
  },
];

// ── JOURNEY SNAPSHOT ──────────────────────────────────────────────────────
// Everything the patient's "current journey" page reads from.
export const journey = {
  heroName: "James",
  daysSince: 47,
  // Hero-framed written story of the journey so far.
  story: [
    "Forty-seven days ago, you walked into an operating room and faced down prostate cancer. That takes a particular kind of courage — the quiet kind nobody applauds.",
    "You started from a strong place, and you didn't waste it. Through the hardest stretch — the catheter, the first leaks, the long nights of the first two weeks — you showed up anyway, telling us the truth about how it really was.",
    "And it's working. Your continence is returning ahead of where most men are at six weeks, and your energy is climbing back. This is your recovery. You are the one doing it.",
  ],
  // Illustrative grade — scoring method to be finalized later.
  grade: {
    letter: "B+",
    percentile: 72,
    headline: "Ahead of most, and still climbing",
    note: "Illustrative preview. This blends how your recovery is tracking against benchmarks with how consistently you log — the exact formula is still being designed.",
  },
};

export const surgeonBio = {
  name: "Dr. Mara Alvarez",
  title: "Urologic oncologist · robotic surgery",
  initials: "MA",
  stats: [
    ["In practice", "18 years"],
    ["Prostatectomies", "2,400+"],
    ["Nerve-sparing rate", "82%"],
    ["Fellowship", "Robotic & reconstructive urology"],
  ],
  bio: "Dr. Alvarez has spent nearly two decades on a single goal: removing the cancer while protecting the life a man wants to return to. Bilateral nerve-sparing is her signature, and she's among the higher-volume robotic prostatectomy surgeons in the region.",
  personal: "She came to medicine after caring for her own father through cancer, and she runs the city marathon most years. On the morning of surgery she tells every patient the same thing.",
  quote: "The cancer is my job. Your recovery is a partnership — and you do the hardest part of it.",
};

export const surgeryHistory = [
  { year: "1904", title: "The first operation", text: "At Johns Hopkins, Hugh Hampton Young performs the first radical prostatectomy, proving prostate cancer could be surgically removed at all." },
  { year: "1945", title: "A new route", text: "Terence Millin introduces the retropubic approach, reaching the prostate through the lower abdomen." },
  { year: "1982", title: "Saving the nerves", text: "Patrick Walsh maps the delicate nerves beside the prostate and pioneers nerve-sparing surgery — the breakthrough that protects continence and potency. Your operation descends directly from his." },
  { year: "2000s", title: "The robotic era", text: "The da Vinci system brings magnified 3D vision and steadier-than-human precision to the procedure." },
  { year: "Today", title: "Your surgery", text: "Bilateral nerve-sparing, robot-assisted, both nerve bundles preserved — more than a century of progress, performed for you." },
];

export const exercisesDone = [
  { name: "Pelvic floor sets", done: 41, target: 56, unit: "sessions", streak: 5 },
  { name: "Daily walks", done: 26, target: 42, unit: "days", streak: 6 },
  { name: "Breathing & relaxation", done: 14, target: 28, unit: "sessions", streak: 2 },
];

// Patient vs cohort, early weeks, continence (% pad-free).
export const journeyBenchmark = [
  { t: "Wk 0", you: 2, median: 3, top: 8 },
  { t: "Wk 2", you: 15, median: 10, top: 22 },
  { t: "Wk 4", you: 40, median: 30, top: 52 },
  { t: "Wk 6", you: 54, median: 44, top: 70 },
];

// Percentile-framed recommendations from those who finished full recovery.
export const recommendations = [
  { tag: "Continence", title: "Add one more pelvic-floor set a day", body: "Men in the top 20% of finishers averaged three sets daily by week six. You're at two — one more could move continence faster." },
  { tag: "Energy", title: "Stretch your walks toward 25 minutes", body: "Top finishers were back to 25-minute daily walks by week four. You're close, and a little more lifts both energy and mood." },
  { tag: "Consistency", title: "Keep your logging streak alive", body: "You log five-plus days a week, better than most. Consistent logging is the single habit most tied to a strong recovery." },
];
