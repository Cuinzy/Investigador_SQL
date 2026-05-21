"use client";

import { useState, useRef, useCallback } from "react";
import { ResultTable } from "./ResultTable";
import { QueryResult, useDatabase } from "@/lib/useDatabase";
import { isQueryAllowed } from "@/lib/objectives";

interface Props {
  caseId: number;
  onQueryExecuted: (sql: string, rowCount: number, valid: boolean, error?: string) => void;
}

const EXAMPLES = [
  "SELECT * FROM vista_casos WHERE id_caso = 1;",
  "SELECT * FROM vista_sospechosos WHERE id_caso = 1;",
  "SELECT * FROM vista_declaraciones WHERE id_caso = 1 ORDER BY sospechoso;",
  "SELECT * FROM ubicaciones WHERE id_caso = 1 ORDER BY fecha_hora;",
  "SELECT * FROM llamadas WHERE id_caso = 1 ORDER BY fecha_hora;",
  "SELECT * FROM mensajes WHERE id_caso = 1 ORDER BY fecha_hora;",
  "SELECT * FROM camara_seguridad WHERE id_caso = 1 ORDER BY fecha_hora;",
  "SELECT * FROM accesos WHERE id_caso = 1 ORDER BY fecha_hora;",
  "SELECT * FROM transacciones WHERE id_caso = 1 ORDER BY fecha_hora;",
  "SELECT * FROM evidencias WHERE id_caso = 1;",
  "SELECT e.nombre, e.lugar_encontrado, h.persona, h.tipo_coincidencia, h.nivel_confianza FROM evidencias e JOIN huellas h ON e.id_evidencia = h.id_evidencia WHERE e.id_caso = 1 ORDER BY h.nivel_confianza DESC;",
];

export function SQLConsole({ caseId, onQueryExecuted }: Props) {
  const [sql, setSql] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | undefined>(undefined);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { ready, execute } = useDatabase();

  const runQuery = useCallback(() => {
    const trimmed = sql.trim();
    if (!trimmed) return;

    if (!isQueryAllowed(trimmed)) {
      const err = "Operación no permitida. Solo se admiten consultas SELECT, SHOW, DESCRIBE y EXPLAIN.";
      setQueryError(err);
      setResult(null);
      onQueryExecuted(trimmed, 0, false, err);
      return;
    }

    try {
      const res = execute(trimmed.replace(/\bid_caso\s*=\s*\d+/gi, `id_caso = ${caseId}`));
      setResult(res);
      setQueryError(undefined);
      setHistory((h) => [trimmed, ...h.slice(0, 49)]);
      setHistIdx(-1);
      onQueryExecuted(trimmed, res.rowCount, true);
    } catch (e) {
      const err = String(e).replace(/^Error:\s*/i, "");
      setQueryError(err);
      setResult(null);
      onQueryExecuted(trimmed, 0, false, err);
    }
  }, [sql, caseId, execute, onQueryExecuted]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runQuery();
    }
    if (e.key === "ArrowUp" && e.ctrlKey) {
      e.preventDefault();
      const idx = histIdx + 1;
      if (idx < history.length) { setSql(history[idx]); setHistIdx(idx); }
    }
    if (e.key === "ArrowDown" && e.ctrlKey) {
      e.preventDefault();
      const idx = histIdx - 1;
      if (idx < 0) { setSql(""); setHistIdx(-1); } else { setSql(history[idx]); setHistIdx(idx); }
    }
  };

  const setExample = (ex: string) => {
    setSql(ex.replace(/id_caso\s*=\s*\d+/g, `id_caso = ${caseId}`));
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-slate-500 mb-1">
        Tablas disponibles: <span className="text-amber-400/80">vista_casos, vista_sospechosos, vista_declaraciones, ubicaciones, llamadas, mensajes, camara_seguridad, accesos, transacciones, evidencias, huellas</span>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Escribe tu consulta SQL aquí...\nEj: SELECT * FROM vista_sospechosos WHERE id_caso = ${caseId};`}
          rows={5}
          className="w-full bg-[#0d1117] border border-amber-800/50 rounded p-3 font-mono text-sm text-green-300 placeholder-slate-600 resize-none focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30"
          disabled={!ready}
          spellCheck={false}
        />
        <div className="absolute bottom-2 right-2 text-xs text-slate-600">Ctrl+Enter para ejecutar</div>
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={runQuery}
          disabled={!ready || !sql.trim()}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-black font-bold rounded text-sm transition-colors"
        >
          {ready ? "▶ Ejecutar" : "Cargando BD..."}
        </button>
        <button
          onClick={() => { setSql(""); setResult(null); setQueryError(undefined); }}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors"
        >
          Limpiar
        </button>
      </div>

      <details className="group">
        <summary className="text-xs text-amber-400/60 cursor-pointer hover:text-amber-400 select-none">
          Consultas de ejemplo (click para expandir)
        </summary>
        <div className="mt-2 flex flex-col gap-1">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setExample(ex)}
              className="text-left text-xs text-slate-400 hover:text-amber-300 font-mono bg-slate-900/50 px-2 py-1 rounded hover:bg-slate-800/50 transition-colors truncate"
            >
              {ex.replace(/id_caso\s*=\s*\d+/g, `id_caso = ${caseId}`)}
            </button>
          ))}
        </div>
      </details>

      <ResultTable result={result} error={queryError} />
    </div>
  );
}
