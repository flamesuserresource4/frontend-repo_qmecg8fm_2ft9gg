import React from 'react';

function ScoreBar({ label, value, accent }) {
  const width = Math.round(value);
  const barClasses = {
    cyan: 'from-cyan-500 to-cyan-400',
    green: 'from-emerald-500 to-emerald-400',
    orange: 'from-orange-500 to-amber-400',
    blue: 'from-blue-500 to-sky-400',
  }[accent || 'cyan'];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-300 text-sm">{label}</span>
        <span className="text-slate-400 text-xs">{width}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${barClasses}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function AnalysisOutput({ status, result, onReset, preview }) {
  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-6 sm:p-8">
      <h2 className="text-slate-100 text-xl font-semibold mb-4">Hasil Analisis</h2>

      {status === 'idle' && (
        <p className="text-slate-400 text-sm">Unggah gambar untuk memulai analisis.</p>
      )}

      {status === 'processing' && (
        <div className="flex items-center gap-4">
          <svg className="animate-spin h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <p className="text-slate-300">Menganalisis...</p>
        </div>
      )}

      {status === 'done' && result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider">Prediksi Teratas</p>
              <div className="mt-1 inline-flex items-baseline gap-3">
                <span className="text-3xl font-bold text-cyan-400">{result.top.label.toUpperCase()}</span>
                <span className="text-slate-400">Keyakinan: {Math.round(result.top.confidence)}%</span>
              </div>
            </div>
            <div className="grid gap-3">
              {result.scores.map((s, idx) => (
                <ScoreBar key={s.label + idx} label={s.label} value={s.confidence} accent={s.accent} />
              ))}
            </div>
            <div className="pt-2">
              <button
                onClick={onReset}
                className="rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-slate-200 hover:bg-slate-800"
              >
                Analisis Gambar Lain
              </button>
            </div>
          </div>

          <div className="w-full">
            {preview && (
              <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                <img src={preview} alt="Pratinjau SEM" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
