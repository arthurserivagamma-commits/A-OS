import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  FileCode,
  Eye,
  Edit3,
  Download,
  Save,
  FolderOpen,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Sparkles,
  Check,
  Search,
  PenTool,
  Highlighter,
  Type,
  Palette,
  Layers,
  FileDown,
} from "lucide-react";

export interface DocFile {
  id: string;
  name: string;
  type: "pdf" | "docx" | "svg";
  content: string; // text, html, or svg xml
  annotations?: any[];
}

const DEFAULT_SAMPLE_PDF = `--- PAGE 1 ---
A-OS SYSTEM SPECIFICATION & ARCHITECTURE
Version: 1.2.1 Pro Edition
Author: A-OS Engineering Group

1. EXECUTIVE OVERVIEW
A-OS is a modern, modular web operating system built with glassmorphism aesthetics, reactive microkernel execution, and sandboxed application environments.

2. VIRTUAL STORAGE SUBSYSTEM
The virtual storage subsystem implements a resilient hierarchy:
- /OS (System Core partition, microkernel, bootloader)
- /Documents (User authored files, DocView documents)
- /Downloads (Web and external saved payloads)

3. SECURITY & RECOVERY
Hardware-level recovery mode (UEFI BIOS v2.44) protects against system file loss and corruption.

--- PAGE 2 ---
APPLICATION ECOSYSTEM & DOCVIEW SUITE
DocView provides integrated viewing and authoring for:
- PDF (Portable Document Format)
- DOCX (Word Document Architecture)
- SVG (Scalable Vector Graphics)

[Verified and signed by A-OS Kernel Guard]`;

const DEFAULT_SAMPLE_DOCX = `<h1>A-OS Project Charter</h1>
<p>Welcome to <strong>DocView</strong> on A-OS. This document editor allows creating, formatting, and reviewing rich formatted documents directly within the operating system.</p>
<h2>Key Capabilities</h2>
<ul>
  <li>Full rich text formatting with headings, lists, and alignments</li>
  <li>Instant synchronization with the A-OS virtual filesystem</li>
  <li>One-click export to local PC disk or A-OS /Documents directory</li>
</ul>
<p><em>Start typing below to modify this document or upload your own .docx, .pdf, or .svg files.</em></p>`;

const DEFAULT_SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="aosGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0066ff" />
      <stop offset="50%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="#0a101f" rx="20" />
  <circle cx="200" cy="150" r="90" fill="url(#aosGrad)" filter="url(#glow)" opacity="0.85" />
  
  <path d="M200 80 L250 210 L220 210 L210 180 L190 180 L180 210 L150 210 Z M200 120 L194 160 L206 160 Z" fill="#ffffff" />
  
  <text x="200" y="260" font-family="-apple-system, sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">A-OS VECTOR</text>
