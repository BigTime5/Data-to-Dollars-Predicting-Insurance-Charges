import { Link } from "react-router-dom";
import { Activity, ArrowLeft, Brain, Database, TrendingUp, ShieldCheck, BarChart3, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-secondary/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <header className="px-6 py-4 flex justify-between items-center glass-card border-b border-border/50 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">MediPredict</span>
        </div>
        <Button variant="outline" asChild className="gap-2 border-primary/20 hover:bg-muted">
          <Link to="/"><ArrowLeft className="h-4 w-4" /> Back to Home</Link>
        </Button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
            About This App
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Predicting Insurance Costs with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Machine Learning.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            MediPredict is a data science capstone project that operationalizes a Random Forest regression model to predict individual insurance charges based on demographic and lifestyle variables.
          </p>
        </div>

        {/* The Problem */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">The Problem</h2>
          <p className="text-muted-foreground leading-relaxed">
            Healthcare costs in the US are notoriously opaque. Patients and insurers alike struggle to understand why premiums vary so dramatically — sometimes by hundreds of thousands of dollars — across individuals with seemingly similar profiles. This project uses real-world data to shine a light on the key driving factors.
          </p>
        </section>

        {/* Key Features Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">What's Inside</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: <Database className="h-5 w-5 text-primary" />,
                title: "Data Pipeline",
                desc: "Automated ingestion and cleaning of 1,300+ healthcare records, handling negative ages, dollar signs, and label normalization.",
              },
              {
                icon: <Brain className="h-5 w-5 text-secondary" />,
                title: "Random Forest Model",
                desc: "Optimized Random Forest Regressor achieving an R² of 0.8299 and RMSE of $4,680 on the validation dataset.",
              },
              {
                icon: <BarChart3 className="h-5 w-5 text-warning" />,
                title: "Exploratory Analytics",
                desc: "Interactive charts revealing charge distributions, smoker vs non-smoker disparities, regional trends, and age group comparisons.",
              },
              {
                icon: <TrendingUp className="h-5 w-5 text-primary" />,
                title: "Live Predictions",
                desc: "A real-time prediction form where you can enter any combination of inputs and get an instant insurance cost estimate.",
              },
              {
                icon: <ShieldCheck className="h-5 w-5 text-secondary" />,
                title: "Validation Suite",
                desc: "A dedicated validation tab that benchmarks model predictions against a holdout dataset, row by row.",
              },
              {
                icon: <FileText className="h-5 w-5 text-warning" />,
                title: "Data Quality Audit",
                desc: "Full transparency into the cleaning stats — how many records were dropped, fixed, and normalized before modeling.",
              },
            ].map((f) => (
              <div key={f.title} className="glass-card rounded-xl p-5 border border-border/50 flex gap-4 hover:border-primary/30 transition-colors">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center shadow-sm">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Technology Stack</h2>
          <div className="flex flex-wrap gap-3">
            {["React 18", "TypeScript", "Vite", "Tailwind CSS", "Recharts", "Radix UI", "React Router v6", "React Hook Form", "TanStack Query"].map((tech) => (
              <span key={tech} className="inline-flex items-center rounded-full border border-border/70 bg-muted/60 px-4 py-1.5 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex gap-4 pt-4 border-t border-border/50">
          <Button size="lg" asChild className="h-12 px-8 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all">
            <Link to="/dashboard">Open Dashboard</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-12 px-8 border-primary/20 hover:bg-muted">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
