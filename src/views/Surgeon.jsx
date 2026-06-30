import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import {
  FileText, Video, Cpu, Link2, ChevronRight, Activity, CheckCircle2,
  GitBranch, Gauge, Scissors, Plus, Check, Users,
} from "lucide-react";
import { C } from "../theme.js";
import {
  opNote, intuitiveMetrics, surgeryPhases, decisions, recoveryTrajectory, DOMAINS, patient, matchedPatient,
} from "../data/mockData.js";

const css = `
.wc-root{font-family:'Inter',system-ui,sans-serif;color:${C.ink};}
.wc-root *{box-sizing:border-box;}
.wc-serif{font-family:'Inter',system-ui,sans-serif;font-weight:700;letter-spacing:-.02em;}
.wc-mono{font-family:'Lora',serif;}
.wc-eyebrow{font-family:'Lora',serif;text-transform:uppercase;
  letter-spacing:.16em;font-size:10px;font-weight:600;color:${C.stone};}
.wc-panel{background:${C.surface};border:1.5px solid ${C.border};border-radius:3px;}
.wc-tag{display:inline-flex;align-items:center;gap:6px;border:1px solid ${C.line};border-radius:2px;
  padding:4px 10px;font-size:11px;color:${C.stone};background:${C.surface};}
.wc-conn{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;color:${C.canopy};
  font-family:'Lora',serif;letter-spacing:.08em;text-transform:uppercase;}
.wc-dot{width:6px;height:6px;border-radius:6px;background:${C.canopy};}
.wc-row{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-top:1px solid ${C.line};font-size:13px;}
.wc-row:first-child{border-top:0;}
.wc-key{color:${C.stone};}
.wc-val{font-weight:500;text-align:right;}
.wc-phase{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:2px;background:${C.surface};
  border:1px solid ${C.line};font-size:12.5px;}
.wc-chip{appearance:none;cursor:pointer;font-family:'Inter',sans-serif;border-radius:2px;
  padding:11px 13px;font-size:13px;text-align:left;border:1px solid ${C.line};background:${C.surface};
  transition:all .15s;display:flex;flex-direction:column;gap:3px;}
.wc-chip:hover{border-color:${C.moss};}
.wc-chip.on{border-color:${C.clay};background:${C.accentSoft};box-shadow:0 0 0 1px ${C.clay} inset;}
.wc-chip:focus-visible{outline:2px solid ${C.clay};outline-offset:2px;}
.wc-btn{appearance:none;border:0;cursor:pointer;font-family:'Inter',sans-serif;border-radius:2px;
  padding:9px 14px;font-size:13px;font-weight:500;display:inline-flex;align-items:center;gap:7px;
  background:${C.bark};color:${C.paper};transition:all .15s;}
.wc-btn:hover{background:#26282E;}
.wc-btn:focus-visible{outline:2px solid ${C.clay};outline-offset:2px;}
.wc-stat{font-family:'Inter',system-ui,sans-serif;font-weight:500;color:${C.bark};line-height:.9;}
.wc-fade{animation:wcf .35s ease;}
@keyframes wcf{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:none;}}
@media (prefers-reduced-motion:reduce){.wc-fade{animation:none;}*{transition:none!important;}}
.wc-select{appearance:none;border:1px solid ${C.line};background:${C.surface};
  color:${C.ink};border-radius:2px;padding:7px 12px;font-size:13px;font-family:'Inter',sans-serif;cursor:pointer;}
.wc-empty{border:1px dashed ${C.line};border-radius:2px;padding:18px;text-align:center;background:${C.paper};}
.wc-page{max-width:1200px;margin:0 auto;padding:26px 24px 8px;}
.wc-headrow{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:14px;}
.wc-content{max-width:1200px;margin:0 auto;padding:18px 24px 40px;display:grid;grid-template-columns:340px minmax(0,1fr);gap:18px;align-items:start;}
.wc-left,.wc-right{display:grid;gap:18px;}
.wc-foot{max-width:1200px;margin:0 auto;padding:0 24px 24px;}
@media (max-width:860px){
  .wc-page{padding:20px 14px 6px;}
  .wc-headrow{display:grid;grid-template-columns:1fr;gap:10px;}
  .wc-select{width:100%;min-height:42px;}
  .wc-content{padding:14px 14px 30px;grid-template-columns:1fr!important;}
  .wc-foot{padding:0 14px 22px;}
  .wc-panel{border-width:1.25px;padding:16px!important;}
  .wc-chip{min-height:58px;}
  .wc-btn{width:100%;justify-content:center;min-height:42px;}
  .wc-row{font-size:12.5px;gap:8px;}
  .wc-key{min-width:0;}
  .wc-val{max-width:52%;overflow-wrap:anywhere;}
}
`;