</svg>`;

export function DocViewApp({ fileData, onSaveToAos }: { fileData?: any; onSaveToAos?: (name: string, content: string, type: string) => void }) {
  const [activeTab, setActiveTab] = useState<"pdf" | "docx" | "svg">("pdf");
  const [docName, setDocName] = useState("document.pdf");
  const [zoom, setZoom] = useState(100);
  const [toast, setToast] = useState<string | null>(null);

  // PDF State
  const [pdfText, setPdfText] = useState(DEFAULT_SAMPLE_PDF);
  const [pdfHighlightMode, setPdfHighlightMode] = useState(false);

  // DOCX State
  const [docxHtml, setDocxHtml] = useState(DEFAULT_SAMPLE_DOCX);
  const editorRef = useRef<HTMLDivElement>(null);

  // SVG State
  const [svgCode, setSvgCode] = useState(DEFAULT_SAMPLE_SVG);
  const [svgViewMode, setSvgViewMode] = useState<"split" | "preview" | "code">("split");

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Load passed file if provided
  useEffect(() => {
    if (fileData) {
      const name = fileData.name || "untitled";
      const ext = name.split(".").pop()?.toLowerCase() || "";
      setDocName(name);

      if (ext === "pdf") {
        setActiveTab("pdf");
        setPdfText(fileData.content || DEFAULT_SAMPLE_PDF);
      } else if (ext === "docx" || ext === "doc") {
        setActiveTab("docx");
        setDocxHtml(fileData.content || DEFAULT_SAMPLE_DOCX);
      } else if (ext === "svg") {
        setActiveTab("svg");
        setSvgCode(fileData.content || DEFAULT_SAMPLE_SVG);
      }
    }
  }, [fileData]);

  // Handle saving into A-OS Virtual Filesystem
  const handleSaveToAos = () => {
    let content = "";
    if (activeTab === "pdf") content = pdfText;
    else if (activeTab === "docx") content = editorRef.current?.innerHTML || docxHtml;
    else if (activeTab === "svg") content = svgCode;

    // Save to localStorage aos-files
    try {
      const existingFiles = JSON.parse(localStorage.getItem("aos-files") || "[]");
      const ext = activeTab;
      const fileName = docName.endsWith(`.${ext}`) ? docName : `${docName.replace(/\.[^.]+$/, "")}.${ext}`;

      const newFile = {
        id: "doc-" + Date.now(),
        name: fileName,
        type: "file",
        parent: "documents",
        content: content,
        icon: ext === "pdf" ? "Text Editor.png" : ext === "svg" ? "Image.png" : "Text Editor.png",
        mime: ext === "pdf" ? "application/pdf" : ext === "svg" ? "image/svg+xml" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };

      const updated = [...existingFiles.filter((f: any) => f.name !== fileName), newFile];
      localStorage.setItem("aos-files", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));

      if (onSaveToAos) {
        onSaveToAos(fileName, content, ext);
      }
      notify(`Saved "${fileName}" directly to A-OS /Documents!`);
    } catch (e) {
      notify("Failed to save to A-OS filesystem.");
    }
  };

  // Handle local download to PC disk (and always copies to A-OS too)
  const handleDownloadPc = () => {
    let content = "";
    let mime = "text/plain";
    const ext = activeTab;
    const fileName = docName.endsWith(`.${ext}`) ? docName : `${docName.replace(/\.[^.]+$/, "")}.${ext}`;

    if (activeTab === "pdf") {
      content = pdfText;
      mime = "application/pdf";
    } else if (activeTab === "docx") {
      content = editorRef.current?.innerHTML || docxHtml;
      mime = "application/msword";
    } else if (activeTab === "svg") {
      content = svgCode;
      mime = "image/svg+xml";
    }

    // 1. Auto-save to A-OS Downloads
    try {
      const existingFiles = JSON.parse(localStorage.getItem("aos-files") || "[]");
      const downloadFile = {
        id: "dl-" + Date.now(),
        name: fileName,
        type: "file",
        parent: "downloads",
        content: content,
        icon: ext === "pdf" ? "Text Editor.png" : ext === "svg" ? "Image.png" : "Text Editor.png",
        mime,
      };
      localStorage.setItem("aos-files", JSON.stringify([...existingFiles, downloadFile]));
      window.dispatchEvent(new Event("storage"));
    } catch {}

    // 2. Download to local machine
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);

    notify(`Downloaded "${fileName}" to PC & saved in A-OS /Downloads!`);
  };

  // File import from PC or local disk
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = file.name;
    const ext = name.split(".").pop()?.toLowerCase() || "";
    setDocName(name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (ext === "svg") {
        setActiveTab("svg");
        setSvgCode(result);
      } else if (ext === "docx" || ext === "doc" || ext === "html") {
        setActiveTab("docx");
        setDocxHtml(result);
      } else {
        setActiveTab("pdf");
        setPdfText(result || DEFAULT_SAMPLE_PDF);
      }
      notify(`Loaded "${name}" into DocView!`);
    };

    if (ext === "svg" || ext === "html" || ext === "txt") {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  };

  // Rich Text command exec for DOCX editor
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setDocxHtml(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none overflow-hidden">
      {/* Toast Alert */}
      {toast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-cyan-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Application Bar */}
      <header className="h-12 px-4 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 backdrop-blur-md">
        {/* Left: App Identity & Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white">
              DocView
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />

          {/* Mode Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800/80 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab("pdf");
                if (!docName.endsWith(".pdf")) setDocName(docName.replace(/\.[^.]+$/, "") + ".pdf");
              }}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === "pdf"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              PDF Viewer
            </button>
            <button
              onClick={() => {
                setActiveTab("docx");
                if (!docName.endsWith(".docx")) setDocName(docName.replace(/\.[^.]+$/, "") + ".docx");
              }}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === "docx"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              DOCX Editor
            </button>
            <button
              onClick={() => {
                setActiveTab("svg");
                if (!docName.endsWith(".svg")) setDocName(docName.replace(/\.[^.]+$/, "") + ".svg");
              }}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === "svg"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              SVG Vector Studio
            </button>
          </div>
        </div>

        {/* Center: Editable Document Name */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <input
            type="text"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            className="text-xs font-bold bg-transparent outline-none text-slate-800 dark:text-slate-200 w-36 text-center"
            placeholder="document_name"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Open Local File */}
          <label className="px-2.5 py-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer transition flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5" /> Open
            <input
              type="file"
              accept=".pdf,.docx,.doc,.svg,.txt,.html,.xml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Save to A-OS Filesystem */}
          <button
            onClick={handleSaveToAos}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
            title="Save directly into A-OS /Documents"
          >
            <Save className="w-3.5 h-3.5" /> Save to A-OS
          </button>

          {/* Download to PC */}
          <button
            onClick={handleDownloadPc}
            className="px-3 py-1.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-1.5"
            title="Download copy to PC disk"
          >
            <Download className="w-3.5 h-3.5" /> Download PC
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {/* 1. PDF VIEWER & ANNOTATOR */}
        {activeTab === "pdf" && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-200/70 dark:bg-slate-900/60">
            {/* PDF Toolbar */}
            <div className="h-10 px-4 bg-white/80 dark:bg-slate-800/80 border-b border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-500">PDF Tools:</span>
                <button
                  onClick={() => setPdfHighlightMode(!pdfHighlightMode)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                    pdfHighlightMode
                      ? "bg-amber-400 text-slate-900 font-bold shadow-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Highlighter className="w-3.5 h-3.5" /> Highlight Mode
                </button>
                <button
                  onClick={() => {
                    setPdfText((prev) => prev + "\n\n[ANNOTATION " + new Date().toLocaleTimeString() + "]: Approved & Reviewed.");
                    notify("Added annotation note!");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-semibold flex items-center gap-1.5"
                >
                  <PenTool className="w-3.5 h-3.5" /> Add Note
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom((z) => Math.max(50, z - 10))}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs w-12 text-center">{zoom}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(200, z + 10))}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PDF Canvas Simulation Page */}
            <div className="flex-1 overflow-auto p-8 flex justify-center">
              <div
                className="w-full max-w-3xl bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-300 dark:border-slate-800 p-10 min-h-[700px] text-slate-800 dark:text-slate-100 font-serif leading-relaxed transition-transform origin-top"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs font-sans font-bold text-slate-500 uppercase tracking-widest">
                      PDF Document View · A-OS Protected Document
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Page 1 of 1</span>
                </div>

                <textarea
                  value={pdfText}
                  onChange={(e) => setPdfText(e.target.value)}
                  className={`w-full min-h-[500px] bg-transparent outline-none resize-none font-mono text-xs leading-loose ${
                    pdfHighlightMode ? "bg-amber-100/30 dark:bg-amber-900/20 p-4 rounded-xl" : ""
                  }`}
                  placeholder="PDF page content..."
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. DOCX RICH TEXT EDITOR */}
        {activeTab === "docx" && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-200/70 dark:bg-slate-900/60">
            {/* Rich Text Toolbar */}
            <div className="h-11 px-4 bg-white/90 dark:bg-slate-800/90 border-b border-slate-300 dark:border-slate-700 flex items-center gap-2 text-xs flex-wrap">
              <select
                onChange={(e) => execCmd("formatBlock", e.target.value)}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-bold outline-none"
              >
                <option value="p">Normal text</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="blockquote">Quote block</option>
              </select>

              <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-600" />

              <button
                onClick={() => execCmd("bold")}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd("italic")}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd("underline")}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200"
                title="Underline"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-600" />

              <button
                onClick={() => execCmd("justifyLeft")}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200"
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd("justifyCenter")}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200"
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd("justifyRight")}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200"
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd("insertUnorderedList")}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200"
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Document Sheet */}
            <div className="flex-1 overflow-auto p-8 flex justify-center">
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setDocxHtml(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: docxHtml }}
                className="w-full max-w-3xl bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-300 dark:border-slate-800 p-12 min-h-[700px] text-slate-900 dark:text-slate-100 font-sans leading-relaxed outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
        )}

        {/* 3. SVG VECTOR STUDIO */}
        {activeTab === "svg" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* SVG Toolbar */}
            <div className="h-10 px-4 bg-white/90 dark:bg-slate-800/90 border-b border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">View Layout:</span>
                <button
                  onClick={() => setSvgViewMode("split")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    svgViewMode === "split" ? "bg-blue-600 text-white font-bold" : "bg-slate-100 dark:bg-slate-700"
                  }`}
                >
                  Split View
                </button>
                <button
                  onClick={() => setSvgViewMode("preview")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    svgViewMode === "preview" ? "bg-blue-600 text-white font-bold" : "bg-slate-100 dark:bg-slate-700"
                  }`}
                >
                  Canvas Preview
                </button>
                <button
                  onClick={() => setSvgViewMode("code")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    svgViewMode === "code" ? "bg-blue-600 text-white font-bold" : "bg-slate-100 dark:bg-slate-700"
                  }`}
                >
                  SVG Code XML
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const circle = `<circle cx="200" cy="150" r="40" fill="#3b82f6" opacity="0.8" />\n</svg>`;
                    setSvgCode((code) => code.replace("</svg>", circle));
                    notify("Inserted SVG circle element!");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  + Add Shape
                </button>
              </div>
            </div>

            {/* Split Canvas & Code Workspace */}
            <div className="flex-1 flex overflow-hidden">
              {/* SVG Live Vector Preview Canvas */}
              {(svgViewMode === "split" || svgViewMode === "preview") && (
                <div className="flex-1 bg-slate-950 p-6 flex flex-col items-center justify-center overflow-auto border-r border-slate-800 relative">
                  <div className="absolute top-3 left-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-900/80 px-2 py-1 rounded-md">
                    Live Vector Output
                  </div>
                  <div
                    className="w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#060b14] flex items-center justify-center p-4"
                    dangerouslySetInnerHTML={{ __html: svgCode }}
                  />
                </div>
              )}

              {/* SVG Code XML Editor */}
              {(svgViewMode === "split" || svgViewMode === "code") && (
                <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
                  <div className="h-8 px-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>SVG XML Source</span>
                    <span>Real-time Sync</span>
                  </div>
                  <textarea
                    value={svgCode}
                    onChange={(e) => setSvgCode(e.target.value)}
                    className="flex-1 p-4 font-mono text-xs bg-slate-950 text-cyan-300 outline-none resize-none leading-relaxed shadow-inner"
                    spellCheck={false}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Status */}
      <footer className="h-8 px-4 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-medium shrink-0">
        <div className="flex items-center gap-3">
          <span>Active Format: <b className="text-blue-600 dark:text-cyan-400 uppercase">{activeTab}</b></span>
          <span>File: <b className="text-slate-800 dark:text-slate-200">{docName}</b></span>
        </div>
        <div>
          <span>DocView v1.0 · A-OS Suite</span>
        </div>
      </footer>
    </div>
  );
}
