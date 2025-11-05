import React from 'react';
import { Microscope, Settings } from 'lucide-react';

export default function Header({ onNavigateAdmin }) {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/70 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-slate-800 text-cyan-300">
            <Microscope size={20} />
          </div>
          <div>
            <h1 className="text-slate-100 font-semibold tracking-tight leading-none">FractoScan</h1>
            <p className="text-xs text-slate-400">Analisis fraktografi instan berbasis ML</p>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <button
            onClick={onNavigateAdmin}
            className="inline-flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="Buka panel admin"
          >
            <Settings size={16} />
            Admin
          </button>
        </nav>
      </div>
    </header>
  );
}
