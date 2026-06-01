"use client";

import { QueryResult } from "@/lib/useDatabase";

export function ResultTable({ result, error }: { result: QueryResult | null; error?: string }) {
  if (error) {
    return (
      <div className="mt-3 p-3 bg-red-950/50 border border-red-700 rounded text-red-300 text-sm font-mono">
        Error: {error}
      </div>
    );
  }
  if (!result) return null;
  if (result.columns.length === 0) {
    return (
      <div className="mt-3 p-3 bg-green-950/50 border border-green-700 rounded text-green-300 text-sm">
        Consulta ejecutada. Sin filas devueltas.
      </div>
    );
  }
  return (
    <div className="mt-3 overflow-x-auto">
      <div className="text-xs text-amber-400/70 mb-1">{result.rowCount} fila{result.rowCount !== 1 ? "s" : ""} devueltas</div>
      <table className="min-w-full text-xs font-mono border border-amber-800/40">
        <thead>
          <tr className="bg-amber-900/30">
            {result.columns.map((col, i) => (
              <th key={i} className="px-3 py-2 text-left text-amber-300 border-b border-amber-800/40 whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, ri) => (
            <tr key={ri} className="border-b border-amber-900/20 hover:bg-amber-900/10">
              {row.map((cell, ci) => {
                const text = cell === null ? null : String(cell);
                const isLong = text !== null && text.length > 60;
                return (
                  <td
                    key={ci}
                    title={text ?? "NULL"}
                    className={`px-3 py-1.5 text-slate-300 ${isLong ? "whitespace-normal break-words max-w-sm" : "whitespace-nowrap max-w-xs overflow-hidden text-ellipsis"}`}
                  >
                    {text === null ? <span className="text-slate-600">NULL</span> : text}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
