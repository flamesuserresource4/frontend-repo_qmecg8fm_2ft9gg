import React, { useEffect, useState } from 'react';
import { Lock, UploadCloud } from 'lucide-react';

// Simple client-side gate (visual only; not secure)
const ADMIN_PASSWORD = 'Bandung2025';

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [modelInfo, setModelInfo] = useState({ name: 'model_v1_balanced.zip', updatedAt: '5 Nov 2025' });
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Keep pathname as /admin if user navigates here from button
    if (window.location.pathname !== '/admin') {
      window.history.replaceState({}, '', '/admin');
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pw = formData.get('password');
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setMessage('Kata sandi salah.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.zip')) {
      setStatus('error');
      setMessage('Harap unggah file .zip dari Teachable Machine.');
      return;
    }
    setStatus('uploading');
    setMessage('Mengunggah dan memvalidasi model...');

    // Simulate upload/validation since no backend is connected yet
    setTimeout(() => {
      // Fake success
      setStatus('success');
      setModelInfo({ name: file.name, updatedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) });
      setMessage('Model berhasil diunggah dan diaktifkan.');
    }, 1500);
  };

  if (!authed) {
    return (
      <div className="max-w-md mx-auto mt-12 rounded-xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="text-cyan-400" size={18} />
          <h2 className="text-slate-100 font-semibold">Panel Admin - Manajemen Model</h2>
        </div>
        <p className="text-slate-400 text-sm mb-4">Masukkan kata sandi untuk melanjutkan.</p>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="password"
            name="password"
            placeholder="Kata sandi"
            className="w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <button
            type="submit"
            className="w-full rounded-md bg-cyan-500 text-slate-900 font-medium px-4 py-2 hover:bg-cyan-400"
          >
            Masuk
          </button>
        </form>
        {message && <p className="text-rose-400 text-sm mt-3">{message}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-slate-100 text-lg font-semibold">Panel Admin - Manajemen Model</h2>
        <p className="text-slate-400 text-sm mt-1">Perbarui model ML tanpa menyentuh kode.</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
        <p className="text-slate-400 text-sm">Model Aktif:</p>
        <p className="text-slate-100 font-medium">{modelInfo.name} <span className="text-slate-500 font-normal">| Terakhir Diperbarui: {modelInfo.updatedAt}</span></p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex items-center gap-2 mb-3">
          <UploadCloud className="text-cyan-400" size={18} />
          <h3 className="text-slate-100 font-medium">Unggah File Model Baru</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4">Terima file .zip berisi model.json, weights.bin, dan metadata.json dari Teachable Machine.</p>

        <label className="inline-flex items-center gap-2 cursor-pointer rounded-md bg-slate-900 border border-slate-800 px-4 py-2 text-slate-200 hover:bg-slate-800">
          <UploadCloud size={16} /> Pilih File .zip
          <input type="file" accept=".zip" className="hidden" onChange={handleUpload} />
        </label>

        {status === 'uploading' && (
          <p className="text-slate-300 text-sm mt-3">{message}</p>
        )}
        {status === 'success' && (
          <p className="text-emerald-400 text-sm mt-3">{message}</p>
        )}
        {status === 'error' && (
          <p className="text-rose-400 text-sm mt-3">{message}</p>
        )}
      </div>
    </div>
  );
}