const tick = { fontSize: 11, fontFamily: "Lora, serif", fill: C.stone };

export default function Surgeon() {
  const [decId, setDecId] = useState("nerve");
  const [imported, setImported] = useState({ intuitive: false, touch: false });
  const dec = decisions.find((d) => d.id === decId);
  const targetSet = new Set(dec.target);

  return (
    <div className="wc-root">
      <style>{css}</style>
      <div className="wc-page">
        <div className="wc-headrow">
          <span className="wc-tag">operative → recovery · prototype</span>
          <select className="wc-select" defaultValue="0418" aria-label="Select case">
            <option value="0418">{patient.id} · {patient.age}M · RALP · {patient.surgeon}</option>
            <option value="0451">PT-0451 · 58M · RALP · {patient.surgeon}</option>
          </select>
        </div>
        <div className="wc-eyebrow">The loop, closed</div>
        <h1 className="wc-serif" style={{ fontSize: "clamp(23px,3vw,34px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-.025em", margin: "4px 0 6px", color: C.bark, maxWidth: 840 }}>
          From the operative note to the recovery span: tracing a surgical decision to the outcome it may be associated with.
        </h1>
        <p style={{ fontSize: 14, color: C.stone, maxWidth: 700, lineHeight: 1.55, margin: 0 }}>
          The EMR operative note is the baseline. Optional OR-data imports add depth. The recovery data is the patient's own JourneySpan
          record. Select a decision to highlight the linked recovery domain and the hypothesis-generating pattern across the surgeon's cohort.
        </p>
      </div>

      <div className="wc-content">
        {/* LEFT */}
        <div className="wc-left">
          {/* op note: baseline */}
          <div className="wc-panel" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={16} color={C.bark} /><span className="wc-eyebrow">Operative note</span>
              </div>
              <span className="wc-conn"><span className="wc-dot" /> EMR · baseline</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{opNote.procedure}</div>
            <div className="wc-eyebrow" style={{ marginBottom: 12 }}>{opNote.platform}</div>
            <div>{opNote.fields.map(([k, v]) => (<div key={k} className="wc-row"><span className="wc-key">{k}</span><span className="wc-val">{v}</span></div>))}</div>
            <div style={{ marginTop: 14, padding: 12, background: C.mist, borderRadius: 2, fontSize: 12.5, lineHeight: 1.5, color: C.ink }}>
              <span className="wc-eyebrow" style={{ display: "block", marginBottom: 5 }}>Surgeon impression</span>{opNote.impression}
            </div>
          </div>

          {/* My Intuitive: optional import */}
          <div className="wc-panel" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Cpu size={16} color={C.bark} /><span className="wc-eyebrow">System & kinematic data</span>
              </div>
              {imported.intuitive
                ? <span className="wc-conn"><Check size={12} color={C.canopy} /> My Intuitive</span>
                : <span className="wc-tag" style={{ color: C.stone }}>optional</span>}
            </div>
            {imported.intuitive ? (
              <div className="wc-fade">
                {intuitiveMetrics.map(([k, v]) => (<div key={k} className="wc-row"><span className="wc-key">{k}</span><span className="wc-val">{v}</span></div>))}
                <div className="wc-eyebrow" style={{ marginTop: 12, lineHeight: 1.5, letterSpacing: ".06em" }}>Case Insights-class metrics paired with the objective OR signal and recovery.</div>
              </div>
            ) : (
              <div className="wc-empty">
                <div style={{ fontSize: 13, color: C.stone, lineHeight: 1.55, marginBottom: 12 }}>
                  Pull console time, instrument choreography, and economy-of-motion from a surgeon-initiated My Intuitive export.
                </div>
                <button className="wc-btn" onClick={() => setImported((s) => ({ ...s, intuitive: true }))}><Plus size={14} /> Import from My Intuitive</button>
              </div>
            )}
          </div>

          {/* Touch Surgery: optional import */}
          <div className="wc-panel" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Video size={16} color={C.bark} /><span className="wc-eyebrow">Surgical video</span>
              </div>
              {imported.touch
                ? <span className="wc-conn"><Check size={12} color={C.canopy} /> Touch Surgery</span>
                : <span className="wc-tag" style={{ color: C.stone }}>optional</span>}
            </div>
            {imported.touch ? (
              <div className="wc-fade">
                <div style={{ background: `linear-gradient(120deg, ${C.bark}, ${C.night2})`, borderRadius: 2, padding: "14px 16px", color: C.paper, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Full case · 1:53:40</div>
                    <div className="wc-eyebrow" style={{ color: "rgba(255,255,255,.6)", marginTop: 2 }}>auto-segmented · 7 phases</div>
                  </div>
                  <ChevronRight size={18} color={C.paper} />
                </div>
                <div className="wc-eyebrow" style={{ marginBottom: 8 }}>Phases · linked to the active decision</div>
                <div style={{ display: "grid", gap: 6 }}>
                  {surgeryPhases.map(([p, t]) => {
                    const linked = dec.phaseMatch && p.includes(dec.phaseMatch);
                    return (
                      <div key={p} className="wc-phase" style={linked ? { borderColor: C.clay, background: C.accentSoft } : {}}>
                        <Scissors size={13} color={linked ? C.clayDeep : C.stone} />
                        <span style={{ flex: 1, fontWeight: linked ? 600 : 400 }}>{p}</span>
                        <span className="wc-mono" style={{ color: C.stone }}>{t}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="wc-empty">
                <div style={{ fontSize: 13, color: C.stone, lineHeight: 1.55, marginBottom: 12 }}>
                  Surface the auto-segmented case video and key phases via Touch Surgery's EMR connectivity.
                </div>
                <button className="wc-btn" onClick={() => setImported((s) => ({ ...s, touch: true }))}><Plus size={14} /> Connect Touch Surgery</button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="wc-right">
          <div className="wc-panel" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <GitBranch size={16} color={C.clayDeep} /><span className="wc-eyebrow">Surgical decisions: select to trace the link</span>
            </div>
            <p style={{ fontSize: 12.5, color: C.stone, margin: "0 0 14px" }}>Each decision points to the recovery domain it may be associated with.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 9 }}>
              {decisions.map((d) => (
                <button key={d.id} className={"wc-chip" + (decId === d.id ? " on" : "")} onClick={() => setDecId(d.id)} aria-pressed={decId === d.id}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{d.label}</span>
                  <span style={{ fontSize: 11.5, color: C.stone }}>{d.value}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="wc-panel wc-fade" key={decId} style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Activity size={16} color={C.bark} /><span className="wc-eyebrow">Patient recovery · JourneySpan record</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
              <Link2 size={15} color={C.clayDeep} />
              <span style={{ fontSize: 14, fontWeight: 600, color: C.bark }}>{dec.label}</span>
              <ChevronRight size={14} color={C.stone} />
              <span style={{ fontSize: 14, color: C.clayDeep, fontWeight: 600 }}>{dec.target.map((t) => DOMAINS.find((d) => d.key === t).label).join(" + ")}</span>
            </div>
            <div style={{ height: 250, width: "100%" }}>
              <ResponsiveContainer>
                <LineChart data={recoveryTrajectory} margin={{ left: -16, right: 12, top: 6 }}>
                  <CartesianGrid stroke={C.line} vertical={false} />
                  <XAxis dataKey="t" tick={tick} axisLine={{ stroke: C.line }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={tick} axisLine={false} tickLine={false} />
                  <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                    <div style={{ background: C.bark, color: C.paper, borderRadius: 2, padding: "10px 12px", fontSize: 12 }}>
                      <div className="wc-mono" style={{ fontSize: 10, opacity: .7, marginBottom: 5 }}>{label}</div>
                      {payload.filter((p) => targetSet.has(p.dataKey)).map((p) => (<div key={p.name}>{DOMAINS.find((d) => d.key === p.dataKey).label}: {p.value}</div>))}
                    </div>) : null} />
                  {DOMAINS.map((d) => {
                    const on = targetSet.has(d.key);
                    return <Line key={d.key} type="monotone" dataKey={d.key} stroke={on ? d.color : C.dim} strokeWidth={on ? 3.2 : 1.4} dot={on ? { r: 3, fill: d.color } : false} strokeOpacity={on ? 1 : 0.5} />;
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginTop: 12, padding: "12px 13px", background: C.accentSoft, borderRadius: 2, border: `1px solid ${C.clay}` }}>
              <Link2 size={15} color={C.clayDeep} style={{ marginTop: 1, flexShrink: 0 }} />
              <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 }}>{dec.note}</div>
            </div>
          </div>

          <div className="wc-panel wc-fade" key={decId + "-c"} style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Gauge size={16} color={C.bark} /><span className="wc-eyebrow">Across the surgeon's cohort</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
              {dec.label} vs {dec.cohort.y}
              {dec.cohort.lowerBetter && <span style={{ fontSize: 12, color: C.stone, fontWeight: 400 }}> · lower is better</span>}
            </div>
            <div style={{ height: 200, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={dec.cohort.cats.map((c, i) => ({ c, v: dec.cohort.vals[i] }))} margin={{ left: -18, right: 12, top: 6 }}>
                  <CartesianGrid stroke={C.line} vertical={false} />
                  <XAxis dataKey="c" tick={tick} axisLine={{ stroke: C.line }} tickLine={false} />
                  <YAxis tick={tick} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: C.mist, opacity: 0.4 }} content={({ active, payload, label }) => active && payload?.length ? (
                    <div style={{ background: C.bark, color: C.paper, borderRadius: 2, padding: "8px 11px", fontSize: 12 }}>{label}: {payload[0].value}</div>) : null} />
                  <Bar dataKey="v" radius={[6, 6, 0, 0]}>
                    {dec.cohort.cats.map((_, i) => <Cell key={i} fill={i === dec.cohort.hi ? C.clay : C.mist} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
              <CheckCircle2 size={14} color={C.clayDeep} />
              <span style={{ fontSize: 12.5, color: C.stone }}>Highlighted bar = this patient's surgical choice. The pattern is the research signal JourneySpan generates at scale.</span>
            </div>
          </div>

          <div className="wc-panel" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Users size={16} color={C.bark} /><span className="wc-eyebrow">Matched cohort lens</span>
            </div>
            <p style={{ fontSize: 12.5, color: C.stone, lineHeight: 1.55, margin: "0 0 12px" }}>
              Compare decisions against patients like this one before treating a pattern as meaningful.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {matchedPatient.criteria.map((c) => (
                <span key={c} className="wc-tag" style={{ background: C.mist }}>{c}</span>
              ))}
            </div>
            <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5, borderTop: `1px solid ${C.line}`, paddingTop: 12 }}>
              {matchedPatient.label}: <strong>n={matchedPatient.n}</strong> synthetic matches. {matchedPatient.insight}
            </div>
          </div>
        </div>
      </div>

      <div className="wc-foot">
        <div style={{ fontSize: 11, color: C.stone, lineHeight: 1.6 }}>
          Baseline source: structured operative note from the EMR. Optional imports: surgeon-initiated case export from My Intuitive;
          Touch Surgery Enterprise video via its EMR connectivity. Deeper kinematic / Case Insights data would come via a research
          data-sharing agreement. Recovery data is the JourneySpan PRO record. All figures synthetic; correlations illustrative, not validated.
        </div>
      </div>
    </div>
  );
}
