import React, { useEffect, useState } from 'react';
import { Lock, UploadCloud, Link as LinkIcon, ArrowLeft } from 'lucide-react';

// Simple client-side gate (visual only; not secure)
const ADMIN_PASSWORD = 'Bandung2025';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [activeSource, setActiveSource] = useState(null); // {type: 'url'|'db', ...}
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (window.location.pathname !== '/admin') {
      window.history.replaceState({}, '', '/admin');
    }
  }, []);

  const fetchActiveModel = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/models/active`);
      const data = await res.json();
      if (data && data.active !== false) {
        setActiveSource(data);
      } else {
        setActiveSource(null);
      }
    } catch (e) {
      // ignore display errors quietly
    }
  };

  useEffect(() => {
    if (authed) {
      fetchActiveModel();
    }
  }, [authed]);

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
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setStatus('error');
      setMessage('Harap unggah file .zip dari Teachable Machine.');
      return;
    }
    setStatus('uploading');
    setMessage('Mengunggah dan menyimpan ke database...');

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_BASE}/api/models`, { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Gagal mengunggah');
      }
      const data = await res.json();
      setStatus('success');
      setMessage('Model berhasil diunggah dan diaktifkan.');
      setActiveSource({ type: 'db', name: data.name, size: data.size, active: true, updated_at: new Date().toISOString() });
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  const handleSetUrl = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const url = new FormData(form).get('tm_url');
    if (!url) return;
    setStatus('uploading');
    setMessage('Menyimpan URL model sebagai sumber aktif...');
    try {
      const res = await fetch(`${API_BASE}/api/models/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Gagal menyimpan URL');
      }
      const data = await res.json();
      setStatus('success');
      setMessage('URL Teachable Machine diaktifkan.');
      setActiveSource({ type: 'url', url: data.url, active: true, updated_at: new Date().toISOString() });
      form.reset();
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  const backToMain = () => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      const popEvent = new PopStateEvent('popstate');
      window.dispatchEvent(popEvent);
    }
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

  const prettyDate = (d) => (d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={backToMain} className="inline-flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-slate-200 hover:bg-slate-800">
          <ArrowLeft size={16} /> Kembali ke Halaman Utama
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-slate-100 text-lg font-semibold">Panel Admin - Manajemen Model</h2>
        <p className="text-slate-400 text-sm mt-1">Pilih salah satu sumber model: unggah file .zip ke database atau pakai URL Teachable Machine.</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
        {activeSource ? (
          <>
            <p className="text-slate-400 text-sm">Sumber Aktif:</p>
            {activeSource.type === 'url' ? (
              <p className="text-slate-100 font-medium">Teachable Machine URL <span className="text-slate-500 font-normal">| Diatur: {prettyDate(activeSource.updated_at)}</span><br /><span className="text-slate-400 text-xs break-all">{activeSource.url}</span></p>
            ) : (
              <p className="text-slate-100 font-medium">File Model (Database): {activeSource.name} <span className="text-slate-500 font-normal">| Diatur: {prettyDate(activeSource.updated_at)}</span></p>
            )}
          </>
        ) : (
          <p className="text-slate-400 text-sm">Belum ada sumber model aktif.</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex items-center gap-2 mb-3">
          <UploadCloud className="text-cyan-400" size={18} />
          <h3 className="text-slate-100 font-medium">Opsi 1: Unggah File Model (.zip) ke Database</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4">Terima file .zip berisi model.json, weights.bin, dan metadata.json dari Teachable Machine.</p>
        <label className="inline-flex items-center gap-2 cursor-pointer rounded-md bg-slate-900 border border-slate-800 px-4 py-2 text-slate-200 hover:bg-slate-800">
          <UploadCloud size={16} /> Pilih File .zip
          <input type="file" accept=".zip" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex items-center gap-2 mb-3">
          <LinkIcon className="text-cyan-400" size={18} />
          <h3 className="text-slate-100 font-medium">Opsi 2: Pakai URL Teachable Machine</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4">Tempel URL langsung ke file model.json Teachable Machine (mis. https://teachablemachine.withgoogle.com/models/XXXX/model.json).</p>
        <form onSubmit={handleSetUrl} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            name="tm_url"
            placeholder="https://teachablemachine.withgoogle.com/models/XXXX/model.json"
            className="flex-1 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <button type="submit" className="rounded-md bg-cyan-500 text-slate-900 font-medium px-4 py-2 hover:bg-cyan-400 whitespace-nowrap">Simpan URL</button>
        </form>
      </div>

      {status !== 'idle' && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          {status === 'uploading' && <p className="text-slate-300 text-sm">{message}</p>}
          {status === 'success' && <p className="text-emerald-400 text-sm">{message}</p>}
          {status === 'error' && <p className="text-rose-400 text-sm">{message}</p>}
        </div>
      )}
    </div>
  );
}
