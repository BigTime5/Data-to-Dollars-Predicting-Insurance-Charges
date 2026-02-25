import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: "default" | "primary" | "success" | "warning";
}

const variantClasses = {
  default: "glass-card",
  primary: "glass-card stat-glow border-primary/20",
  success: "glass-card border-success/20",
  warning: "glass-card border-warning/20",
};

const iconVariantClasses = {
  default: "bg-secondary text-secondary-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export function StatCard({ title, value, subtitle, icon, variant = "default" }: StatCardProps) {
  return (
    <div className={`rounded-lg p-5 ${variantClasses[variant]} animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`rounded-lg p-2.5 ${iconVariantClasses[variant]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
