import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Activity, Database, TrendingUp, Users, Heart, DollarSign,
  BarChart3, FileText, ArrowLeft, Zap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PredictionForm } from "@/components/PredictionForm";
import { DataTable } from "@/components/DataTable";
import {
  InsuranceRecord, ValidationRecord, CleaningStats,
  loadAndCleanData, loadValidationData, predictCharges,
  computeStats, getDistributionData, getSmokerComparison,
  getRegionData, getChargesByAge,
} from "@/lib/dataUtils";

/* ─── colour palette ─────────────────────────────── */
const C = {
  cyan: "#06b6d4",
  purple: "#a78bfa",
  green: "#34d399",
  amber: "#fbbf24",
  pink: "#f472b6",
  muted: "#475569",
  grid: "rgba(255,255,255,0.06)",
  bg: "#040d18",
};

/* ─── inline styles ──────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

  .dash-root { font-family:'Inter',sans-serif; background:#040d18; color:#e2e8f0; min-height:100vh; }

  /* ambient orbs */
  .dash-orb-1 { position:fixed; top:-10%; right:-5%; width:45%; height:45%;
    background:radial-gradient(circle,rgba(6,182,212,0.12) 0%,transparent 70%);
    filter:blur(80px); pointer-events:none; z-index:0; }
  .dash-orb-2 { position:fixed; bottom:-10%; left:-5%; width:40%; height:40%;
    background:radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%);
    filter:blur(80px); pointer-events:none; z-index:0; }

  /* header */
  .dash-header {
    position:sticky; top:0; z-index:50;
    display:flex; align-items:center; gap:.75rem; padding:.9rem 1.75rem;
    background:rgba(4,13,24,0.8); backdrop-filter:blur(16px);
    border-bottom:1px solid rgba(6,182,212,0.12);
  }
  .dash-logo-ring { width:36px;height:36px;border-radius:10px;
    display:flex;align-items:center;justify-content:center;
    background:rgba(6,182,212,0.15); color:#06b6d4;
    box-shadow:0 0 16px rgba(6,182,212,0.25); }
  .dash-title { font-size:1rem; font-weight:800; color:#f1f5f9; letter-spacing:-.02em; }
  .dash-subtitle { font-size:.7rem; color:#475569; margin-top:.05rem; }
  .dash-record-pill {
    margin-left:auto; display:flex; align-items:center; gap:.4rem;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
    border-radius:999px; padding:.3rem .85rem; font-size:.72rem;
    font-family:monospace; color:#64748b;
  }
  .dash-back {
    display:inline-flex; align-items:center; gap:.4rem;
    color:#64748b; font-size:.75rem; text-decoration:none;
    border:1px solid rgba(255,255,255,0.08); border-radius:8px;
    padding:.35rem .75rem; transition:all .2s; white-space:nowrap;
  }
  .dash-back:hover { color:#06b6d4; border-color:rgba(6,182,212,0.3); }

  /* stat cards */
  .stat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; }
  @media(max-width:900px){ .stat-grid{grid-template-columns:repeat(2,1fr);} }

  .stat-card {
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
    border-radius:14px; padding:1.1rem 1.25rem; position:relative; overflow:hidden;
    transition:border-color .3s, box-shadow .3s;
  }
  .stat-card::before { content:''; position:absolute; top:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,transparent,var(--accent-color,#06b6d4),transparent);
    opacity:.6; }
  .stat-card:hover { border-color:rgba(6,182,212,0.2); box-shadow:0 8px 30px rgba(0,0,0,.3); }
  .stat-card-label { font-size:.65rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#475569; margin-bottom:.3rem; }
  .stat-card-value { font-size:1.7rem; font-weight:900; letter-spacing:-.03em; color:#f1f5f9; line-height:1; }
  .stat-card-sub { font-size:.72rem; color:#475569; margin-top:.35rem; }
  .stat-card-icon {
    position:absolute; top:1rem; right:1rem; width:36px;height:36px;border-radius:10px;
    display:flex;align-items:center;justify-content:center;
  }

  /* tabs */
  .dash-tabs-list {
    display:flex; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.07); border-radius:12px;
    padding:.3rem; gap:.25rem; width:fit-content;
  }
  .dash-tab-trigger {
    display:inline-flex; align-items:center; gap:.45rem;
    padding:.45rem 1rem; border-radius:8px; font-size:.8rem; font-weight:600;
    color:#64748b; background:transparent; border:none; cursor:pointer;
    transition:all .2s;
  }
  .dash-tab-trigger[data-state="active"] {
    background:rgba(6,182,212,0.12); color:#06b6d4;
    box-shadow:0 0 12px rgba(6,182,212,0.15);
  }
  .dash-tab-trigger:hover:not([data-state="active"]) { color:#e2e8f0; }

  /* chart cards */
  .chart-card {
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
    border-radius:14px; padding:1.25rem 1.5rem; transition:border-color .25s;
  }
  .chart-card:hover { border-color:rgba(6,182,212,0.15); }
  .chart-title { font-size:.85rem; font-weight:700; color:#cbd5e1; margin-bottom:1rem; }

  /* chart tooltip */
  .recharts-tooltip-wrapper .recharts-default-tooltip {
    background:#0f1e31 !important; border:1px solid rgba(6,182,212,0.2) !important;
    border-radius:10px !important; font-size:12px !important; color:#e2e8f0 !important;
  }

  /* loading */
  .dash-loading { display:flex;align-items:center;justify-content:center;
    min-height:100vh; background:#040d18; color:#475569; gap:.75rem; font-size:1rem; }

  /* predict form overrides */
  .predict-dark input, .predict-dark select,
  .predict-dark [data-radix-select-trigger] {
    background:rgba(255,255,255,0.06) !important;
    border-color:rgba(255,255,255,0.1) !important;
    color:#e2e8f0 !important;
  }
  .predict-dark button[type=submit], .predict-dark .predict-btn {
    background:linear-gradient(135deg,#06b6d4,#6366f1) !important;
    border:none !important;
    box-shadow: 0 0 20px rgba(6,182,212,0.35) !important;
  }

  /* data quality cards */
  .dq-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
  @media(max-width:700px){ .dq-grid{grid-template-columns:repeat(2,1fr);} }
  .dq-card {
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
    border-radius:14px; padding:1.1rem 1.25rem;
  }
  .dq-card-label { font-size:.65rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#475569;margin-bottom:.3rem; }
  .dq-card-value { font-size:1.5rem;font-weight:900;color:#f1f5f9; }

  @keyframes dashFadeUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
  .dash-fadein { animation:dashFadeUp .5s ease both; }
`;

/* ─── custom tooltip ─────────────────────────────── */
const DarkTooltip = ({ active, payload, label, formatter }: any) => {
  if (!active || !payload?.length) return null;
  const val = formatter ? formatter(payload[0].value) : payload[0].value;
  return (
    <div style={{ background: "#0f1e31", border: "1px solid rgba(6,182,212,0.25)", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "#e2e8f0" }}>
      <p style={{ color: "#64748b", marginBottom: 2 }}>{label}</p>
      <p style={{ fontWeight: 700, color: "#06b6d4" }}>{Array.isArray(val) ? val[0] : val}</p>
    </div>
  );
};

/* ─── component ──────────────────────────────────── */
export default function Index() {
  const [data, setData] = useState<InsuranceRecord[]>([]);
  const [validationData, setValidationData] = useState<ValidationRecord[]>([]);
  const [stats, setStats] = useState<CleaningStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/insurance.csv").then(r => r.text()),
      fetch("/data/validation_dataset.csv").then(r => r.text()),
    ]).then(([insuranceCsv, validationCsv]) => {
      const { data: cleaned, stats: cleanStats } = loadAndCleanData(insuranceCsv);
      setData(cleaned);
      setStats(cleanStats);
      const valData = loadValidationData(validationCsv);
      setValidationData(valData.map(v => ({ ...v, predicted_charges: predictCharges(v) })));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="dash-loading">
          <Activity size={18} style={{ color: C.cyan, animation: "pulse 2s infinite" }} />
          Loading healthcare data…
        </div>
      </>
    );
  }

  const chargeStats = computeStats(data);
  const smokerComp = getSmokerComparison(data);
  const regionData = getRegionData(data);
  const ageData = getChargesByAge(data);
  const chargesDist = getDistributionData(data, "charges", 12);
  const bmiDist = getDistributionData(data, "bmi", 12);
  const ageDist = getDistributionData(data, "age", 10);

  const smokerPieData = [
    { name: "Smoker", value: smokerComp.smokerCount, fill: C.pink },
    { name: "Non-Smoker", value: smokerComp.nonSmokerCount, fill: C.cyan },
  ];
  const smokerBars = [
    { label: "Smokers", avg: Math.round(smokerComp.smokerAvg) },
    { label: "Non-Smokers", avg: Math.round(smokerComp.nonSmokerAvg) },
  ];

  const axisProps = { tick: { fontSize: 10, fill: "#475569" }, stroke: "transparent" };

  return (
    <>
      <style>{css}</style>
      <div className="dash-root">
        {/* ambient */}
        <div className="dash-orb-1" />
        <div className="dash-orb-2" />

        {/* ── header ── */}
        <header className="dash-header">
          <div className="dash-logo-ring"><Heart size={17} /></div>
          <div>
            <div className="dash-title">Healthcare Cost Prediction</div>
            <div className="dash-subtitle">Predictive Analytics Dashboard · Random Forest Model</div>
          </div>
          <div className="dash-record-pill">
            <Database size={12} style={{ color: C.cyan }} />
            {data.length} records
          </div>
          <Link to="/" className="dash-back">
            <ArrowLeft size={13} /> Home
          </Link>
        </header>

        <main style={{ maxWidth: 1280, margin: "0 auto", padding: "1.5rem 1.5rem 3rem", position: "relative", zIndex: 1 }}>

          {/* ── stat cards ── */}
          <div className="stat-grid dash-fadein" style={{ marginBottom: "1.5rem" }}>
            <StatCard
              accentColor={C.cyan}
              iconBg="rgba(6,182,212,0.15)"
              icon={<DollarSign size={16} style={{ color: C.cyan }} />}
              label="Avg. Charges"
              value={`$${chargeStats.mean.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
              sub={`Median: $${chargeStats.median.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
            />
            <StatCard
              accentColor={C.purple}
              iconBg="rgba(167,139,250,0.15)"
              icon={<Database size={16} style={{ color: C.purple }} />}
              label="Records"
              value={chargeStats.count.toLocaleString()}
              sub={`${stats?.droppedRows} rows cleaned`}
            />
            <StatCard
              accentColor={C.green}
              iconBg="rgba(52,211,153,0.15)"
              icon={<TrendingUp size={16} style={{ color: C.green }} />}
              label="Model R² Score"
              value="0.8299"
              sub="Random Forest"
            />
            <StatCard
              accentColor={C.amber}
              iconBg="rgba(251,191,36,0.15)"
              icon={<Activity size={16} style={{ color: C.amber }} />}
              label="RMSE"
              value="$4,680"
              sub="MAE: $2,875"
            />
          </div>

          {/* ── tabs ── */}
          <Tabs defaultValue="eda" className="space-y-4">
            <TabsList className="dash-tabs-list" style={{ background: "transparent", border: "none", padding: 0 }}>
              {[
                { value: "eda", label: "Exploration", icon: <BarChart3 size={14} /> },
                { value: "predict", label: "Predict", icon: <Zap size={14} /> },
                { value: "validation", label: "Validation", icon: <FileText size={14} /> },
                { value: "cleaning", label: "Data Quality", icon: <Database size={14} /> },
              ].map(t => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="dash-tab-trigger"
                  style={{ all: "unset" } as any}
                >
                  <span className="dash-tab-trigger" data-value={t.value}>
                    {t.icon} {t.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* EDA */}
            <TabsContent value="eda">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

                <ChartCard title="Charges Distribution">
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart data={chargesDist}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                      <XAxis dataKey="range" {...axisProps} />
                      <YAxis {...axisProps} />
                      <Tooltip content={<DarkTooltip />} />
                      <Bar dataKey="count" fill={C.cyan} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Avg. Charges by Age Group">
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart data={ageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                      <XAxis dataKey="ageGroup" {...axisProps} />
                      <YAxis {...axisProps} />
                      <Tooltip content={<DarkTooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Avg"]} />} />
                      <Bar dataKey="avgCharges" fill={C.purple} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Smoker vs Non-Smoker">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={smokerPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                          {smokerPieData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                        </Pie>
                        <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={smokerBars} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                        <XAxis type="number" {...axisProps} />
                        <YAxis dataKey="label" type="category" {...axisProps} width={90} />
                        <Tooltip content={<DarkTooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Avg"]} />} />
                        <Bar dataKey="avg" radius={[0, 4, 4, 0]}>
                          <Cell fill={C.pink} />
                          <Cell fill={C.cyan} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard title="Avg. Charges by Region">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={regionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                      <XAxis dataKey="region" {...axisProps} />
                      <YAxis {...axisProps} />
                      <Tooltip content={<DarkTooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Avg"]} />} />
                      <Bar dataKey="avgCharges" fill={C.amber} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="BMI Distribution">
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart data={bmiDist}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                      <XAxis dataKey="range" {...axisProps} />
                      <YAxis {...axisProps} />
                      <Tooltip content={<DarkTooltip />} />
                      <Bar dataKey="count" fill={C.green} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Age Distribution">
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart data={ageDist}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                      <XAxis dataKey="range" {...axisProps} />
                      <YAxis {...axisProps} />
                      <Tooltip content={<DarkTooltip />} />
                      <Bar dataKey="count" fill={C.purple} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </TabsContent>

            {/* Predict */}
            <TabsContent value="predict">
              <div style={{ maxWidth: 700, margin: "0 auto" }} className="predict-dark">
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, padding: "1.75rem",
                }}>
                  <PredictionForm />
                </div>
              </div>
            </TabsContent>

            {/* Validation */}
            <TabsContent value="validation">
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
                <Users size={15} style={{ color: C.cyan }} />
                <span style={{ fontSize: ".85rem", fontWeight: 700, color: "#cbd5e1" }}>
                  Validation Predictions ({validationData.length} records)
                </span>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, overflow: "hidden",
              }}>
                <DataTable data={validationData} />
              </div>
            </TabsContent>

            {/* Data Quality */}
            <TabsContent value="cleaning">
              {stats && (
                <div className="dq-grid">
                  <DQCard label="Total Raw Rows" value={stats.totalRows} color={C.cyan} />
                  <DQCard label="Clean Records" value={stats.cleanedRows} color={C.green} />
                  <DQCard label="Dropped Rows" value={stats.droppedRows} color={C.amber} />
                  <DQCard label="Negative Ages Fixed" value={stats.negativeAgesFixed} color={C.purple} />
                  <DQCard label="Sex Labels Normalized" value={stats.sexNormalized} color={C.pink}
                    sub="M/F/man/woman → male/female" />
                  <DQCard label="$ Signs Removed" value={stats.dollarSignsRemoved} color={C.cyan}
                    sub="From charges column" />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}

/* ─── sub-components ────────────────────────────── */
function StatCard({ accentColor, iconBg, icon, label, value, sub }: {
  accentColor: string; iconBg: string; icon: React.ReactNode;
  label: string; value: string | number; sub?: string;
}) {
  return (
    <div className="stat-card dash-fadein" style={{ "--accent-color": accentColor } as React.CSSProperties}>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
      <div className="stat-card-icon" style={{ background: iconBg }}>{icon}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="chart-card dash-fadein">
      <div className="chart-title">{title}</div>
      {children}
    </div>
  );
}

function DQCard({ label, value, color, sub }: {
  label: string; value: string | number; color: string; sub?: string;
}) {
  return (
    <div className="dq-card dash-fadein">
      <div className="dq-card-label">{label}</div>
      <div className="dq-card-value" style={{ color }}>{value}</div>
      {sub && <div style={{ fontSize: ".7rem", color: "#475569", marginTop: ".25rem" }}>{sub}</div>}
    </div>
  );
}
