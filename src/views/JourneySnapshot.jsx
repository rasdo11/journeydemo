import {
  AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft, Award, Stethoscope, Quote, Activity, Footprints, Wind,
  Heart, TrendingUp, ChevronRight, Sparkles, Share2, FileDown, Users,
} from "lucide-react";
import { C } from "../theme.js";
import {
  journey, surgeonBio, surgeryHistory, exercisesDone, journeyBenchmark, recommendations, opNote, matchedPatient,
} from "../data/mockData.js";

const css = `
.js-root{font-family:'Inter',system-ui,sans-serif;color:${C.ink};}
.js-root *{box-sizing:border-box;}
.js-serif{font-family:'Inter',system-ui,sans-serif;font-weight:700;letter-spacing:-.02em;}
.js-mono{font-family:'IBM Plex Mono',ui-monospace,monospace;}
.js-eyebrow{font-family:'IBM Plex Mono',ui-monospace,monospace;text-transform:uppercase;
  letter-spacing:.16em;font-size:10px;font-weight:600;color:${C.stone};}
.js-panel{background:${C.surface};border:1.5px solid ${C.border};border-radius:3px;}
.js-back{appearance:none;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);
  color:${C.paper};border-radius:2px;padding:8px 14px;font-size:13px;font-weight:500;cursor:pointer;
  font-family:'Inter',sans-serif;display:inline-flex;align-items:center;gap:7px;transition:all .15s;}
.js-back:hover{background:rgba(255,255,255,.16);}
.js-back:focus-visible{outline:2px solid ${C.clay};outline-offset:2px;}
.js-sectlabel{display:flex;align-items:center;gap:8px;margin-bottom:14px;}
.js-bar{height:9px;border-radius:6px;background:${C.mist};overflow:hidden;}
.js-barfill{height:100%;border-radius:6px;background:${C.canopy};}
.js-tl-item{display:flex;gap:16px;padding-bottom:22px;position:relative;}
.js-tl-rail{position:absolute;left:31px;top:8px;bottom:-6px;width:2px;background:${C.line};}
.js-tl-year{width:64px;flex-shrink:0;text-align:right;font-family:'IBM Plex Mono',monospace;font-size:12px;
  font-weight:500;color:${C.clayDeep};padding-top:1px;}
.js-tl-dot{width:13px;height:13px;border-radius:50%;background:${C.canopy};border:3px solid ${C.surface};
  box-shadow:0 0 0 1px ${C.line};flex-shrink:0;margin-top:2px;z-index:1;}
.js-rec{display:flex;gap:14px;padding:16px;border:1px solid ${C.line};border-radius:2px;background:${C.surface};}
.js-rectag{font-family:'IBM Plex Mono',monospace;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;
  color:${C.clayDeep};background:${C.accentSoft};border-radius:2px;padding:3px 7px;display:inline-block;}
.js-action{appearance:none;border:1px solid ${C.bark};background:${C.accent};color:${C.bark};border-radius:2px;
  padding:11px 14px;font-size:13px;font-weight:800;cursor:pointer;font-family:'Inter',sans-serif;
  display:inline-flex;align-items:center;gap:8px;letter-spacing:-.01em;}
.js-action.secondary{background:${C.surface};}
.js-fade{animation:jsf .4s ease;}
@keyframes jsf{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
@media (prefers-reduced-motion:reduce){.js-fade{animation:none;}.js-back{transition:none;}}
`;

const tick = { fontSize: 11, fontFamily: "IBM Plex Mono, monospace", fill: C.stone };

function GradeRing({ percentile, letter }) {
  const r = 52, circ = 2 * Math.PI * r;
  const dash = (percentile / 100) * circ;
  return (
    <svg viewBox="0 0 130 130" width="130" height="130" role="img" aria-label={`Recovery grade ${letter}`}>
      <circle cx="65" cy="65" r={r} fill="none" stroke={C.mist} strokeWidth="11" />
      <circle cx="65" cy="65" r={r} fill="none" stroke={C.accent} strokeWidth="11" strokeLinecap="butt"
        strokeDasharray={`${dash} ${circ}`} transform="rotate(-90 65 65)" />
      <text x="65" y="60" textAnchor="middle" className="js-serif" style={{ fontSize: 34, fontWeight: 800, fill: C.bark }}>{letter}</text>
      <text x="65" y="82" textAnchor="middle" className="js-mono" style={{ fontSize: 10, letterSpacing: ".1em", fill: C.stone }}>{percentile}th pctl</text>
    </svg>
  );
}

