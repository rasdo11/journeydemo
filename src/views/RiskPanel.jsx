import { useState, useMemo } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ShieldAlert, ListChecks, ClipboardCheck, Info } from "lucide-react";
import { C } from "../theme.js";
import { riskCohort, continenceBand, riskModelCard } from "../data/mockData.js";

const css = `
.rp-root{font-family:'Inter',system-ui,sans-serif;color:${C.ink};}
.rp-root *{box-sizing:border-box;}
.rp-serif{font-family:'Inter',system-ui,sans-serif;font-weight:700;letter-spacing:-.02em;}
.rp-mono{font-family:'IBM Plex Mono',ui-monospace,monospace;}
.rp-eyebrow{font-family:'IBM Plex Mono',ui-monospace,monospace;text-transform:uppercase;
  letter-spacing:.16em;font-size:10px;font-weight:600;color:${C.stone};}
.rp-tag{display:inline-flex;align-items:center;gap:6px;border:1px solid ${C.line};border-radius:2px;
  padding:4px 10px;font-size:11px;color:${C.stone};background:${C.surface};}
.rp-panel{background:${C.surface};border:1.5px solid ${C.border};border-radius:3px;}
.rp-page{max-width:1200px;margin:0 auto;padding:26px 24px 8px;}
.rp-content{max-width:1200px;margin:0 auto;padding:18px 24px 40px;
  display:grid;grid-template-columns:360px minmax(0,1fr);gap:18px;align-items:start;}
.rp-right{display:grid;gap:18px;}
.rp-foot{max-width:1200px;margin:0 auto;padding:0 24px 24px;}

/* queue */
.rp-queuehead{display:flex;align-items:center;gap:8px;padding:14px 16px;border-bottom:1px solid ${C.line};}
.rp-row{appearance:none;width:100%;cursor:pointer;text-align:left;font-family:'Inter',sans-serif;
  display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:11px;align-items:center;
  padding:13px 16px;background:${C.surface};border:0;border-bottom:1px solid ${C.line};
  transition:background .14s;}
.rp-row:last-child{border-bottom:0;}
.rp-row:hover{background:${C.mist};}
.rp-row.on{background:${C.accentSoft};box-shadow:inset 3px 0 0 ${C.accent};}
.rp-row:focus-visible{outline:2px solid ${C.accent};outline-offset:-2px;}
.rp-av{width:38px;height:38px;border-radius:2px;background:${C.bark};color:#fff;
  display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:700;
  font-family:'IBM Plex Mono',monospace;letter-spacing:.04em;}
.rp-id{display:block;font-size:13.5px;font-weight:700;color:${C.bark};letter-spacing:-.01em;}
.rp-meta{display:block;font-size:11px;color:${C.stone};margin-top:2px;}
.rp-right-col{display:flex;flex-direction:column;align-items:flex-end;gap:6px;}
.rp-chip{font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:.1em;
  font-size:9px;font-weight:600;padding:3px 7px;border-radius:2px;white-space:nowrap;border:1px solid transparent;}
.rp-chip.off{background:${C.bark};color:#fff;}
.rp-chip.watch{background:transparent;color:${C.stone};border-color:${C.line};}
.rp-chip.on-track{background:${C.accent};color:${C.bark};}
.rp-dev{font-family:'IBM Plex Mono',monospace;font-size:12.5px;font-weight:600;color:${C.bark};}

/* detail */
.rp-block-head{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
.rp-driver{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid ${C.line};font-size:13px;line-height:1.45;color:${C.ink};}
.rp-driver:first-child{border-top:0;}
.rp-sq{width:8px;height:8px;flex-shrink:0;margin-top:5px;background:${C.accent};border-radius:1px;}
.rp-callout{border:1.5px solid ${C.bark};border-radius:2px;padding:14px 16px;background:${C.paper};}
.rp-modelchip{display:inline-block;font-size:11px;color:${C.ink};background:${C.mist};
  border:1px solid ${C.line};border-radius:2px;padding:4px 9px;line-height:1.3;}
.rp-fine{font-size:11px;color:${C.stone};line-height:1.55;}
@media (max-width:860px){
  .rp-page{padding:20px 14px 6px;}
  .rp-content{padding:14px 14px 30px;grid-template-columns:1fr!important;}
  .rp-foot{padding:0 14px 22px;}
  .rp-panel{border-width:1.25px;}
  .rp-row{min-height:60px;}
}
`;

