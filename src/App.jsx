import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Nav, { STEPS } from "./components/Nav.jsx";
import StatusQuo from "./views/StatusQuo.jsx";
import PatientRoad from "./views/PatientRoad.jsx";
import Surgeon from "./views/Surgeon.jsx";
import RiskPanel from "./views/RiskPanel.jsx";
import { C } from "./theme.js";

const VIEWS = { status: StatusQuo, patient: PatientRoad, surgeon: Surgeon, risk: RiskPanel };

const appCss = `
.app-pager{border-top:1px solid ${C.line};background:${C.surface};}
.app-pager-inner{max-width:1200px;margin:0 auto;padding:18px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
.app-nav-btn{appearance:none;cursor:pointer;font-family:Inter,sans-serif;border-radius:2px;padding:10px 16px;font-size:13.5px;font-weight:500;display:inline-flex;align-items:center;gap:7px;}
.app-nav-btn.primary{border:1px solid ${C.bark};background:${C.accent};color:${C.bark};}
.app-nav-btn.secondary{border:1px solid ${C.line};background:transparent;color:${C.stone};}
@media (max-width:720px){
  .app-pager-inner{padding:12px 14px;display:grid;grid-template-columns:1fr;gap:8px;}
  .app-pager-inner > span{display:none;}
  .app-nav-btn{width:100%;justify-content:center;min-height:44px;}
}
`;

export default function App() {
  const [view, setView] = useState("status");
  const ActiveView = VIEWS[view];
  const idx = STEPS.findIndex((s) => s.id === view);
  const prev = STEPS[idx - 1];
  const next = STEPS[idx + 1];

  return (
    <div style={{ minHeight: "100vh", background: C.paper }}>
      <style>{appCss}</style>
      <Nav view={view} setView={setView} />
      <ActiveView setView={setView} />

      {/* guided prev / next: follows the full narrative order */}
      {idx >= 0 && (
        <div className="app-pager">
          <div className="app-pager-inner">
            {prev ? (
              <button onClick={() => setView(prev.id)} className="app-nav-btn secondary">
                <ChevronLeft size={16} /> {prev.label}
              </button>
            ) : <span />}
            {next ? (
              <button onClick={() => setView(next.id)} className="app-nav-btn primary">
                Next: {next.label} <ChevronRight size={16} />
              </button>
            ) : <span />}
          </div>
        </div>
      )}
    </div>
  );
}
