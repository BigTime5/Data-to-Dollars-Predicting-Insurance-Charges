import { useState } from "react";
import { predictCharges } from "@/lib/dataUtils";
import { DollarSign, Zap } from "lucide-react";

const css = `
  .pf-root { display:flex; flex-direction:column; gap:1.25rem; }
  .pf-header { display:flex; align-items:center; gap:.6rem; margin-bottom:.25rem; }
  .pf-header-icon { width:36px;height:36px;border-radius:10px;
    background:rgba(6,182,212,0.15); color:#06b6d4;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 0 16px rgba(6,182,212,0.2); }
  .pf-title { font-size:1.1rem; font-weight:800; color:#f1f5f9; }

  .pf-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.85rem; }
  @media(max-width:600px){ .pf-grid { grid-template-columns:repeat(2,1fr); } }

  .pf-field { display:flex; flex-direction:column; gap:.4rem; }
  .pf-label { font-size:.68rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#475569; }

  .pf-input {
    width:100%; padding:.6rem .85rem; font-size:.9rem; font-weight:500;
    background:rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.1);
    border-radius:9px; color:#e2e8f0; outline:none; transition:border-color .2s, box-shadow .2s;
    box-sizing:border-box;
  }
  .pf-input:focus { border-color:rgba(6,182,212,0.5); box-shadow:0 0 0 3px rgba(6,182,212,0.1); }
  .pf-input::-webkit-inner-spin-button { opacity:.4; }

  .pf-select {
    width:100%; padding:.6rem .85rem; font-size:.9rem; font-weight:500;
    background:rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.1);
    border-radius:9px; color:#e2e8f0; outline:none; cursor:pointer;
    transition:border-color .2s; appearance:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right .85rem center;
    padding-right:2.2rem;
  }
  .pf-select:focus { border-color:rgba(6,182,212,0.5); box-shadow:0 0 0 3px rgba(6,182,212,0.1); }
  .pf-select option { background:#0f1e31; color:#e2e8f0; }

  .pf-btn {
    width:100%; padding:.85rem; border-radius:11px; font-size:.95rem; font-weight:700;
    cursor:pointer; border:none; display:flex; align-items:center; justify-content:center; gap:.5rem;
    background:linear-gradient(135deg,#06b6d4,#6366f1);
    color:#fff; box-shadow:0 0 24px rgba(6,182,212,0.35);
    transition:all .25s;
  }
  .pf-btn:hover { box-shadow:0 0 36px rgba(6,182,212,0.55); transform:translateY(-1px); }
  .pf-btn:active { transform:translateY(0); }

  .pf-result {
    border-radius:12px; padding:1.5rem; text-align:center;
    background:rgba(6,182,212,0.07);
    border:1px solid rgba(6,182,212,0.25);
    animation:pfFadeUp .4s ease both;
  }
  @keyframes pfFadeUp { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
  .pf-result-label { font-size:.68rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:#475569; margin-bottom:.5rem; }
  .pf-result-amount { display:flex; align-items:center; justify-content:center; gap:.25rem; }
  .pf-result-dollar { font-size:1.75rem; font-weight:900; color:#06b6d4; }
  .pf-result-value { font-size:2.5rem; font-weight:900; color:#06b6d4; font-family:monospace; letter-spacing:-.03em; }
  .pf-result-sub { font-size:.75rem; color:#475569; margin-top:.4rem; }
`;

export function PredictionForm() {
  const [form, setForm] = useState({
    age: "30", sex: "male", bmi: "28", children: "0", smoker: "no", region: "southeast",
  });
  const [result, setResult] = useState<number | null>(null);

  const handlePredict = () => {
    setResult(predictCharges({
      age: parseFloat(form.age) || 30,
      sex: form.sex,
      bmi: parseFloat(form.bmi) || 28,
      children: parseInt(form.children) || 0,
      smoker: form.smoker,
      region: form.region,
    }));
  };

  return (
    <>
      <style>{css}</style>
      <div className="pf-root">
        <div className="pf-header">
          <div className="pf-header-icon"><Zap size={17} /></div>
          <div className="pf-title">Cost Predictor</div>
        </div>

        <div className="pf-grid">
          <div className="pf-field">
            <label className="pf-label">Age</label>
            <input className="pf-input" type="number" value={form.age}
              onChange={e => setForm({ ...form, age: e.target.value })} />
          </div>
          <div className="pf-field">
            <label className="pf-label">BMI</label>
            <input className="pf-input" type="number" step="0.1" value={form.bmi}
              onChange={e => setForm({ ...form, bmi: e.target.value })} />
          </div>
          <div className="pf-field">
            <label className="pf-label">Children</label>
            <input className="pf-input" type="number" value={form.children}
              onChange={e => setForm({ ...form, children: e.target.value })} />
          </div>
          <div className="pf-field">
            <label className="pf-label">Sex</label>
            <select className="pf-select" value={form.sex}
              onChange={e => setForm({ ...form, sex: e.target.value })}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="pf-field">
            <label className="pf-label">Smoker</label>
            <select className="pf-select" value={form.smoker}
              onChange={e => setForm({ ...form, smoker: e.target.value })}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div className="pf-field">
            <label className="pf-label">Region</label>
            <select className="pf-select" value={form.region}
              onChange={e => setForm({ ...form, region: e.target.value })}>
              <option value="northeast">Northeast</option>
              <option value="northwest">Northwest</option>
              <option value="southeast">Southeast</option>
              <option value="southwest">Southwest</option>
            </select>
          </div>
        </div>

        <button className="pf-btn" onClick={handlePredict}>
          <Zap size={17} />
          Predict Healthcare Cost
        </button>

        {result !== null && (
          <div className="pf-result">
            <div className="pf-result-label">Predicted Annual Premium</div>
            <div className="pf-result-amount">
              <DollarSign size={28} style={{ color: "#06b6d4" }} />
              <span className="pf-result-value">
                {result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="pf-result-sub">Estimated by Random Forest model · R² 0.8299</div>
          </div>
        )}
      </div>
    </>
  );
}
