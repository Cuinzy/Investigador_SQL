"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadState, saveState, GameState, QueryRecord } from "@/lib/gameState";
import { CASES, SUSPECTS, DECLARATIONS, CULPRITS } from "@/lib/gameData";
import { SQLConsole } from "@/components/SQLConsole";
import { OBJECTIVES, detectObjectives } from "@/lib/objectives";

type Tab = "expediente" | "sospechosos" | "consola" | "progreso";

function sha256(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

function simpleHash(queries: QueryRecord[]): string {
  const combined = queries.map((q) => q.sql).join("|");
  return sha256(combined);
}

export default function GamePage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId: caseIdStr } = use(params);
  const caseId = parseInt(caseIdStr, 10);
  const router = useRouter();

  const [state, setState] = useState<GameState | null>(null);
  const [tab, setTab] = useState<Tab>("expediente");
  const [selectedSuspect, setSelectedSuspect] = useState<number | null>(null);
  const [showAccuseModal, setShowAccuseModal] = useState(false);
  const [accuseTarget, setAccuseTarget] = useState<number | null>(null);
  const [justification, setJustification] = useState("");
  const [accuseResult, setAccuseResult] = useState<"correct" | "wrong" | null>(null);
  const [generating, setGenerating] = useState(false);

  const currentCase = CASES.find((c) => c.id === caseId);
  const suspects = SUSPECTS.filter((s) => s.id_caso === caseId);

  useEffect(() => {
    const s = loadState();
    if (!s.investigator) { router.push("/register"); return; }
    if (!s.currentCase) {
      saveState({ ...s, currentCase: caseId, startedAt: s.startedAt ?? new Date().toISOString() });
      setState({ ...s, currentCase: caseId, startedAt: s.startedAt ?? new Date().toISOString() });
    } else {
      setState(s);
    }
  }, [router, caseId]);

  const handleQueryExecuted = useCallback(
    (sql: string, rowCount: number, valid: boolean, error?: string) => {
      setState((prev) => {
        if (!prev) return prev;
        const newQuery: QueryRecord = {
          id: Date.now().toString(),
          sql,
          rowCount,
          timestamp: new Date().toISOString(),
          valid,
          error,
        };
        const newQueries = [...prev.queries, newQuery];
        const alreadyCompleted = new Set(prev.completedObjectives);
        const newlyCompleted = valid ? detectObjectives(sql, alreadyCompleted) : [];
        const newCompleted = [...prev.completedObjectives, ...newlyCompleted];
        const next = { ...prev, queries: newQueries, completedObjectives: newCompleted };
        saveState(next);
        return next;
      });
    },
    []
  );

  const validQueries = state?.queries.filter((q) => q.valid) ?? [];
  const completedObjectives = state?.completedObjectives ?? [];
  const canAccuse = validQueries.length >= 15 && completedObjectives.length >= 15;

  const handleAccuse = async () => {
    if (!accuseTarget || !state || !currentCase) return;
    const isCorrect = CULPRITS[caseId] === accuseTarget;

    if (!isCorrect) {
      setAccuseResult("wrong");
      return;
    }

    setGenerating(true);
    const culprit = suspects.find((s) => s.id === accuseTarget);
    const queriesHash = simpleHash(state.queries);
    const solvedAt = new Date().toISOString();

    try {
      const res = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investigatorCode: state.investigator!.code,
          investigatorName: state.investigator!.name,
          caseId,
          caseTitle: currentCase.titulo,
          culpritName: culprit?.nombre ?? "",
          queryCount: state.queries.length,
          queriesHash,
          solvedAt,
        }),
      });
      const data = await res.json();
      const code = data.code ?? "ERROR-GENERATING-CODE";

      const next: GameState = {
        ...state,
        solved: true,
        culpritSelected: accuseTarget,
        justification,
        solvedAt,
        validationCode: code,
      };
      saveState(next);
      setState(next);
      setAccuseResult("correct");
    } catch {
      setAccuseResult("correct");
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!state || !currentCase) return;
    const culprit = suspects.find((s) => s.id === state.culpritSelected);
    const lines = [
      "REPORTE DE INVESTIGACIÓN SQL",
      "============================",
      "",
      `Juego: Expediente SQL: Mentiras en la Base de Datos`,
      `Investigador: ${state.investigator?.name}`,
      `Código del investigador: ${state.investigator?.code}`,
      state.investigator?.group ? `Grupo: ${state.investigator.group}` : "",
      `Caso: Caso ${String(caseId).padStart(2, "0")} - ${currentCase.titulo}`,
      `Fecha de resolución: ${state.solvedAt ? new Date(state.solvedAt).toLocaleString("es") : ""}`,
      `Culpable identificado: ${culprit?.nombre}`,
      "",
      "CONSULTAS SQL REALIZADAS",
      "========================",
      ...state.queries.map((q, i) => `${i + 1}. ${q.sql}`),
      "",
      "CÓDIGO ÚNICO DE VALIDACIÓN",
      "==========================",
      state.validationCode ?? "",
      "",
      "Este código puede ser validado por el administrador en el Panel de Administrador.",
    ].filter((l) => l !== undefined);

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_caso${caseId}_${state.investigator?.code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!state || !currentCase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08080f] text-slate-400">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080f] flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/cases" className="text-amber-500/60 hover:text-amber-400 text-sm shrink-0">← Casos</Link>
            <div className="w-px h-4 bg-slate-700" />
            <div className="min-w-0">
              <span className="text-xs text-amber-500/60">Caso {String(caseId).padStart(2, "0")} · </span>
              <span className="text-sm font-semibold text-slate-200 truncate">{currentCase.titulo}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-slate-500 hidden sm:block">{state.investigator?.name}</span>
            <div className={`text-xs px-2 py-1 rounded ${canAccuse ? "bg-amber-900/50 text-amber-300 border border-amber-700/50" : "bg-slate-800 text-slate-500"}`}>
              {completedObjectives.length}/15 obj · {validQueries.length} consultas
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-800/60 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {(["expediente", "sospechosos", "consola", "progreso"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                  tab === t
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {t === "expediente" ? "📋 Expediente" : t === "sospechosos" ? "👥 Sospechosos" : t === "consola" ? "💻 Consola SQL" : "📊 Progreso"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">

        {/* Expediente tab */}
        {tab === "expediente" && (
          <div className="max-w-3xl">
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-amber-900/30 border border-amber-800/40 rounded-lg p-3 text-2xl shrink-0 select-none">📋</div>
                <div>
                  <div className="text-xs text-amber-500/60 mb-1">EXPEDIENTE CRIMINAL — CASO {String(caseId).padStart(2, "0")}</div>
                  <h2 className="text-xl font-bold text-amber-300">{currentCase.titulo}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-950/50 rounded-lg p-3 space-y-2">
                  <Field label="Víctima" value={currentCase.victima} />
                  <Field label="Lugar del crimen" value={currentCase.lugar_crimen} />
                  <Field label="Hora estimada" value={new Date(currentCase.fecha_crimen).toLocaleString("es", { dateStyle: "medium", timeStyle: "short" })} />
                </div>
                <div className="bg-slate-950/50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Dificultad</div>
                  <div className={`inline-block text-xs px-2 py-0.5 rounded-full border ${currentCase.dificultad === "alta" ? "bg-red-900/40 text-red-400 border-red-800/50" : currentCase.dificultad === "media" ? "bg-yellow-900/40 text-yellow-400 border-yellow-800/50" : "bg-green-900/40 text-green-400 border-green-800/50"}`}>
                    {currentCase.dificultad.charAt(0).toUpperCase() + currentCase.dificultad.slice(1)}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Descripción del caso</div>
                <p className="text-slate-300 leading-relaxed">{currentCase.descripcion}</p>
              </div>

              <div className="bg-amber-950/20 border border-amber-800/30 rounded-lg p-4">
                <div className="text-xs text-amber-400/80 font-semibold mb-2">INSTRUCCIONES DE INVESTIGACIÓN</div>
                <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                  <li>Interroga a los sospechosos en la pestaña <strong className="text-slate-300">Sospechosos</strong></li>
                  <li>Usa la <strong className="text-slate-300">Consola SQL</strong> para cruzar declaraciones con datos</li>
                  <li>Completa los <strong className="text-slate-300">15 objetivos obligatorios</strong> de investigación</li>
                  <li>Realiza mínimo <strong className="text-slate-300">15 consultas válidas</strong> antes de acusar</li>
                  <li>Cuando estés listo, acusa al culpable con una justificación</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Sospechosos tab */}
        {tab === "sospechosos" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h2 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Sospechosos ({suspects.length})</h2>
              {suspects.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSuspect(s.id === selectedSuspect ? null : s.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedSuspect === s.id
                      ? "border-amber-600/60 bg-amber-900/20"
                      : "border-slate-700/50 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{s.nombre}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{s.profesion} · {s.edad} años</div>
                    </div>
                    <div className="text-xs text-right shrink-0">
                      <span className="text-slate-600">Nerviosismo</span>
                      <div className="flex gap-0.5 mt-1 justify-end">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-sm ${i < s.nivel_nerviosismo ? "bg-red-500" : "bg-slate-800"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    <span className="text-slate-600">Relación: </span>{s.relacion_victima}
                  </div>
                </button>
              ))}
            </div>

            <div>
              {selectedSuspect ? (
                (() => {
                  const s = suspects.find((x) => x.id === selectedSuspect)!;
                  const decls = DECLARATIONS.filter((d) => d.id_sospechoso === s.id);
                  return (
                    <div className="bg-slate-900/40 border border-amber-800/30 rounded-xl p-5 sticky top-20">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl select-none">🎤</span>
                        <div>
                          <div className="font-bold text-amber-300">{s.nombre}</div>
                          <div className="text-xs text-slate-500">Interrogatorio</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-xs text-slate-500 mb-1">Motivo aparente</div>
                        <p className="text-sm text-slate-300">{s.motivo_aparente}</p>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Declaraciones</div>
                        <div className="space-y-2">
                          {decls.map((d, i) => (
                            <div key={d.id} className="bg-slate-950/60 rounded-lg p-3 border border-slate-800/50">
                              <div className="text-xs text-amber-500/50 mb-1">Declaración {i + 1} · {d.tema}</div>
                              <p className="text-sm text-slate-300 italic">&ldquo;{d.declaracion}&rdquo;</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="flex items-center justify-center h-48 text-slate-600 text-sm">
                  Selecciona un sospechoso para ver sus declaraciones
                </div>
              )}
            </div>
          </div>
        )}

        {/* Consola SQL tab */}
        {tab === "consola" && (
          <div className="max-w-4xl">
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl select-none">💻</span>
                <h2 className="font-bold text-slate-200">Consola SQL</h2>
                <span className="text-xs text-slate-600">— id_caso actual: {caseId}</span>
              </div>
              <SQLConsole caseId={caseId} onQueryExecuted={handleQueryExecuted} />
            </div>

            {state.queries.length > 0 && (
              <div className="mt-4 bg-slate-900/40 border border-slate-700/50 rounded-xl p-4">
                <div className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Historial de consultas ({state.queries.length})</div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {[...state.queries].reverse().map((q, i) => (
                    <div key={q.id} className={`flex items-start gap-2 text-xs font-mono py-1 border-b border-slate-800/30 ${q.valid ? "text-slate-400" : "text-red-500/60"}`}>
                      <span className="text-slate-600 shrink-0">{state.queries.length - i}.</span>
                      <span className="truncate">{q.sql}</span>
                      {q.valid && <span className="text-slate-600 shrink-0">{q.rowCount} filas</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progreso tab */}
        {tab === "progreso" && (
          <div className="max-w-2xl">
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-5 mb-4">
              <h2 className="font-bold text-slate-200 mb-4">Progreso de Investigación</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <StatCard label="Consultas válidas" value={validQueries.length} target={15} />
                <StatCard label="Objetivos completados" value={completedObjectives.length} target={15} />
              </div>

              <div className="space-y-2">
                {OBJECTIVES.map((obj) => {
                  const done = completedObjectives.includes(obj.code);
                  return (
                    <div key={obj.code} className={`flex items-start gap-3 p-2.5 rounded-lg ${done ? "bg-green-950/30 border border-green-800/30" : "bg-slate-950/40 border border-slate-800/30"}`}>
                      <span className={`text-sm shrink-0 mt-0.5 ${done ? "text-green-400" : "text-slate-600"}`}>{done ? "✓" : "○"}</span>
                      <div className="min-w-0">
                        <div className={`text-xs font-medium ${done ? "text-green-300" : "text-slate-400"}`}>{obj.description}</div>
                        {!done && <div className="text-xs text-slate-600 mt-0.5">{obj.hint}</div>}
                      </div>
                      <span className="text-xs text-slate-700 shrink-0">{obj.code}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`rounded-xl p-5 border ${canAccuse ? "bg-amber-900/20 border-amber-700/50" : "bg-slate-900/40 border-slate-700/50"}`}>
              {canAccuse ? (
                <div className="text-center">
                  <div className="text-2xl mb-2 select-none">⚖️</div>
                  <h3 className="font-bold text-amber-300 mb-1">¡Listo para acusar!</h3>
                  <p className="text-sm text-slate-400 mb-4">Has completado todos los requisitos de investigación.</p>
                  <button
                    onClick={() => setShowAccuseModal(true)}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg transition-colors"
                  >
                    Acusar Sospechoso
                  </button>
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  <div className="text-xl mb-2 select-none">🔒</div>
                  <p className="text-sm">El botón de acusación se desbloqueará cuando completes los 15 objetivos y realices al menos 15 consultas válidas.</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Te faltan {Math.max(0, 15 - completedObjectives.length)} objetivos y {Math.max(0, 15 - validQueries.length)} consultas válidas.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Accuse Modal */}
      {showAccuseModal && !accuseResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-amber-700/50 rounded-xl p-6 max-w-lg w-full shadow-2xl">
            <h2 className="text-xl font-bold text-amber-400 mb-1">Acusar Sospechoso</h2>
            <p className="text-sm text-slate-500 mb-5">Selecciona al culpable y justifica tu acusación.</p>

            <div className="space-y-2 mb-5">
              {suspects.map((s) => (
                <label key={s.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${accuseTarget === s.id ? "border-amber-600/60 bg-amber-900/20" : "border-slate-700/50 hover:border-slate-600"}`}>
                  <input type="radio" name="suspect" value={s.id} checked={accuseTarget === s.id} onChange={() => setAccuseTarget(s.id)} className="accent-amber-500" />
                  <div>
                    <div className="font-medium text-slate-200">{s.nombre}</div>
                    <div className="text-xs text-slate-500">{s.profesion}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-sm text-slate-400 mb-1">Justificación (máximo 500 caracteres)</label>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value.slice(0, 500))}
                rows={3}
                placeholder="Explica brevemente por qué acusas a esta persona..."
                className="w-full bg-[#0d1117] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none focus:border-amber-500/60"
              />
              <div className="text-xs text-right text-slate-600 mt-0.5">{justification.length}/500</div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowAccuseModal(false); setAccuseTarget(null); }} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleAccuse}
                disabled={!accuseTarget || !justification.trim() || generating}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-black font-bold rounded-lg text-sm transition-colors"
              >
                {generating ? "Generando reporte..." : "Confirmar Acusación"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {accuseResult && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border rounded-xl p-8 max-w-lg w-full shadow-2xl text-center">
            {accuseResult === "correct" ? (
              <>
                <div className="text-5xl mb-4 select-none">🎉</div>
                <h2 className="text-2xl font-bold text-green-400 mb-2">¡Caso Resuelto!</h2>
                <p className="text-slate-400 mb-2">Has identificado correctamente al culpable.</p>
                <div className="bg-green-950/30 border border-green-800/30 rounded-lg p-3 mb-5 text-sm text-green-300">
                  {suspects.find((s) => s.id === accuseTarget)?.nombre}
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 mb-5 text-left">
                  <div className="text-xs text-slate-500 mb-1">Código de Validación</div>
                  <div className="font-mono text-xs text-amber-300 break-all">{state.validationCode}</div>
                </div>

                <div className="flex flex-col gap-3">
                  <button onClick={downloadReport} className="py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg transition-colors">
                    Descargar Reporte .txt
                  </button>
                  <Link href="/cases" className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors block">
                    Volver a Casos
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4 select-none">❌</div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">Acusación Incorrecta</h2>
                <p className="text-slate-400 mb-5">La acusación no es suficiente. Revisa mejor las contradicciones, la ventana de tiempo y las evidencias físicas.</p>
                <button
                  onClick={() => { setAccuseResult(null); setShowAccuseModal(false); setAccuseTarget(null); setTab("consola"); }}
                  className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Seguir Investigando
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-600">{label}</div>
      <div className="text-sm text-slate-300">{value}</div>
    </div>
  );
}

function StatCard({ label, value, target }: { label: string; value: number; target: number }) {
  const pct = Math.min(100, (value / target) * 100);
  const done = value >= target;
  return (
    <div className={`rounded-lg p-4 border ${done ? "border-green-800/50 bg-green-950/20" : "border-slate-700/50 bg-slate-950/40"}`}>
      <div className={`text-2xl font-bold ${done ? "text-green-400" : "text-amber-400"}`}>
        {value}<span className="text-lg text-slate-600">/{target}</span>
      </div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
      <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${done ? "bg-green-500" : "bg-amber-600"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
