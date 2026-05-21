import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#08080f] px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-6 text-5xl select-none">🔍</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-amber-400 mb-3 tracking-tight">
          Expediente SQL
        </h1>
        <p className="text-xl text-amber-200/70 mb-2 font-light italic">
          Mentiras en la Base de Datos
        </p>
        <div className="w-24 h-px bg-amber-700/50 mx-auto my-6" />

        <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
          Un juego de investigación criminal donde la única arma es el SQL.
          Interroga sospechosos, consulta la base de datos policial y descubre
          al culpable antes de acusar.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-10 max-w-sm mx-auto text-sm">
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3">
            <div className="text-amber-400 font-bold text-lg">7</div>
            <div className="text-slate-500 text-xs">Casos</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3">
            <div className="text-amber-400 font-bold text-lg">15</div>
            <div className="text-slate-500 text-xs">Objetivos</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3">
            <div className="text-amber-400 font-bold text-lg">11</div>
            <div className="text-slate-500 text-xs">Tablas SQL</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg text-lg transition-colors shadow-lg shadow-amber-900/30"
          >
            Iniciar Investigación
          </Link>
          <Link
            href="/admin"
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-lg transition-colors border border-slate-700"
          >
            Panel Administrador
          </Link>
        </div>

        <div className="mt-12 text-xs text-slate-600 space-y-1">
          <p>Practica SELECT · WHERE · JOIN · GROUP BY · HAVING · COUNT · DISTINCT · BETWEEN · LIKE</p>
          <p>Compatible con sintaxis MySQL/SQLite</p>
        </div>
      </div>
    </div>
  );
}
