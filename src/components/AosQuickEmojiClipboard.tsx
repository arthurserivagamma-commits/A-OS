import React, { useState, useEffect, useRef } from "react";
import {
  Smile,
  Clipboard,
  Search,
  Sparkles,
  Trash2,
  Zap,
  Code,
  Globe,
  FileText,
  X,
} from "lucide-react";

export interface ClipboardItem {
  id: string;
  type: "text" | "image" | "code" | "url";
  content: string;
  preview?: string;
  timestamp: number;
  length?: number;
}

export interface EmojiItem {
  id: string;
  name: string;
  symbol: string;
  category: string;
}

// EXCLUSIVE OFFICIAL A-OS EMOJI & SYMBOL COLLECTION (ONLY THIS PACK IN A-OS)
export const AOS_ONLY_EMOJIS: EmojiItem[] = [
  // A-OS Neo 3D & Core Signature Glyphs
  { id: "aos-1", name: "A-OS Core", symbol: "💠", category: "A-OS Neo" },
  { id: "aos-2", name: "Quantum Bot", symbol: "🤖", category: "A-OS Neo" },
  { id: "aos-3", name: "Hyper Bolt", symbol: "⚡", category: "A-OS Neo" },
  { id: "aos-4", name: "Cyber Flame", symbol: "🔥", category: "A-OS Neo" },
  { id: "aos-5", name: "Crystal Shard", symbol: "💎", category: "A-OS Neo" },
  { id: "aos-6", name: "Super Launch", symbol: "🚀", category: "A-OS Neo" },
  { id: "aos-7", name: "Golden Star", symbol: "⭐", category: "A-OS Neo" },
  { id: "aos-8", name: "Sparkles Glow", symbol: "✨", category: "A-OS Neo" },
  { id: "aos-9", name: "Sovereign Crown", symbol: "👑", category: "A-OS Neo" },
  { id: "aos-10", name: "Cyber Shield", symbol: "🛡️", category: "A-OS Neo" },
  { id: "aos-11", name: "Kernel Shell", symbol: "💻", category: "A-OS Neo" },
  { id: "aos-12", name: "Quantum Chip", symbol: "🔮", category: "A-OS Neo" },
  { id: "aos-13", name: "Optical Array", symbol: "💽", category: "A-OS Neo" },
  { id: "aos-14", name: "Infinite Loop", symbol: "♾️", category: "A-OS Neo" },

  // A-OS Expressive Emotes
  { id: "em-1", name: "Grinning Face", symbol: "😀", category: "Emotes" },
  { id: "em-2", name: "Tears of Joy", symbol: "😂", category: "Emotes" },
  { id: "em-3", name: "Rolling Laughing", symbol: "🤣", category: "Emotes" },
  { id: "em-4", name: "Heart Eyes", symbol: "😍", category: "Emotes" },
  { id: "em-5", name: "Star Struck", symbol: "🤩", category: "Emotes" },
  { id: "em-6", name: "Sunglasses Cool", symbol: "😎", category: "Emotes" },
  { id: "em-7", name: "Partying Face", symbol: "🥳", category: "Emotes" },
  { id: "em-8", name: "Exploding Head", symbol: "🤯", category: "Emotes" },
  { id: "em-9", name: "Pleading Eyes", symbol: "🥺", category: "Emotes" },
  { id: "em-10", name: "Loudly Crying", symbol: "😭", category: "Emotes" },
  { id: "em-11", name: "Thinking Face", symbol: "🤔", category: "Emotes" },
  { id: "em-12", name: "Saluting", symbol: "🫡", category: "Emotes" },
  { id: "em-13", name: "Nerd Face", symbol: "🤓", category: "Emotes" },
  { id: "em-14", name: "Melting Face", symbol: "🫠", category: "Emotes" },
  { id: "em-15", name: "Red Heart", symbol: "❤️", category: "Emotes" },
  { id: "em-16", name: "Sparkle Heart", symbol: "💖", category: "Emotes" },
  { id: "em-17", name: "Thumbs Up", symbol: "👍", category: "Emotes" },
  { id: "em-18", name: "Clapping Hands", symbol: "👏", category: "Emotes" },
  { id: "em-19", name: "Victory Peace", symbol: "✌️", category: "Emotes" },
  { id: "em-20", name: "Folded Hands", symbol: "🙏", category: "Emotes" },
  { id: "em-21", name: "Flexed Biceps", symbol: "💪", category: "Emotes" },
  { id: "em-22", name: "Eyes Looking", symbol: "👀", category: "Emotes" },

  // A-OS Cyber & Quantum Symbols
  { id: "cq-1", name: "Matrix Diamond", symbol: "◆", category: "Symbols" },
  { id: "cq-2", name: "Secure Node", symbol: "◈", category: "Symbols" },
  { id: "cq-3", name: "Quantum Hex", symbol: "⬢", category: "Symbols" },
  { id: "cq-4", name: "Spark Rune", symbol: "✦", category: "Symbols" },
  { id: "cq-5", name: "Microprocessor", symbol: "🖲️", category: "Symbols" },
  { id: "cq-6", name: "Atomic Structure", symbol: "⚛️", category: "Symbols" },
  { id: "cq-7", name: "Radioactive", symbol: "☢️", category: "Symbols" },
  { id: "cq-8", name: "Biohazard", symbol: "☣️", category: "Symbols" },
  { id: "cq-9", name: "Satellite Array", symbol: "📡", category: "Symbols" },
  { id: "cq-10", name: "World Wide Mesh", symbol: "🌐", category: "Symbols" },
  { id: "cq-11", name: "Neural Brain", symbol: "🧠", category: "Symbols" },
  { id: "cq-12", name: "Game Controller", symbol: "🎮", category: "Symbols" },
  { id: "cq-13", name: "Trophy Gold", symbol: "🏆", category: "Symbols" },
  { id: "cq-14", name: "Lightbulb Idea", symbol: "💡", category: "Symbols" },
  { id: "cq-15", name: "System Gear", symbol: "⚙️", category: "Symbols" },
  { id: "cq-16", name: "Padlock Key", symbol: "🔒", category: "Symbols" },
  { id: "cq-17", name: "Golden Key", symbol: "🔑", category: "Symbols" },
  { id: "cq-18", name: "Full Battery", symbol: "🔋", category: "Symbols" },
  { id: "cq-19", name: "Server Rack", symbol: "🖥️", category: "Symbols" },
  { id: "cq-20", name: "Check Mark", symbol: "✅", category: "Symbols" },
  { id: "cq-21", name: "Cross Mark", symbol: "❌", category: "Symbols" },
  { id: "cq-22", name: "Warning Triangle", symbol: "⚠️", category: "Symbols" },
  { id: "cq-23", name: "Note Pad", symbol: "📝", category: "Symbols" },
  { id: "cq-24", name: "Folder Icon", symbol: "📁", category: "Symbols" },
];

