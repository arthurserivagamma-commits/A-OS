import React, { useState, useEffect } from "react";
import { exportAosAsZip } from "../utils/zipExporter";
import { DesignStudioApp } from "./DesignStudioApp";
import { OpenSourceApp } from "./OpenSourceApp";
import {
  Sparkles,
  Download,
  Layers,
  Cloud,
  Lock,
  Unlock,
  Check,
  RefreshCw,
  Zap,
  Sliders,
  Eye,
  User,
  Palette,
  MousePointer,
  Apple,
  Circle,
  Type,
  Code,
  Laptop,
  Clock,
  Edit3,
  Save,
  MessageCircle,
  Send,
  Globe,
  Play,
  FileCode,
} from "lucide-react";

export type EmojiPackType =
  | "iOS / Apple"
  | "Meta / WhatsApp"
  | "Telegram"
  | "Google Noto"
  | "3D Cyber";

export function PowerPreferencesTab() {
  const [showOpenSource, setShowOpenSource] = useState(false);
  const [showDesignStudio, setShowDesignStudio] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Device Info & Editable Name
  const [deviceName, setDeviceName] = useState(() => {
    return localStorage.getItem("aos-device-name") || "A-OS Desktop Station";
  });
  const [isEditingDeviceName, setIsEditingDeviceName] = useState(false);
  const [tempDeviceName, setTempDeviceName] = useState(deviceName);

  // Live Uptime since Factory Reset
  const [uptimeStr, setUptimeStr] = useState<string>("0d 0h 0m 0s");

  useEffect(() => {
    const getResetTime = () => {
      let resetTime = localStorage.getItem("aos-factory-reset-time");
      if (!resetTime) {
        resetTime = new Date(Date.now() - 3600000 * 5).toISOString();
        localStorage.setItem("aos-factory-reset-time", resetTime);
      }
      return new Date(resetTime).getTime();
    };

    const updateTimer = () => {
      const start = getResetTime();
      const now = Date.now();
      const diffMs = Math.max(0, now - start);

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      setUptimeStr(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Running Index Editor
  const [runningIndexCode, setRunningIndexCode] = useState(() => {
    return (
      localStorage.getItem("aos-custom-running-index") ||
      `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <title>A-OS Desktop v1.2.1</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>`
    );
  });
  const [isEditingIndex, setIsEditingIndex] = useState(false);

  // Active Emoji Pack
  const [activeEmojiPack, setActiveEmojiPack] = useState<EmojiPackType>(() => {
    return (localStorage.getItem("aos-active-emoji-pack") as any) || "iOS / Apple";
  });

  const [glassmorphism, setGlassmorphism] = useState(() => {
    return localStorage.getItem("aos-glassmorphism-mode") !== "false";
  });

  const [transparency, setTransparency] = useState<number>(() => {
    const saved = localStorage.getItem("aos-window-transparency");
    return saved ? Number(saved) : 72;
  });

  const [blurRadius, setBlurRadius] = useState<number>(() => {
    const saved = localStorage.getItem("aos-window-blur");
    return saved ? Number(saved) : 28;
  });

  const [noLocking, setNoLocking] = useState(() => {
    return localStorage.getItem("aos-no-locking") === "true";
  });

  const [autoBackup, setAutoBackup] = useState(() => {
    return localStorage.getItem("aos-auto-backup") !== "false";
  });

  const [autoApplyOtherPC, setAutoApplyOtherPC] = useState(() => {
    return localStorage.getItem("aos-auto-apply-cloud") !== "false";
  });

  // Profile Customization state
  const [avatarType, setAvatarType] = useState<"letter" | "color" | "default">(() => {
    return (localStorage.getItem("aos-profile-avatar-type") as any) || "letter";
  });
  const [avatarLetter, setAvatarLetter] = useState(() => {
    return localStorage.getItem("aos-profile-avatar-letter") || "A";
  });
  const [avatarColor, setAvatarColor] = useState(() => {
    return localStorage.getItem("aos-profile-avatar-color") || "#0ea5e9";
  });

  // Pointer Text state
  const [pointerTextEnabled, setPointerTextEnabled] = useState(() => {
    return localStorage.getItem("aos-pointer-text-enabled") === "true";
  });
  const [pointerText, setPointerText] = useState(() => {
    return localStorage.getItem("aos-pointer-text") || "A-OS";
  });

  const [syncState, setSyncState] = useState<string>("Synced · Just now");

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Sync Transparency & Glassmorphism
  useEffect(() => {
    localStorage.setItem("aos-glassmorphism-mode", String(glassmorphism));
    localStorage.setItem("aos-window-transparency", String(transparency));
    localStorage.setItem("aos-window-blur", String(blurRadius));

    const opacityVal = glassmorphism ? transparency / 100 : 1.0;
    const blurVal = glassmorphism ? blurRadius : 0;
    const panelOpacity = glassmorphism ? Math.max(0.4, (transparency / 100) * 0.9) : 1.0;

    document.documentElement.style.setProperty("--window-glass-opacity", opacityVal.toString());
    document.documentElement.style.setProperty("--window-blur", `${blurVal}px`);
    document.documentElement.style.setProperty("--panel-glass-opacity", panelOpacity.toString());

    if (glassmorphism) {
      document.documentElement.classList.add("glassmorphism-mode");
      document.body.classList.add("glassmorphism-mode");
    } else {
      document.documentElement.classList.remove("glassmorphism-mode");
      document.body.classList.remove("glassmorphism-mode");
    }
  }, [glassmorphism, transparency, blurRadius]);

  // Sync Profile Avatar settings
  useEffect(() => {
    localStorage.setItem("aos-profile-avatar-type", avatarType);
    localStorage.setItem("aos-profile-avatar-letter", avatarLetter);
    localStorage.setItem("aos-profile-avatar-color", avatarColor);
    window.dispatchEvent(new Event("storage"));
  }, [avatarType, avatarLetter, avatarColor]);

  // Sync Pointer Text settings
  useEffect(() => {
    localStorage.setItem("aos-pointer-text-enabled", String(pointerTextEnabled));
    localStorage.setItem("aos-pointer-text", pointerText);
    const badge = document.getElementById("aos-pointer-text-badge");
    if (badge) {
      badge.style.display = pointerTextEnabled ? "block" : "none";
      badge.innerText = pointerText;
    }
  }, [pointerTextEnabled, pointerText]);

  // Sync Emoji Pack
  useEffect(() => {
    localStorage.setItem("aos-active-emoji-pack", activeEmojiPack);
  }, [activeEmojiPack]);

  const handleSaveDeviceName = () => {
    setDeviceName(tempDeviceName);
    localStorage.setItem("aos-device-name", tempDeviceName);
    setIsEditingDeviceName(false);
    notify("Device name updated!");
  };

  const handleApplyRunningIndex = () => {
    localStorage.setItem("aos-custom-running-index", runningIndexCode);
    notify("Running index applied & updated!");
  };

  const handleDownloadZip = () => {
    notify("Packaging full standalone A-OS system...");
    const res = exportAosAsZip();
    if (res.success) {
      notify(`Downloaded ${res.filename}`);
    } else {
      notify("Failed to export ZIP.");
    }
  };

  const colorPresets = [
    { label: "Ocean Blue", hex: "#0ea5e9" },
    { label: "Royal Indigo", hex: "#6366f1" },
    { label: "Cyber Purple", hex: "#a855f7" },
    { label: "Neon Pink", hex: "#ec4899" },
    { label: "Sunset Coral", hex: "#f43f5e" },
    { label: "Amber Gold", hex: "#f59e0b" },
    { label: "Emerald Green", hex: "#10b981" },
    { label: "Dark Slate", hex: "#334155" },
  ];

  return (
    <div className="space-y-6 max-w-3xl pb-10">
      {/* Toast */}
      {toastMsg && (
        <div className="p-3 rounded-2xl bg-blue-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 animate-fade-in">
          <Zap className="w-4 h-4 text-cyan-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Card */}
      <section className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/25 flex items-center justify-center font-black text-xs text-white shadow-inner">
              A
            </span>
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-cyan-200">
              A-OS System Preferences
            </span>
          </div>
          <h2 className="text-2xl font-black mt-1 tracking-tight">Power Preferences</h2>
          <p className="text-xs text-blue-100 mt-1 max-w-md">
            System diagnostics, uptime, emoji packs, live index editor, and full system backup.
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner font-black">
          A
        </div>
      </section>

      {/* Device Information & Uptime Card */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-slate-800/80 shadow-lg backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Device Diagnostics & Identity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hardware identity, live uptime, and editable device name
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Device Version */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Device Version
            </span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1 block">
              A-OS v1.2.1
            </span>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">
              Build 2026.08.19-Pro
            </span>
          </div>

          {/* Editable Device Name */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Device Name
            </span>
            {isEditingDeviceName ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={tempDeviceName}
                  onChange={(e) => setTempDeviceName(e.target.value)}
                  className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-blue-500 rounded-lg outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveDeviceName}
                  className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {deviceName}
                </span>
                <button
                  onClick={() => {
                    setTempDeviceName(deviceName);
                    setIsEditingDeviceName(true);
                  }}
                  className="p-1 text-slate-400 hover:text-blue-500 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Live Uptime */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Uptime Since Last Reset
              </span>
              <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {uptimeStr}
              </span>
            </div>
            <span className="text-[9px] text-slate-400">Continuous microkernel cycle</span>
          </div>
        </div>
      </div>

      {/* Edit Running Index */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-slate-800/80 shadow-lg backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Running Index Script (index.html)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                View and edit the live index and boot execution code
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingIndex((v) => !v)}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
            >
              {isEditingIndex ? "Collapse Editor" : "Edit Running Index"}
            </button>
            {isEditingIndex && (
              <button
                onClick={handleApplyRunningIndex}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <Play className="w-3 h-3" /> Apply & Save
              </button>
            )}
          </div>
        </div>

        {isEditingIndex && (
          <div className="space-y-2 animate-slide-down">
            <textarea
              value={runningIndexCode}
              onChange={(e) => setRunningIndexCode(e.target.value)}
              className="w-full h-48 p-4 font-mono text-xs bg-slate-950 text-cyan-300 rounded-2xl border border-slate-800 outline-none resize-none focus:border-cyan-500 shadow-inner"
              spellCheck={false}
            />
            <p className="text-[10px] text-slate-400">
              Changes to this index will be packaged into your next standalone ZIP export.
            </p>
          </div>
        )}
      </div>

      {/* Emoji Pack Switcher */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-slate-800/80 shadow-lg backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                System Emoji Pack
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose between iOS, Meta WhatsApp, Telegram, Google, and 3D Cyber emoji packs
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDesignStudio(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Palette className="w-3.5 h-3.5" /> Design Studio
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { id: "iOS / Apple", label: "iOS / Apple", icon: Apple },
            { id: "Meta / WhatsApp", label: "Meta / WhatsApp", icon: MessageCircle },
            { id: "Telegram", label: "Telegram", icon: Send },
            { id: "Google Noto", label: "Google Noto", icon: Globe },
            { id: "3D Cyber", label: "3D Cyber", icon: Sparkles },
          ].map((p) => {
            const Icon = p.icon;
            const isSelected = activeEmojiPack === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActiveEmojiPack(p.id as any);
                  notify(`Switched emoji pack to ${p.id}`);
                }}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px] font-bold whitespace-nowrap truncate w-full">
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Avatar Customization */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-slate-800/80 shadow-lg backdrop-blur-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Profile Avatar Customization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize your profile image with any color or a letter in a circle
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center p-4 bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-xl transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: avatarColor,
                boxShadow: `0 8px 24px -4px ${avatarColor}66`,
                border: "3px solid rgba(255,255,255,0.8)",
              }}
            >
              {avatarType === "letter" ? (
                <span>{avatarLetter || "A"}</span>
              ) : avatarType === "color" ? null : (
                <User className="w-8 h-8" />
              )}
            </div>
            <span className="mt-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              Active Avatar
            </span>
          </div>

          {/* Controls */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAvatarType("letter")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  avatarType === "letter"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Type className="w-3.5 h-3.5" /> Letter in Circle
              </button>
              <button
                onClick={() => setAvatarType("color")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  avatarType === "color"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Circle className="w-3.5 h-3.5" /> Pure Color
              </button>
              <button
                onClick={() => setAvatarType("default")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  avatarType === "default"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <User className="w-3.5 h-3.5" /> Icon
              </button>
            </div>

            {avatarType === "letter" && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Circle Letter
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={avatarLetter}
                  onChange={(e) => setAvatarLetter(e.target.value.toUpperCase())}
                  className="w-24 px-3 py-1.5 text-center text-sm font-black bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl uppercase outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="A"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                Avatar Circle Color
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {colorPresets.map((p) => (
                  <button
                    key={p.hex}
                    onClick={() => setAvatarColor(p.hex)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      avatarColor === p.hex ? "scale-125 ring-2 ring-blue-500 ring-offset-2" : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: p.hex }}
                    title={p.label}
                  />
                ))}
                <input
                  type="color"
                  value={avatarColor}
                  onChange={(e) => setAvatarColor(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                  title="Pick custom color"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* A-OS Mouse Pointer Text */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-slate-800/80 shadow-lg backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <MousePointer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              A-OS Mouse Pointer Text
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Display a glowing custom A-OS badge tracking the cursor
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <div>
              <b className="block text-xs text-slate-800 dark:text-slate-200">
                Enable Cursor Text Badge
              </b>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Displays "{pointerText}" next to your mouse cursor
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pointerTextEnabled}
                onChange={(e) => {
                  setPointerTextEnabled(e.target.checked);
                  notify(e.target.checked ? "Mouse pointer text enabled!" : "Mouse pointer text hidden.");
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600" />
            </label>
          </div>

          {pointerTextEnabled && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                Pointer Text:
              </label>
              <input
                type="text"
                value={pointerText}
                onChange={(e) => setPointerText(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="A-OS"
              />
            </div>
          )}
        </div>
      </div>

      {/* Window Transparency & Glassmorphism */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-slate-800/80 shadow-lg backdrop-blur-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Window Transparency & Glassmorphism
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Frosted glass refraction and custom opacity across all system windows
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {/* Glassmorphism Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <div>
              <b className="block text-xs text-slate-800 dark:text-slate-200">
                Transparent Glassmorphism Windows
              </b>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Live frosted glass refraction (default active)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={glassmorphism}
                onChange={(e) => setGlassmorphism(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          {/* Window Opacity Slider */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <b className="text-slate-800 dark:text-slate-200">Window Glass Opacity</b>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-[11px]">
                {transparency}%
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="100"
              value={transparency}
              onChange={(e) => setTransparency(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>

          {/* Blur Radius Slider */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <b className="text-slate-800 dark:text-slate-200">Frosted Glass Blur Strength</b>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-[11px]">
                {blurRadius}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={blurRadius}
              onChange={(e) => setBlurRadius(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* No Locking & Auto-Login */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-slate-800/80 shadow-lg backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            {noLocking ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No Locking & Auto-Login Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bypasses the lock screen directly into the desktop
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
          <div>
            <b className="block text-xs text-slate-800 dark:text-slate-200">
              Disable Lock Screen (Auto-Login)
            </b>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Never prompt for password on boot or restart
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={noLocking}
              onChange={(e) => setNoLocking(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
          </label>
        </div>
      </div>

      {/* Auto Backup & Sync Other Computer */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-slate-800/80 shadow-lg backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Auto Backup & Multi-Computer Sync
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synchronize settings and files automatically
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <div>
              <b className="block text-xs text-slate-800 dark:text-slate-200">
                Automated Cloud Snapshots
              </b>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Status: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{syncState}</span>
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoBackup}
                onChange={(e) => setAutoBackup(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <div>
              <b className="block text-xs text-slate-800 dark:text-slate-200">
                Apply Other Computer Setting Automatically
              </b>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Pulls and applies preferences without manual intervention
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoApplyOtherPC}
                onChange={(e) => setAutoApplyOtherPC(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Design Studio */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-pink-500/10 via-fuchsia-500/10 to-purple-500/10 border border-pink-200/60 dark:border-pink-800/40 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
              <Palette className="w-5 h-5" />
              <b className="text-sm font-bold">Design Studio</b>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Live theme colors, animated shaders, GIF wallpapers, boot target & A-OSA emojis.
            </p>
          </div>
          <button
            onClick={() => setShowDesignStudio(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Palette className="w-4 h-4" /> Open Design Studio
          </button>
        </div>

        {/* OpenSource App */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-teal-500/10 to-emerald-500/10 border border-cyan-200/60 dark:border-cyan-800/40 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
              <Code className="w-5 h-5" />
              <b className="text-sm font-bold">OpenSource App</b>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Inspect source code, copy and paste files, edit components, and download source code.
            </p>
          </div>
          <button
            onClick={() => setShowOpenSource(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Code className="w-4 h-4" /> Open Source Explorer
          </button>
        </div>

        {/* Download ZIP */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-cyan-500/10 border border-blue-200/60 dark:border-blue-800/40 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Download className="w-5 h-5" />
              <b className="text-sm font-bold">System ZIP Export</b>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Download your entire runnable A-OS virtual workspace, files, and index.html as a standalone `.zip`.
            </p>
          </div>
          <button
            onClick={handleDownloadZip}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Runnable ZIP
          </button>
        </div>
      </div>

      {/* OpenSource Modal */}
      {showOpenSource && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            <button
              onClick={() => setShowOpenSource(false)}
              className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 text-sm font-bold"
            >
              ✕
            </button>
            <OpenSourceApp />
          </div>
        </div>
      )}

      {/* Design Studio Modal */}
      {showDesignStudio && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xl">
          <div className="relative w-full max-w-4xl h-[88vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            <button
              onClick={() => setShowDesignStudio(false)}
              className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1"
            >
              ✕ Close Studio
            </button>
            <DesignStudioApp />
          </div>
        </div>
      )}
    </div>
  );
}
