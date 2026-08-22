import React, { useState, useEffect } from "react";
import AosDesktop from "./AosDesktop";
import { BackgroundServices } from "./components/BackgroundServices";
import { AosAlertDialog } from "./components/AosAlertDialog";
import { AosQuickEmojiClipboard } from "./components/AosQuickEmojiClipboard";
import { DesktopWidgetsContainer, DesktopWidgetManager } from "./components/DesktopWidgets";

export function App() {
  const [isWidgetManagerOpen, setIsWidgetManagerOpen] = useState(false);

  useEffect(() => {
    const handleOpenWidgetManager = () => {
      setIsWidgetManagerOpen(true);
    };

    window.addEventListener("aos-open-widget-manager", handleOpenWidgetManager);
    return () => {
      window.removeEventListener("aos-open-widget-manager", handleOpenWidgetManager);
    };
  }, []);

  return (
    <>
      <AosDesktop />
      <DesktopWidgetsContainer />
      <DesktopWidgetManager
        isOpen={isWidgetManagerOpen}
        onClose={() => setIsWidgetManagerOpen(false)}
      />
      <BackgroundServices />
      <AosAlertDialog />
      <AosQuickEmojiClipboard />
    </>
  );
}

export default App;
