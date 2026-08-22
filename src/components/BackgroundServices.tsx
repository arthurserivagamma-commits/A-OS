import { useEffect } from "react";
import { initAskEmbedBridge } from "./AskEmbedBridge";

export function BackgroundServices() {
  // Initialize AskEmbed host bridge protocol handler
  useEffect(() => {
    const cleanup = initAskEmbedBridge();
    return () => {
      cleanup();
    };
  }, []);

  // Initialize default glassmorphism, transparency, and profile style on boot
  useEffect(() => {
    const isGlass = localStorage.getItem("aos-glassmorphism-mode") !== "false";
    const transparency = Number(localStorage.getItem("aos-window-transparency") || 72);
    const blurRadius = Number(localStorage.getItem("aos-window-blur") || 28);

    const opacityVal = isGlass ? transparency / 100 : 1.0;
    const blurVal = isGlass ? blurRadius : 0;
    const panelOpacity = isGlass ? Math.max(0.4, (transparency / 100) * 0.9) : 1.0;

    document.documentElement.style.setProperty("--window-glass-opacity", opacityVal.toString());
    document.documentElement.style.setProperty("--window-blur", `${blurVal}px`);
    document.documentElement.style.setProperty("--panel-glass-opacity", panelOpacity.toString());

    if (isGlass) {
      document.documentElement.classList.add("glassmorphism-mode");
      document.body.classList.add("glassmorphism-mode");
    }

    // Auto-login & no-locking check
    const noLocking = localStorage.getItem("aos-no-locking") === "true";
    if (noLocking) {
      sessionStorage.setItem("aos-skip-login", "true");
    }
  }, []);

  // Fix 2 text pointers bug & A-OS Mouse Pointer Text badge engine
  useEffect(() => {
    let pointerBadge = document.getElementById("aos-pointer-text-badge");
    if (!pointerBadge) {
      pointerBadge = document.createElement("div");
      pointerBadge.id = "aos-pointer-text-badge";
      pointerBadge.className = "aos-pointer-text-badge";
      pointerBadge.innerText = localStorage.getItem("aos-pointer-text") || "A-OS";
      document.body.appendChild(pointerBadge);
    }

    const updateBadgeVisibility = () => {
      const isEnabled = localStorage.getItem("aos-pointer-text-enabled") === "true";
      if (pointerBadge) {
        pointerBadge.style.display = isEnabled ? "block" : "none";
        pointerBadge.innerText = localStorage.getItem("aos-pointer-text") || "A-OS";
      }
    };

    updateBadgeVisibility();
    window.addEventListener("storage", updateBadgeVisibility);

    const handleMouseMove = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const isTextInput = !!target?.closest(
        'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]'
      );
      const customPointer = document.getElementById("aos-custom-pointer");
      if (customPointer) {
        if (isTextInput) {
          customPointer.style.display = "none";
          customPointer.classList.add("over-text-input");
        } else {
          customPointer.style.display = "";
          customPointer.classList.remove("over-text-input");
        }
      }

      if (pointerBadge && pointerBadge.style.display !== "none") {
        pointerBadge.style.transform = `translate3d(${e.clientX + 16}px, ${e.clientY + 18}px, 0)`;
        if (isTextInput) {
          pointerBadge.style.opacity = "0.25";
        } else {
          pointerBadge.style.opacity = "1";
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("storage", updateBadgeVisibility);
    };
  }, []);

  return null;
}
