import { useEffect, useRef, useState, ReactNode } from "react";
import { AppId } from "../types";
import { getSystemIcon } from "../icon-assets";

export function Window({
  app,
  webApp,
  children,
  close,
  minimize,
  z,
  initialOffset,
  onFocus,
  resizable,
  rememberSize,
  compact,
  appOverride,
}: {
  app: Exclude<AppId, null>;
  webApp?: any;
  children: ReactNode;
  close: () => void;
  minimize: () => void;
  z: number;
  initialOffset?: number;
  onFocus: () => void;
  resizable: boolean;
  rememberSize: boolean;
  compact?: boolean;
  appOverride?: { name?: string; icon?: string };
}) {
  const [full, setFull] = useState(false);
  const [position, setPosition] = useState({
    x: ((initialOffset || 0) % 5) * 34 - 68,
    y: ((initialOffset || 0) % 5) * 27 - 54,
  });
  const [size, setSize] = useState<{ width?: number; height?: number }>({});
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const resize = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const windowRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rememberSize) {
      setSize({});
      return;
    }
    try {
      setSize(JSON.parse(localStorage.getItem(`aos-window-size-${app}`) || "{}"));
    } catch {
      setSize({});
    }
  }, [app, rememberSize]);

  const titles: Record<string, string> = {
    store: "A-Store",
    files: "Files",
    settings: "Settings",
    weba: "OSInternet",
    versions: "A-OS Versions",
    notes: "Notes",
    security: "Security",
    webapp: webApp?.name || "Web app",
    vscode: "File Assist",
    codeviewer: "Code Viewer",
    paint: "Paint",
    minesweeper: "Minesweeper",
    zipviewer: "ZIP Viewer",
    terminalapp: "A-OS Terminal",
    devstudio: "DevStudio",
    storage: "Storages",
    mediaview: "MediaView",
    devicesource: "DeviceSource",
    simulator: "A-OS Simulator",
    company: "Company",
    lucky: "Lucky",
    money: "Money",
    star: "STAR",
    safe: "Safe",
    unsafe: "Unsafe Lab",
    bugged: "Bug Inspector",
    dead: "Dead A Screen",
    pc: "A-OS PC",
    video: "Video",
    music: "Music",
    images: "Images",
    trash: "Trash",
    osegg: "OSegg",
    clock: "Clock",
    calculator: "Calculator",
    weather: "Weather",
    record: "Record",
    camera: "Camera",
    keyboard: "On-Screen Keyboard",
    deviceoverpowered: "Device-OverPowered",
    aapplications: "A-Applications Login",
  };

  const windowIcons: Record<string, string> = {
    terminalapp: "Terminal.png",
    keyboard: "Terminal.png",
    devstudio: "Code.png",
    storage: "This PC.png",
    mediaview: "Media Files.png",
    devicesource: "Code.png",
    simulator: "OS Logo.png",
    paint: "Draw.png",
    minesweeper: "Bug.png",
    zipviewer: "zip.png",
    vscode: "Code.png",
    codeviewer: "Text Editor.png",
    webapp: "Internet.png",
    store: "Downloads.png",
    files: "Files.png",
    settings: "Settings.png",
    weba: "Internet.png",
    versions: "Code.png",
    notes: "Notes.png",
    security: "Security Shield.png",
    company: "Company.png",
    lucky: "Lucky.png",
    money: "Money.png",
    star: "STAR.png",
    safe: "Safe.png",
    unsafe: "UnSafe.png",
    bugged: "Bugged.png",
    dead: "Dead A Screen (bsod but das).png",
    pc: "PC.png",
    video: "Video.png",
    music: "Music.png",
    images: "Images.png",
    trash: "Trash.png",
    osegg: "Bug.png",
    clock: "Clock.png",
    calculator: "Calculator.png",
    weather: "Weather.png",
    record: "Record.png",
    camera: "Image.png",
    deviceoverpowered: "PC.png",
    aapplications: "Cloud.png",
  };

  const file = appOverride?.icon || windowIcons[app] || "Unnamed app.png";
  const iconSrc = file.startsWith("data:") || file.startsWith("/") ? file : getSystemIcon(file);

  return (
    <section
      ref={windowRef}
      className={`system-window${app === "weba" ? " browser-window" : ""}${compact ? " compact-x-window" : ""}${full ? " window-full" : ""}`}
      onPointerDown={onFocus}
      style={
        full
          ? { zIndex: z }
          : {
              zIndex: z,
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
              ...(size.width ? { width: `${size.width}px` } : {}),
              ...(size.height ? { height: `${size.height}px` } : {}),
            }
      }
    >
      <header
        style={{ touchAction: "none", userSelect: "none", cursor: full ? "default" : "grab" }}
        onPointerDown={(e) => {
          if (full || (e.target as HTMLElement).closest("button")) return;
          drag.current = {
            x: e.clientX,
            y: e.clientY,
            ox: position.x,
            oy: position.y,
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          setPosition({
            x: drag.current.ox + e.clientX - drag.current.x,
            y: drag.current.oy + e.clientY - drag.current.y,
          });
        }}
        onPointerUp={(e) => {
          drag.current = null;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
      >
        <div>
          <img src={iconSrc} alt="" />
          <b>{appOverride?.name || titles[app] || "App"}</b>
        </div>
        <nav>
          {!compact && (
            <button onClick={minimize} aria-label="Minimize">
              <span />
            </button>
          )}
          {!compact && (
            <button onClick={() => setFull((v) => !v)} aria-label={full ? "Restore window" : "Fullscreen"}>
              <span />
            </button>
          )}
          <button onClick={close} aria-label="Close">
            <span />
          </button>
        </nav>
      </header>
      {children}
      {resizable && !full && !compact && (
        <button
          className="window-resize-handle"
          aria-label="Resize window"
          onPointerDown={(event) => {
            event.stopPropagation();
            const bounds = windowRef.current?.getBoundingClientRect();
            if (!bounds) return;
            resize.current = { x: event.clientX, y: event.clientY, width: bounds.width, height: bounds.height };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!resize.current) return;
            setSize({
              width: Math.max(480, Math.min(window.innerWidth - 24, resize.current.width + event.clientX - resize.current.x)),
              height: Math.max(340, Math.min(window.innerHeight - 92, resize.current.height + event.clientY - resize.current.y)),
            });
          }}
          onPointerUp={(event) => {
            resize.current = null;
            event.currentTarget.releasePointerCapture(event.pointerId);
            if (rememberSize) {
              const bounds = windowRef.current?.getBoundingClientRect();
              if (bounds) {
                localStorage.setItem(
                  `aos-window-size-${app}`,
                  JSON.stringify({ width: Math.round(bounds.width), height: Math.round(bounds.height) })
                );
              }
            }
          }}
        />
      )}
    </section>
  );
}