const tick = { fontSize: 11, fontFamily: "IBM Plex Mono, monospace", fill: C.stone };
const TIER_RANK = { "off-trajectory": 0, watch: 1, "on-track": 2 };
const TIER_LABEL = { "off-trajectory": "Off-trajectory", watch: "Watch", "on-track": "On-track" };

function tierClass(tier) {
  if (tier === "off-trajectory") return "off";
  if (tier === "watch") return "watch";
  return "on-track";
}

function signed(n) {
  return n > 0 ? `+${n}` : `${n}`;
}

export default function RiskPanel() {
  // Review priority: off-trajectory first, then watch, then on-track.
  const sorted = useMemo(
    () => [...riskCohort].sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier]),
    []
  );
  // Default-select the most important case (the off-trajectory patient).
  const [selId, setSelId] = useState(
    () => (sorted.find((p) => p.tier === "off-trajectory") || sorted[0]).id
  );
  const sel = sorted.find((p) => p.id === selId) || sorted[0];

  // Merge the patient's observed points onto the expected band by timepoint so
  // the patient line shares the band's x-axis. Timepoints the patient hasn't
  // reached stay undefined, so the accent line simply stops there.
  const chartData = useMemo(() => {
    const byT = Object.fromEntries(sel.points.map((p) => [p.t, p.you]));
    return continenceBand.map((b) => ({ ...b, you: byT[b.t] }));
  }, [sel]);

  return (
    <div className="rp-root">
      <style>{css}</style>

      <div className="rp-page">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
          <span className="rp-tag">recovery-risk model · clinician-facing · synthetic cohort</span>
          <span className="rp-eyebrow">Step 04</span>
        </div>
        <div className="rp-eyebrow">Clinician review queue</div>
        <h1 className="rp-serif" style={{ fontSize: "clamp(23px,3vw,34px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-.025em", margin: "4px 0 6px", color: C.bark, maxWidth: 860 }}>
          Patients whose 12-month continence recovery is deviating from their expected trajectory.
        </h1>
        <p style={{ fontSize: 14, color: C.stone, maxWidth: 720, lineHeight: 1.55, margin: 0 }}>
          The recovery-risk model flags patients deviating from their expected 12-month continence
          trajectory — for clinician review, not automated action.
        </p>
      </div>

      <div className="rp-content">
        {/* LEFT — the queue */}
        <div className="rp-panel" style={{ overflow: "hidden", alignSelf: "start" }}>
          <div className="rp-queuehead">
            <ShieldAlert size={16} color={C.bark} />
            <span className="rp-eyebrow">Review queue · {sorted.length} patients</span>
          </div>
          {sorted.map((p) => (
            <button
              key={p.id}
              className={"rp-row" + (p.id === selId ? " on" : "")}
              onClick={() => setSelId(p.id)}
              aria-pressed={p.id === selId}
            >
              <span className="rp-av">{p.initials}</span>
              <span style={{ minWidth: 0 }}>
                <span className="rp-id">{p.id}</span>
                <span className="rp-meta">{p.age} · {p.technique} · {p.window}</span>
              </span>
              <span className="rp-right-col">
                <span className={"rp-chip " + tierClass(p.tier)}>{TIER_LABEL[p.tier]}</span>
                <span className="rp-dev">{signed(p.deviation)} pts</span>
              </span>
            </button>
          ))}
        </div>

        {/* RIGHT — selected-patient detail */}
        <div className="rp-right">
          {/* 1. trajectory chart */}
          <div className="rp-panel" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
              <div>
                <div className="rp-eyebrow" style={{ marginBottom: 3 }}>Continence trajectory vs expected band</div>
                <div className="rp-serif" style={{ fontSize: 18, color: C.bark }}>
                  {sel.id} · <span style={{ fontWeight: 500, color: C.stone, fontSize: 14 }}>{sel.age} · {sel.technique}</span>
                </div>
              </div>
              <span className="rp-dev" style={{ fontSize: 14 }}>{signed(sel.deviation)} pts vs expected</span>
            </div>
            <p style={{ fontSize: 12.5, color: C.stone, margin: "0 0 12px", lineHeight: 1.5 }}>
              Shaded band = expected recovery range (% pad-free). Dashed = expected. Blue = this patient.
            </p>
            <div style={{ height: 280, width: "100%" }}>
              <ResponsiveContainer>
                <ComposedChart data={chartData} margin={{ left: -14, right: 14, top: 6, bottom: 4 }}>
                  <CartesianGrid stroke={C.line} vertical={false} />
                  <XAxis dataKey="t" tick={tick} axisLine={{ stroke: C.line }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={tick} axisLine={false} tickLine={false}
                    label={{ value: "% pad-free", angle: -90, position: "insideLeft", offset: 16, style: { fontSize: 10, fontFamily: "IBM Plex Mono, monospace", fill: C.stone, letterSpacing: ".08em" } }} />
                  <Tooltip
                    contentStyle={{ border: `1px solid ${C.bark}`, borderRadius: 2, fontSize: 12, fontFamily: "Inter, sans-serif" }}
                    formatter={(v, name) => {
                      if (name === "band") return [null, null];
                      if (name === "exp") return [`${v}%`, "Expected"];
                      return [`${v}%`, "This patient"];
                    }}
                  />
                  <Area dataKey={(d) => [d.lo, d.hi]} name="band" stroke="none" fill={C.mist} fillOpacity={1} isAnimationActive={false} legendType="none" />
                  <Line type="monotone" dataKey="exp" name="exp" stroke={C.dim} strokeWidth={2} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="you" name="you" stroke={C.accent} strokeWidth={2.6} dot={{ r: 3.5, fill: C.accent }} connectNulls={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. why flagged */}
          <div className="rp-panel" style={{ padding: 20 }}>
            <div className="rp-block-head">
              <ListChecks size={16} color={C.bark} />
              <span className="rp-eyebrow">Why flagged · model explainability</span>
            </div>
            <div>
              {sel.drivers.map((d) => (
                <div key={d} className="rp-driver"><span className="rp-sq" />{d}</div>
              ))}
            </div>
          </div>

          {/* 3. recommended review */}
          <div className="rp-panel" style={{ padding: 20 }}>
            <div className="rp-block-head">
              <ClipboardCheck size={16} color={C.bark} />
              <span className="rp-eyebrow">Recommended review · a prompt, not an order</span>
            </div>
            <div className="rp-callout">
              <p style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.55, margin: 0 }}>{sel.review}</p>
            </div>
          </div>

          {/* 4. model card */}
          <div className="rp-panel" style={{ padding: 20 }}>
            <div className="rp-block-head">
              <Info size={16} color={C.bark} />
              <span className="rp-eyebrow">Model card</span>
            </div>
            <div className="rp-eyebrow" style={{ marginBottom: 4 }}>Primary outcome</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.bark, marginBottom: 14 }}>{riskModelCard.primaryOutcome}</div>
            <div className="rp-eyebrow" style={{ marginBottom: 8 }}>What the model combines</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 14 }}>
              {riskModelCard.inputs.map((i) => (<span key={i} className="rp-modelchip">{i}</span>))}
            </div>
            <p className="rp-fine" style={{ margin: "0 0 6px" }}><strong style={{ color: C.ink }}>Validation:</strong> {riskModelCard.validation}</p>
            <p className="rp-fine" style={{ margin: 0 }}><strong style={{ color: C.ink }}>Boundary:</strong> {riskModelCard.boundary}</p>
          </div>
        </div>
      </div>

      <div className="rp-foot">
        <div style={{ fontSize: 11, color: C.stone, lineHeight: 1.6 }}>
          Synthetic cohort. The model is illustrative and internally validated for demonstration only.
          JourneySpan flags for clinician review; it does not diagnose, direct treatment, or assign intervention.
        </div>
      </div>
    </div>
  );
}
