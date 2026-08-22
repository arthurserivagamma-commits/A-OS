import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  CloudSun,
  Cpu,
  StickyNote,
  Music,
  Calculator,
  Search,
  X,
  GripHorizontal,
  Plus,
  Trash2,
  Sparkles,
  Volume2,
  Calendar as CalendarIcon,
  CheckSquare,
  Globe,
  Battery,
  Wifi,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Quote,
  Smile,
  Zap,
  Dices,
  Palette,
  QrCode,
  Newspaper,
  Compass,
  Copy,
  Check,
  Flame,
  Bot,
  LayoutGrid,
  Eye,
  EyeOff,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export type WidgetType =
  | "clock"
  | "analog_clock"
  | "world_clock"
  | "weather"
  | "forecast"
  | "notes"
  | "todo"
  | "sysmon"
  | "battery"
  | "network"
  | "music"
  | "calculator"
  | "converter"
  | "search"
  | "calendar"
  | "stopwatch"
  | "timer"
  | "pomodoro"
  | "quote"
  | "joke"
  | "facts"
  | "crypto"
  | "counter"
  | "dice"
  | "color"
  | "qr"
  | "rss"
  | "avatar"
  | "logo"
  | "fortune";

export interface DesktopWidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  data?: any;
}

export const AVAILABLE_WIDGET_TYPES: {
  type: WidgetType;
  name: string;
  desc: string;
  category: "Utilities" | "System" | "Time & Focus" | "Info & News" | "Fun & Tools";
  defaultWidth: number;
  defaultHeight: number;
}[] = [
  // Time & Focus
  { type: "clock", name: "Digital Clock", desc: "Live time with seconds & full date", category: "Time & Focus", defaultWidth: 200, defaultHeight: 120 },
  { type: "analog_clock", name: "Analog Clock", desc: "Classic dial with moving hands", category: "Time & Focus", defaultWidth: 180, defaultHeight: 180 },
  { type: "world_clock", name: "World Clocks", desc: "Multi-timezone international clock", category: "Time & Focus", defaultWidth: 220, defaultHeight: 150 },
  { type: "calendar", name: "Mini Calendar", desc: "Monthly calendar with today highlight", category: "Time & Focus", defaultWidth: 220, defaultHeight: 180 },
  { type: "stopwatch", name: "Stopwatch", desc: "High-precision timer with laps", category: "Time & Focus", defaultWidth: 200, defaultHeight: 130 },
  { type: "timer", name: "Countdown Timer", desc: "Custom countdown with audio alerts", category: "Time & Focus", defaultWidth: 200, defaultHeight: 130 },
  { type: "pomodoro", name: "Pomodoro Focus", desc: "25min focus & 5min break cycles", category: "Time & Focus", defaultWidth: 210, defaultHeight: 140 },

  // System & Stats
  { type: "sysmon", name: "System Monitor", desc: "Live CPU, RAM & SSD utilization gauges", category: "System", defaultWidth: 210, defaultHeight: 150 },
  { type: "battery", name: "Battery Status", desc: "Power percentage & charging stats", category: "System", defaultWidth: 190, defaultHeight: 120 },
  { type: "network", name: "Network Ping", desc: "Real-time latency & throughput test", category: "System", defaultWidth: 200, defaultHeight: 130 },
  { type: "crypto", name: "Crypto Tracker", desc: "Live BTC, ETH, and SOL tickers", category: "System", defaultWidth: 210, defaultHeight: 140 },

  // Utilities
  { type: "notes", name: "Sticky Note", desc: "Color-coded draggable memo pad", category: "Utilities", defaultWidth: 210, defaultHeight: 160 },
  { type: "todo", name: "To-Do Checklist", desc: "Interactive task list with checkboxes", category: "Utilities", defaultWidth: 220, defaultHeight: 180 },
  { type: "calculator", name: "Mini Calculator", desc: "Fast on-desktop math calculator", category: "Utilities", defaultWidth: 190, defaultHeight: 200 },
  { type: "converter", name: "Unit Converter", desc: "Instant km/mi, kg/lb, C/F converter", category: "Utilities", defaultWidth: 220, defaultHeight: 150 },
  { type: "search", name: "Web Search", desc: "Quick Google, DuckDuckGo & Wiki launcher", category: "Utilities", defaultWidth: 220, defaultHeight: 120 },
  { type: "qr", name: "QR Generator", desc: "Instant QR code maker for text & links", category: "Utilities", defaultWidth: 200, defaultHeight: 190 },

  // Info & News
  { type: "weather", name: "Weather Station", desc: "Live temperature & atmospheric conditions", category: "Info & News", defaultWidth: 210, defaultHeight: 130 },
  { type: "forecast", name: "5-Day Forecast", desc: "Weekly weather outlook", category: "Info & News", defaultWidth: 230, defaultHeight: 150 },
  { type: "rss", name: "A-OS News Feed", desc: "Top tech, science & OS headlines", category: "Info & News", defaultWidth: 230, defaultHeight: 160 },
  { type: "facts", name: "Science Facts", desc: "Fascinating daily space & tech facts", category: "Info & News", defaultWidth: 220, defaultHeight: 140 },
  { type: "quote", name: "Daily Quote", desc: "Inspiring wisdom & philosophy quotes", category: "Info & News", defaultWidth: 220, defaultHeight: 140 },

  // Fun & Tools
  { type: "counter", name: "Tally Clicker", desc: "Tap counter with + / - & reset", category: "Fun & Tools", defaultWidth: 180, defaultHeight: 120 },
  { type: "dice", name: "Dice & Coin", desc: "Interactive D6 roller & coin flipper", category: "Fun & Tools", defaultWidth: 190, defaultHeight: 130 },
  { type: "color", name: "Color Palette", desc: "Hex generator & click-to-copy codes", category: "Fun & Tools", defaultWidth: 200, defaultHeight: 140 },
  { type: "joke", name: "Programmer Jokes", desc: "Hilarious coding & tech jokes", category: "Fun & Tools", defaultWidth: 220, defaultHeight: 140 },
  { type: "fortune", name: "Magic 8-Ball", desc: "Ask a question and tap for your fortune", category: "Fun & Tools", defaultWidth: 190, defaultHeight: 140 },
  { type: "avatar", name: "A-OS Pet Bot", desc: "Interactive animated companion bot", category: "Fun & Tools", defaultWidth: 190, defaultHeight: 140 },
  { type: "music", name: "Audio Chimes", desc: "Harmonic tone synthesizer buttons", category: "Fun & Tools", defaultWidth: 200, defaultHeight: 120 },
  { type: "logo", name: "A-OS Pro Badge", desc: "Glowing metallic system emblem", category: "Fun & Tools", defaultWidth: 180, defaultHeight: 130 },
];

