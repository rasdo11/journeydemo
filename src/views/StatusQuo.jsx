import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea,
} from "recharts";
import { FileText, AlertTriangle, ArrowRight, Lock, Scissors } from "lucide-react";
import { C } from "../theme.js";
import { epicBlocks, epicAllItems, epicTimeline, DOMAINS, recoveryTrajectory } from "../data/mockData.js";

const css = `
.eq-root{font-family:'Inter',system-ui,sans-serif;color:${C.ink};}
.eq-root *{box-sizing:border-box;}
.eq-serif{font-family:'Inter',system-ui,sans-serif;font-weight:700;letter-spacing:-.02em;}
.eq-mono{font-family:'IBM Plex Mono',ui-monospace,monospace;}
.eq-eyebrow{font-family:'IBM Plex Mono',ui-monospace,monospace;text-transform:uppercase;
  letter-spacing:.16em;font-size:10px;font-weight:600;color:${C.stone};}
.eq-seg{display:inline-flex;background:${C.mist};border-radius:2px;padding:4px;gap:4px;}
.eq-seg button{appearance:none;border:0;cursor:pointer;border-radius:2px;padding:8px 16px;font-size:13px;
  font-weight:500;color:${C.stone};background:transparent;font-family:'Inter',sans-serif;transition:all .18s;}
.eq-seg button.on{background:${C.bark};color:${C.paper};}
.eq-seg button:focus-visible{outline:2px solid ${C.clay};outline-offset:2px;}
.eq-panel{background:${C.surface};border:1.5px solid ${C.border};border-radius:3px;}
.eq-tag{display:inline-flex;align-items:center;gap:6px;border:1px solid ${C.line};border-radius:2px;
  padding:4px 10px;font-size:11px;color:${C.stone};background:${C.surface};}
.eq-tl{display:flex;align-items:stretch;gap:0;width:100%;overflow-x:auto;padding-bottom:4px;}
.eq-stop{flex:1;min-width:96px;border:0;background:transparent;cursor:pointer;text-align:left;
  font-family:'Inter',sans-serif;padding:0;}
.eq-stop:focus-visible{outline:2px solid ${C.clay};outline-offset:2px;border-radius:2px;}
.eq-node{height:14px;display:flex;align-items:center;}
.eq-rail{height:2px;background:${C.line};flex:1;}
.eq-dot{width:14px;height:14px;border-radius:50%;background:${C.surface};border:2px solid ${C.stone};flex-shrink:0;}
.eq-stop.on .eq-dot{background:${C.clay};border-color:${C.clay};}
.eq-stop.event .eq-dot{background:${C.bark};border-color:${C.bark};border-radius:3px;}
.eq-stop.void .eq-dot{background:${C.void};border-color:${C.line};border-style:dashed;}
.eq-stoplabel{margin-top:10px;}
.eq-q{border-top:1px solid ${C.line};padding:16px 0;}
.eq-opts{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px;}
.eq-opt{appearance:none;border:1px solid ${C.line};background:${C.surface};cursor:pointer;
  border-radius:2px;padding:8px 12px;font-size:12.5px;color:${C.ink};font-family:'Inter',sans-serif;
  transition:all .14s;line-height:1.3;}
.eq-opt:hover{border-color:${C.moss};}
.eq-opt.sel{background:${C.canopy};border-color:${C.canopy};color:#fff;}
.eq-opt:focus-visible{outline:2px solid ${C.clay};outline-offset:2px;}
.eq-blockhead{font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:.16em;
  font-size:11px;color:${C.clayDeep};margin:26px 0 2px;}
.eq-scorebar{height:8px;border-radius:6px;background:${C.mist};overflow:hidden;}
.eq-scorefill{height:100%;border-radius:6px;}
.eq-stat{font-family:'Inter',system-ui,sans-serif;font-weight:500;color:${C.bark};line-height:.9;}
.eq-fade{animation:eqf .35s ease;}
@keyframes eqf{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:none;}}
@media (prefers-reduced-motion:reduce){.eq-fade{animation:none;}.eq-seg button,.eq-opt{transition:none;}}
.eq-th{text-align:left;font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:.1em;
  font-size:10px;color:${C.stone};padding:8px 10px;font-weight:500;}
.eq-td{padding:11px 10px;font-size:13px;border-top:1px solid ${C.line};}
.eq-page{max-width:1160px;margin:0 auto;padding:26px 24px 8px;}
.eq-body{max-width:1160px;margin:0 auto;padding:22px 24px 40px;}
.eq-foot{max-width:1160px;margin:0 auto;padding:0 24px 24px;}
.eq-topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:14px;}
.eq-hero-grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(260px,1fr);gap:18px;align-items:start;}
.eq-main-grid{display:grid;grid-template-columns:minmax(0,1fr) 270px;gap:18px;}
@media (max-width:720px){
  .eq-page{padding:20px 14px 6px;}
  .eq-body{padding:16px 14px 28px;}
  .eq-foot{padding:0 14px 20px;}
  .eq-topbar{display:grid;grid-template-columns:1fr;gap:10px;}
  .eq-tag{width:100%;justify-content:center;text-align:center;}
  .eq-seg{width:100%;display:grid;grid-template-columns:1fr 1fr;}
  .eq-seg button{padding:10px 8px;font-size:12px;}
  .eq-hero-grid{grid-template-columns:1fr!important;gap:12px;}
  .eq-main-grid{grid-template-columns:1fr!important;}
  .eq-tl{padding-bottom:10px;}
  .eq-stop{min-width:86px;}
  .eq-panel{border-width:1.25px;}
  .eq-q{padding:14px 0;}
  .eq-opts{margin-left:0!important;}
  .eq-opt{width:100%;justify-content:flex-start;text-align:left;}
  .eq-th,.eq-td{padding:8px 6px;font-size:11.5px;}
}
`;

