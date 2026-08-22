import React, { useState, useEffect } from "react";
import {
  Palette,
  Sparkles,
  Image as ImageIcon,
  Film,
  Cpu,
  Monitor,
  Check,
  RefreshCw,
  Zap,
  Layers,
  Upload,
  Link,
  Play,
  RotateCcw,
  Sliders,
  Eye,
  SlidersHorizontal,
  Flame,
  Globe,
  Smile,
  ShieldAlert,
} from "lucide-react";

export type BackgroundAnimationType =
  | "none"
  | "aurora"
  | "cybergrid"
  | "space"
  | "matrix"
  | "liquidglass"
  | "twilight";

export type BootTargetType = "os" | "bios";

export interface GifWallpaperPreset {
  id: string;
  name: string;
  url: string;
  thumb: string;
  category: string;
}

export const CURATED_GIFS: GifWallpaperPreset[] = [
  {
    id: "cyberpunk-city",
    name: "Neon Cyberpunk Metropolis",
    category: "Cyber / Sci-Fi",
    url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "synthwave-sunset",
    name: "Retro Synthwave Horizon",
    category: "Vaporwave / 80s",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "deep-space",
    name: "Cosmic Nebula Drift",
    category: "Space",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "ocean-waves",
    name: "Pacific Oceanic Waves",
    category: "Nature",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "fluid-aurora",
    name: "Fluid Glassmorphism Prismatic",
    category: "Abstract",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=80",
  },
];

export const THEME_COLOR_PRESETS = [
  { id: "blue", label: "Electric Blue", hex: "#0066ff", glow: "rgba(0,102,255,0.4)" },
  { id: "cyan", label: "Neon Cyan", hex: "#00f5ff", glow: "rgba(0,245,255,0.4)" },
  { id: "violet", label: "Cyber Violet", hex: "#8b5cf6", glow: "rgba(139,92,246,0.4)" },
  { id: "emerald", label: "Matrix Emerald", hex: "#10b981", glow: "rgba(16,185,129,0.4)" },
  { id: "sunset", label: "Sunset Amber", hex: "#f59e0b", glow: "rgba(245,158,11,0.4)" },
  { id: "rose", label: "Crimson Rose", hex: "#f43f5e", glow: "rgba(244,63,94,0.4)" },
  { id: "obsidian", label: "Dark Obsidian", hex: "#0f172a", glow: "rgba(15,23,42,0.4)" },
  { id: "custom", label: "Custom Hex", hex: "#3b82f6", glow: "rgba(59,130,246,0.4)" },
];