export const DEFAULT_WIDGETS: DesktopWidgetConfig[] = [
  {
    id: "widget-clock-init",
    type: "clock",
    title: "Digital Clock",
    x: 140,
    y: 25,
    width: 200,
    height: 120,
  },
  {
    id: "widget-weather-init",
    type: "weather",
    title: "Weather Station",
    x: 140,
    y: 160,
    width: 210,
    height: 130,
  },
  {
    id: "widget-sysmon-init",
    type: "sysmon",
    title: "System Monitor",
    x: 365,
    y: 25,
    width: 210,
    height: 150,
  },
];

/**
 * Smart Collision-Free Layout Calculation:
 * Ensures widgets never overlap desktop icons (x < 130px) or shelf (bottom 85px)
 * or each other!
 */
export function calculateNonOverlappingGrid(
  widgetsList: DesktopWidgetConfig[],
  screenWidth = typeof window !== "undefined" ? window.innerWidth : 1280,
  screenHeight = typeof window !== "undefined" ? window.innerHeight : 800
): DesktopWidgetConfig[] {
  const startX = 140; // Safe zone past desktop icons on left
  const startY = 25;
  const colWidth = 225;
  const rowHeight = 165;
  const bottomShelfPadding = 85;

  const usableWidth = Math.max(colWidth, screenWidth - startX - 20);
  const maxCols = Math.max(1, Math.floor(usableWidth / colWidth));

  return widgetsList.map((w, index) => {
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);

    const x = startX + col * colWidth;
    const y = startY + row * rowHeight;

    return {
      ...w,
      x,
      y,
    };
  });
}

/**
 * Finds the next available non-overlapping position for a single new widget
 */
export function findNextSafeSlot(
  currentWidgets: DesktopWidgetConfig[],
  itemWidth = 210,
  itemHeight = 150
): { x: number; y: number } {
  const screenW = typeof window !== "undefined" ? window.innerWidth : 1280;
  const screenH = typeof window !== "undefined" ? window.innerHeight : 800;

  const startX = 140;
  const startY = 25;
  const colWidth = 225;
  const rowHeight = 165;

  const maxCols = Math.max(1, Math.floor((screenW - startX - 20) / colWidth));

  for (let slot = 0; slot < 200; slot++) {
    const col = slot % maxCols;
    const row = Math.floor(slot / maxCols);
    const candidateX = startX + col * colWidth;
    const candidateY = startY + row * rowHeight;

    // Check collision with existing widgets
    const hasCollision = currentWidgets.some((w) => {
      const wWidth = w.width || 210;
      const wHeight = w.height || 140;
      const xOverlap = candidateX < w.x + wWidth && candidateX + itemWidth > w.x;
      const yOverlap = candidateY < w.y + wHeight && candidateY + itemHeight > w.y;
      return xOverlap && yOverlap;
    });

    if (!hasCollision) {
      return { x: candidateX, y: candidateY };
    }
  }

  // Fallback offset
  const offset = currentWidgets.length * 15;
  return {
    x: Math.min(screenW - 240, startX + (offset % (screenW - 350))),
    y: Math.min(screenH - 220, startY + (offset % (screenH - 300))),
  };
}

