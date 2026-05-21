"use client";

import { useState } from "react";
import Link from "next/link";

interface Payload {
  game_id: string;
  version: string;
  investigator_code: string;
  investigator_name: string;
  case_id: number;
  case_title: string;
  solved: boolean;
  culprit: string;
  query_count: number;
  queries_hash: string;
  solved_at: string;
  nonce: string;
}

// ── Login gate ────────────────────────────────────────────────────────────────
function LoginGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem("admin_unlocked", "1");
        onUnlock();
      } else {
        setError(data.error ?? "Contraseña incorrecta");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 gap-3">
          <span className="text-5xl select-none">🔐</span>
          <h1 className="text-2xl font-bold text-amber-400">Panel de Administrador</h1>
          <p className="text-sm text-slate-500 text-center">Acceso restringido — ingresa la contraseña del profesor</p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoFocus
              className="w-full bg-[#0d1117] border border-slate-700 focus:border-amber-500 rounded-lg px-4 py-3 text-slate-300 placeholder-slate-700 outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-800/40 rounded-lg px-3 py-2">
              <span className="select-none">❌</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!password.trim() || loading}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-black font-bold rounded-lg transition-colors"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-amber-500/60 hover:text-amber-400 text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Admin panel ───────────────────────────────────────────────────────────────
function AdminPanel() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{ valid: boolean; payload?: Payload; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/validate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ valid: false, error: "Error de conexión" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_unlocked");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#08080f] px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-amber-500/60 hover:text-amber-400 text-sm inline-flex items-center gap-1">
            ← Inicio
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl select-none">🛡️</span>
          <div>
            <h1 className="text-2xl font-bold text-amber-400">Panel de Administrador</h1>
            <p className="text-sm text-slate-500">Validar código de investigación</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 mb-6">
          <label className="block text-sm text-slate-400 mb-2">Código único de validación</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={3}
            placeholder="SQLCASE1.EXPEDIENTE_SQL.INV-2026-0042...."
            className="w-full bg-[#0d1117] border border-slate-700 focus:border-amber-500 rounded-lg px-4 py-3 font-mono text-xs text-slate-300 placeholder-slate-700 outline-none resize-none transition-colors"
            spellCheck={false}
          />
          <button
            onClick={validate}
            disabled={!code.trim() || loading}
            className="mt-3 w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-black font-bold rounded-lg transition-colors"
          >
            {loading ? "Validando..." : "Validar Código"}
          </button>
        </div>

        {result && (
          <div className={`rounded-xl p-6 border ${result.valid ? "bg-green-950/30 border-green-800/50" : "bg-red-950/30 border-red-800/50"}`}>
            {result.valid && result.payload ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl select-none">✅</span>
                  <span className="font-bold text-green-400">Código Válido</span>
                </div>
                <div className="space-y-2 text-sm">
                  <Row label="Juego" value={result.payload.game_id} />
                  <Row label="Versión" value={result.payload.version} />
                  <Row label="Investigador" value={result.payload.investigator_name} />
                  <Row label="Código investigador" value={result.payload.investigator_code} />
                  <Row label="Caso" value={`#${result.payload.case_id} — ${result.payload.case_title}`} />
                  <Row label="Culpable identificado" value={result.payload.culprit} highlight />
                  <Row label="Caso resuelto" value={result.payload.solved ? "Sí" : "No"} />
                  <Row label="Consultas realizadas" value={String(result.payload.query_count)} />
                  <Row label="Hash de consultas" value={result.payload.queries_hash} mono />
                  <Row label="Fecha de resolución" value={new Date(result.payload.solved_at).toLocaleString("es")} />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl select-none">❌</span>
                <div>
                  <div className="font-bold text-red-400">Código Inválido</div>
                  <div className="text-sm text-red-400/70 mt-0.5">{result.error ?? "No se pudo verificar el código."}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page root ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("admin_unlocked") === "1";
  });

  if (!unlocked) {
    return <LoginGate onUnlock={() => setUnlocked(true)} />;
  }

  return <AdminPanel />;
}

function Row({ label, value, highlight, mono }: { label: string; value: string; highlight?: boolean; mono?: boolean }) {
  return (
    <div className="flex gap-3">
      <span className="text-slate-500 w-44 shrink-0">{label}</span>
      <span className={`break-all ${highlight ? "text-green-300 font-semibold" : mono ? "font-mono text-amber-300/80 text-xs" : "text-slate-300"}`}>
        {value}
      </span>
    </div>
  );
}
