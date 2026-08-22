import React, { useState, useEffect, useRef } from "react";
import { Terminal, AlertTriangle, RotateCcw, Power, ShieldAlert, Cpu } from "lucide-react";

export function BiosCrashScreen({ onRecoveryComplete }: { onRecoveryComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([
    "A-OS ACPI BIOS Revision 2.44.09",
    "CPU: Virtual Quad-Core Processor @ 3.60GHz",
    "Memory Testing: 16384KB OK",
    "Primary Master: Virtual SATA Disk 128GB",
    "",
    "*** HARDWARE DIAGNOSTIC ALERT ***",
    "[CRITICAL] VFS INTEGRITY CHECK FAILED: /OS/system/kernel.sys NOT FOUND!",
    "[CRITICAL] Operating System Core folder was deleted or missing.",
    "[HALTED] Kernel panic: 0x0000007B (INACCESSIBLE_BOOT_DEVICE)",
    "",
    "Type a command below to proceed:",
    "  /restart       - Attempt normal reboot",
    "  /restart-aos   - Attempt A-OS kernel boot",
    "  /factory-reset - Reinstall A-OS and restore system files",
    "",
  ]);

  const [inputVal, setInputVal] = useState("");
  const [mode, setMode] = useState<"bios" | "recovery_prompt" | "recovery_rebooting">("bios");
  const [rebootStep, setRebootStep] = useState(0);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = (cmdStr: string) => {
    const cmd = cmdStr.trim().toLowerCase();
    const newLogs = [...logs, `BIOS> ${cmdStr}`];

    if (cmd === "/restart" || cmd === "/restart-aos") {
      newLogs.push("Rebooting hardware...");
      newLogs.push("Scanning SATA ports for bootloader...");
      newLogs.push("[ERROR] A-OS was not found on disk.");
      newLogs.push("Kernel panic: 0x0000007B INACCESSIBLE_BOOT_DEVICE.");
      newLogs.push("No bootable operating system detected. System halted.");
      newLogs.push("Type /factory-reset to initiate system recovery.");
      newLogs.push("");
      setLogs(newLogs);
    } else if (cmd === "/factory-reset") {
      setMode("recovery_prompt");
    } else if (cmd === "help" || cmd === "/help") {
      newLogs.push("Available commands: /restart, /restart-aos, /factory-reset, help");
      setLogs(newLogs);
    } else if (cmd === "clear" || cmd === "cls") {
      setLogs(["A-OS System BIOS v2.44", "Type /factory-reset to reinstall A-OS."]);
    } else {
      newLogs.push(`Unknown BIOS command: '${cmdStr}'. Try /restart or /factory-reset`);
      setLogs(newLogs);
    }
  };

  const handleConfirmFactoryReset = () => {
    setMode("recovery_rebooting");
    setRebootStep(1);

    setTimeout(() => setRebootStep(2), 1200);
    setTimeout(() => setRebootStep(3), 2400);
    setTimeout(() => setRebootStep(4), 3600);
    setTimeout(() => {
      // Clear crash and perform factory reset
      localStorage.removeItem("aos-os-deleted");
      localStorage.removeItem("aos-files");
      localStorage.setItem("aos-factory-reset-time", new Date().toISOString());
      localStorage.setItem("aos-device-name", "A-OS Desktop Station");
      onRecoveryComplete();
    }, 4800);
  };

  // 1. RECOVERY REBOOTING SCREEN
  if (mode === "recovery_rebooting") {
    return (
      <div className="fixed inset-0 z-[9999999] bg-[#07111e] text-white flex flex-col items-center justify-center p-6 select-none font-sans">
        <div className="flex flex-col items-center space-y-6 animate-fade-in">
          {/* Pulsing A Logo */}
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-blue-500/40 animate-pulse">
              A
            </div>
            <div className="absolute -inset-2 rounded-3xl border-2 border-cyan-400/40 animate-ping" />
          </div>

          {/* Spinner */}
          <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />

          {/* Title & Recovery Subtitle */}
          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-black tracking-tight text-white">
              A-OS Desktop
            </h2>
            <p className="text-sm font-extrabold text-cyan-400 tracking-wide uppercase">
              System Setup & Restore
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {rebootStep === 1 && "Formatting system storage partition..."}
              {rebootStep === 2 && "Reinstalling microkernel and /OS core files..."}
              {rebootStep === 3 && "Restoring default applications and Apple emoji packs..."}
              {rebootStep === 4 && "Booting into fresh A-OS desktop..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. RECOVERY CONSOLE PROMPT (Black Screen)
  if (mode === "recovery_prompt") {
    return (
      <div className="fixed inset-0 z-[9999999] bg-black text-slate-100 font-mono flex flex-col items-center justify-center p-8 select-none">
        <div className="max-w-xl w-full border border-slate-700 bg-slate-950 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400">
              <RotateCcw className="w-5 h-5" />
              <b className="text-base tracking-wider uppercase">A-OS Recovery Console</b>
            </div>
            <span className="text-xs text-slate-500">v2.44</span>
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-slate-300">
            <p className="text-amber-400 font-bold">
              [!] Operating System partition /OS was uninstalled or corrupted.
            </p>
            <p>
              Do you want to reinstall A-OS and restore the system to factory defaults?
            </p>
            <p className="text-xs text-slate-500">
              This will re-deploy the microkernel, system applications, default media, and bootloader.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setMode("bios")}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-xl transition"
            >
              Cancel (Back to BIOS)
            </button>
            <button
              onClick={handleConfirmFactoryReset}
              className="px-5 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-lg shadow-cyan-600/30 transition flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reinstall A-OS (Y)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. MAIN BIOS CRASH SCREEN
  return (
    <div className="fixed inset-0 z-[9999999] bg-[#020617] text-cyan-400 font-mono flex flex-col justify-between p-6 select-text overflow-hidden">
      {/* Top Banner */}
      <div className="border-b border-cyan-800/80 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-red-600/30 border border-red-500 text-red-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-200">
              A-OS SYSTEM BIOS v2.44 · KERNEL PANIC
            </h1>
            <span className="text-[11px] text-red-400 font-semibold">
              SYSTEM HALTED: CORE SYSTEM MISSING
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCommand("/restart")}
            className="px-3 py-1 bg-slate-900 border border-cyan-800 text-xs text-cyan-300 rounded hover:bg-slate-800"
          >
            /restart
          </button>
          <button
            onClick={() => setMode("recovery_prompt")}
            className="px-3 py-1 bg-cyan-900 border border-cyan-500 text-xs text-white font-bold rounded hover:bg-cyan-800"
          >
            /factory-reset
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto my-4 space-y-1 text-xs leading-relaxed text-slate-300">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`${
              log.startsWith("[CRITICAL]") || log.startsWith("[ERROR]") || log.startsWith("[HALTED]")
                ? "text-red-400 font-bold"
                : log.startsWith("***")
                ? "text-amber-400 font-bold"
                : log.startsWith("BIOS>")
                ? "text-cyan-300 font-bold"
                : "text-slate-300"
            }`}
          >
            {log}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Input Prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputVal.trim()) {
            handleCommand(inputVal);
            setInputVal("");
          }
        }}
        className="flex items-center gap-2 border-t border-cyan-800/80 pt-3"
      >
        <span className="text-xs font-bold text-cyan-400">BIOS&gt;</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          autoFocus
          placeholder="Type /restart or /factory-reset and press Enter..."
          className="flex-1 bg-transparent border-0 text-xs text-white font-mono outline-none placeholder-slate-600"
        />
        <button
          type="submit"
          className="px-3 py-1 text-xs bg-cyan-700 text-white font-bold rounded hover:bg-cyan-600"
        >
          Execute
        </button>
      </form>
    </div>
  );
}
