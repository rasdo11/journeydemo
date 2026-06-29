import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Nav, { STEPS } from "./components/Nav.jsx";
import StatusQuo from "./views/StatusQuo.jsx";
import PatientRoad from "./views/PatientRoad.jsx";
import Surgeon from "./views/Surgeon.jsx";
import JourneySnapshot from "./views/JourneySnapshot.jsx";
import { C } from "./theme.js";

const VIEWS = { status: StatusQuo, patient: PatientRoad, surgeon: Surgeon, journey: JourneySnapshot };

export default function App() {
  const [view, setView] = useState("status");
  const ActiveView = VIEWS[view];
  const idx = STEPS.findIndex((s) => s.id === view);
  const prev = STEPS[idx - 1];
  const next = STEPS[idx + 1];

  return (
    <div style={{ minHeight: "100vh", background: C.paper }}>
      <Nav view={view} setView={setView} />
      <ActiveView setView={setView} />

      {/* guided prev / next — follows the full narrative order */}
      {idx >= 0 && (
        <div style={{ borderTop: `1px solid ${C.line}`, background: C.surface }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            {prev ? (
              <button onClick={() => setView(prev.id)} style={navBtn(false)}>
                <ChevronLeft size={16} /> {prev.label}
              </button>
            ) : <span />}
            {next ? (
              <button onClick={() => setView(next.id)} style={navBtn(true)}>
                Next: {next.label} <ChevronRight size={16} />
              </button>
            ) : <span />}
          </div>
        </div>
      )}
    </div>
  );
}

function navBtn(primary) {
  return {
    appearance: "none", cursor: "pointer", fontFamily: "Inter, sans-serif",
    border: primary ? `1px solid ${C.bark}` : `1px solid ${C.line}`,
    background: primary ? C.accent : "transparent",
    color: primary ? C.bark : C.stone,
    borderRadius: 2, padding: "10px 16px", fontSize: 13.5, fontWeight: 500,
    display: "inline-flex", alignItems: "center", gap: 7,
  };
}
