"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadState, saveState } from "@/lib/gameState";
import { CASES } from "@/lib/gameData";

const DIFFICULTY_LABELS = { baja: "Baja", media: "Media", alta: "Alta" };
const DIFFICULTY_COLORS = {
  baja: "bg-green-900/40 text-green-400 border-green-800/50",
  media: "bg-yellow-900/40 text-yellow-400 border-yellow-800/50",
  alta: "bg-red-900/40 text-red-400 border-red-800/50",
};
const CASE_ICONS = ["🏛️", "☕", "🔥", "💎", "🎭", "⌚", "🛣️"];

export default function CasesPage() {
  const router = useRouter();
  const [investigatorName, setInvestigatorName] = useState("");

  useEffect(() => {
    const state = loadState();
    if (!state.investigator) { router.push("/register"); return; }
    setInvestigatorName(state.investigator.name);
  }, [router]);

  const startCase = (caseId: number) => {
    const state = loadState();
    saveState({ ...state, currentCase: caseId });
    router.push(`/game/${caseId}`);
  };

  return (
    <div className="min-h-screen bg-[#08080f] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-amber-500/60 hover:text-amber-400 text-sm inline-flex items-center gap-1 mb-2">
              ← Inicio
            </Link>
            <h1 className="text-3xl font-bold text-amber-400">Selecciona un Caso</h1>
            {investigatorName && (
              <p className="text-slate-500 text-sm mt-1">Bienvenido, <span className="text-slate-300">{investigatorName}</span></p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CASES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => startCase(c.id)}
              className="text-left bg-slate-900/60 border border-slate-700/50 hover:border-amber-700/60 rounded-xl p-5 transition-all hover:bg-slate-800/60 group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl select-none">{CASE_ICONS[i]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[c.dificultad]}`}>
                  {DIFFICULTY_LABELS[c.dificultad]}
                </span>
              </div>
              <div className="text-xs text-amber-500/60 mb-1">Caso {String(c.id).padStart(2, "0")}</div>
              <h2 className="text-base font-bold text-slate-200 group-hover:text-amber-300 transition-colors mb-2">
                {c.titulo}
              </h2>
              <div className="text-xs text-slate-500 space-y-0.5">
                <div><span className="text-slate-600">Víctima:</span> {c.victima}</div>
                <div><span className="text-slate-600">Lugar:</span> {c.lugar_crimen.split(",")[0]}</div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">
          Cada caso requiere mínimo 15 consultas SQL y completar 15 objetivos obligatorios antes de poder acusar.
        </p>
      </div>
    </div>
  );
}