const tickStyle = { fontSize: 11, fontFamily: "IBM Plex Mono, monospace", fill: C.stone };

export default function StatusQuo() {
  const [view, setView] = useState("patient");
  return (
    <div className="eq-root">
      <style>{css}</style>
      <div className="eq-page">
        <div className="eq-topbar">
          <span className="eq-tag">EPIC-26 · the status quo · synthetic data</span>
          <div className="eq-seg" role="tablist" aria-label="Choose a view">
            <button role="tab" aria-selected={view === "patient"} className={view === "patient" ? "on" : ""} onClick={() => setView("patient")}>What the patient gets</button>
            <button role="tab" aria-selected={view === "clinic"} className={view === "clinic" ? "on" : ""} onClick={() => setView("clinic")}>What the doctor sees</button>
          </div>
        </div>
        <div className="eq-eyebrow">{view === "patient" ? "The survey, in a visual overview" : "The instrument's output, as actually read"}</div>
        {view === "patient" ? (
          <div className="eq-hero-grid">
            <div>
              <h1 className="eq-serif" style={{ fontSize: "clamp(23px,3.2vw,36px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-.025em", margin: "4px 0 10px", color: C.bark, maxWidth: 800 }}>
                For many, the post-op patient experience doesn't begin for 8 weeks.
              </h1>
              <p style={{ fontSize: 14, color: C.stone, maxWidth: 680, lineHeight: 1.55, margin: 0 }}>
                Click a point on the care timeline to see what the patient is asked there, where, on their first crucial days of recovery, they're asked nothing at all.
              </p>
            </div>
            <div className="eq-panel" style={{ padding: "14px 16px", background: C.accentSoft, borderColor: C.accent }}>
              <div className="eq-eyebrow" style={{ color: C.accentInk, marginBottom: 7 }}>The status quo gap</div>
              <p style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.55, margin: 0 }}>
                The main problem with the EPIC-26 and other PROMs is the vague alignment between its numeric scores and a patient's actual functional capabilities.
              </p>
            </div>
          </div>
        ) : (
          <>
            <h1 className="eq-serif" style={{ fontSize: "clamp(23px,3.2vw,36px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-.025em", margin: "4px 0 6px", color: C.bark, maxWidth: 800 }}>
              Five domain scores at five moments: the entire picture recovery is judged on today.
            </h1>
            <p style={{ fontSize: 14, color: C.stone, maxWidth: 660, lineHeight: 1.55, margin: 0 }}>
              Validated, free, widely used, and structurally limited in ways that define what a better instrument would fix.
            </p>
          </>
        )}
      </div>
      <div className="eq-body">
        {view === "patient" ? <PatientView /> : <ClinicianView />}
      </div>
      <div className="eq-foot">
        <div style={{ fontSize: 11, color: C.stone, lineHeight: 1.6 }}>
          EPIC-26 developed at the University of Michigan; free to use, no license required. Timeline reflects the ICHOM localized
          prostate cancer standard set; trajectory and scores are synthetic, patterned on published radical-prostatectomy outcomes.
        </div>
      </div>
    </div>
  );
}

