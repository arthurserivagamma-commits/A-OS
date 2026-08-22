import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

export interface AosAlertData {
  appName: string;
  message: string;
  onConfirm?: () => void;
}

export function AosAlertDialog() {
  const [currentAlert, setCurrentAlert] = useState<AosAlertData | null>(null);

  useEffect(() => {
    // 1. Intercept native window.alert
    const originalAlert = window.alert;
    (window as any)._originalAlert = originalAlert;

    window.alert = (msg?: any) => {
      const messageStr = typeof msg === "object" ? JSON.stringify(msg, null, 2) : String(msg ?? "");
      // Infer active app name from title or focused element
      let inferredApp = "A-OS Application";
      const activeWindow = document.querySelector(".window.active, .window:hover, .app-window, .active");
      if (activeWindow) {
        const titleEl = activeWindow.querySelector(".window-title, header b, header span, .title, h1, h2");
        if (titleEl && titleEl.textContent) {
          inferredApp = titleEl.textContent.trim();
        }
      }

      setCurrentAlert({
        appName: inferredApp,
        message: messageStr,
      });
    };

    // 2. Listen for postMessage from iframes/embeds
    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === "object") {
        if (event.data.type === "aos-alert" || event.data.type === "alert") {
          setCurrentAlert({
            appName: event.data.appName || event.data.title || "Embedded Application",
            message: event.data.message || event.data.text || "",
          });
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Custom event dispatcher for internal components
    const handleCustomAlert = (e: CustomEvent<AosAlertData>) => {
      if (e.detail) {
        setCurrentAlert(e.detail);
      }
    };
    window.addEventListener("aos-show-alert" as any, handleCustomAlert);

    return () => {
      window.alert = originalAlert;
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("aos-show-alert" as any, handleCustomAlert);
    };
  }, []);

  if (!currentAlert) return null;

  const handleClose = () => {
    if (currentAlert.onConfirm) {
      currentAlert.onConfirm();
    }
    setCurrentAlert(null);
  };

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in select-none">
      {/* A-OS Window */}
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 rounded-2xl border border-white/60 dark:border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-2xl animate-scale-up">
        {/* A-OS Window Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-2 truncate">
            <span className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
              A
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {currentAlert.appName}
            </span>
          </div>

          {/* Just the X button to close */}
          <button
            onClick={handleClose}
            aria-label="Close Alert"
            className="w-6 h-6 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white flex items-center justify-center transition-all duration-150 active:scale-90"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Window Content */}
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 text-sm text-slate-800 dark:text-slate-200 font-medium whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto pr-1">
              {currentAlert.message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function triggerAosAlert(appName: string, message: string, onConfirm?: () => void) {
  window.dispatchEvent(
    new CustomEvent("aos-show-alert", {
      detail: { appName, message, onConfirm },
    })
  );
}
