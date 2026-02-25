import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ValidationRecord } from "@/lib/dataUtils";

interface DataTableProps {
  data: ValidationRecord[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <div className="max-h-[400px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">#</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Age</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sex</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">BMI</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Children</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Smoker</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Region</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Predicted Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i} className="border-border/30 hover:bg-accent/50 transition-colors">
                <TableCell className="font-mono text-xs text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-mono text-sm">{row.age}</TableCell>
                <TableCell className="text-sm capitalize">{row.sex}</TableCell>
                <TableCell className="font-mono text-sm">{row.bmi.toFixed(1)}</TableCell>
                <TableCell className="font-mono text-sm">{row.children}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${row.smoker === 'yes' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
                    {row.smoker}
                  </span>
                </TableCell>
                <TableCell className="text-sm capitalize">{row.region}</TableCell>
                <TableCell className="text-right font-mono text-sm font-semibold text-primary">
                  ${row.predicted_charges?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