export function DesignStudioApp(props?: any) {
  const [activeTab, setActiveTab] = useState<"theme" | "animation" | "gif" | "boot" | "emojis">("theme");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Theme Accent Color State
  const [accentColor, setAccentColor] = useState<string>(() => {
    return localStorage.getItem("aos-accent-color") || "#0066ff";
  });

  // Animated Background State
  const [bgAnimation, setBgAnimation] = useState<BackgroundAnimationType>(() => {
    return (localStorage.getItem("aos-bg-animation") as BackgroundAnimationType) || "none";
  });

  // GIF Background State
  const [customGifUrl, setCustomGifUrl] = useState<string>(() => {
    return localStorage.getItem("aos-custom-gif-url") || "";
  });
  const [activeWallpaper, setActiveWallpaper] = useState<string>(() => {
    return localStorage.getItem("aos-wallpaper") || "Aqua A (Default).png";
  });

  // Boot Target State (OS vs BIOS)
  const [bootTarget, setBootTarget] = useState<BootTargetType>(() => {
    return (localStorage.getItem("aos-boot-target") as BootTargetType) || "os";
  });

  // A-OSA Unique Emoji Styling State
  const [uniqueEmojiGlow, setUniqueEmojiGlow] = useState<boolean>(() => {
    return localStorage.getItem("aos-unique-emoji-glow") !== "false";
  });

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Sync Accent Color to document
  useEffect(() => {
    localStorage.setItem("aos-accent-color", accentColor);
    document.documentElement.style.setProperty("--aos-accent-color", accentColor);
    window.dispatchEvent(new CustomEvent("aos-theme-change", { detail: { accentColor } }));
  }, [accentColor]);

  // Sync Background Animation
  useEffect(() => {
    localStorage.setItem("aos-bg-animation", bgAnimation);
    // Add/remove animation class on document body
    const animClasses = [
      "bg-anim-aurora",
      "bg-anim-cybergrid",
      "bg-anim-space",
      "bg-anim-matrix",
      "bg-anim-liquidglass",
      "bg-anim-twilight",
    ];
    animClasses.forEach((c) => document.body.classList.remove(c));
    if (bgAnimation !== "none") {
      document.body.classList.add(`bg-anim-${bgAnimation}`);
    }
    window.dispatchEvent(new CustomEvent("aos-bg-anim-change", { detail: { bgAnimation } }));
  }, [bgAnimation]);

  // Sync Boot Target
  useEffect(() => {
    localStorage.setItem("aos-boot-target", bootTarget);
  }, [bootTarget]);

  // Sync Unique Emoji Glow
  useEffect(() => {
    localStorage.setItem("aos-unique-emoji-glow", String(uniqueEmojiGlow));
    if (uniqueEmojiGlow) {
      document.documentElement.classList.add("aos-unique-emojis-active");
    } else {
      document.documentElement.classList.remove("aos-unique-emojis-active");
    }
  }, [uniqueEmojiGlow]);

  const handleApplyGif = (url: string) => {
    if (!url.trim()) return;
    localStorage.setItem("aos-wallpaper", url);
    localStorage.setItem("aos-custom-gif-url", url);
    setActiveWallpaper(url);
    if (props?.setWallpaper) {
      props.setWallpaper(url);
    }
    notify("GIF background applied to A-OS desktop!");
    window.dispatchEvent(new Event("storage"));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      handleApplyGif(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 text-slate-100 backdrop-blur-2xl select-none font-sans overflow-hidden">
      {/* Toast */}
      {toastMsg && (
        <div className="absolute top-4 right-4 z-50 px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-2xl shadow-blue-500/40 animate-fade-in">
          <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all"
            style={{ backgroundColor: accentColor, boxShadow: `0 8px 24px ${accentColor}66` }}
          >
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white">A-OS Design Studio</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/10 text-cyan-300 border border-white/10">
                PRO ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live Theme Colors, Animated Shaders, GIF Backgrounds, Boot Targets & Emojis
            </p>
          </div>
        </div>

        {/* Live Preview Pill */}
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
          <span>Live Styling Synced</span>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-950/60 border-b border-white/10 overflow-x-auto text-xs font-bold">
        {[
          { id: "theme", label: "Theme Colors", icon: Palette },
          { id: "animation", label: "Animated Backgrounds", icon: Sparkles },
          { id: "gif", label: "GIF Backgrounds", icon: Film },
          { id: "boot", label: "Boot to BIOS / OS", icon: Cpu },
          { id: "emojis", label: "A-OSA Unique Emojis", icon: Smile },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                isActive
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: isActive ? accentColor : undefined }} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* TAB 1: THEME COLOR */}
        {activeTab === "theme" && (
          <div className="space-y-6 max-w-2xl animate-fade-in">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">System Accent Color</h2>
                  <p className="text-xs text-slate-400">
                    Colors all active windows, dock highlights, buttons, and glowing outlines.
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-xl shadow-lg border border-white/20"
                  style={{ backgroundColor: accentColor }}
                />
              </div>

              {/* Color Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {THEME_COLOR_PRESETS.map((preset) => {
                  const isSelected = accentColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setAccentColor(preset.hex);
                        notify(`Accent theme set to ${preset.label}`);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? "bg-white/15 border-white/40 shadow-xl"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-5 h-5 rounded-full shadow-inner border border-white/30"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span className="text-xs font-bold text-white">{preset.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Hex Input */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <label className="text-xs font-bold text-slate-300">Custom Hex Code:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-9 h-9 rounded-xl bg-transparent cursor-pointer border border-white/20"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-28 px-3 py-1.5 text-xs font-mono font-bold bg-black/40 border border-white/20 rounded-xl uppercase text-white outline-none focus:border-cyan-400"
                    placeholder="#0066FF"
                  />
                </div>
              </div>
            </div>

            {/* Live Interactive Preview Card */}
            <div className="p-5 rounded-3xl bg-slate-950/60 border border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Theme Appearance Preview
              </h3>
              <div
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border flex items-center justify-between"
                style={{ borderColor: accentColor }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs"
                    style={{ backgroundColor: accentColor }}
                  >
                    A
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">A-OS Glass Window Title</span>
                    <span className="text-[10px] text-slate-400">Accent highlight applied in real time</span>
                  </div>
                </div>
                <button
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg transition"
                  style={{ backgroundColor: accentColor, boxShadow: `0 4px 16px ${accentColor}88` }}
                >
                  Action Button
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANIMATED BACKGROUNDS */}
        {activeTab === "animation" && (
          <div className="space-y-6 max-w-2xl animate-fade-in">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white">Dynamic Animated Shaders</h2>
                <p className="text-xs text-slate-400">
                  Select real-time GPU/CSS animated motion backgrounds that flow beneath your desktop windows.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  {
                    id: "none",
                    name: "Static Wallpaper (Off)",
                    desc: "Classic static wallpaper with zero animation overhead",
                    gradient: "from-slate-800 to-slate-950",
                  },
                  {
                    id: "aurora",
                    name: "Aurora Borealis Waves",
                    desc: "Flowing oceanic teal and purple harmonic waves",
                    gradient: "from-teal-600 via-indigo-600 to-purple-800",
                  },
                  {
                    id: "cybergrid",
                    name: "3D Cyber Retro Grid",
                    desc: "Perspective neon grid moving forward into the distance",
                    gradient: "from-fuchsia-700 via-purple-900 to-slate-950",
                  },
                  {
                    id: "space",
                    name: "Deep Space Star Drift",
                    desc: "Floating particle stars with gentle cosmic nebula drift",
                    gradient: "from-blue-950 via-slate-900 to-black",
                  },
                  {
                    id: "liquidglass",
                    name: "Fluid Glass Prismatic",
                    desc: "Silky chromatic liquid motion with refraction highlights",
                    gradient: "from-blue-600 via-cyan-500 to-emerald-600",
                  },
                  {
                    id: "matrix",
                    name: "Quantum Matrix Rain",
                    desc: "Cybernetic glowing matrix code cascade effect",
                    gradient: "from-emerald-950 via-slate-900 to-black",
                  },
                  {
                    id: "twilight",
                    name: "Sunset Twilight Shift",
                    desc: "Warm twilight glow transitioning smoothly into dusk",
                    gradient: "from-amber-600 via-rose-700 to-purple-950",
                  },
                ].map((item) => {
                  const isSelected = bgAnimation === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setBgAnimation(item.id as any);
                        notify(`Background animation set to ${item.name}`);
                      }}
                      className={`p-4 rounded-2xl border text-left transition relative overflow-hidden group ${
                        isSelected
                          ? "bg-white/15 border-white/40 shadow-xl ring-2 ring-blue-500"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`h-12 w-full rounded-xl bg-gradient-to-r ${item.gradient} mb-3 shadow-inner flex items-center justify-end px-3`}
                      >
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-white">{item.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GIF BACKGROUNDS */}
        {activeTab === "gif" && (
          <div className="space-y-6 max-w-2xl animate-fade-in">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white">Animated GIF Desktop Wallpapers</h2>
                <p className="text-xs text-slate-400">
                  Set live animated GIF loops as your full-screen desktop background.
                </p>
              </div>

              {/* Custom GIF Link & File Upload */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <label className="text-xs font-bold text-slate-300 block">Apply Any Custom GIF URL:</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-900 border border-white/15 rounded-xl">
                    <Link className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="url"
                      value={customGifUrl}
                      onChange={(e) => setCustomGifUrl(e.target.value)}
                      placeholder="https://media.giphy.com/media/.../giphy.gif"
                      className="w-full text-xs bg-transparent text-white outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyGif(customGifUrl)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" /> Apply
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400">
                  <span>Or upload a .gif file from your computer:</span>
                  <label className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold cursor-pointer transition flex items-center gap-1.5">
                    <Upload className="w-3 h-3" />
                    <span>Upload GIF</span>
                    <input type="file" accept="image/gif,image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Curated High-Res GIF Presets */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 mb-2.5">Curated High-Resolution Presets:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CURATED_GIFS.map((gif) => {
                    const isSelected = activeWallpaper === gif.url;
                    return (
                      <div
                        key={gif.id}
                        className={`group relative rounded-2xl overflow-hidden border transition cursor-pointer ${
                          isSelected
                            ? "border-blue-500 ring-2 ring-blue-500 shadow-xl"
                            : "border-white/10 hover:border-white/30"
                        }`}
                        onClick={() => handleApplyGif(gif.url)}
                      >
                        <img
                          src={gif.thumb}
                          alt={gif.name}
                          className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white drop-shadow">{gif.name}</span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-cyan-300 drop-shadow">{gif.category}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOOT TARGET (BIOS vs OS) */}
        {activeTab === "boot" && (
          <div className="space-y-6 max-w-2xl animate-fade-in">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white">Default Boot Target Configuration</h2>
                <p className="text-xs text-slate-400">
                  Configure whether your machine boots straight into the A-OS Desktop or into the UEFI BIOS Shell on
                  startup.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Option 1: Boot to A-OS */}
                <button
                  onClick={() => {
                    setBootTarget("os");
                    notify("Boot target set to A-OS Operating System (Default)");
                  }}
                  className={`p-5 rounded-3xl border text-left transition flex flex-col justify-between space-y-3 ${
                    bootTarget === "os"
                      ? "bg-blue-600/20 border-blue-500 ring-2 ring-blue-500 shadow-xl"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                      <Monitor className="w-5 h-5" />
                    </div>
                    {bootTarget === "os" && <Check className="w-5 h-5 text-emerald-400" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Boot to A-OS Desktop</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Direct fast-boot into user login and desktop environment. Standard operational mode.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase text-blue-400">Recommended</span>
                </button>

                {/* Option 2: Boot to BIOS */}
                <button
                  onClick={() => {
                    setBootTarget("bios");
                    notify("Boot target set to A-OS UEFI BIOS Shell!");
                  }}
                  className={`p-5 rounded-3xl border text-left transition flex flex-col justify-between space-y-3 ${
                    bootTarget === "bios"
                      ? "bg-purple-600/20 border-purple-500 ring-2 ring-purple-500 shadow-xl"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg">
                      <Cpu className="w-5 h-5" />
                    </div>
                    {bootTarget === "bios" && <Check className="w-5 h-5 text-emerald-400" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Boot to UEFI BIOS</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Always starts directly in the UEFI Firmware Terminal shell on power-on or page refresh.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase text-purple-400">Firmware Mode</span>
                </button>
              </div>

              {/* Status Note */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300">
                    Current active boot state:{" "}
                    <b className="text-white">{bootTarget === "os" ? "A-OS Desktop OS" : "UEFI Firmware Shell"}</b>
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (props?.setScreen) {
                      props.setScreen("bios");
                    } else {
                      window.location.reload();
                    }
                  }}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition text-[11px]"
                >
                  Test BIOS Boot Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: UNIQUE A-OSA EMOJIS */}
        {activeTab === "emojis" && (
          <div className="space-y-6 max-w-2xl animate-fade-in">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">A-OSA Signature Crystal Neo-Glow Emojis</h2>
                  <p className="text-xs text-slate-400">
                    Always-on signature vector glow styling across the system, apps, and message editors.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-300">ALWAYS ON</span>
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              </div>

              {/* Preview Grid */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 text-center">
                  {[
                    "✨", "⚡", "🚀", "💎", "🔮", "🔥", "🌟", "💡",
                    "😀", "😎", "🤩", "🥳", "🤖", "👑", "🎨", "💻",
                    "📄", "📁", "⚙️", "🔒", "🌐", "❤️", "🎯", "🏆"
                  ].map((emoji, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all hover:scale-110 flex flex-col items-center justify-center group cursor-pointer"
                    >
                      <span className="text-2xl drop-shadow-[0_0_12px_rgba(0,245,255,0.8)] filter transition-all">
                        {emoji}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>
                  All emojis in DocView, text files, and system windows are enhanced with A-OSA Crystal Neo-Glow vector
                  rendering by default.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default DesignStudioApp;