export function AosQuickEmojiClipboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"emojis" | "clipboard">("emojis");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  // Load clipboard history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aos-clipboard-history");
      if (saved) {
        setClipboardItems(JSON.parse(saved));
      } else {
        const initial: ClipboardItem[] = [
          {
            id: "clip-1",
            type: "text",
            content: "Welcome to A-OS! Press Ctrl + . or Shift + . for Quick Palette.",
            timestamp: Date.now() - 1000 * 60 * 5,
            length: 63,
          },
        ];
        setClipboardItems(initial);
        localStorage.setItem("aos-clipboard-history", JSON.stringify(initial));
      }
    } catch {}
  }, []);

  const saveClipboardItems = (items: ClipboardItem[]) => {
    setClipboardItems(items);
    try {
      localStorage.setItem("aos-clipboard-history", JSON.stringify(items.slice(0, 30)));
    } catch {}
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  // Global Clipboard Capture Listener (Captures all copy / cut events)
  useEffect(() => {
    const handleCopyCapture = () => {
      try {
        const text = document.getSelection()?.toString();
        if (text && text.trim().length > 0) {
          const newItem: ClipboardItem = {
            id: `clip-${Date.now()}`,
            type:
              text.startsWith("http://") || text.startsWith("https://")
                ? "url"
                : text.includes("{") || text.includes("function") || text.includes("const ")
                ? "code"
                : "text",
            content: text,
            timestamp: Date.now(),
            length: text.length,
          };
          setClipboardItems((prev) => {
            const filtered = prev.filter((i) => i.content !== text);
            const updated = [newItem, ...filtered].slice(0, 30);
            try {
              localStorage.setItem("aos-clipboard-history", JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      } catch {}
    };

    window.addEventListener("copy", handleCopyCapture);
    window.addEventListener("cut", handleCopyCapture);
    return () => {
      window.removeEventListener("copy", handleCopyCapture);
      window.removeEventListener("cut", handleCopyCapture);
    };
  }, []);

  // Global Keyboard Shortcut Listener: Ctrl + . | Cmd + . | Shift + .
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isPeriod = e.key === "." || e.key === ">" || e.code === "Period";
      const isTrigger =
        ((e.ctrlKey || e.metaKey) && isPeriod) ||
        (e.shiftKey && (e.key === ">" || e.key === "."));

      if (isTrigger) {
        e.preventDefault();
        e.stopPropagation();

        const active = document.activeElement as HTMLElement | null;
        if (
          active &&
          (active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.isContentEditable)
        ) {
          lastActiveElementRef.current = active;
          const rect = active.getBoundingClientRect();
          setPosition({
            x: Math.max(8, Math.min(rect.left, window.innerWidth - 275)),
            y: Math.max(8, Math.min(rect.bottom + 6, window.innerHeight - 340)),
          });
        } else {
          setPosition({
            x: Math.max(8, Math.floor(window.innerWidth / 2 - 135)),
            y: Math.max(8, Math.floor(window.innerHeight / 2 - 170)),
          });
        }

        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomTrigger = (e: any) => {
      if (e.detail?.tab) {
        setActiveTab(e.detail.tab);
      }
      if (e.detail?.x !== undefined && e.detail?.y !== undefined) {
        setPosition({ x: e.detail.x, y: e.detail.y });
      } else {
        setPosition({
          x: Math.max(8, Math.floor(window.innerWidth / 2 - 135)),
          y: Math.max(8, Math.floor(window.innerHeight / 2 - 170)),
        });
      }
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("aos-open-quick-palette", handleCustomTrigger);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("aos-open-quick-palette", handleCustomTrigger);
    };
  }, [isOpen]);

  // Insert Emoji or Text into Target Element or System Clipboard
  const handleInsertContent = (content: string, label: string) => {
    const target = lastActiveElementRef.current;

    // 1. Insert into input or textarea if active
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      const start = target.selectionStart ?? target.value.length;
      const end = target.selectionEnd ?? start;
      const val = target.value;
      target.value = val.substring(0, start) + content + val.substring(end);
      target.selectionStart = target.selectionEnd = start + content.length;
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.focus();
    } else if (target && target.isContentEditable) {
      document.execCommand("insertText", false, content);
      target.focus();
    }

    // 2. Also write to system clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(content).catch(() => {});
    }

    // 3. Register in clipboard history
    const newItem: ClipboardItem = {
      id: `clip-${Date.now()}`,
      type: "text",
      content: content,
      timestamp: Date.now(),
      length: content.length,
    };
    saveClipboardItems([newItem, ...clipboardItems.filter((i) => i.content !== content)]);

    showToast(`Copied ${label}!`);
    setIsOpen(false);
  };

  // Filter Emojis
  const filteredEmojis = AOS_ONLY_EMOJIS.filter((emoji) => {
    return (
      !searchQuery ||
      emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emoji.symbol.includes(searchQuery)
    );
  });

  // Filter Clipboard Items
  const filteredClipboard = clipboardItems.filter((item) =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimeAgo = (timestamp: number) => {
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h`;
    return `${Math.floor(diffHr / 24)}d`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999998] bg-black/25 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999999] px-3 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xl border border-sky-300/40">
          <Zap className="w-3 h-3 text-cyan-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Ultra-Compact Palette Modal */}
      <section
        className="emoji-picker"
        style={
          position
            ? { left: `${position.x}px`, top: `${position.y}px` }
            : { left: "calc(50vw - 135px)", top: "calc(50vh - 170px)" }
        }
        data-no-translate="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header */}
        <header>
          <b>
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>A-OS Emojis & Clipboard</span>
          </b>
          <button
            onClick={() => setIsOpen(false)}
            className="close-btn"
            title="Close (Esc)"
          >
            ×
          </button>
        </header>

        {/* 2 Compact Tabs: Emojis & Last Copied */}
        <div className="emoji-tabs">
          <button
            onClick={() => {
              setActiveTab("emojis");
              setSearchQuery("");
            }}
            className={`emoji-tab-btn ${activeTab === "emojis" ? "active" : ""}`}
          >
            <Smile className="w-3 h-3" />
            <span>Emojis</span>
            <span className="opacity-75 text-[9px]">({filteredEmojis.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("clipboard");
              setSearchQuery("");
            }}
            className={`emoji-tab-btn ${activeTab === "clipboard" ? "active" : ""}`}
          >
            <Clipboard className="w-3 h-3" />
            <span>Last Copied</span>
            <span className="opacity-75 text-[9px]">({clipboardItems.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <input
          autoFocus
          type="text"
          className="emoji-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            activeTab === "emojis"
              ? "Search A-OS emojis & symbols..."
              : "Search copied items..."
          }
        />

        {/* Main Content Area */}
        {activeTab === "emojis" ? (
          <div className="emoji-grid">
            {filteredEmojis.length > 0 ? (
              filteredEmojis.map((emoji) => (
                <button
                  key={emoji.id}
                  onClick={() => handleInsertContent(emoji.symbol, emoji.name)}
                  title={emoji.name}
                  className="aos-3d-emoji"
                >
                  <span>{emoji.symbol}</span>
                </button>
              ))
            ) : (
              <p className="col-span-7 text-center text-[10px] py-4 opacity-60">
                No emojis match "{searchQuery}"
              </p>
            )}
          </div>
        ) : (
          <div className="clipboard-list">
            {clipboardItems.length > 0 && (
              <div className="flex items-center justify-between px-1 pb-1">
                <span className="text-[9px] font-bold opacity-60 uppercase tracking-wider">
                  Copied Snippets
                </span>
                <button
                  onClick={() => {
                    saveClipboardItems([]);
                    showToast("Cleared clipboard");
                  }}
                  className="text-[9px] text-red-400 hover:underline flex items-center gap-0.5"
                >
                  <Trash2 className="w-2.5 h-2.5" /> Clear
                </button>
              </div>
            )}

            {filteredClipboard.length > 0 ? (
              filteredClipboard.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleInsertContent(item.content, "Clipboard snippet")}
                  className="clipboard-card"
                >
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="font-bold flex items-center gap-1 opacity-70">
                      {item.type === "code" ? (
                        <Code className="w-2.5 h-2.5 text-emerald-400" />
                      ) : item.type === "url" ? (
                        <Globe className="w-2.5 h-2.5 text-sky-400" />
                      ) : (
                        <FileText className="w-2.5 h-2.5 text-slate-400" />
                      )}
                      <span className="uppercase text-[8px]">{item.type}</span>
                    </span>
                    <span className="opacity-50 text-[8px]">{formatTimeAgo(item.timestamp)}</span>
                  </div>
                  <div className="text-[10px] font-mono line-clamp-2 select-text break-words leading-tight">
                    {item.content}
                  </div>
                  <div className="flex items-center justify-between text-[8px] opacity-50 pt-0.5">
                    <span>{item.length || item.content.length} chars</span>
                    <span className="text-cyan-400 font-bold">Paste</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 opacity-60 text-[10px]">
                <Clipboard className="w-5 h-5 mx-auto mb-1 opacity-40" />
                <p>No copied items</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer>
          <span>A-OS Official Pack</span>
          <span>Ctrl + . / Shift + .</span>
        </footer>
      </section>
    </div>
  );
}
