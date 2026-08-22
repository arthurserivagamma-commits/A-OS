import React, { useState } from "react";
import {
  Download,
  Terminal,
  Globe,
  HardDrive,
  Check,
  FolderArchive,
  Layers,
  Cpu,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Code2,
  FileCode,
} from "lucide-react";
import { exportAosAsZip } from "../utils/zipExporter";

export function OsDownloadPage({ onClose }: { onClose?: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  const handleDownloadFullOs = () => {
    setDownloading(true);
    setDownloadStatus("Packaging full A-OS OS kernel, components, and project files...");

    setTimeout(() => {
      const result = exportAosAsZip();
      setDownloading(false);
      if (result.success) {
        setDownloadStatus(`Successfully downloaded: ${result.filename}`);
      } else {
        setDownloadStatus("Export error. Please try again.");
      }
      setTimeout(() => setDownloadStatus(null), 5000);
    }, 600);
  };

  const handleDownloadStandalone = () => {
    setDownloading(true);
    setDownloadStatus("Packaging standalone instant runnable index.html...");
    setTimeout(() => {
      exportAosAsZip();
      setDownloading(false);
      setDownloadStatus("Downloaded A-OS standalone bundle! Double-click index.html to run.");
      setTimeout(() => setDownloadStatus(null), 5000);
    }, 500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-y-auto">
      {/* Header Banner */}
      <div className="p-8 bg-gradient-to-b from-blue-950/60 via-slate-900/40 to-slate-950 border-b border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-2xl shadow-blue-500/30 mb-4 animate-scale-up">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-blue-500">
              A
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          A-OS Operating System Center
        </h1>
        <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
          Download the real, complete A-OS system files to run the full web operating system locally on your PC, Mac, Linux machine, or deploy directly to your website.
        </p>

        {/* Status Toast */}
        {downloadStatus && (
          <div className="mt-4 px-4 py-2 rounded-2xl bg-blue-600/90 text-white text-xs font-bold shadow-xl border border-blue-400/40 flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-cyan-300" />
            <span>{downloadStatus}</span>
          </div>
        )}
      </div>

      {/* Main Download Options Grid */}
      <div className="max-w-4xl w-full mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: Full System Source Package */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all duration-200 flex flex-col justify-between shadow-xl group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <FolderArchive className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 block mb-1">
              Complete Distribution
            </span>
            <h3 className="text-lg font-bold text-white mb-2">Full A-OS System Package (.zip)</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Includes all source files, Vite config, React/TSX components, DocView app, UEFI BIOS, `/OS` microkernel, wallpapers, and virtual filesystem partition.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> package.json & Vite setup
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Standalone index.html bundle
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> /OS system kernel & user files
              </li>
            </ul>
          </div>

          <button
            onClick={handleDownloadFullOs}
            disabled={downloading}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Packaging OS Files..." : "Download Complete OS ZIP"}
          </button>
        </div>

        {/* Option 2: 1-Click Standalone Web OS */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 flex flex-col justify-between shadow-xl group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 block mb-1">
              Instant Standalone
            </span>
            <h3 className="text-lg font-bold text-white mb-2">Standalone Single-File Bundle</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Zero dependencies or terminal commands needed. Just double click the exported <code className="text-cyan-300">index.html</code> file on any PC, Mac, or browser.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Double-click to launch
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Upload to any static host / Vercel
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Offline execution ready
              </li>
            </ul>
          </div>

          <button
            onClick={handleDownloadStandalone}
            disabled={downloading}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-xs font-bold border border-slate-700 hover:border-slate-600 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <HardDrive className="w-4 h-4" />
            Download Standalone Bundle
          </button>
        </div>
      </div>

      {/* Deployment & Host Instructions */}
      <div className="max-w-4xl w-full mx-auto px-8 pb-12">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            How to Run A-OS on Your PC or Website
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Run on PC */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <b className="text-cyan-400 block mb-2 font-sans font-bold">1. Run on PC / Mac / Linux:</b>
              <p className="text-slate-400 mb-2 font-sans">Option A (Zero Setup):</p>
              <code className="text-emerald-400 block mb-3 bg-slate-900 p-2 rounded-lg">
                Double click "index.html"
              </code>
              <p className="text-slate-400 mb-2 font-sans">Option B (Node / Vite):</p>
              <code className="text-blue-400 block bg-slate-900 p-2 rounded-lg">
                npm install<br />
                npm run dev
              </code>
            </div>

            {/* Run on Website */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <b className="text-cyan-400 block mb-2 font-sans font-bold">2. Host on Any Website:</b>
              <p className="text-slate-400 mb-2 font-sans">Deploy instantly to:</p>
              <ul className="text-slate-300 space-y-1 font-sans">
                <li>• <b>Vercel / Netlify</b>: Drag and drop the folder</li>
                <li>• <b>GitHub Pages</b>: Push to repository</li>
                <li>• <b>Apache / Nginx</b>: Copy files to <code className="text-amber-400">/var/www/html</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
