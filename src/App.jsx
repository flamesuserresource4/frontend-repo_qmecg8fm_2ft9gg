import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import AnalysisOutput from './components/AnalysisOutput';
import AdminPanel from './components/AdminPanel';

function analyzeMock() {
  // Fake model output for UI preview
  const labels = [
    { label: 'Ductile to Brittle', accent: 'orange' },
    { label: 'Fatigue', accent: 'blue' },
    { label: 'Ductile', accent: 'green' },
    { label: 'Brittle', accent: 'cyan' },
  ];
  // Generate random scores then normalize to 100
  const raw = labels.map(() => Math.random() + 0.2);
  const sum = raw.reduce((a, b) => a + b, 0);
  const scores = labels.map((l, i) => ({ label: l.label, accent: l.accent, confidence: (raw[i] / sum) * 100 }));
  const top = scores.reduce((a, b) => (a.confidence > b.confidence ? a : b));
  return { top, scores };
}

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [image, setImage] = useState(null); // { file, preview }
  const [status, setStatus] = useState('idle'); // idle | processing | done
  const [result, setResult] = useState(null);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setRoute(path);
    }
  };

  const handleSelected = (payload) => {
    setImage(payload);
    setStatus('processing');
    setResult(null);
    // Simulate analysis latency
    setTimeout(() => {
      const out = analyzeMock();
      setResult(out);
      setStatus('done');
    }, 1200);
  };

  const resetAll = () => {
    setImage(null);
    setStatus('idle');
    setResult(null);
  };

  const isAdmin = route === '/admin';

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Header onNavigateAdmin={() => navigate('/admin')} />
        <main className="mx-auto max-w-6xl px-4 pb-20">
          <AdminPanel />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Header onNavigateAdmin={() => navigate('/admin')} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100">
            FractoScan: Analisis Fraktografi Instan
          </h2>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Unggah citra SEM dari permukaan patahan untuk mendapatkan prediksi mode kegagalan secara real-time
            seperti Ductile, Brittle, atau Fatigue berdasarkan model pembelajaran mesin.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <UploadArea onImageSelected={handleSelected} disabled={status === 'processing'} />
            {image && (
              <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                <img src={image.preview} alt="Pratinjau SEM" className="w-full h-64 object-contain" />
              </div>
            )}
          </div>

          <AnalysisOutput status={status} result={result} onReset={resetAll} preview={image?.preview} />
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-slate-500 text-sm">
        Dibuat untuk kebutuhan analisis material. Mode gelap dioptimalkan untuk citra SEM.
      </footer>
    </div>
  );
}
