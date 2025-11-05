import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

export default function UploadArea({ onImageSelected, disabled }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const valid = ['image/jpeg', 'image/png', 'image/tiff'];
    if (!valid.includes(file.type)) {
      alert('Format tidak didukung. Gunakan .jpg, .png, atau .tiff');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onImageSelected({ file, preview: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  return (
    <div
      className={[
        'relative w-full rounded-xl border-2 border-dashed',
        dragActive ? 'border-cyan-400 bg-cyan-950/20' : 'border-slate-700 bg-slate-900/40',
        'p-6 sm:p-8 flex flex-col items-center justify-center text-center',
        disabled ? 'opacity-60 pointer-events-none' : 'hover:border-slate-600',
      ].join(' ')}
      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); if (!disabled) setDragActive(true); }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="p-3 rounded-full bg-slate-800 text-slate-200">
          <Upload size={24} />
        </div>
        <h3 className="text-slate-100 text-lg font-medium">Seret & letakkan gambar SEM</h3>
        <p className="text-slate-400 text-sm">atau</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-md bg-cyan-500 text-slate-900 font-medium px-4 py-2 hover:bg-cyan-400 transition-colors"
        >
          <ImageIcon size={16} /> Pilih Gambar SEM
        </button>
        <p className="text-slate-500 text-xs mt-2">Mendukung format .jpg, .png, .tiff</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/tiff"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