function PatientView() {
  const [stop, setStop] = useState("acute");
  const [ans, setAns] = useState({});
  const current = epicTimeline.find((t) => t.id === stop);

  const domainScores = useMemo(() => {
    const out = {};
    DOMAINS.forEach((d) => {
      const items = epicAllItems.filter((i) => i.dom === d.key);
      const vals = items.map((i) => (ans[i.id] != null ? i.std[ans[i.id]] : null)).filter((v) => v != null);
      out[d.key] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
    });
    return out;
  }, [ans]);

  const answered = Object.keys(ans).length;
  const isSurvey = current.kind === "survey";

  return (
    <div className="eq-fade">
      <div className="eq-panel" style={{ padding: "20px 22px", marginBottom: 18 }}>
        <div className="eq-eyebrow" style={{ marginBottom: 14 }}>The care timeline · when EPIC-26 is given</div>
        <div className="eq-tl">
          {epicTimeline.map((t, i) => (
            <button key={t.id} className={"eq-stop " + (t.kind === "event" ? "event " : t.kind === "void" ? "void " : "") + (stop === t.id ? "on" : "")}
              onClick={() => t.kind !== "event" && setStop(t.id)} disabled={t.kind === "event"} aria-pressed={stop === t.id}>
              <div className="eq-node">
                <span className="eq-rail" style={{ visibility: i === 0 ? "hidden" : "visible" }} />
                <span className="eq-dot" />
                <span className="eq-rail" style={{ visibility: i === epicTimeline.length - 1 ? "hidden" : "visible" }} />
              </div>
              <div className="eq-stoplabel">
                <div style={{ fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  {t.kind === "event" && <Scissors size={12} color={C.bark} />}{t.label}
                </div>
                <div className="eq-eyebrow" style={{ letterSpacing: ".1em", marginTop: 2 }}>{t.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="eq-main-grid">
        <div className="eq-panel" style={{ padding: "22px 24px" }}>
          {isSurvey ? (
            <>
              <div className="eq-eyebrow" style={{ marginBottom: 6 }}>{current.label} · {current.sub} · the same 26 items every visit</div>
              <h3 className="eq-serif" style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px", color: C.bark }}>Please answer about the last 4 weeks</h3>
              <p style={{ fontSize: 13, color: C.stone, margin: "0 0 8px", lineHeight: 1.5 }}>The form is identical whether you're 3 months or 2 years out. It asks you to recall a month at once.</p>
              <div style={{ maxHeight: 560, overflowY: "auto", paddingRight: 6 }}>
                {epicBlocks.map((b) => (
                  <div key={b.title}>
                    <div className="eq-blockhead">{b.title}</div>
                    {b.items.map((it) => (
                      <div key={it.id} className="eq-q">
                        <div style={{ display: "flex", gap: 8 }}>
                          <span className="eq-mono" style={{ fontSize: 11, color: C.stone, paddingTop: 2, minWidth: 22 }}>{it.id}</span>
                          <span style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.4 }}>{it.text}</span>
                        </div>
                        <div className="eq-opts" style={{ marginLeft: 30 }}>
                          {it.opts.map((o, idx) => (
                            <button key={o} className={"eq-opt" + (ans[it.id] === idx ? " sel" : "")}
                              onClick={() => setAns((s) => ({ ...s, [it.id]: idx }))} aria-pressed={ans[it.id] === idx}>{o}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <Lock size={26} color={C.stone} style={{ marginBottom: 14 }} />
              <h3 className="eq-serif" style={{ fontSize: 22, fontWeight: 500, margin: "0 0 8px", color: C.bark }}>Nothing is collected here</h3>
              <p style={{ fontSize: 14, color: C.stone, maxWidth: 380, margin: "0 auto", lineHeight: 1.6 }}>
                The acute recovery window includes the catheter, first leaks, and early continence work. It is exactly when the patient struggles most.
                But a four-week recall survey can't run mid-recovery, so the status quo captures none of it.
              </p>
              <button className="eq-tag" style={{ marginTop: 18, cursor: "pointer", borderColor: C.clay, color: C.clayDeep }} onClick={() => setStop("3mo")}>
                Jump to the first survey (3 months) <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="eq-panel" style={{ padding: 18, position: "sticky", top: 84 }}>
            <div className="eq-eyebrow" style={{ marginBottom: 4 }}>What your answers become</div>
            <div style={{ fontSize: 13, color: C.stone, marginBottom: 16, lineHeight: 1.5 }}>
              {isSurvey ? `${answered} of 26 answered. Five 0–100 domain scores: the only thing that reaches your chart.` : "No survey at this visit, so no scores."}
            </div>
            {DOMAINS.map((d) => {
              const v = domainScores[d.key];
              return (
                <div key={d.key} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{d.label}</span>
                    <span className="eq-mono" style={{ fontSize: 13, color: v == null ? C.stone : C.bark }}>{v == null ? "-" : v}</span>
                  </div>
                  <div className="eq-scorebar"><div className="eq-scorefill" style={{ width: `${v ?? 0}%`, background: d.color, opacity: v == null ? 0.25 : 1 }} /></div>
                </div>
              );
            })}
            <hr style={{ border: 0, borderTop: `1px solid ${C.line}`, margin: "8px 0 12px" }} />
            <div style={{ fontSize: 11.5, color: C.stone, lineHeight: 1.5 }}>26 nuanced answers collapse to 5 numbers. The texture of which moment, which trigger, and why it happened is not kept.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClinicianView() {
  const base = recoveryTrajectory[0];
  const last = recoveryTrajectory[recoveryTrajectory.length - 1];
  return (
    <div className="eq-fade" style={{ display: "grid", gap: 18 }}>
      <div className="eq-panel" style={{ padding: 22 }}>
        <div className="eq-eyebrow" style={{ marginBottom: 6 }}>What the clinician receives · one patient, two years</div>
        <h3 className="eq-serif" style={{ fontSize: 21, fontWeight: 500, margin: "0 0 2px", color: C.bark }}>Five domain scores, five points in time</h3>
        <p style={{ fontSize: 13, color: C.stone, margin: "0 0 18px" }}>The classic prostatectomy signature: continence craters then recovers; sexual function takes a deep, durable hit.</p>
        <div style={{ height: 300, width: "100%" }}>
          <ResponsiveContainer>
            <LineChart data={recoveryTrajectory} margin={{ left: -14, right: 14, top: 6, bottom: 4 }}>
              <ReferenceArea x1="Baseline" x2="3 months" fill={C.void} fillOpacity={0.5} />
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis dataKey="t" tick={tickStyle} axisLine={{ stroke: C.line }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={tickStyle} axisLine={false} tickLine={false} />
              <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                <div style={{ background: C.bark, color: C.paper, borderRadius: 2, padding: "10px 12px", fontSize: 12 }}>
                  <div className="eq-mono" style={{ fontSize: 10, opacity: .7, marginBottom: 5, letterSpacing: ".08em" }}>{label}</div>
                  {payload.map((p) => (
                    <div key={p.name} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ width: 8, height: 8, borderRadius: 8, background: p.stroke }} />
                      {DOMAINS.find((d) => d.key === p.dataKey)?.label}: {p.value}
                    </div>
                  ))}
                </div>) : null} />
              {DOMAINS.map((d) => (
                <Line key={d.key} type="monotone" dataKey={d.key} stroke={d.color}
                  strokeWidth={d.key === "sex" || d.key === "incont" ? 2.6 : 1.8} dot={{ r: 3, fill: d.color }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 14 }}>
          {DOMAINS.map((d) => (
            <span key={d.key} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12 }}>
              <span style={{ width: 13, height: 3, background: d.color, borderRadius: 2 }} /> {d.label}
            </span>
          ))}
          <span className="eq-tag" style={{ marginLeft: "auto" }}>
            <span style={{ width: 11, height: 11, background: C.void, borderRadius: 2, display: "inline-block" }} /> shaded = the unmeasured acute window
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
        <div className="eq-panel" style={{ padding: 22 }}>
          <div className="eq-eyebrow" style={{ marginBottom: 12 }}>Change from baseline at 24 months</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th className="eq-th">Domain</th>
                <th className="eq-th" style={{ textAlign: "right" }}>Base</th>
                <th className="eq-th" style={{ textAlign: "right" }}>Now</th>
                <th className="eq-th" style={{ textAlign: "right" }}>Δ</th>
                <th className="eq-th">Meaningful?</th>
              </tr>
            </thead>
            <tbody>
              {DOMAINS.map((d) => {
                const delta = last[d.key] - base[d.key];
                const meaningful = Math.abs(delta) >= d.mid;
                return (
                  <tr key={d.key}>
                    <td className="eq-td" style={{ fontWeight: 500 }}>
                      <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 8, background: d.color, marginRight: 7 }} />{d.label}
                    </td>
                    <td className="eq-td eq-mono" style={{ textAlign: "right", color: C.stone }}>{base[d.key]}</td>
                    <td className="eq-td eq-mono" style={{ textAlign: "right" }}>{last[d.key]}</td>
                    <td className="eq-td eq-mono" style={{ textAlign: "right", color: delta < 0 ? C.clayDeep : C.canopy, fontWeight: 500 }}>{delta > 0 ? "+" : ""}{delta}</td>
                    <td className="eq-td" style={{ fontSize: 11.5, color: meaningful ? C.clayDeep : C.stone }}>{meaningful ? `yes (≥ ${d.mid} MID)` : "below MID"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ fontSize: 11, color: C.stone, marginTop: 12, lineHeight: 1.5 }}>
            MID = minimally important difference. Published EPIC-26 ranges: incontinence 6–9, irritative 5–7, bowel 4–6, sexual 10–12, hormonal 4–6.
          </div>
        </div>

        <div className="eq-panel" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={15} color={C.clayDeep} /><span className="eq-eyebrow">What this baseline can and cannot see</span>
          </div>
          {[
            ["Five snapshots in two years", "Between visits, the chart is a flat line drawn through dots. The dips and recoveries in the gaps are invisible."],
            ["A blind acute window", "The 0–8 week period, when continence and catheter struggles peak, is never captured."],
            ["Four-week recall", "Each score asks a man to average a month of fluctuating experience into one answer, at a clinic visit."],
            ["One fixed form", "The week-12 and month-24 patient see the identical 26 questions. Nothing adapts to where they are."],
            ["Function and bother, not why", "A score of 34 records the level, never the cause, the context, or the patient's own words."],
          ].map(([h, b], i) => (
            <div key={h} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: i ? `1px solid ${C.line}` : "none" }}>
              <div className="eq-mono" style={{ fontSize: 11, color: C.clayDeep, paddingTop: 2 }}>{String(i + 1).padStart(2, "0")}</div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{h}</div>
                <div style={{ fontSize: 12.5, color: C.stone, lineHeight: 1.5 }}>{b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