const exIcons = [Activity, Footprints, Wind];

export default function JourneySnapshot({ setView }) {
  return (
    <div className="js-root">
      <style>{css}</style>

      {/* hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.bark} 0%, ${C.night2} 72%, ${C.accentInk} 100%)`, color: C.paper }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "20px 24px 0" }}>
          <button className="js-back" onClick={() => setView && setView("patient")}>
            <ArrowLeft size={15} /> Back to my recovery span
          </button>
        </div>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "26px 24px 40px", display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          <svg viewBox="0 0 300 120" width="300" height="120" style={{ maxWidth: "100%" }} aria-hidden="true">
            <rect x="14" y="64" width="272" height="2" fill="rgba(255,255,255,.22)" />
            <rect x="14" y="64" width="150" height="2" fill={C.accent} />
            {[14, 50, 86, 122, 158, 194, 230, 266].map((x, i) => (
              <rect key={i} x={x} y={58} width="1.5" height="14" fill="rgba(255,255,255,.28)" />
            ))}
            <rect x="160" y="44" width="8" height="8" fill={C.accent} />
            <rect x="163" y="52" width="2" height="14" fill={C.accent} />
            <text x="164" y="34" textAnchor="middle" fill="#fff" style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, fontWeight: 600, letterSpacing: ".05em" }}>DAY {journey.daysSince}</text>
            <text x="14" y="92" fill="rgba(255,255,255,.5)" style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 8.5, letterSpacing: ".12em" }}>SURGERY</text>
            <text x="286" y="92" textAnchor="end" fill="rgba(255,255,255,.5)" style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 8.5, letterSpacing: ".12em" }}>1 YEAR</text>
          </svg>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="js-eyebrow" style={{ color: "rgba(255,255,255,.6)" }}>Day {journey.daysSince} · your journey so far</div>
            <h1 className="js-serif" style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, lineHeight: 1.02, letterSpacing: "-.03em", margin: "8px 0 0" }}>
              {journey.heroName}, look how far you've come.
            </h1>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <button className="js-action"><Share2 size={15} /> Share with surgeon</button>
              <button className="js-action secondary"><FileDown size={15} /> Export recovery record</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 24px 56px", display: "grid", gap: 26 }}>

        {/* grade */}
        <div className="js-panel js-fade" style={{ padding: 24, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <GradeRing percentile={journey.grade.percentile} letter={journey.grade.letter} />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div className="js-sectlabel"><Award size={16} color={C.clayDeep} /><span className="js-eyebrow">Your recovery grade</span></div>
            <h2 className="js-serif" style={{ fontSize: 24, fontWeight: 500, margin: "0 0 8px", color: C.bark }}>{journey.grade.headline}</h2>
            <p style={{ fontSize: 13.5, color: C.stone, lineHeight: 1.55, margin: "0 0 10px" }}>
              You're tracking better than roughly <strong style={{ color: C.ink }}>{journey.grade.percentile}%</strong> of men at this point after the same surgery.
            </p>
            <div style={{ fontSize: 11.5, color: C.stone, fontStyle: "italic", lineHeight: 1.5, background: C.mist, borderRadius: 2, padding: "10px 12px" }}>
              {journey.grade.note}
            </div>
          </div>
        </div>

        {/* the story */}
        <div className="js-fade">
          <div className="js-sectlabel"><Heart size={16} color={C.clayDeep} /><span className="js-eyebrow">Your story so far</span></div>
          <div style={{ display: "grid", gap: 16 }}>
            {journey.story.map((p, i) => (
              <p key={i} className={i === 0 ? "js-serif" : ""} style={{
                margin: 0, color: i === 0 ? C.bark : C.ink, lineHeight: 1.6,
                fontSize: i === 0 ? 20 : 15, fontWeight: i === 0 ? 500 : 400,
              }}>{p}</p>
            ))}
          </div>
        </div>

        {/* surgeon */}
        <div className="js-panel js-fade" style={{ padding: 24 }}>
          <div className="js-sectlabel"><Stethoscope size={16} color={C.clayDeep} /><span className="js-eyebrow">Your surgeon</span></div>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 64, height: 64, borderRadius: 2, background: C.bark, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "Inter, system-ui, sans-serif", fontSize: 24, fontWeight: 600 }}>
              {surgeonBio.initials}
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.bark }}>{surgeonBio.name}</div>
              <div className="js-eyebrow" style={{ marginTop: 2 }}>{surgeonBio.title}</div>
              <p style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.6, margin: "12px 0 0" }}>{surgeonBio.bio}</p>
              <p style={{ fontSize: 13.5, color: C.stone, lineHeight: 1.6, margin: "8px 0 0" }}>{surgeonBio.personal}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
            {surgeonBio.stats.map(([k, v]) => (
              <div key={k} style={{ flex: "1 1 130px", background: C.mist, borderRadius: 2, padding: "11px 13px" }}>
                <div className="js-serif" style={{ fontSize: 18, fontWeight: 600, color: C.bark }}>{v}</div>
                <div className="js-eyebrow" style={{ marginTop: 2, letterSpacing: ".1em" }}>{k}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 18, padding: "14px 16px", background: C.mist, borderRadius: 2 }}>
            <Quote size={18} color={C.canopy} style={{ flexShrink: 0, marginTop: 2 }} />
            <p className="js-serif" style={{ fontStyle: "italic", fontSize: 16, lineHeight: 1.5, color: C.ink, margin: 0 }}>"{surgeonBio.quote}"</p>
          </div>
        </div>

        {/* surgery — personal + historical */}
        <div className="js-panel js-fade" style={{ padding: 24 }}>
          <div className="js-sectlabel"><Award size={16} color={C.clayDeep} /><span className="js-eyebrow">Your surgery — and the century behind it</span></div>
          <p style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.6, margin: "0 0 6px" }}>
            What you had was a <strong>{opNote.procedure.toLowerCase()}</strong> with <strong>bilateral nerve-sparing</strong> — both delicate nerve bundles preserved. It is the most refined version of an operation more than a hundred years in the making.
          </p>
          <div style={{ marginTop: 20 }}>
            {surgeryHistory.map((h, i) => (
              <div key={h.year} className="js-tl-item">
                {i < surgeryHistory.length - 1 && <span className="js-tl-rail" />}
                <span className="js-tl-year">{h.year}</span>
                <span className="js-tl-dot" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.bark }}>{h.title}</div>
                  <div style={{ fontSize: 13, color: C.stone, lineHeight: 1.55, marginTop: 2 }}>{h.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* exercises */}
        <div className="js-panel js-fade" style={{ padding: 24 }}>
          <div className="js-sectlabel"><Activity size={16} color={C.clayDeep} /><span className="js-eyebrow">The work you've put in</span></div>
          <div style={{ display: "grid", gap: 16 }}>
            {exercisesDone.map((ex, i) => {
              const Icon = exIcons[i % exIcons.length];
              const pct = Math.round((ex.done / ex.target) * 100);
              return (
                <div key={ex.name}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                    <Icon size={16} color={C.stone} />
                    <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{ex.name}</span>
                    <span className="js-mono" style={{ fontSize: 12.5, color: C.bark }}>{ex.done}/{ex.target} {ex.unit}</span>
                  </div>
                  <div className="js-bar"><div className="js-barfill" style={{ width: `${pct}%` }} /></div>
                  <div className="js-eyebrow" style={{ marginTop: 5 }}>{ex.streak}-day streak · {pct}% of this stage</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* benchmark */}
        <div className="js-panel js-fade" style={{ padding: 24 }}>
          <div className="js-sectlabel"><TrendingUp size={16} color={C.clayDeep} /><span className="js-eyebrow">How you're tracking vs patients like you</span></div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: C.bark }}>Continence recovery — your first six weeks</div>
          <p style={{ fontSize: 12.5, color: C.stone, margin: "0 0 14px" }}>Your line against a matched synthetic cohort and the top finishers, same surgery.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            {matchedPatient.criteria.map((c) => (
              <span key={c} className="js-eyebrow" style={{ border: `1px solid ${C.line}`, borderRadius: 2, padding: "5px 8px", background: C.mist }}>{c}</span>
            ))}
          </div>
          <div style={{ height: 250, width: "100%" }}>
            <ResponsiveContainer>
              <AreaChart data={journeyBenchmark} margin={{ left: -16, right: 10, top: 6 }}>
                <defs>
                  <linearGradient id="jtop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.moss} stopOpacity={0.2} /><stop offset="100%" stopColor={C.moss} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.line} vertical={false} />
                <XAxis dataKey="t" tick={tick} axisLine={{ stroke: C.line }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={tick} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                  <div style={{ background: C.bark, color: C.paper, borderRadius: 2, padding: "9px 12px", fontSize: 12 }}>
                    <div className="js-mono" style={{ fontSize: 10, opacity: .7, marginBottom: 4 }}>{label}</div>
                    <div>You: {payload.find((p) => p.dataKey === "you")?.value}% pad-free</div>
                    <div style={{ opacity: .8 }}>Typical: {payload.find((p) => p.dataKey === "median")?.value}%</div>
                  </div>) : null} />
                <Area type="monotone" dataKey="top" stroke={C.moss} strokeWidth={1} fill="url(#jtop)" strokeDasharray="4 3" name="Top finishers" />
                <Line type="monotone" dataKey="median" stroke={C.stone} strokeWidth={1.6} dot={false} name="Typical" />
                <Line type="monotone" dataKey="you" stroke={C.canopy} strokeWidth={3} dot={{ r: 4, fill: C.canopy }} name="You" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 12 }}>
            {[["You", C.canopy], ["Typical", C.stone], ["Top finishers", C.moss]].map(([l, c]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12 }}>
                <span style={{ width: 13, height: 3, background: c, borderRadius: 2 }} /> {l}
              </span>
            ))}
          </div>
        </div>

        {/* recommendations */}
        <div className="js-fade">
          <div className="js-sectlabel"><Sparkles size={16} color={C.clayDeep} /><span className="js-eyebrow">How to push your journey further</span></div>
          <p style={{ fontSize: 13.5, color: C.stone, lineHeight: 1.55, margin: "0 0 16px", maxWidth: 620 }}>
            Drawn from men who reached the strongest one-year outcomes after this surgery — what set the top finishers apart.
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {recommendations.map((r) => (
              <div key={r.title} className="js-rec">
                <div style={{ width: 36, height: 36, borderRadius: 2, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ChevronRight size={18} color={C.clayDeep} />
                </div>
                <div>
                  <span className="js-rectag">{r.tag}</span>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: C.bark, margin: "7px 0 3px" }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: C.stone, lineHeight: 1.55 }}>{r.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="js-panel js-fade" style={{ padding: 24, display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Users size={20} color={C.clayDeep} />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div className="js-eyebrow">{matchedPatient.label} · n={matchedPatient.n} synthetic matches</div>
            <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.6, margin: "8px 0 0" }}>{matchedPatient.insight}</p>
          </div>
        </div>

        <button className="js-back" onClick={() => setView && setView("patient")}
          style={{ justifySelf: "start", background: C.bark, border: "0" }}>
          <ArrowLeft size={15} /> Back to my recovery span
        </button>

        <div style={{ fontSize: 11, color: C.stone, lineHeight: 1.6 }}>
          Demonstration with synthetic data. The recovery grade and percentile comparisons are illustrative previews; the scoring
          method has not been finalized. Surgical history is factual; the surgeon and patient are fictional.
        </div>
      </div>
    </div>
  );
}
