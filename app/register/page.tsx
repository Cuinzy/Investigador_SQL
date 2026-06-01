"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadState, saveState } from "@/lib/gameState";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [group, setGroup] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError("El nombre y el código del investigador son obligatorios.");
      return;
    }
    const state = loadState();
    saveState({ ...state, investigator: { name: name.trim(), code: code.trim().toUpperCase(), group: group.trim() } });
    router.push("/cases");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#08080f] px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="text-amber-500/60 hover:text-amber-400 text-sm mb-8 inline-flex items-center gap-1">
          ← Inicio
        </Link>

        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-8 shadow-2xl">
          <div className="text-2xl mb-1 select-none">🪪</div>
          <h1 className="text-2xl font-bold text-amber-400 mb-1">Registro de Investigador</h1>
          <p className="text-slate-500 text-sm mb-6">Tus datos quedarán registrados en el reporte final de investigación.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Nombre del Investigador <span className="text-amber-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Laura Méndez"
                className="w-full bg-[#0d1117] border border-slate-700 focus:border-amber-500 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 outline-none transition-colors text-sm"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Código del Investigador <span className="text-amber-500">*</span></label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej: INV-2026-0042"
                className="w-full bg-[#0d1117] border border-slate-700 focus:border-amber-500 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 outline-none transition-colors text-sm font-mono uppercase"
              />
              <p className="text-xs text-slate-600 mt-1">Se usará para generar tu código único de validación</p>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Grupo / Sección <span className="text-slate-600">(opcional)</span></label>
              <input
                type="text"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="Ej: Bases de Datos II - Grupo A"
                className="w-full bg-[#0d1117] border border-slate-700 focus:border-amber-500 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 outline-none transition-colors text-sm"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg transition-colors mt-2"
            >
              Continuar →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