export function DesktopWidgetsContainer({
  onOpenApp,
}: {
  onOpenApp?: (appId: string) => void;
}) {
  const [widgets, setWidgets] = useState<DesktopWidgetConfig[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [showCenterLogo, setShowCenterLogo] = useState<boolean>(false);
  const [widgetsHidden, setWidgetsHidden] = useState<boolean>(false);

  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // Load widgets from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aos-desktop-widgets");
      if (saved) {
        setWidgets(JSON.parse(saved));
      } else {
        setWidgets(DEFAULT_WIDGETS);
        localStorage.setItem("aos-desktop-widgets", JSON.stringify(DEFAULT_WIDGETS));
      }
      setShowCenterLogo(localStorage.getItem("aos-show-center-logo") === "true");
    } catch {
      setWidgets(DEFAULT_WIDGETS);
    }
  }, []);

  // Listen for widget and center logo update events
  useEffect(() => {
    const handleWidgetUpdate = () => {
      try {
        const saved = localStorage.getItem("aos-desktop-widgets");
        if (saved) setWidgets(JSON.parse(saved));
        setShowCenterLogo(localStorage.getItem("aos-show-center-logo") === "true");
      } catch {}
    };

    window.addEventListener("aos-widgets-changed", handleWidgetUpdate);
    window.addEventListener("aos-center-logo-changed", handleWidgetUpdate);
    return () => {
      window.removeEventListener("aos-widgets-changed", handleWidgetUpdate);
      window.removeEventListener("aos-center-logo-changed", handleWidgetUpdate);
    };
  }, []);

  const saveWidgets = (updated: DesktopWidgetConfig[]) => {
    setWidgets(updated);
    try {
      localStorage.setItem("aos-desktop-widgets", JSON.stringify(updated));
      window.dispatchEvent(new Event("aos-widgets-changed"));
    } catch {}
  };

  const removeWidget = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = widgets.filter((w) => w.id !== id);
    saveWidgets(next);
  };

  const duplicateWidget = (widget: DesktopWidgetConfig, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const pos = findNextSafeSlot(widgets, widget.width || 210, widget.height || 140);
    const newWidget: DesktopWidgetConfig = {
      ...widget,
      id: `widget-${widget.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      x: pos.x,
      y: pos.y,
    };
    saveWidgets([...widgets, newWidget]);
  };

  const updateWidgetData = (id: string, dataPatch: any) => {
    const next = widgets.map((w) =>
      w.id === id ? { ...w, data: { ...w.data, ...dataPatch } } : w
    );
    saveWidgets(next);
  };

  const handleAutoArrangeGrid = () => {
    const arranged = calculateNonOverlappingGrid(widgets, window.innerWidth, window.innerHeight);
    saveWidgets(arranged);
  };

  // Dragging handlers with screen clamping & anti-overlap
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button, input, textarea, a, select")) return;
    const widget = widgets.find((w) => w.id === id);
    if (!widget) return;

    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: widget.x,
      origY: widget.y,
    };
    setActiveDragId(id);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { id, startX, startY, origX, origY } = dragRef.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Boundary clamp: keep away from top-left (left icons) and bottom shelf
    const newX = Math.max(10, Math.min(window.innerWidth - 220, origX + deltaX));
    const newY = Math.max(10, Math.min(window.innerHeight - 170, origY + deltaY));

    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x: newX, y: newY } : w))
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current) {
      saveWidgets(widgets);
      dragRef.current = null;
      setActiveDragId(null);
    }
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      id="aos-desktop-widgets-layer"
      className="absolute inset-0 pointer-events-none z-[4] overflow-hidden select-none"
    >
      {/* Optional Large Center OS Logo Watermark */}
      {showCenterLogo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 select-none transition-all duration-300">
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <div className="w-36 h-36 rounded-3xl bg-gradient-to-tr from-cyan-500/60 to-blue-600/60 p-0.5 shadow-2xl backdrop-blur-sm">
              <div className="w-full h-full bg-slate-950/80 rounded-[22px] flex items-center justify-center">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-blue-500">
                  A
                </span>
              </div>
            </div>
            <span className="text-2xl font-black tracking-widest text-white/70 font-mono">A-OS</span>
          </div>
        </div>
      )}

      {/* Floating Desktop Quick Actions Pill Bar (Top Right) */}
      <div className="absolute top-4 right-4 z-[15] pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 shadow-2xl shadow-black/60">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("aos-open-widget-manager"))}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          title="Open Widget Manager to add up to 100 widgets"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span>+ Add Widgets</span>
          <span className="bg-black/30 px-1.5 py-0.5 rounded-full text-[10px] text-cyan-200">
            {widgets.length}
          </span>
        </button>

        <button
          type="button"
          onClick={handleAutoArrangeGrid}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1 cursor-pointer active:scale-95"
          title="Tidy Grid: Automatically rearrange all widgets into clean, non-overlapping columns and rows"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Tidy Grid</span>
        </button>

        <button
          type="button"
          onClick={() => setWidgetsHidden(!widgetsHidden)}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition cursor-pointer"
          title={widgetsHidden ? "Show Widgets" : "Hide Widgets"}
        >
          {widgetsHidden ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Render All Active Draggable Desktop Widgets */}
      {!widgetsHidden &&
        widgets.map((widget) => (
          <div
            key={widget.id}
            onPointerDown={(e) => handlePointerDown(widget.id, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              left: `${widget.x}px`,
              top: `${widget.y}px`,
              width: widget.width ? `${widget.width}px` : "auto",
              zIndex: activeDragId === widget.id ? 20 : 6,
            }}
            className={`absolute pointer-events-auto rounded-2xl backdrop-blur-2xl border transition-all ${
              activeDragId === widget.id
                ? "shadow-2xl shadow-cyan-500/30 ring-2 ring-cyan-400 cursor-grabbing scale-[1.02]"
                : "shadow-xl hover:shadow-2xl cursor-grab"
            } bg-slate-900/90 border-slate-700/80 text-white p-3`}
          >
            {/* Widget Header Controls */}
            <div className="flex items-center justify-between gap-1 mb-2 opacity-80 hover:opacity-100 transition">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-tight text-slate-200 truncate">
                <GripHorizontal className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{widget.title}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={(e) => duplicateWidget(widget, e)}
                  className="w-5 h-5 rounded-md hover:bg-blue-500/20 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition"
                  title="Duplicate widget"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => removeWidget(widget.id, e)}
                  className="w-5 h-5 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition"
                  title="Remove widget"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Widget Body Content */}
            <div className="text-xs">
              {widget.type === "clock" && <ClockWidget />}
              {widget.type === "analog_clock" && <AnalogClockWidget />}
              {widget.type === "world_clock" && <WorldClockWidget />}
              {widget.type === "weather" && <WeatherWidget />}
              {widget.type === "forecast" && <ForecastWidget />}
              {widget.type === "notes" && (
                <NotesWidget
                  data={widget.data}
                  onSave={(data) => updateWidgetData(widget.id, data)}
                />
              )}
              {widget.type === "todo" && (
                <TodoWidget
                  data={widget.data}
                  onSave={(data) => updateWidgetData(widget.id, data)}
                />
              )}
              {widget.type === "sysmon" && <SysMonWidget />}
              {widget.type === "battery" && <BatteryWidget />}
              {widget.type === "network" && <NetworkWidget />}
              {widget.type === "crypto" && <CryptoWidget />}
              {widget.type === "music" && <MusicWidget />}
              {widget.type === "calculator" && <CalculatorWidget />}
              {widget.type === "converter" && <ConverterWidget />}
              {widget.type === "search" && <SearchWidget onOpenApp={onOpenApp} />}
              {widget.type === "calendar" && <CalendarWidget />}
              {widget.type === "stopwatch" && <StopwatchWidget />}
              {widget.type === "timer" && <TimerWidget />}
              {widget.type === "pomodoro" && <PomodoroWidget />}
              {widget.type === "quote" && <QuoteWidget />}
              {widget.type === "joke" && <JokeWidget />}
              {widget.type === "facts" && <FactsWidget />}
              {widget.type === "counter" && (
                <CounterWidget
                  data={widget.data}
                  onSave={(data) => updateWidgetData(widget.id, data)}
                />
              )}
              {widget.type === "dice" && <DiceWidget />}
              {widget.type === "color" && <ColorWidget />}
              {widget.type === "qr" && <QrWidget />}
              {widget.type === "rss" && <RssWidget />}
              {widget.type === "fortune" && <FortuneWidget />}
              {widget.type === "avatar" && <AvatarWidget />}
              {widget.type === "logo" && <LogoWidget />}
            </div>
          </div>
        ))}
    </div>
  );
}

// --------------------------------------------------------------------------
// INDIVIDUAL RICH WIDGET COMPONENTS
// --------------------------------------------------------------------------

function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="flex flex-col items-center justify-center px-3 py-1 text-center min-w-[170px]">
      <div className="text-2xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400">
        {timeStr}
      </div>
      <div className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wide uppercase">
        {dateStr}
      </div>
    </div>
  );
}

function AnalogClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sec = time.getSeconds();
  const min = time.getMinutes();
  const hr = time.getHours() % 12;

  const secDeg = sec * 6;
  const minDeg = min * 6 + sec * 0.1;
  const hrDeg = hr * 30 + min * 0.5;

  return (
    <div className="flex flex-col items-center justify-center p-1">
      <div className="w-28 h-28 rounded-full border-2 border-cyan-500/40 bg-slate-950/80 relative flex items-center justify-center shadow-inner">
        {/* Hour markers */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <div
            key={deg}
            className="absolute w-0.5 h-2 bg-slate-500/80 origin-bottom"
            style={{ transform: `rotate(${deg}deg) translateY(-46px)` }}
          />
        ))}
        {/* Hour Hand */}
        <div
          className="absolute w-1 h-8 bg-cyan-300 rounded-full origin-bottom"
          style={{ transform: `rotate(${hrDeg}deg) translateY(-50%)` }}
        />
        {/* Minute Hand */}
        <div
          className="absolute w-0.5 h-11 bg-white rounded-full origin-bottom"
          style={{ transform: `rotate(${minDeg}deg) translateY(-50%)` }}
        />
        {/* Second Hand */}
        <div
          className="absolute w-0.5 h-12 bg-rose-500 rounded-full origin-bottom"
          style={{ transform: `rotate(${secDeg}deg) translateY(-50%)` }}
        />
        {/* Pin */}
        <div className="w-2 h-2 rounded-full bg-cyan-400 z-10 shadow-md" />
      </div>
      <span className="text-[10px] font-mono text-slate-400 mt-1 font-bold">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}

function WorldClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = [
    { name: "London", tz: "Europe/London" },
    { name: "New York", tz: "America/New_York" },
    { name: "Tokyo", tz: "Asia/Tokyo" },
  ];

  return (
    <div className="space-y-1.5 py-0.5 min-w-[190px]">
      {cities.map((c) => {
        const str = time.toLocaleTimeString("en-US", { timeZone: c.tz, hour: "2-digit", minute: "2-digit" });
        return (
          <div key={c.name} className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-950/50">
            <span className="text-[11px] font-bold text-slate-300">{c.name}</span>
            <span className="text-[11px] font-mono font-black text-cyan-300">{str}</span>
          </div>
        );
      })}
    </div>
  );
}

function WeatherWidget() {
  const [weather] = useState({ temp: 22, condition: "Sunny", city: "A-OS Capital", humidity: 48 });

  return (
    <div className="flex items-center gap-3 px-2 py-1 min-w-[180px]">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold text-lg">
        ☀️
      </div>
      <div>
        <div className="flex items-center gap-1">
          <span className="text-xl font-black text-white">{weather.temp}°C</span>
          <span className="text-[10px] font-bold text-cyan-300 uppercase">{weather.condition}</span>
        </div>
        <div className="text-[10px] text-slate-400 font-medium">
          {weather.city} · {weather.humidity}% Hum
        </div>
      </div>
    </div>
  );
}

function ForecastWidget() {
  const days = [
    { day: "Mon", icon: "☀️", temp: "22°" },
    { day: "Tue", icon: "⛅", temp: "20°" },
    { day: "Wed", icon: "🌧️", temp: "17°" },
    { day: "Thu", icon: "⚡", temp: "16°" },
    { day: "Fri", icon: "☀️", temp: "23°" },
  ];

  return (
    <div className="flex justify-between gap-1 px-1 py-1 min-w-[200px]">
      {days.map((d) => (
        <div key={d.day} className="flex flex-col items-center p-1 rounded-lg bg-slate-950/40 text-center flex-1">
          <span className="text-[9px] font-bold text-slate-400">{d.day}</span>
          <span className="text-base my-0.5">{d.icon}</span>
          <span className="text-[10px] font-bold text-cyan-300 font-mono">{d.temp}</span>
        </div>
      ))}
    </div>
  );
}

function NotesWidget({ data, onSave }: { data?: any; onSave: (d: any) => void }) {
  const [text, setText] = useState(data?.text || "📌 Sticky Note: Drag anywhere!");
  const [color, setColor] = useState(data?.color || "amber");

  const colors = [
    { id: "amber", bg: "bg-amber-400/10 border-amber-400/40 text-amber-200" },
    { id: "cyan", bg: "bg-cyan-400/10 border-cyan-400/40 text-cyan-200" },
    { id: "rose", bg: "bg-rose-400/10 border-rose-400/40 text-rose-200" },
    { id: "emerald", bg: "bg-emerald-400/10 border-emerald-400/40 text-emerald-200" },
  ];

  const activeColor = colors.find((c) => c.id === color) || colors[0];

  return (
    <div className="min-w-[190px] space-y-1.5">
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onSave({ text: e.target.value, color });
        }}
        className={`w-full h-20 rounded-xl p-2 text-xs font-sans placeholder-slate-500 focus:outline-none resize-none border ${activeColor.bg}`}
        placeholder="Type note..."
      />
      <div className="flex gap-1 justify-end">
        {colors.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setColor(c.id);
              onSave({ text, color: c.id });
            }}
            className={`w-3.5 h-3.5 rounded-full border ${
              c.id === "amber"
                ? "bg-amber-400"
                : c.id === "cyan"
                ? "bg-cyan-400"
                : c.id === "rose"
                ? "bg-rose-400"
                : "bg-emerald-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function TodoWidget({ data, onSave }: { data?: any; onSave: (d: any) => void }) {
  const [items, setItems] = useState<Array<{ id: string; text: string; done: boolean }>>(
    data?.items || [
      { id: "1", text: "Try dragging widgets", done: true },
      { id: "2", text: "Explore A-Store apps", done: false },
      { id: "3", text: "Create custom files", done: false },
    ]
  );
  const [input, setInput] = useState("");

  const toggle = (id: string) => {
    const next = items.map((i) => (i.id === id ? { ...i, done: !i.done } : i));
    setItems(next);
    onSave({ items: next });
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const next = [...items, { id: String(Date.now()), text: input.trim(), done: false }];
    setItems(next);
    onSave({ items: next });
    setInput("");
  };

  return (
    <div className="min-w-[200px] space-y-1.5">
      <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
        {items.map((i) => (
          <div
            key={i.id}
            onClick={() => toggle(i.id)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-950/50 hover:bg-slate-950/80 cursor-pointer transition"
          >
            <div
              className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                i.done ? "bg-cyan-500 border-cyan-400 text-black font-black" : "border-slate-600"
              }`}
            >
              {i.done && "✓"}
            </div>
            <span className={`text-[11px] truncate flex-1 ${i.done ? "line-through text-slate-500" : "text-slate-200"}`}>
              {i.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={add} className="flex gap-1 pt-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="+ Add task..."
          className="flex-1 bg-slate-950/80 border border-slate-700 rounded-lg px-2 py-0.5 text-[11px] text-white focus:outline-none focus:border-cyan-400"
        />
      </form>
    </div>
  );
}

function SysMonWidget() {
  const [cpu, setCpu] = useState(18);
  const [ram, setRam] = useState(42);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpu(Math.floor(12 + Math.random() * 20));
      setRam(Math.floor(40 + Math.random() * 8));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-w-[180px] space-y-2 py-0.5">
      <div>
        <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-1">
          <span>CPU CORE USAGE</span>
          <span className="text-cyan-400">{cpu}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
            style={{ width: `${cpu}%` }}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-1">
          <span>RAM ALLOCATION</span>
          <span className="text-indigo-400">{ram}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-500"
            style={{ width: `${ram}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function BatteryWidget() {
  const [level] = useState(94);

  return (
    <div className="flex items-center gap-3 px-2 py-1 min-w-[170px]">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-base shadow-md">
        <Zap className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-black text-white">{level}%</span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1 py-0.5 rounded">
            AC Plugged
          </span>
        </div>
        <span className="text-[10px] text-slate-400">Power Healthy · 0.8W</span>
      </div>
    </div>
  );
}

function NetworkWidget() {
  const [ping, setPing] = useState(14);

  useEffect(() => {
    const timer = setInterval(() => {
      setPing(Math.floor(10 + Math.random() * 12));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-1.5 min-w-[180px] py-0.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-medium">Ping Latency</span>
        <span className="text-emerald-400 font-bold font-mono">{ping} ms</span>
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-medium">Downlink</span>
        <span className="text-cyan-300 font-bold font-mono">1.2 Gbps</span>
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-medium">Status</span>
        <span className="text-blue-400 font-bold">Online ✓</span>
      </div>
    </div>
  );
}

function CryptoWidget() {
  const [btc] = useState({ price: "$92,450", change: "+3.8%" });
  const [eth] = useState({ price: "$3,180", change: "+2.1%" });

  return (
    <div className="space-y-1.5 min-w-[180px] py-0.5">
      <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-950/50">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-400 font-bold">₿</span>
          <span className="text-[11px] font-bold">BTC</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono font-bold">{btc.price}</span>
          <span className="text-[9px] text-emerald-400 block">{btc.change}</span>
        </div>
      </div>
      <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-950/50">
        <div className="flex items-center gap-1.5">
          <span className="text-indigo-400 font-bold">Ξ</span>
          <span className="text-[11px] font-bold">ETH</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono font-bold">{eth.price}</span>
          <span className="text-[9px] text-emerald-400 block">{eth.change}</span>
        </div>
      </div>
    </div>
  );
}

function MusicWidget() {
  const playChime = (tone: string) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(tone === "high" ? 880 : 523, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {}
  };

  return (
    <div className="flex items-center gap-2 min-w-[180px] py-1">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
        <Volume2 className="w-4 h-4" />
      </div>
      <div className="flex gap-1.5 flex-1">
        <button
          type="button"
          onClick={() => playChime("low")}
          className="flex-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-slate-200 transition"
        >
          Chime A
        </button>
        <button
          type="button"
          onClick={() => playChime("high")}
          className="flex-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-cyan-300 transition"
        >
          Chime B
        </button>
      </div>
    </div>
  );
}

function CalculatorWidget() {
  const [calc, setCalc] = useState("0");

  const press = (key: string) => {
    if (key === "C") setCalc("0");
    else if (key === "=") {
      try {
        const safe = calc.replace(/[^0-9+\-*/.]/g, "");
        // eslint-disable-next-line no-eval
        setCalc(String(Function(`'use strict'; return (${safe})`)()));
      } catch {
        setCalc("Err");
      }
    } else {
      setCalc((prev) => (prev === "0" || prev === "Err" ? key : prev + key));
    }
  };

  return (
    <div className="min-w-[170px]">
      <div className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-2 py-1 text-right font-mono text-cyan-300 text-sm mb-2 overflow-hidden">
        {calc}
      </div>
      <div className="grid grid-cols-4 gap-1 text-[11px] font-bold">
        {["7", "8", "9", "+", "4", "5", "6", "-", "1", "2", "3", "*", "C", "0", "=", "/"].map(
          (k) => (
            <button
              key={k}
              type="button"
              onClick={() => press(k)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-center transition"
            >
              {k}
            </button>
          )
        )}
      </div>
    </div>
  );
}

function ConverterWidget() {
  const [km, setKm] = useState("10");
  const mi = (parseFloat(km) * 0.621371 || 0).toFixed(2);

  return (
    <div className="space-y-2 min-w-[180px] py-1">
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={km}
          onChange={(e) => setKm(e.target.value)}
          className="w-16 bg-slate-950/80 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
        />
        <span className="text-[11px] font-bold text-slate-300">Kilometers</span>
      </div>
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60">
        <span className="text-[11px] text-slate-400 font-medium">Miles:</span>
        <span className="text-sm font-black font-mono text-cyan-300">{mi} mi</span>
      </div>
    </div>
  );
}

function SearchWidget({ onOpenApp }: { onOpenApp?: (appId: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    setQuery("");
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-1.5 min-w-[190px] py-1">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Google..."
        className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-500"
      />
      <button
        type="submit"
        className="px-2.5 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center justify-center cursor-pointer"
      >
        <Search className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}

function CalendarWidget() {
  const today = new Date();
  const dateNum = today.getDate();
  const monthName = today.toLocaleString("default", { month: "short" });

  return (
    <div className="min-w-[190px] p-1">
      <div className="text-center font-bold text-xs text-cyan-300 mb-1">
        {monthName} {today.getFullYear()}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
          <span key={idx} className="text-slate-500 font-bold">
            {d}
          </span>
        ))}
        {Array.from({ length: 28 }).map((_, idx) => {
          const d = idx + 1;
          const isToday = d === dateNum;
          return (
            <span
              key={idx}
              className={`p-0.5 rounded-full ${
                isToday ? "bg-cyan-500 text-black font-black shadow-md shadow-cyan-500/50" : "text-slate-300"
              }`}
            >
              {d}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function StopwatchWidget() {
  const [sec, setSec] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let t: any;
    if (running) {
      t = setInterval(() => setSec((s) => s + 1), 1000);
    }
    return () => clearInterval(t);
  }, [running]);

  const fmt = `${Math.floor(sec / 60)
    .toString()
    .padStart(2, "0")}:${(sec % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center justify-center p-1 min-w-[170px]">
      <div className="text-2xl font-black font-mono text-cyan-300 tracking-wider mb-2">{fmt}</div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setRunning(!running)}
          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
            running ? "bg-amber-500/30 text-amber-300" : "bg-cyan-600 text-white"
          }`}
        >
          {running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setSec(0);
          }}
          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function TimerWidget() {
  const [time, setTime] = useState(300);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let t: any;
    if (active && time > 0) {
      t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    }
    return () => clearInterval(t);
  }, [active, time]);

  const min = Math.floor(time / 60);
  const s = time % 60;

  return (
    <div className="flex flex-col items-center justify-center p-1 min-w-[170px]">
      <div className="text-2xl font-black font-mono text-amber-300 mb-2">
        {min}:{s.toString().padStart(2, "0")}
      </div>
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => setActive(!active)}
          className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
        >
          {active ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={() => {
            setActive(false);
            setTime(300);
          }}
          className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
        >
          Reset (5m)
        </button>
      </div>
    </div>
  );
}

function PomodoroWidget() {
  const [time, setTime] = useState(25 * 60);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let t: any;
    if (active && time > 0) {
      t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    }
    return () => clearInterval(t);
  }, [active, time]);

  const min = Math.floor(time / 60);
  const s = time % 60;

  return (
    <div className="space-y-1.5 min-w-[180px] p-1 text-center">
      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center justify-center gap-1">
        <Flame className="w-3 h-3 text-rose-500" /> Focus Mode (25m)
      </span>
      <div className="text-2xl font-black font-mono text-white">
        {min}:{s.toString().padStart(2, "0")}
      </div>
      <button
        type="button"
        onClick={() => setActive(!active)}
        className={`w-full py-1 rounded-lg font-bold text-xs ${
          active ? "bg-rose-500/20 text-rose-300" : "bg-rose-600 text-white shadow-md shadow-rose-600/30"
        }`}
      >
        {active ? "Pause Session" : "Start Focus Session"}
      </button>
    </div>
  );
}

function QuoteWidget() {
  const quotes = [
    "Simplicity is the soul of efficiency.",
    "First, solve the problem. Then, write the code.",
    "Make it work, make it right, make it fast.",
    "A computer is a bicycle for the mind.",
  ];
  const [idx, setIdx] = useState(0);

  return (
    <div className="min-w-[190px] p-1 space-y-1.5">
      <p className="text-[11px] italic text-slate-300 leading-relaxed font-serif">
        "{quotes[idx]}"
      </p>
      <button
        type="button"
        onClick={() => setIdx((idx + 1) % quotes.length)}
        className="text-[10px] text-cyan-400 hover:underline font-bold"
      >
        Next Quote →
      </button>
    </div>
  );
}

function JokeWidget() {
  const jokes = [
    "There are 10 types of people in the world: those who understand binary, and those who don't.",
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  ];
  const [idx, setIdx] = useState(0);

  return (
    <div className="min-w-[190px] p-1 space-y-1.5">
      <p className="text-[11px] text-amber-200 leading-snug">
        😄 {jokes[idx]}
      </p>
      <button
        type="button"
        onClick={() => setIdx((idx + 1) % jokes.length)}
        className="text-[10px] text-amber-400 hover:underline font-bold"
      >
        Next Joke →
      </button>
    </div>
  );
}

function FactsWidget() {
  const facts = [
    "The first computer mouse was invented by Doug Engelbart around 1964 and made of wood.",
    "About 90% of the world's currency only exists on computers.",
    "Over 700 new programming languages have been created since 1950.",
  ];
  const [idx, setIdx] = useState(0);

  return (
    <div className="min-w-[190px] p-1 space-y-1.5">
      <p className="text-[11px] text-sky-200 leading-snug">
        💡 {facts[idx]}
      </p>
      <button
        type="button"
        onClick={() => setIdx((idx + 1) % facts.length)}
        className="text-[10px] text-sky-400 hover:underline font-bold"
      >
        Next Fact →
      </button>
    </div>
  );
}

function CounterWidget({ data, onSave }: { data?: any; onSave: (d: any) => void }) {
  const [count, setCount] = useState(data?.count ?? 0);

  const update = (newCount: number) => {
    setCount(newCount);
    onSave({ count: newCount });
  };

  return (
    <div className="flex flex-col items-center justify-center p-1 min-w-[160px]">
      <div className="text-3xl font-black font-mono text-cyan-300 mb-2">{count}</div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => update(count - 1)}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-lg font-black flex items-center justify-center"
        >
          -
        </button>
        <button
          type="button"
          onClick={() => update(0)}
          className="px-2 py-1 rounded-xl bg-slate-800 text-[10px] text-slate-400 font-bold"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => update(count + 1)}
          className="w-8 h-8 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-lg font-black flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
}

function DiceWidget() {
  const [val, setVal] = useState(6);
  const [coin, setCoin] = useState("Heads");

  return (
    <div className="flex items-center justify-around gap-2 p-1 min-w-[170px]">
      <button
        type="button"
        onClick={() => setVal(Math.floor(1 + Math.random() * 6))}
        className="flex flex-col items-center p-2 rounded-xl bg-slate-950/60 hover:bg-slate-950/90 transition"
      >
        <span className="text-2xl font-black text-amber-400">🎲 {val}</span>
        <span className="text-[9px] text-slate-400 mt-1 font-bold">Roll D6</span>
      </button>
      <button
        type="button"
        onClick={() => setCoin(Math.random() > 0.5 ? "Heads" : "Tails")}
        className="flex flex-col items-center p-2 rounded-xl bg-slate-950/60 hover:bg-slate-950/90 transition"
      >
        <span className="text-xs font-black text-cyan-300">🪙 {coin}</span>
        <span className="text-[9px] text-slate-400 mt-1 font-bold">Flip Coin</span>
      </button>
    </div>
  );
}

function ColorWidget() {
  const [colors, setColors] = useState(["#38bdf8", "#818cf8", "#c084fc", "#f472b6"]);
  const [copied, setCopied] = useState<string | null>(null);

  const randomize = () => {
    const gen = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setColors([gen(), gen(), gen(), gen()]);
  };

  const copyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-2 p-1 min-w-[180px]">
      <div className="flex gap-1.5 h-10 rounded-xl overflow-hidden p-1 bg-slate-950">
        {colors.map((c) => (
          <div
            key={c}
            onClick={() => copyHex(c)}
            style={{ backgroundColor: c }}
            className="flex-1 rounded-lg cursor-pointer hover:scale-105 transition-transform"
            title={`Click to copy ${c}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <button
          type="button"
          onClick={randomize}
          className="text-cyan-400 font-bold hover:underline"
        >
          ✨ Randomize
        </button>
        <span className="text-slate-400 font-mono">
          {copied ? `Copied ${copied}!` : "Click color to copy"}
        </span>
      </div>
    </div>
  );
}

function QrWidget() {
  const [text, setText] = useState("https://a-os.dev");

  return (
    <div className="space-y-2 p-1 min-w-[180px] flex flex-col items-center">
      <div className="w-24 h-24 bg-white p-1 rounded-xl flex items-center justify-center shadow-lg">
        {/* Placeholder SVG QR */}
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(text)}`}
          alt="QR"
          className="w-full h-full object-contain"
        />
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-2 py-0.5 text-[10px] text-white text-center font-mono focus:outline-none"
        placeholder="Enter text or URL..."
      />
    </div>
  );
}

function RssWidget() {
  const news = [
    "A-OS 1.2.1 kernel release now live",
    "WebAssembly engine runs 40% faster",
    "Open-source desktop ecosystem expands",
  ];

  return (
    <div className="space-y-1.5 p-1 min-w-[190px]">
      {news.map((item, idx) => (
        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
          <span className="text-cyan-400 font-bold">•</span>
          <span className="truncate">{item}</span>
        </div>
      ))}
    </div>
  );
}

function FortuneWidget() {
  const answers = ["Yes definitely", "Ask again later", "Signs point to yes", "Cannot predict now", "Outlook very good"];
  const [ans, setAns] = useState("Ask a question & tap");

  return (
    <div className="flex flex-col items-center justify-center p-1 min-w-[170px] text-center">
      <button
        type="button"
        onClick={() => setAns(answers[Math.floor(Math.random() * answers.length)])}
        className="w-14 h-14 rounded-full bg-slate-950 border-2 border-indigo-500/50 flex items-center justify-center text-xl shadow-lg hover:scale-105 active:scale-95 transition mb-1.5"
      >
        🎱
      </button>
      <span className="text-[11px] font-bold text-indigo-300">{ans}</span>
    </div>
  );
}

function AvatarWidget() {
  const moods = ["🤖 Hello user!", "⚡ Systems optimal", "✨ Feeling electric", "💻 Ready to code!"];
  const [mood, setMood] = useState(moods[0]);

  return (
    <div className="flex items-center gap-3 p-1 min-w-[170px]">
      <button
        type="button"
        onClick={() => setMood(moods[Math.floor(Math.random() * moods.length)])}
        className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg hover:scale-105 active:scale-95 transition flex-shrink-0"
      >
        🤖
      </button>
      <div>
        <b className="text-xs font-bold text-white block">A-Bot</b>
        <span className="text-[10px] text-cyan-300 leading-tight block">{mood}</span>
      </div>
    </div>
  );
}

function LogoWidget() {
  return (
    <div className="flex flex-col items-center justify-center p-2 text-center min-w-[160px]">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl mb-1">
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-blue-500">
            A
          </span>
        </div>
      </div>
      <b className="text-xs font-bold text-white tracking-wide">A-OS PRO</b>
      <span className="text-[9px] text-slate-400 font-mono">v1.2.1 Operating System</span>
    </div>
  );
}

// --------------------------------------------------------------------------
// COMPREHENSIVE WIDGET MANAGER MODAL
// --------------------------------------------------------------------------

export function DesktopWidgetManager({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [widgets, setWidgets] = useState<DesktopWidgetConfig[]>([]);
  const [showCenterLogo, setShowCenterLogo] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aos-desktop-widgets");
      if (saved) setWidgets(JSON.parse(saved));
      setShowCenterLogo(localStorage.getItem("aos-show-center-logo") === "true");
    } catch {}
  }, [isOpen]);

  if (!isOpen) return null;

  const saveAndBroadcast = (nextList: DesktopWidgetConfig[]) => {
    setWidgets(nextList);
    try {
      localStorage.setItem("aos-desktop-widgets", JSON.stringify(nextList));
      window.dispatchEvent(new Event("aos-widgets-changed"));
    } catch {}
  };

  const addWidget = (type: WidgetType, title: string, defaultW = 210, defaultH = 140) => {
    const pos = findNextSafeSlot(widgets, defaultW, defaultH);
    const newWidget: DesktopWidgetConfig = {
      id: `widget-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      type,
      title,
      x: pos.x,
      y: pos.y,
      width: defaultW,
      height: defaultH,
    };
    saveAndBroadcast([...widgets, newWidget]);
  };

  const removeWidgetByType = (type: WidgetType) => {
    saveAndBroadcast(widgets.filter((w) => w.type !== type));
  };

  const clearAllWidgets = () => {
    saveAndBroadcast([]);
  };

  const handleAutoArrange = () => {
    const arranged = calculateNonOverlappingGrid(widgets, window.innerWidth, window.innerHeight);
    saveAndBroadcast(arranged);
  };

  // Add 100 widgets generator (arranged in neat non-overlapping matrix!)
  const add100Widgets = () => {
    const types = AVAILABLE_WIDGET_TYPES;
    const generated: DesktopWidgetConfig[] = [];

    for (let i = 0; i < 100; i++) {
      const t = types[i % types.length];
      generated.push({
        id: `widget-mega-${i}-${Date.now()}`,
        type: t.type,
        title: `${t.name} #${i + 1}`,
        x: 0,
        y: 0,
        width: t.defaultWidth,
        height: t.defaultHeight,
      });
    }

    const arranged = calculateNonOverlappingGrid(generated, window.innerWidth, window.innerHeight);
    saveAndBroadcast(arranged);
  };

  // Add 20 widgets starter pack
  const add20Widgets = () => {
    const types = AVAILABLE_WIDGET_TYPES.slice(0, 20);
    const generated: DesktopWidgetConfig[] = types.map((t, idx) => ({
      id: `widget-pack-${idx}-${Date.now()}`,
      type: t.type,
      title: t.name,
      x: 0,
      y: 0,
      width: t.defaultWidth,
      height: t.defaultHeight,
    }));

    const arranged = calculateNonOverlappingGrid(generated, window.innerWidth, window.innerHeight);
    saveAndBroadcast(arranged);
  };

  const toggleCenterLogo = (val: boolean) => {
    setShowCenterLogo(val);
    try {
      localStorage.setItem("aos-show-center-logo", String(val));
      window.dispatchEvent(new Event("aos-center-logo-changed"));
    } catch {}
  };

  const categories = ["All", "Utilities", "System", "Time & Focus", "Info & News", "Fun & Tools"];

  const filteredWidgets = AVAILABLE_WIDGET_TYPES.filter((w) => {
    const matchesCat = selectedCategory === "All" || w.category === selectedCategory;
    const matchesSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Desktop Widgets Hub
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add, customize, auto-align, or generate up to 100+ non-overlapping desktop widgets.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Batch Actions Toolbar */}
        <div className="py-3 px-1 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={add100Widgets}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-300" />
              + Add 100 Widgets (Full Grid)
            </button>

            <button
              type="button"
              onClick={add20Widgets}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 flex items-center gap-1 cursor-pointer transition"
            >
              + Add 20 Widgets Pack
            </button>

            <button
              type="button"
              onClick={handleAutoArrange}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1 cursor-pointer transition"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
              📐 Auto-Arrange Grid
            </button>
          </div>

          <div className="flex items-center gap-2">
            {widgets.length > 0 && (
              <button
                type="button"
                onClick={clearAllWidgets}
                className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs transition"
              >
                Clear All ({widgets.length})
              </button>
            )}
          </div>
        </div>

        {/* Categories and Search */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  selectedCategory === c
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="w-48">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search widgets..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Widgets Grid List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredWidgets.map((item) => {
              const activeCount = widgets.filter((w) => w.type === item.type).length;
              return (
                <div
                  key={item.type}
                  className={`p-3.5 rounded-2xl border transition flex flex-col justify-between ${
                    activeCount > 0
                      ? "bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-950/50"
                      : "bg-slate-800/60 border-slate-700/80 hover:border-slate-600"
                  }`}
                >
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <b className="text-xs font-bold text-white">{item.name}</b>
                      {activeCount > 0 && (
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded-full border border-cyan-800">
                          {activeCount} active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>

                  <div className="flex gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => addWidget(item.type, item.name, item.defaultWidth, item.defaultHeight)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 flex items-center justify-center gap-1 cursor-pointer transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Add
                    </button>
                    {activeCount > 0 && (
                      <button
                        type="button"
                        onClick={() => removeWidgetByType(item.type)}
                        className="py-1.5 px-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs transition"
                        title="Remove all of this type"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center OS Logo Watermark Setting */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-bold">Big Center OS Logo:</span>
            <button
              type="button"
              onClick={() => toggleCenterLogo(!showCenterLogo)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                showCenterLogo ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              {showCenterLogo ? "Enabled ✓" : "Disabled"}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-lg shadow-cyan-600/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
