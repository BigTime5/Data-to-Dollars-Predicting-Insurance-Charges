import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, PieChart, Pie, Legend } from "recharts";
import { Activity, Database, TrendingUp, Users, Heart, DollarSign, BarChart3, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
import { PredictionForm } from "@/components/PredictionForm";
import { DataTable } from "@/components/DataTable";
import {
  InsuranceRecord, ValidationRecord, CleaningStats,
  loadAndCleanData, loadValidationData, predictCharges,
  computeStats, getDistributionData, getSmokerComparison,
  getRegionData, getChargesByAge,
} from "@/lib/dataUtils";

const CHART_COLORS = {
  primary: "hsl(174, 62%, 38%)",
  secondary: "hsl(200, 70%, 50%)",
  warning: "hsl(35, 92%, 55%)",
  danger: "hsl(340, 65%, 55%)",
  purple: "hsl(260, 55%, 55%)",
  muted: "hsl(200, 10%, 45%)",
};

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
      const predicted = valData.map(v => ({ ...v, predicted_charges: predictCharges(v) }));
      setValidationData(predicted);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Activity className="h-5 w-5 animate-pulse" />
          <span className="text-lg">Loading healthcare data...</span>
        </div>
      </div>
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
    { name: "Smoker", value: smokerComp.smokerCount, fill: CHART_COLORS.danger },
    { name: "Non-Smoker", value: smokerComp.nonSmokerCount, fill: CHART_COLORS.primary },
  ];

  const smokerChargesBar = [
    { label: "Smokers", avg: Math.round(smokerComp.smokerAvg) },
    { label: "Non-Smokers", avg: Math.round(smokerComp.nonSmokerAvg) },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Healthcare Cost Prediction</h1>
            <p className="text-xs text-muted-foreground">Predictive Analytics Dashboard · Random Forest Model</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <Database className="h-3.5 w-3.5" />
            <span className="font-mono">{data.length} records</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Avg. Charges" value={`$${chargeStats.mean.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} subtitle={`Median: $${chargeStats.median.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} icon={<DollarSign className="h-5 w-5" />} variant="primary" />
          <StatCard title="Records" value={chargeStats.count.toLocaleString()} subtitle={`${stats?.droppedRows} rows cleaned`} icon={<Database className="h-5 w-5" />} variant="default" />
          <StatCard title="Model R² Score" value="0.8299" subtitle="Random Forest" icon={<TrendingUp className="h-5 w-5" />} variant="success" />
          <StatCard title="RMSE" value="$4,680" subtitle={`MAE: $2,875`} icon={<Activity className="h-5 w-5" />} variant="warning" />
        </div>

        <Tabs defaultValue="eda" className="space-y-4">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="eda" className="text-xs gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Exploration</TabsTrigger>
            <TabsTrigger value="predict" className="text-xs gap-1.5"><Calculator className="h-3.5 w-3.5" />Predict</TabsTrigger>
            <TabsTrigger value="validation" className="text-xs gap-1.5"><FileText className="h-3.5 w-3.5" />Validation</TabsTrigger>
            <TabsTrigger value="cleaning" className="text-xs gap-1.5"><Database className="h-3.5 w-3.5" />Data Quality</TabsTrigger>
          </TabsList>

          {/* EDA Tab */}
          <TabsContent value="eda" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Charges Distribution */}
              <div className="glass-card rounded-lg p-5">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Charges Distribution</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chargesDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,88%)" />
                    <XAxis dataKey="range" tick={{ fontSize: 10 }} stroke={CHART_COLORS.muted} />
                    <YAxis tick={{ fontSize: 10 }} stroke={CHART_COLORS.muted} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(0,0%,100%)', border: '1px solid hsl(210,18%,88%)', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Charges by Age Group */}
              <div className="glass-card rounded-lg p-5">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Avg. Charges by Age Group</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,88%)" />
                    <XAxis dataKey="ageGroup" tick={{ fontSize: 10 }} stroke={CHART_COLORS.muted} />
                    <YAxis tick={{ fontSize: 10 }} stroke={CHART_COLORS.muted} />
                    <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Avg Charges']} contentStyle={{ backgroundColor: 'hsl(0,0%,100%)', border: '1px solid hsl(210,18%,88%)', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="avgCharges" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Smoker Comparison */}
              <div className="glass-card rounded-lg p-5">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Smoker vs Non-Smoker</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={smokerPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                        {smokerPieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={smokerChargesBar} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,88%)" />
                      <XAxis type="number" tick={{ fontSize: 10 }} stroke={CHART_COLORS.muted} />
                      <YAxis dataKey="label" type="category" tick={{ fontSize: 10 }} stroke={CHART_COLORS.muted} width={90} />
                      <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Avg']} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="avg" radius={[0, 4, 4, 0]}>
                        <Cell fill={CHART_COLORS.danger} />
                        <Cell fill={CHART_COLORS.primary} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Region */}
              <div className="glass-card rounded-lg p-5">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Avg. Charges by Region</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={regionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,88%)" />
                    <XAxis dataKey="region" tick={{ fontSize: 10 }} stroke={CHART_COLORS.muted} />
                    <YAxis tick={{ fontSize: 10 }} stroke={CHART_COLORS.muted} />
                    <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Avg']} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="avgCharges" fill={CHART_COLORS.warning} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* BMI Distribution */}
              <div className="glass-card rounded-lg p-5">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">BMI Distribution</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={bmiDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,88%)" />
                    <XAxis dataKey="range" tick={{ fontSize: 10 }} stroke={CHART_COLORS.muted} />
                    <YAxis tick={{ fontSize: 10 }} stroke={CHART_COLORS.muted} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" fill={CHART_COLORS.purple} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Age Distribution */}
              <div className="glass-card rounded-lg p-5">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Age Distribution</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={ageDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,88%)" />
                    <XAxis dataKey="range" tick={{ fontSize: 10 }} stroke={CHART_COLORS.muted} />
                    <YAxis tick={{ fontSize: 10 }} stroke={CHART_COLORS.muted} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* Predict Tab */}
          <TabsContent value="predict">
            <div className="max-w-2xl mx-auto">
              <PredictionForm />
            </div>
          </TabsContent>

          {/* Validation Tab */}
          <TabsContent value="validation" className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Validation Predictions ({validationData.length} records)</h3>
            </div>
            <DataTable data={validationData} />
          </TabsContent>

          {/* Data Quality Tab */}
          <TabsContent value="cleaning" className="space-y-4">
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard title="Total Raw Rows" value={stats.totalRows} icon={<FileText className="h-5 w-5" />} />
                <StatCard title="Clean Records" value={stats.cleanedRows} variant="success" icon={<Database className="h-5 w-5" />} />
                <StatCard title="Dropped Rows" value={stats.droppedRows} variant="warning" icon={<Activity className="h-5 w-5" />} />
                <StatCard title="Negative Ages Fixed" value={stats.negativeAgesFixed} />
                <StatCard title="Sex Labels Normalized" value={stats.sexNormalized} subtitle="M/F/man/woman → male/female" />
                <StatCard title="$ Signs Removed" value={stats.dollarSignsRemoved} subtitle="From charges column" />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Calculator(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" />
    </svg>
  );
}
