import React, { useState } from "react";
import { exportAosAsZip } from "../utils/zipExporter";
import {
  Code,
  Copy,
  Check,
  Download,
  FileCode,
  FileText,
  Search,
  Zap,
  Layers,
  Sparkles,
  Clipboard,
  Terminal,
  FolderCode,
  Globe,
} from "lucide-react";

export interface SourceFile {
  name: string;
  path: string;
  type: "ts" | "tsx" | "jsx" | "css" | "json" | "html" | "md";
  content: string;
}

export function OpenSourceApp() {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFileName, setActiveFileName] = useState("src/App.tsx");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [customContents, setCustomContents] = useState<Record<string, string>>({});

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const SOURCE_FILES: SourceFile[] = [
    {
      name: "src/App.tsx",
      path: "src/App.tsx",
      type: "tsx",
      content: `import React from "react";
import AosDesktop from "./AosDesktop";
import { BackgroundServices } from "./components/BackgroundServices";

export function App() {
  return (
    <>
      <AosDesktop />
      <BackgroundServices />
    </>
  );
}

export default App;`,
    },
    {
      name: "src/components/PowerPreferencesTab.tsx",
      path: "src/components/PowerPreferencesTab.tsx",
      type: "tsx",
      content: `// A-OS Power Preferences Tab
// Includes Window Transparency Sliders, Glassmorphism Engine,
// Profile Avatar Customization (Letter in Circle & Colors),
// A-OS Mouse Pointer Text, Apple Emoji Pack, and ZIP Backup.`,
    },
    {
      name: "src/components/CustomEmojiStudio.tsx",
      path: "src/components/CustomEmojiStudio.tsx",
      type: "tsx",
      content: `// A-OS Apple Emoji Pack & 3D Custom Emoji Studio
// Features over 200 authentic Apple-style emojis and 3D custom glowing emojis.`,
    },
    {
      name: "src/utils/zipExporter.ts",
      path: "src/utils/zipExporter.ts",
      type: "ts",
      content: `// A-OS ZIP Archive Generator
// Packages all filesystem documents, notes, dev apps, and settings into a .zip.`,
    },
    {
      name: "src/index.css",
      path: "src/index.css",
      type: "css",
      content: `/* A-OS Complete Design System & Glassmorphism Shader Engine */
:root {
  --window-glass-opacity: 0.72;
  --window-blur: 28px;
  --panel-glass-opacity: 0.65;
}

/* Glassmorphism Surface Rules */
.system-window {
  background: rgba(255, 255, 255, var(--window-glass-opacity, 0.72)) !important;
  backdrop-filter: blur(var(--window-blur, 28px)) saturate(190%) !important;
  -webkit-backdrop-filter: blur(var(--window-blur, 28px)) saturate(190%) !important;
  border: 1px solid rgba(255, 255, 255, 0.7) !important;
  box-shadow: 0 24px 60px rgba(7, 21, 46, 0.28) !important;
}`,
    },
    {
      name: "package.json",
      path: "package.json",
      type: "json",
      content: `{
  "name": "a-os-desktop",
  "version": "1.2.1",
  "dependencies": {
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "fflate": "^0.8.3",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24"
  }
}`,
    },
    {
      name: "index.html",
      path: "index.html",
      type: "html",
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>A-OS Desktop v1.2.1</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,..." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
    {
      name: "README.md",
      path: "README.md",
      type: "md",
      content: `# A-OS Desktop v1.2.1 (Open Source)

A-OS is a modern web-based operating system featuring:
- **A-Applications & Auth Ecosystem**
- **Glassmorphism Desktop with Customizable Transparency**
- **Apple Emoji Pack & 3D Custom Emoji Creator**
- **Profile Avatar Customizer (Letter in Circle & Pure Colors)**
- **A-OS Mouse Pointer Text**
- **Virtual Filesystem & Code Studio**
- **Full System ZIP Exporter**`,
    },
  ];

  const filteredFiles = SOURCE_FILES.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeFile =
    SOURCE_FILES.find((f) => f.name === activeFileName) || SOURCE_FILES[0];

  const currentCode =
    customContents[activeFile.name] !== undefined
      ? customContents[activeFile.name]
      : activeFile.content;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode).catch(() => {});
    setCopied(true);
    notify(`Copied ${activeFile.name} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSource = () => {
    notify("Downloading complete A-OS Source ZIP...");
    const res = exportAosAsZip();
    if (res.success) {
      notify(`Downloaded ${res.filename}`);
    } else {
      notify("Failed to package source code.");
    }
  };

  const handleContentChange = (newVal: string) => {
    setCustomContents((prev) => ({
      ...prev,
      [activeFile.name]: newVal,
    }));
  };

  return (
    <div className="flex h-full w-full bg-slate-900/95 text-slate-100 font-sans overflow-hidden select-text">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-[99999] px-4 py-2 bg-blue-600 text-white rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Zap className="w-4 h-4 text-cyan-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Sidebar File Tree */}
      <aside className="w-64 bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between p-3 shrink-0">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-2 py-1.5 border-b border-slate-800/60 pb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <FolderCode className="w-4 h-4" />
            </div>
            <div>
              <b className="block text-xs font-black tracking-tight text-white">
                A-OS OpenSource
              </b>
              <span className="text-[10px] text-slate-400">v1.2.1 · Source Tree</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search source files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          {/* File list */}
          <div className="space-y-1 max-h-[55vh] overflow-y-auto">
            {filteredFiles.map((file) => (
              <button
                key={file.name}
                onClick={() => {
                  setActiveFileName(file.name);
                  setEditMode(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-left transition ${
                  activeFileName === file.name
                    ? "bg-blue-600/30 text-cyan-300 border border-cyan-500/30 font-semibold"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                {file.type === "tsx" || file.type === "ts" ? (
                  <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                ) : file.type === "css" ? (
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Download source button */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <button
            onClick={handleDownloadSource}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download A-OS (REAL) Windows (.zip)</span>
          </button>
          <button
            onClick={handleDownloadSource}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-white/10 transition flex items-center justify-center gap-2"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download Web & Source Archive</span>
          </button>
          <p className="text-[10px] text-slate-400 text-center font-medium">
            Includes run-windows.bat, full A-OS (REAL) runnable system & source
          </p>
        </div>
      </aside>

      {/* Main Code View & Editor */}
      <main className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
        {/* Top toolbar */}
        <header className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-950 text-cyan-400 border border-cyan-500/20 font-mono text-[11px]">
              {activeFile.name}
            </span>
            <span className="text-[11px] text-slate-400">
              {currentCode.split("\n").length} lines · {new Blob([currentCode]).size} bytes
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode((v) => !v)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                editMode
                  ? "bg-amber-600 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {editMode ? "Viewing Mode" : "Paste / Edit Mode"}
            </button>

            <button
              onClick={handleCopyCode}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy File Code"}</span>
            </button>
          </div>
        </header>

        {/* Code Content Container */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed bg-[#0d1117]">
          {editMode ? (
            <textarea
              value={currentCode}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full h-full bg-transparent text-slate-200 outline-none resize-none font-mono"
              placeholder="Paste or edit source code here..."
              spellCheck={false}
            />
          ) : (
            <pre className="text-slate-300">
              <code>
                {currentCode.split("\n").map((line, idx) => (
                  <div key={idx} className="flex hover:bg-slate-800/40">
                    <span className="w-10 select-none text-slate-600 text-right pr-4 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-slate-200">{line || " "}</span>
                  </div>
                ))}
              </code>
            </pre>
          )}
        </div>

        {/* Footer */}
        <footer className="px-5 py-2 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Click "Copy File Code" to copy, or switch to "Paste / Edit Mode" to modify files.</span>
          <span className="text-cyan-400 font-semibold">A-OS OpenSource Engine</span>
        </footer>
      </main>
    </div>
  );
}
