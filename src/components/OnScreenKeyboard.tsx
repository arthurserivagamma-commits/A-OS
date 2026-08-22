import React, { useState } from "react";
import {
  Delete,
  CornerDownLeft,
  ArrowUp,
  Smile,
  Copy,
  Trash2,
  Globe,
  Space,
  Check,
  Zap,
} from "lucide-react";

export function OnScreenKeyboardApp() {
  const [typedText, setTypedText] = useState("");
  const [isShift, setIsShift] = useState(false);
  const [isCaps, setIsCaps] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const playClick = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {}
  };

  const handleKeyPress = (char: string) => {
    playClick();
    let charToAdd = char;
    if (isShift || isCaps) {
      charToAdd = char.toUpperCase();
    } else {
      charToAdd = char.toLowerCase();
    }
    setTypedText((prev) => prev + charToAdd);
    if (isShift) setIsShift(false);

    // Also dispatch to active document input if possible
    try {
      const active = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
        const start = active.selectionStart ?? active.value.length;
        const end = active.selectionEnd ?? start;
        const val = active.value;
        active.value = val.substring(0, start) + charToAdd + val.substring(end);
        active.selectionStart = active.selectionEnd = start + charToAdd.length;
        active.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } catch {}
  };

  const handleBackspace = () => {
    playClick();
    setTypedText((prev) => prev.slice(0, -1));
  };

  const handleSpace = () => {
    playClick();
    setTypedText((prev) => prev + " ");
  };

  const handleEnter = () => {
    playClick();
    setTypedText((prev) => prev + "\n");
  };

  const handleClear = () => {
    playClick();
    setTypedText("");
  };

  const handleCopy = () => {
    playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(typedText).catch(() => {});
    }
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleOpenEmoji = () => {
    window.dispatchEvent(new CustomEvent("aos-open-quick-palette", { detail: { tab: "emojis" } }));
  };

  // Keyboard Rows
  const row1 = ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="];
  const row1Shift = ["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+"];

  const row2 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"];
  const row3 = ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"];
  const row4 = ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"];

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col p-4 select-none font-sans overflow-hidden">
      {/* Top Preview Bar */}
      <div className="mb-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Live Typed Output
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition shadow"
            >
              {copiedToast ? (
                <>
                  <Check className="w-3 h-3 text-emerald-300" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-red-500/30 text-slate-300 hover:text-red-300 font-bold text-xs flex items-center gap-1 transition"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>

        <textarea
          value={typedText}
          onChange={(e) => setTypedText(e.target.value)}
          placeholder="Click the keys below to type in A-OS..."
          className="w-full h-16 bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-2xl p-2.5 text-sm font-mono text-cyan-200 placeholder-slate-500 resize-none focus:outline-none"
        />
      </div>

      {/* Keyboard Matrix */}
      <div className="flex-1 flex flex-col justify-between gap-1.5 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
        {/* Row 1: Numbers */}
        <div className="flex gap-1">
          {row1.map((k, i) => {
            const display = isShift ? row1Shift[i] : k;
            return (
              <button
                key={k}
                onClick={() => handleKeyPress(display)}
                className="flex-1 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 active:text-white text-slate-200 font-bold text-xs flex flex-col items-center justify-center transition shadow-sm border border-slate-700/50"
              >
                <span className="text-[9px] text-slate-400">{row1Shift[i]}</span>
                <span>{k}</span>
              </button>
            );
          })}
          <button
            onClick={handleBackspace}
            className="w-16 h-10 rounded-xl bg-slate-800/90 hover:bg-red-500/30 text-slate-200 hover:text-red-200 font-bold text-xs flex items-center justify-center transition border border-slate-700/50"
            title="Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        {/* Row 2: QWERTY */}
        <div className="flex gap-1">
          <button
            onClick={() => handleKeyPress("\t")}
            className="w-14 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-[10px] flex items-center justify-center border border-slate-700/50"
          >
            TAB
          </button>
          {row2.map((k) => (
            <button
              key={k}
              onClick={() => handleKeyPress(k)}
              className="flex-1 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 active:text-white text-slate-100 font-bold text-xs uppercase flex items-center justify-center transition shadow-sm border border-slate-700/50"
            >
              {isShift || isCaps ? k.toUpperCase() : k}
            </button>
          ))}
        </div>

        {/* Row 3: ASDF */}
        <div className="flex gap-1">
          <button
            onClick={() => setIsCaps(!isCaps)}
            className={`w-16 h-10 rounded-xl font-bold text-[10px] flex items-center justify-center transition border ${
              isCaps
                ? "bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30"
                : "bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700/50"
            }`}
          >
            CAPS
          </button>
          {row3.map((k) => (
            <button
              key={k}
              onClick={() => handleKeyPress(k)}
              className="flex-1 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 active:text-white text-slate-100 font-bold text-xs uppercase flex items-center justify-center transition shadow-sm border border-slate-700/50"
            >
              {isShift || isCaps ? k.toUpperCase() : k}
            </button>
          ))}
          <button
            onClick={handleEnter}
            className="w-16 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center transition shadow border border-blue-400/40"
            title="Enter"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Row 4: ZXCV */}
        <div className="flex gap-1">
          <button
            onClick={() => setIsShift(!isShift)}
            className={`w-20 h-10 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 transition border ${
              isShift
                ? "bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30"
                : "bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700/50"
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5" /> SHIFT
          </button>
          {row4.map((k) => (
            <button
              key={k}
              onClick={() => handleKeyPress(k)}
              className="flex-1 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 active:text-white text-slate-100 font-bold text-xs uppercase flex items-center justify-center transition shadow-sm border border-slate-700/50"
            >
              {isShift || isCaps ? k.toUpperCase() : k}
            </button>
          ))}
          <button
            onClick={() => setIsShift(!isShift)}
            className={`w-20 h-10 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 transition border ${
              isShift
                ? "bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30"
                : "bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700/50"
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5" /> SHIFT
          </button>
        </div>

        {/* Row 5: Space & Functions */}
        <div className="flex gap-1">
          <button
            onClick={handleOpenEmoji}
            className="w-14 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center border border-slate-700/50"
            title="Open Emojis & Symbols"
          >
            <Smile className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleKeyPress(" ")}
            className="flex-1 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 active:text-white text-slate-400 font-bold text-xs flex items-center justify-center transition border border-slate-700/50"
          >
            SPACE
          </button>
          <button
            onClick={handleCopy}
            className="w-16 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] flex items-center justify-center border border-slate-700/50"
          >
            COPY
          </button>
        </div>
      </div>
    </div>
  );
}
