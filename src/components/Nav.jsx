import { C } from "../theme.js";

// The demo's narrative order. Edit labels/order here.
export const STEPS = [
  { id: "status", n: "01", label: "Status quo", hint: "today's tool" },
  { id: "patient", n: "02", label: "Patient experience", hint: "the recovery span" },
  { id: "surgeon", n: "03", label: "Surgeon & post-care", hint: "the OR-to-recovery link" },
];

const navCss = `
.nv-bar{background:${C.bark};color:#fff;position:sticky;top:0;z-index:30;border-bottom:1.5px solid ${C.bark};}
.nv-wrap{max-width:1200px;margin:0 auto;padding:0 24px;display:flex;align-items:stretch;
  justify-content:space-between;gap:16px;flex-wrap:wrap;}
.nv-brand{display:flex;align-items:center;gap:11px;padding:16px 0;}
.nv-mark{width:22px;height:16px;flex-shrink:0;}
.nv-name{font-family:'Inter',sans-serif;font-size:18px;font-weight:800;letter-spacing:-.02em;}
.nv-steps{display:flex;}
.nv-step{appearance:none;border:0;cursor:pointer;background:transparent;font-family:'Inter',sans-serif;
  color:rgba(255,255,255,.55);padding:0 18px;display:flex;align-items:center;gap:10px;
  transition:background .14s,color .14s;text-align:left;border-left:1px solid rgba(255,255,255,.14);}
.nv-step:first-child{border-left:0;}
.nv-step:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.9);}
.nv-step.on{background:#fff;color:${C.bark};}
.nv-step:focus-visible{outline:2px solid ${C.accent};outline-offset:-2px;}
.nv-num{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:.1em;opacity:.7;}
.nv-on .nv-num{opacity:.55;color:${C.accent};}
.nv-label{font-size:13px;font-weight:700;line-height:1.1;letter-spacing:-.01em;}
.nv-hint{font-size:9.5px;opacity:.7;font-family:'IBM Plex Mono',monospace;letter-spacing:.1em;text-transform:uppercase;font-weight:500;}
@media (prefers-reduced-motion:reduce){.nv-step{transition:none;}}
`;

function Mark() {
  // geometric "span" mark: two end posts joined by a beam
  return (
    <svg className="nv-mark" viewBox="0 0 22 16" fill="none" aria-hidden="true">
      <rect x="0" y="0" width="3" height="16" fill={C.accent} />
      <rect x="19" y="0" width="3" height="16" fill="#fff" />
      <rect x="3" y="6.5" width="16" height="3" fill="#fff" />
    </svg>
  );
}

export default function Nav({ view, setView }) {
  const active = view === "journey" ? "patient" : view;
  return (
    <div className="nv-bar">
      <style>{navCss}</style>
      <div className="nv-wrap">
        <div className="nv-brand">
          <Mark />
          <span className="nv-name">JourneySpan</span>
        </div>
        <div className="nv-steps" role="tablist" aria-label="Demo views">
          {STEPS.map((s) => (
            <button key={s.id} role="tab" aria-selected={active === s.id}
              className={"nv-step" + (active === s.id ? " on nv-on" : "")} onClick={() => setView(s.id)}>
              <span className="nv-num">STEP {s.n}</span>
              <span>
                <span className="nv-label">{s.label}</span>
                <span style={{ display: "block" }} className="nv-hint">{s.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
