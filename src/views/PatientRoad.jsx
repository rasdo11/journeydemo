import { useState, useMemo } from "react";
import {
  Camera, Mic, ClipboardList, Play, Square, MessageCircle, Lock,
  Check, ShieldAlert, Sparkles, Scissors, X, ArrowRight, BrainCircuit,
} from "lucide-react";
import { C } from "../theme.js";
import { roadWindows, roadCurrent, roadSeedSubs, seedConcerns, intelligenceSignals } from "../data/mockData.js";

function lerp(a, b, t) { return a + (b - a) * t; }
function hexToRgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
function mix(h1, h2, t) {
  const a = hexToRgb(h1), b = hexToRgb(h2);
  return `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;
}

const css = `
.wr-root{font-family:'Inter',system-ui,sans-serif;color:${C.ink};}
.wr-root *{box-sizing:border-box;}
.wr-serif{font-family:'Inter',system-ui,sans-serif;font-weight:700;letter-spacing:-.02em;}
.wr-mono{font-family:'IBM Plex Mono',ui-monospace,monospace;}
.wr-eyebrow{font-family:'IBM Plex Mono',ui-monospace,monospace;text-transform:uppercase;
  letter-spacing:.16em;font-size:10px;font-weight:600;color:${C.stone};}
.wr-panel{background:${C.surface};border:1.5px solid ${C.border};border-radius:3px;}
.wr-tag{display:inline-flex;align-items:center;gap:6px;border:1px solid ${C.line};border-radius:2px;
  padding:4px 10px;font-size:11px;color:${C.stone};background:${C.surface};}
.wr-node{cursor:pointer;}
.wr-node:focus-visible circle,.wr-node:focus-visible rect{stroke:${C.clay};stroke-width:3;}
.wr-slot{border:1px solid ${C.line};border-radius:2px;padding:16px;background:${C.surface};
  transition:border-color .15s;display:flex;flex-direction:column;gap:10px;}
.wr-slot.done{border-color:${C.canopy};background:${C.accentSoft};}
.wr-slot.locked{opacity:.55;}
.wr-icon{width:38px;height:38px;border-radius:2px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.wr-btn{appearance:none;border:0;cursor:pointer;font-family:'Inter',sans-serif;border-radius:2px;
  padding:9px 14px;font-size:13px;font-weight:500;display:inline-flex;align-items:center;gap:7px;transition:all .15s;}
.wr-btn.primary{background:${C.bark};color:${C.paper};}
.wr-btn.primary:hover{background:#26282E;}
.wr-btn.ghost{background:transparent;color:${C.clayDeep};border:1px solid ${C.line};}
.wr-btn.ghost:hover{border-color:${C.clay};}
.wr-btn:disabled{cursor:not-allowed;opacity:.5;}
.wr-btn:focus-visible{outline:2px solid ${C.clay};outline-offset:2px;}
.wr-pill{appearance:none;border:1px solid ${C.line};background:${C.surface};cursor:pointer;border-radius:2px;
  padding:7px 12px;font-size:12.5px;color:${C.ink};font-family:'Inter',sans-serif;transition:all .14s;}
.wr-pill:hover{border-color:${C.moss};}
.wr-pill.sel{background:${C.canopy};border-color:${C.canopy};color:#fff;}
.wr-video{position:relative;border-radius:2px;overflow:hidden;cursor:pointer;border:1px solid ${C.line};}
.wr-meter{height:9px;border-radius:6px;background:${C.mist};overflow:hidden;width:160px;}
.wr-meterfill{height:100%;border-radius:6px;background:${C.canopy};transition:width .5s ease;}
.wr-stat{font-family:'Inter',system-ui,sans-serif;font-weight:500;color:${C.bark};line-height:.9;}
.wr-fade{animation:wrf .35s ease;}
@keyframes wrf{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
@media (prefers-reduced-motion:reduce){.wr-fade{animation:none;}*{transition:none !important;}}
.wr-thread{background:${C.mist};border-radius:2px;padding:12px 14px;font-size:12.5px;line-height:1.5;}
.wr-area{width:100%;border:1px solid ${C.line};border-radius:2px;padding:11px 12px;font-size:13px;
  font-family:'Inter',sans-serif;resize:vertical;min-height:74px;background:${C.surface};color:${C.ink};}
.wr-area:focus{outline:2px solid ${C.clay};outline-offset:1px;}
`;

const MODE = {
  photo: { Icon: Camera, label: "Photo", bg: C.lilac, fg: C.clayDeep, verb: "Add a photo", done: "Photo shared" },
  voice: { Icon: Mic, label: "Voice", bg: C.mist, fg: C.clayDeep, verb: "Record a note", done: "Voice note shared" },
  survey: { Icon: ClipboardList, label: "Check-in", bg: C.mist, fg: C.bark, verb: "Start check-in", done: "Check-in done" },
};

const order = roadWindows.map((w) => w.id);
const VB_W = 1040, VB_H = 150;
const BASE_Y = 70;
const nodes = roadWindows.map((w, i) => {
  const x = 64 + (i * (VB_W - 128)) / (roadWindows.length - 1);
  return { ...w, x, y: BASE_Y, idx: i };
});

export default function PatientRoad({ setView }) {
  const [sel, setSel] = useState(roadCurrent);
  const [subs, setSubs] = useState(roadSeedSubs);
  const [openSurvey, setOpenSurvey] = useState(false);
  const [surveyAns, setSurveyAns] = useState({});
  const [video, setVideo] = useState(null);
  const [concerns, setConcerns] = useState(seedConcerns);
  const [draft, setDraft] = useState("");

  const status = (id) => {
    const i = order.indexOf(id), c = order.indexOf(roadCurrent);
    if (id === "surg") return "event";
    return i <= c ? "open" : "upcoming";
  };
  const fillOf = (w) => {
    if (w.kind === "event" || w.slots.length === 0) return 0;
    const s = subs[w.id] || {};
    return w.slots.filter((sl) => s[sl.type]).length / w.slots.length;
  };
  const totals = useMemo(() => {
    let avail = 0, done = 0, byMode = { photo: 0, voice: 0, survey: 0 };
    roadWindows.forEach((w) => {
      if (status(w.id) !== "open") return;
      w.slots.forEach((sl) => { avail++; if ((subs[w.id] || {})[sl.type]) { done++; byMode[sl.type]++; } });
    });
    return { avail, done, byMode, bloom: avail ? Math.round((done / avail) * 100) : 0 };
  }, [subs]);

  const selW = roadWindows.find((w) => w.id === sel);
  const selStatus = status(sel);
  const toggle = (winId, type) => setSubs((s) => ({ ...s, [winId]: { ...(s[winId] || {}), [type]: !(s[winId] || {})[type] } }));
  const submitSurvey = () => { toggle(sel, "survey"); setOpenSurvey(false); setSurveyAns({}); };
  const sendConcern = () => { if (!draft.trim()) return; setConcerns((c) => [...c, { from: "you", text: draft.trim(), when: "just now", pending: true }]); setDraft(""); };

  return (
    <div className="wr-root">
      <style>{css}</style>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 24px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
          <span className="wr-tag">recovery span · prototype</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="wr-eyebrow">Your span · {totals.bloom}% signal visible</span>
            <div className="wr-meter"><div className="wr-meterfill" style={{ width: `${totals.bloom}%` }} /></div>
          </div>
        </div>
        <div className="wr-eyebrow">Your recovery, sectioned into windows</div>
        <h1 className="wr-serif" style={{ fontSize: "clamp(23px,3vw,34px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-.025em", margin: "4px 0 6px", color: C.bark, maxWidth: 820 }}>
          Build the record in the windows that are open. The signal sharpens as you share.
        </h1>
        <p style={{ fontSize: 14, color: C.stone, maxWidth: 680, lineHeight: 1.55, margin: 0 }}>
          Nothing is required, and there's no order to follow. In each open window you can add a photo, a voice note, or a quick
          check-in, whatever you have the energy for. Every submission makes more of your recovery visible.
        </p>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 24px 0" }}>
        <div className="wr-panel" style={{ padding: "8px 8px 4px", overflowX: "auto" }}>
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="150" style={{ minWidth: 900 }} role="group" aria-label="Recovery span">
            {nodes.slice(0, -1).map((n, i) => {
              const m = nodes[i + 1]; const f = fillOf(n);
              const col = status(n.id) === "upcoming" ? C.bare : mix(C.bare, C.accent, f);
              return <rect key={"seg" + i} x={n.x} y={BASE_Y - 1.5} width={m.x - n.x} height={3} fill={col} />;
            })}
            {nodes.map((n) => {
              const st = status(n.id); const f = fillOf(n);
              const S = 24, half = S / 2; const sel_ = sel === n.id;
              return (
                <g key={n.id} className="wr-node" role="button" tabIndex={0} aria-label={`${n.label}, ${st}`}
                  onClick={() => { if (n.id !== "surg") { setSel(n.id); setOpenSurvey(false); } }}
                  onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && n.id !== "surg") { e.preventDefault(); setSel(n.id); setOpenSurvey(false); } }}>
                  {n.kind === "event" ? (
                    <>
                      <rect x={n.x - half} y={BASE_Y - half} width={S} height={S} fill={C.bark} stroke={sel_ ? C.accent : C.bark} strokeWidth="2" />
                      <Scissors x={n.x - 7} y={BASE_Y - 7} width={14} height={14} color="#fff" />
                    </>
                  ) : (
                    <>
                      <rect x={n.x - half} y={BASE_Y - half} width={S} height={S} fill="#fff"
                        stroke={sel_ ? C.accent : (st === "upcoming" ? C.line : C.border)} strokeWidth={sel_ ? 2.5 : 1.5}
                        strokeDasharray={st === "upcoming" ? "3 2" : "0"} />
                      {st !== "upcoming" && f > 0 && (
                        <rect x={n.x - half + 2} y={BASE_Y - half + 2 + (S - 4) * (1 - f)} width={S - 4} height={(S - 4) * f} fill={C.accent} />
                      )}
                      {st === "open" && f === 1 && (
                        <path d={`M ${n.x - 5.5} ${BASE_Y} l 3.5 3.5 l 6.5 -7.5`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                    </>
                  )}
                  <text x={n.x} y={BASE_Y + 32} textAnchor="middle" style={{ fontSize: 12, fontWeight: 700, fill: sel_ ? C.accent : C.ink, fontFamily: "Inter, sans-serif", letterSpacing: "-.01em" }}>{n.label}</text>
                  <text x={n.x} y={BASE_Y + 46} textAnchor="middle" style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", fill: C.stone, fontFamily: "IBM Plex Mono, monospace", fontWeight: 500 }}>{n.dates}</text>
                </g>
              );
            })}
          </svg>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", padding: "4px 14px 12px" }}>
            <span className="wr-tag"><span style={{ width: 11, height: 3, background: C.bare, borderRadius: 2, display: "inline-block" }} /> empty: nothing captured</span>
            <span className="wr-tag"><span style={{ width: 11, height: 3, background: C.canopy, borderRadius: 2, display: "inline-block" }} /> filled: captured</span>
            <span className="wr-tag" style={{ marginLeft: "auto" }}>Tap any open window · order doesn't matter</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 24px 40px", display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 18 }}>
        <div className="wr-panel wr-fade" key={sel} style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div className="wr-eyebrow">{selW.dates}{selStatus === "upcoming" ? " · upcoming" : ""}</div>
              <h2 className="wr-serif" style={{ fontSize: 25, fontWeight: 500, margin: "2px 0 0", color: C.bark }}>{selW.label}</h2>
            </div>
            {selStatus === "upcoming"
              ? <span className="wr-tag" style={{ color: C.clayDeep, borderColor: C.clay }}><Lock size={12} /> opens when you reach it</span>
              : selW.slots.length > 0 && <span className="wr-tag"><Square size={11} color={C.accentInk} /> {selW.slots.filter((s) => (subs[sel] || {})[s.type]).length}/{selW.slots.length} signals visible</span>}
          </div>

          {selW.video && (
            <div className="wr-video wr-fade" style={{ marginTop: 18 }} role="button" tabIndex={0}
              onClick={() => setVideo(selW.video)} onKeyDown={(e) => (e.key === "Enter") && setVideo(selW.video)}>
              <div style={{ background: `linear-gradient(120deg, ${C.bark}, ${C.night2})`, padding: "20px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: 2, background: "rgba(255,255,255,.16)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Play size={20} color={C.paper} fill={C.paper} />
                </div>
                <div style={{ color: C.paper }}>
                  <div className="wr-eyebrow" style={{ color: "rgba(255,255,255,.6)" }}>From your care team · {selW.video.dur}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>{selW.video.who}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.75)" }}>{selW.video.role} · what to expect here</div>
                </div>
              </div>
            </div>
          )}

          {selW.slots.length === 0 ? (
            <p style={{ fontSize: 14, color: C.stone, marginTop: 18, lineHeight: 1.6 }}>This is a moment, not a check-in. Watch the message above. There is nothing to submit on surgery day.</p>
          ) : (
            <>
              <div className="wr-eyebrow" style={{ marginTop: 22, marginBottom: 12 }}>Ways to share: pick any, skip the rest</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
                {selW.slots.map((sl) => {
                  const m = MODE[sl.type]; const done = (subs[sel] || {})[sl.type]; const locked = selStatus === "upcoming";
                  return (
                    <div key={sl.type} className={"wr-slot" + (done ? " done" : "") + (locked ? " locked" : "")}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span className="wr-icon" style={{ background: m.bg }}><m.Icon size={18} color={m.fg} /></span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{sl.title}</div>
                          <div className="wr-eyebrow" style={{ marginTop: 1 }}>{m.label} · optional</div>
                        </div>
                        {done && <Check size={17} color={C.canopy} style={{ marginLeft: "auto" }} />}
                      </div>
                      <p style={{ fontSize: 12.5, color: C.stone, lineHeight: 1.5, margin: 0 }}>{sl.guide}</p>
                      {sl.type === "survey" && openSurvey && !done && !locked ? (
                        <div className="wr-fade" style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 7 }}>In the last week, how often did a leak interrupt you?</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                            {["Rarely", "A few times", "Daily", "Many times a day"].map((o, i) => (
                              <button key={o} className={"wr-pill" + (surveyAns.q1 === i ? " sel" : "")} onClick={() => setSurveyAns((a) => ({ ...a, q1: i }))}>{o}</button>
                            ))}
                          </div>
                          <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 7 }}>Energy this week, compared to last?</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                            {["Worse", "Same", "A little better", "Much better"].map((o, i) => (
                              <button key={o} className={"wr-pill" + (surveyAns.q2 === i ? " sel" : "")} onClick={() => setSurveyAns((a) => ({ ...a, q2: i }))}>{o}</button>
                            ))}
                          </div>
                          <button className="wr-btn primary" onClick={submitSurvey} disabled={surveyAns.q1 == null || surveyAns.q2 == null}>Share check-in</button>
                        </div>
                      ) : (
                        <div style={{ marginTop: "auto" }}>
                          {done ? (
                            <button className="wr-btn ghost" onClick={() => toggle(sel, sl.type)} disabled={locked}>{m.done} · undo</button>
                          ) : (
                            <button className="wr-btn primary" disabled={locked} onClick={() => sl.type === "survey" ? setOpenSurvey(true) : toggle(sel, sl.type)}>
                              <m.Icon size={14} /> {m.verb}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {selStatus === "upcoming" && <p style={{ fontSize: 12.5, color: C.stone, marginTop: 12 }}>You can watch the milestone video now: submissions for this window open once you reach it.</p>}
            </>
          )}
        </div>

        <div style={{ display: "grid", gap: 18, alignContent: "start" }}>
          <div className="wr-panel" style={{ padding: 20 }}>
            <div className="wr-eyebrow" style={{ marginBottom: 10 }}>Your recovery so far</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span className="wr-stat" style={{ fontSize: 40 }}>{totals.done}</span>
              <span style={{ fontSize: 13, color: C.stone }}>of {totals.avail} recovery signals visible</span>
            </div>
            <div style={{ display: "flex", gap: 8, margin: "14px 0 4px" }}>
              {[["photo", Camera], ["voice", Mic], ["survey", ClipboardList]].map(([k, Icon]) => (
                <div key={k} style={{ flex: 1, background: C.mist, borderRadius: 2, padding: "11px 10px" }}>
                  <Icon size={15} color={C.stone} />
                  <div className="wr-mono" style={{ fontSize: 16, color: C.bark, marginTop: 5 }}>{totals.byMode[k]}</div>
                  <div className="wr-eyebrow" style={{ letterSpacing: ".1em" }}>{k}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginTop: 14, padding: "12px 13px", background: C.accentSoft, borderRadius: 2 }}>
              <Sparkles size={15} color={C.accentInk} style={{ marginTop: 1, flexShrink: 0 }} />
              <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>
                At five weeks, men using JourneySpan make <strong>7</strong> signals visible on average. You're at <strong>{totals.done}</strong>: your team is seeing your recovery clearly.
              </div>
            </div>
          </div>

          <div className="wr-panel" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <BrainCircuit size={16} color={C.bark} /><span className="wr-eyebrow">Recovery intelligence</span>
            </div>
            <p style={{ fontSize: 12.5, color: C.stone, lineHeight: 1.55, margin: "0 0 12px" }}>
              JourneySpan turns optional inputs into structured signals your team can review.
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {intelligenceSignals.map((s) => (
                <div key={s.source} style={{ border: `1px solid ${C.line}`, borderRadius: 2, padding: "10px 11px", background: C.surface }}>
                  <div className="wr-eyebrow" style={{ color: C.bark, marginBottom: 4 }}>{s.source} · {s.confidence}</div>
                  <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.45 }}>{s.signal}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="wr-panel" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <MessageCircle size={16} color={C.bark} /><span className="wr-eyebrow">Ask your care team</span>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-start", fontSize: 11.5, color: C.clayDeep, background: C.mist, borderRadius: 2, padding: "8px 10px", margin: "6px 0 12px" }}>
              <ShieldAlert size={13} style={{ marginTop: 1, flexShrink: 0 }} /> For non-urgent questions only. Call your clinic or 911 in an emergency.
            </div>
            <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
              {concerns.map((c, i) => (
                <div key={i} className="wr-thread" style={{ background: c.from === "you" ? C.surface : C.mist, border: c.from === "you" ? `1px solid ${C.line}` : "none" }}>
                  <div className="wr-eyebrow" style={{ marginBottom: 4 }}>{c.from === "you" ? "You" : "Care team"} · {c.when}{c.pending ? " · sending" : ""}</div>
                  {c.text}
                </div>
              ))}
            </div>
            <textarea className="wr-area" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a non-urgent question…" aria-label="Non-emergency question" />
            <button className="wr-btn primary" style={{ marginTop: 10, width: "100%", justifyContent: "center" }} onClick={sendConcern} disabled={!draft.trim()}>Send to care team</button>
            <div className="wr-eyebrow" style={{ marginTop: 8, textAlign: "center" }}>typically answered within 1 business day</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 48px" }}>
        <button onClick={() => setView && setView("journey")} style={{
          width: "100%", appearance: "none", cursor: "pointer", border: 0, borderRadius: 3,
          padding: "22px 26px", background: `linear-gradient(120deg, ${C.bark}, ${C.night2})`, color: C.paper,
          fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 44, height: 44, borderRadius: 2, background: "rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Square size={18} color={C.accent} />
            </span>
            <span style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontFamily: "Inter, system-ui, sans-serif", fontSize: 20, fontWeight: 700 }}>Open your Journey Snapshot</span>
              <span style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,.72)", marginTop: 2 }}>Your shareable story, visit summary, progress, and matched benchmark</span>
            </span>
          </span>
          <ArrowRight size={24} color={C.paper} />
        </button>
      </div>

      {video && (
        <div onClick={() => setVideo(null)} style={{ position: "fixed", inset: 0, background: "rgba(11,11,12,.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 50 }}>
          <div className="wr-fade" onClick={(e) => e.stopPropagation()} style={{ background: C.surface, borderRadius: 3, maxWidth: 460, width: "100%", overflow: "hidden" }}>
            <div style={{ background: `linear-gradient(120deg, ${C.bark}, ${C.night2})`, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ width: 60, height: 60, borderRadius: 2, background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Play size={26} color={C.paper} fill={C.paper} />
              </div>
              <button onClick={() => setVideo(null)} aria-label="Close" className="wr-btn" style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,.18)", color: C.paper, padding: 8, borderRadius: 2 }}><X size={16} /></button>
            </div>
            <div style={{ padding: 22 }}>
              <div className="wr-eyebrow">{video.who} · {video.role} · {video.dur}</div>
              <p className="wr-serif" style={{ fontSize: 17, fontStyle: "italic", lineHeight: 1.45, color: C.ink, margin: "10px 0 0" }}>"{video.note}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
