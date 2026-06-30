import { C } from "../theme.js";

// The demo's narrative order. Edit labels/order here.
export const STEPS = [
  { id: "status",  n: "01", label: "Status quo",          hint: "today's tool" },
  { id: "patient", n: "02", label: "Patient experience",  hint: "the recovery span" },
  { id: "surgeon", n: "03", label: "Surgeon & post-care", hint: "the OR-to-recovery link" },
  { id: "risk",    n: "04", label: "Clinician review",    hint: "the recovery-risk model" },
];

const navCss = `
.nv-bar{background:${C.bark};color:#fff;position:sticky;top:0;z-index:30;border-bottom:1.5px solid ${C.bark};}
.nv-wrap{max-width:1200px;margin:0 auto;padding:0 24px;display:flex;align-items:stretch;
  justify-content:space-between;gap:16px;flex-wrap:wrap;}
.nv-brand{display:flex;align-items:center;gap:11px;padding:16px 0;}
.nv-mark{width:28px;height:18px;flex-shrink:0;}
.nv-name{font-family:'Inter',sans-serif;font-size:18px;font-weight:900;letter-spacing:-.045em;}
.nv-steps{display:flex;}
.nv-step{appearance:none;border:0;cursor:pointer;background:transparent;font-family:'Inter',sans-serif;
  color:rgba(255,255,255,.55);padding:0 18px;display:flex;align-items:center;gap:10px;
  transition:background .14s,color .14s;text-align:left;border-left:1px solid rgba(255,255,255,.14);}
.nv-step:first-child{border-left:0;}
.nv-step:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.9);}
.nv-step.on{background:${C.accent};color:${C.bark};}
.nv-step:focus-visible{outline:2px solid ${C.accent};outline-offset:-2px;}
.nv-num{font-family:'Lora',serif;font-size:10px;font-weight:600;letter-spacing:.1em;opacity:.7;}
.nv-on .nv-num{opacity:.55;color:${C.accent};}
.nv-label{font-size:13px;font-weight:700;line-height:1.1;letter-spacing:-.01em;}
.nv-hint{font-size:9.5px;opacity:.7;font-family:'Lora',serif;letter-spacing:.1em;text-transform:uppercase;font-weight:500;}
@media (prefers-reduced-motion:reduce){.nv-step{transition:none;}}
@media (max-width:720px){
  .nv-bar{position:sticky;}
  .nv-wrap{padding:0 14px;gap:0;display:block;}
  .nv-brand{padding:13px 0 11px;}
  .nv-name{font-size:17px;}
  .nv-steps{margin:0 -14px;padding:0 14px 12px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;}
  .nv-step{flex:0 0 158px;min-height:58px;padding:0 12px;border:1px solid rgba(255,255,255,.14);border-left:1px solid rgba(255,255,255,.14);scroll-snap-align:start;}
  .nv-step + .nv-step{margin-left:8px;}
  .nv-step.on{border-color:${C.accent};}
  .nv-hint{display:none!important;}
}
`;

function Mark() {
  // geometric "span" mark: optimistic, sharp, and instantly recognizable
  return (
    <svg className="nv-mark" viewBox="0 0 28 18" fill="none" aria-hidden="true">
      <rect x="0" y="0" width="7" height="18" fill={C.accent} />
      <rect x="10" y="0" width="18" height="5" fill="#fff" />
      <rect x="10" y="13" width="18" height="5" fill="#fff" />
      <rect x="20" y="5" width="8" height="8" fill={C.accent} />
    </svg>
  );
}

export default function Nav({ view, setView }) {
  const active = view;
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
