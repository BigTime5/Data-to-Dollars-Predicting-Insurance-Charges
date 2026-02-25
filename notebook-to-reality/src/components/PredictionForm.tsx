import { useState } from "react";
import { predictCharges } from "@/lib/dataUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign } from "lucide-react";

export function PredictionForm() {
  const [form, setForm] = useState({
    age: "30",
    sex: "male",
    bmi: "28",
    children: "0",
    smoker: "no",
    region: "southeast",
  });
  const [result, setResult] = useState<number | null>(null);

  const handlePredict = () => {
    const prediction = predictCharges({
      age: parseFloat(form.age) || 30,
      sex: form.sex,
      bmi: parseFloat(form.bmi) || 28,
      children: parseInt(form.children) || 0,
      smoker: form.smoker,
      region: form.region,
    });
    setResult(prediction);
  };

  return (
    <div className="glass-card rounded-lg p-6 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">Cost Predictor</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Age</Label>
          <Input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">BMI</Label>
          <Input type="number" step="0.1" value={form.bmi} onChange={e => setForm({ ...form, bmi: e.target.value })} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Children</Label>
          <Input type="number" value={form.children} onChange={e => setForm({ ...form, children: e.target.value })} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Sex</Label>
          <Select value={form.sex} onValueChange={v => setForm({ ...form, sex: v })}>
            <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Smoker</Label>
          <Select value={form.smoker} onValueChange={v => setForm({ ...form, smoker: v })}>
            <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Region</Label>
          <Select value={form.region} onValueChange={v => setForm({ ...form, region: v })}>
            <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="northeast">Northeast</SelectItem>
              <SelectItem value="northwest">Northwest</SelectItem>
              <SelectItem value="southeast">Southeast</SelectItem>
              <SelectItem value="southwest">Southwest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handlePredict} className="w-full">
        <Calculator className="h-4 w-4 mr-2" />
        Predict Healthcare Cost
      </Button>

      {result !== null && (
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-5 text-center animate-fade-in">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Predicted Annual Cost</p>
          <div className="flex items-center justify-center gap-1">
            <DollarSign className="h-7 w-7 text-primary" />
            <span className="text-3xl font-bold text-primary font-mono">
              {result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
