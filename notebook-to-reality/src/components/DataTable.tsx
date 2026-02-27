import { ValidationRecord } from "@/lib/dataUtils";

const css = `
  .dt-wrap { max-height:440px; overflow:auto; }
  .dt-wrap::-webkit-scrollbar { width:6px; height:6px; }
  .dt-wrap::-webkit-scrollbar-track { background:transparent; }
  .dt-wrap::-webkit-scrollbar-thumb { background:rgba(6,182,212,0.25); border-radius:3px; }

  .dt-table { width:100%; border-collapse:collapse; font-size:.82rem; }

  .dt-thead th {
    padding:.65rem 1rem; text-align:left;
    font-size:.65rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
    color:#475569; background:rgba(255,255,255,0.03);
    border-bottom:1px solid rgba(255,255,255,0.07);
    white-space:nowrap; position:sticky; top:0; z-index:1;
  }
  .dt-thead th.right { text-align:right; }

  .dt-row { border-bottom:1px solid rgba(255,255,255,0.04); transition:background .15s; }
  .dt-row:hover { background:rgba(6,182,212,0.05); }

  .dt-row td { padding:.6rem 1rem; color:#cbd5e1; }
  .dt-row td.num { font-family:monospace; color:#94a3b8; }
  .dt-row td.idx { font-family:monospace; font-size:.75rem; color:#334155; }
  .dt-row td.cost { text-align:right; font-family:monospace; font-weight:700; color:#06b6d4; }
  .dt-row td.cap { text-transform:capitalize; }

  .smoker-yes { display:inline-flex;align-items:center; border-radius:999px;
    padding:.15rem .6rem; font-size:.72rem; font-weight:600;
    background:rgba(244,114,182,0.12); color:#f472b6; border:1px solid rgba(244,114,182,0.2); }
  .smoker-no  { display:inline-flex;align-items:center; border-radius:999px;
    padding:.15rem .6rem; font-size:.72rem; font-weight:600;
    background:rgba(52,211,153,0.12); color:#34d399; border:1px solid rgba(52,211,153,0.2); }
`;

interface DataTableProps { data: ValidationRecord[]; }

export function DataTable({ data }: DataTableProps) {
  return (
    <>
      <style>{css}</style>
      <div className="dt-wrap">
        <table className="dt-table">
          <thead className="dt-thead">
            <tr>
              {["#", "Age", "Sex", "BMI", "Children", "Smoker", "Region"].map(h => (
                <th key={h}>{h}</th>
              ))}
              <th className="right">Predicted Cost</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="dt-row">
                <td className="idx">{i + 1}</td>
                <td className="num">{row.age}</td>
                <td className="cap">{row.sex}</td>
                <td className="num">{row.bmi.toFixed(1)}</td>
                <td className="num">{row.children}</td>
                <td>
                  <span className={row.smoker === "yes" ? "smoker-yes" : "smoker-no"}>
                    {row.smoker}
                  </span>
                </td>
                <td className="cap">{row.region}</td>
                <td className="cost">
                  ${row.predicted_charges?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
