import { zipSync, strToU8 } from "fflate";

export function exportAosAsZip(): { success: boolean; filename: string } {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `A-OS-(REAL)-Windows-Edition-v1.2.1-${timestamp}.zip`;

    // Collect all stored files and configurations
    const filesRaw = localStorage.getItem("aos-files") || "[]";
    const settingsBackup: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("aos-") || key.startsWith("dev-app-"))) {
        try {
          settingsBackup[key] = JSON.parse(localStorage.getItem(key) || '""');
        } catch {
          settingsBackup[key] = localStorage.getItem(key);
        }
      }
    }

    const archiveData: Record<string, Uint8Array> = {};

    // 1. Standalone Instant Runnable index.html (runs immediately when double-clicked on Windows / Mac / Linux!)
    const standaloneHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>A-OS (REAL) Windows Edition v1.2.1</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='28' fill='%230066ff'/%3E%3Cpath d='M50 18 L76 78 L61 78 L56 64 L44 64 L39 78 L24 78 Z M50 35 L47 52 L53 52 Z' fill='%23ffffff'/%3E%3C/svg%3E" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --accent-color: #0066ff;
    }
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Apple Color Emoji", "SF Pro", "Segoe UI", sans-serif;
      background: radial-gradient(circle at 50% 50%, #0b1329, #020617);
      height: 100vh;
      color: #fff;
      user-select: none;
    }
    .glass {
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(28px) saturate(180%);
      -webkit-backdrop-filter: blur(28px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .window-active {
      box-shadow: 0 25px 60px -15px rgba(0, 102, 255, 0.35), 0 0 0 1px rgba(0, 102, 255, 0.5);
    }
    .aos-glow-emoji {
      filter: drop-shadow(0 0 8px rgba(0, 245, 255, 0.6));
      transition: transform 0.2s ease;
    }
    .aos-glow-emoji:hover {
      transform: scale(1.2);
    }
    /* Animated Aurora */
    .bg-aurora {
      background: linear-gradient(-45deg, #091a2f, #0d3b66, #2d0c4e, #005f73, #0a9396);
      background-size: 400% 400%;
      animation: auroraShift 16s ease infinite;
    }
    @keyframes auroraShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  </style>
</head>
<body class="flex flex-col justify-between h-screen bg-aurora" id="os-root">
  <!-- Top Bar -->
  <header class="h-10 px-4 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between text-xs font-semibold z-40">
    <div class="flex items-center gap-3">
      <div class="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs shadow-md">A</div>
      <span class="font-bold tracking-tight">A-OS (REAL) Windows Edition</span>
      <span class="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-cyan-300 border border-blue-400/30">PRO</span>
    </div>
    <div class="flex items-center gap-4 text-slate-300">
      <button onclick="toggleQuickPalette()" class="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[11px] font-mono text-cyan-300 transition">
        Ctrl + . (Quick Palette)
      </button>
      <div id="clock" class="font-mono text-white">12:00 PM</div>
    </div>
  </header>

  <!-- Desktop Canvas Icons -->
  <main class="flex-1 p-6 grid grid-cols-6 gap-6 items-start content-start z-10">
    <div onclick="openApp('docview')" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-white/10 cursor-pointer transition text-center">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl shadow-xl">📄</div>
      <span class="text-xs font-bold">DocView Suite</span>
    </div>
    <div onclick="openApp('files')" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-white/10 cursor-pointer transition text-center">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-2xl shadow-xl">📁</div>
      <span class="text-xs font-bold">Files</span>
    </div>
    <div onclick="openApp('design')" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-white/10 cursor-pointer transition text-center">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-2xl shadow-xl">🎨</div>
      <span class="text-xs font-bold">Design Studio</span>
    </div>
    <div onclick="openApp('terminal')" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-white/10 cursor-pointer transition text-center">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-black flex items-center justify-center text-2xl shadow-xl border border-white/20">💻</div>
      <span class="text-xs font-bold">Terminal</span>
    </div>
    <div onclick="openApp('settings')" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-white/10 cursor-pointer transition text-center">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-600 to-slate-800 flex items-center justify-center text-2xl shadow-xl">⚙️</div>
      <span class="text-xs font-bold">Settings</span>
    </div>
  </main>

  <!-- BIOS Shell Recovery Screen (Triggered if /OS is deleted) -->
  <div id="bios-screen" class="fixed inset-0 bg-black text-emerald-400 font-mono p-8 hidden z-50 flex-col justify-between">
    <div class="space-y-3">
      <div class="text-xl font-bold text-red-500">A-OS UEFI FIRMWARE TERMINAL · SYSTEM RECOVERY</div>
      <p class="text-sm text-slate-300">FATAL: The /OS directory was deleted or unmounted. Kernel cannot boot.</p>
      <div class="p-4 bg-slate-950 border border-emerald-500/40 rounded-xl space-y-2 text-xs">
        <div>Available Recovery Commands:</div>
        <div>- <b class="text-white">/reinstall-aos</b> : Reinstall full A-OS microkernel & system partitions</div>
        <div>- <b class="text-white">/factory-reset</b> : Reset virtual disk and reboot to desktop</div>
        <div>- <b class="text-white">/os</b> : Mount temporary virtual OS image</div>
      </div>
    </div>
    <div class="flex items-center gap-2 border-t border-emerald-500/30 pt-3">
      <span>A-OS-BIOS></span>
      <input id="bios-input" onkeydown="handleBiosKey(event)" class="flex-1 bg-transparent text-emerald-300 outline-none" placeholder="Type /reinstall-aos and press Enter..." />
    </div>
  </div>

  <!-- Active Windows Container -->
  <div id="windows-layer" class="fixed inset-0 pointer-events-none z-30"></div>

  <!-- Quick Palette Overlay (Ctrl + .) -->
  <div id="quick-palette" class="fixed inset-0 bg-slate-950/70 backdrop-blur-md hidden z-[999] flex items-center justify-center p-4">
    <div class="w-full max-w-lg glass rounded-3xl p-5 shadow-2xl space-y-4 border border-white/20">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <div class="flex items-center gap-2">
          <span class="text-lg">✨</span>
          <b class="text-sm">A-OS Quick Palette</b>
          <span class="text-[10px] font-mono bg-blue-600/30 px-2 py-0.5 rounded-full text-cyan-300">Ctrl + .</span>
        </div>
        <button onclick="toggleQuickPalette()" class="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 text-xs">✕</button>
      </div>

      <!-- 2 Tabs -->
      <div class="flex gap-2">
        <button onclick="setPaletteTab('emojis')" id="btn-tab-emojis" class="flex-1 py-2 rounded-xl bg-blue-600 text-xs font-bold shadow-md">✨ A-OS Emojis</button>
        <button onclick="setPaletteTab('clipboard')" id="btn-tab-clipboard" class="flex-1 py-2 rounded-xl bg-white/10 text-xs font-bold text-slate-300">📋 Last Copied</button>
      </div>

      <!-- Emojis Content -->
      <div id="palette-emojis" class="space-y-3">
        <div class="grid grid-cols-6 gap-2 text-center max-h-56 overflow-y-auto p-1">
          <button onclick="copyEmoji('💠')" class="p-3 bg-white/5 hover:bg-white/15 rounded-xl aos-glow-emoji text-2xl">💠</button>
          <button onclick="copyEmoji('🤖')" class="p-3 bg-white/5 hover:bg-white/15 rounded-xl aos-glow-emoji text-2xl">🤖</button>
          <button onclick="copyEmoji('⚡')" class="p-3 bg-white/5 hover:bg-white/15 rounded-xl aos-glow-emoji text-2xl">⚡</button>
          <button onclick="copyEmoji('🔥')" class="p-3 bg-white/5 hover:bg-white/15 rounded-xl aos-glow-emoji text-2xl">🔥</button>
          <button onclick="copyEmoji('💎')" class="p-3 bg-white/5 hover:bg-white/15 rounded-xl aos-glow-emoji text-2xl">💎</button>
          <button onclick="copyEmoji('🚀')" class="p-3 bg-white/5 hover:bg-white/15 rounded-xl aos-glow-emoji text-2xl">🚀</button>
          <button onclick="copyEmoji('⭐')" class="p-3 bg-white/5 hover:bg-white/15 rounded-xl aos-glow-emoji text-2xl">⭐</button>
          <button onclick="copyEmoji('👑')" class="p-3 bg-white/5 hover:bg-white/15 rounded-xl aos-glow-emoji text-2xl">👑</button>
          <button onclick="copyEmoji('🛡️')" class="p-3 bg-white/5 hover:bg-white/15 rounded-xl aos-glow-emoji text-2xl">🛡️</button>
          <button onclick="copyEmoji('💻')" class="p-3 bg-white/5 hover:bg-white/15 rounded-xl aos-glow-emoji text-2xl">💻</button>
          <button onclick="copyEmoji('😎')" class="p-3 bg-white/5 hover:bg-white/15 rounded-xl aos-glow-emoji text-2xl">😎</button>
          <button onclick="copyEmoji('🤩')" class="p-3 bg-white/5 hover:bg-white/15 rounded-xl aos-glow-emoji text-2xl">🤩</button>
        </div>
        <p class="text-[11px] text-slate-400 text-center">Click any emoji to copy or insert instantly!</p>
      </div>

      <!-- Clipboard Content -->
      <div id="palette-clipboard" class="hidden space-y-2 max-h-56 overflow-y-auto">
        <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-200 flex justify-between items-center">
          <span class="truncate">A-OS (REAL) Windows Edition v1.2.1</span>
          <span class="text-[10px] text-slate-400">Just now</span>
        </div>
        <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-200 flex justify-between items-center">
          <span class="truncate">export const KERNEL_STATUS = 'ACTIVE';</span>
          <span class="text-[10px] text-slate-400">5m ago</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Taskbar Shelf -->
  <footer class="h-16 px-6 bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between z-40">
    <div class="flex items-center gap-3">
      <button onclick="openApp('docview')" class="w-11 h-11 rounded-2xl bg-blue-600 hover:scale-110 active:scale-95 transition flex items-center justify-center text-xl shadow-md">📄</button>
      <button onclick="openApp('files')" class="w-11 h-11 rounded-2xl bg-cyan-600 hover:scale-110 active:scale-95 transition flex items-center justify-center text-xl shadow-md">📁</button>
      <button onclick="openApp('design')" class="w-11 h-11 rounded-2xl bg-pink-600 hover:scale-110 active:scale-95 transition flex items-center justify-center text-xl shadow-md">🎨</button>
      <button onclick="openApp('terminal')" class="w-11 h-11 rounded-2xl bg-slate-800 hover:scale-110 active:scale-95 transition flex items-center justify-center text-xl shadow-md border border-white/10">💻</button>
      <button onclick="openApp('settings')" class="w-11 h-11 rounded-2xl bg-slate-700 hover:scale-110 active:scale-95 transition flex items-center justify-center text-xl shadow-md">⚙️</button>
    </div>
    <div class="flex items-center gap-3 text-xs text-slate-400">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="text-white font-semibold">A-OS (REAL) Windows Active</span>
    </div>
  </footer>

  <script>
    function updateClock() {
      document.getElementById('clock').innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Global Shortcut Ctrl + .
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '.' || e.key === '>')) {
        e.preventDefault();
        toggleQuickPalette();
      }
    });

    function toggleQuickPalette() {
      const el = document.getElementById('quick-palette');
      el.classList.toggle('hidden');
    }

    function setPaletteTab(tab) {
      if (tab === 'emojis') {
        document.getElementById('palette-emojis').classList.remove('hidden');
        document.getElementById('palette-clipboard').classList.add('hidden');
        document.getElementById('btn-tab-emojis').className = 'flex-1 py-2 rounded-xl bg-blue-600 text-xs font-bold shadow-md';
        document.getElementById('btn-tab-clipboard').className = 'flex-1 py-2 rounded-xl bg-white/10 text-xs font-bold text-slate-300';
      } else {
        document.getElementById('palette-emojis').classList.add('hidden');
        document.getElementById('palette-clipboard').classList.remove('hidden');
        document.getElementById('btn-tab-emojis').className = 'flex-1 py-2 rounded-xl bg-white/10 text-xs font-bold text-slate-300';
        document.getElementById('btn-tab-clipboard').className = 'flex-1 py-2 rounded-xl bg-indigo-600 text-xs font-bold shadow-md';
      }
    }

    function copyEmoji(emoji) {
      navigator.clipboard.writeText(emoji);
      alert('Copied ' + emoji + ' to clipboard!');
      toggleQuickPalette();
    }

    function openApp(id) {
      const container = document.getElementById('windows-layer');
      let title = 'App';
      let content = '';

      if (id === 'docview') {
        title = 'DocView Suite (PDF / DOCX / SVG)';
        content = '<div class="space-y-4"><h3 class="text-sm font-bold text-blue-400">A-OS Rich Document Editor</h3><textarea class="w-full h-44 bg-slate-950 p-3 rounded-xl text-xs text-white border border-white/10 outline-none" placeholder="Type your document content here..."></textarea><div class="flex gap-2"><button class="px-3 py-1.5 bg-blue-600 text-xs font-bold rounded-xl">Save Document</button><button class="px-3 py-1.5 bg-white/10 text-xs font-bold rounded-xl">Export PDF</button></div></div>';
      } else if (id === 'files') {
        title = 'A-OS Files Explorer';
        content = '<div class="space-y-3 font-mono text-xs"><div class="p-3 bg-white/5 rounded-xl flex justify-between items-center"><span>📁 /OS (System Kernel Directory)</span><button onclick="triggerOsDelete()" class="px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-[10px]">Delete /OS</button></div><div class="p-3 bg-white/5 rounded-xl">📁 /Documents (User Files)</div><div class="p-3 bg-white/5 rounded-xl">📁 /Downloads (Payloads)</div></div>';
      } else if (id === 'design') {
        title = 'A-OS Design Studio';
        content = '<div class="space-y-4"><h3 class="text-xs font-bold text-pink-400">Accent Colors & Dynamic Shaders</h3><div class="grid grid-cols-4 gap-2"><button onclick="document.body.className=\\'flex flex-col justify-between h-screen bg-aurora\\'" class="p-3 rounded-xl bg-blue-600/40 border border-blue-400 text-xs font-bold">Aurora</button><button onclick="document.body.style.background=\\'#020617\\'" class="p-3 rounded-xl bg-slate-800 text-xs font-bold">Obsidian</button></div></div>';
      } else if (id === 'terminal') {
        title = 'A-OS Terminal Shell';
        content = '<div class="h-44 bg-black p-3 rounded-xl font-mono text-xs text-emerald-400 space-y-1 overflow-y-auto"><div>A-OS Terminal Shell v1.2.1</div><div>Type /help for available commands</div><div class="text-white">> ready</div></div>';
      } else if (id === 'settings') {
        title = 'A-OS System Settings';
        content = '<div class="space-y-3 text-xs"><b class="text-white block">Power Preferences & Hardware</b><p class="text-slate-400">Glassmorphism: High Blur (28px)</p><p class="text-slate-400">Emoji System: A-OS Unique Signature</p><p class="text-slate-400">Virtual Memory: 16 GB Allocated</p></div>';
      }

      container.innerHTML = \`
        <div class="pointer-events-auto fixed inset-12 m-auto max-w-2xl max-h-[520px] glass rounded-3xl p-6 flex flex-col justify-between window-active z-40">
          <div class="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 class="font-bold text-sm">\${title}</h3>
            <button onclick="document.getElementById('windows-layer').innerHTML=''" class="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs">✕</button>
          </div>
          <div class="flex-1 py-4 overflow-auto">\${content}</div>
          <div class="border-t border-white/10 pt-2 text-[11px] text-slate-400 flex justify-between">
            <span>A-OS (REAL) Windows Edition</span>
            <span>Running Standalone</span>
          </div>
        </div>
      \`;
    }

    function triggerOsDelete() {
      if (confirm('CRITICAL SYSTEM WARNING: Deleting the /OS partition will crash A-OS into UEFI BIOS shell. Continue?')) {
        document.getElementById('windows-layer').innerHTML = '';
        document.getElementById('bios-screen').classList.remove('hidden');
      }
    }

    function handleBiosKey(e) {
      if (e.key === 'Enter') {
        const val = document.getElementById('bios-input').value.trim();
        if (val === '/reinstall-aos' || val === '/factory-reset' || val === '/os') {
          alert('System restored! Rebooting into A-OS (REAL)...');
          document.getElementById('bios-screen').classList.add('hidden');
          document.getElementById('bios-input').value = '';
        } else {
          alert('Unknown BIOS command. Try /reinstall-aos');
        }
      }
    }
  </script>
</body>
</html>`;

    archiveData["index.html"] = strToU8(standaloneHtml);

    // 2. package.json for Node / Vite development
    const packageJsonContent = JSON.stringify(
      {
        name: "a-os-operating-system",
        version: "1.2.1",
        private: true,
        type: "module",
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
        },
        dependencies: {
          "lucide-react": "^1.16.0",
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          fflate: "^0.8.2",
        },
        devDependencies: {
          "@tailwindcss/vite": "^4.1.1",
          "@types/react": "^19.0.0",
          "@types/react-dom": "^19.0.0",
          "@vitejs/plugin-react": "^4.3.4",
          tailwindcss: "^4.1.1",
          typescript: "~5.7.2",
          vite: "^6.2.0",
        },
      },
      null,
      2
    );
    archiveData["package.json"] = strToU8(packageJsonContent);

    // 3. vite.config.ts
    const viteConfigContent = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;
    archiveData["vite.config.ts"] = strToU8(viteConfigContent);

    // 4. README with full PC & Website hosting guide
    archiveData["README.md"] = strToU8(
      `# A-OS Desktop Operating System v1.2.1\n\n` +
      `A modular web operating system with glassmorphism aesthetics, DocView document suite (PDF, DOCX, SVG), virtual filesystem, and UEFI BIOS recovery.\n\n` +
      `## How to Run on PC / Mac / Linux\n` +
      `### Option 1: Instant Standalone (Zero setup)\n` +
      `Double-click \`index.html\` in any web browser.\n\n` +
      `### Option 2: Full Developer Environment (Node.js)\n` +
      `\`\`\`bash\n` +
      `npm install\n` +
      `npm run dev\n` +
      `\`\`\`\n\n` +
      `## How to Host on Your Website\n` +
      `- **Vercel / Netlify**: Deploy this repository or upload the \`dist\` folder.\n` +
      `- **GitHub Pages**: Upload and enable Pages under Settings.\n` +
      `- **Apache / Nginx**: Copy files into your web root directory (\`/var/www/html\`).\n`
    );

    // 4b. Windows One-Click Launchers
    archiveData["run-windows.bat"] = strToU8(
      `@echo off\r\necho Starting A-OS Desktop System...\r\necho Opening A-OS in your default browser...\r\nstart "" "%~dp0index.html"\r\necho Done!\r\n`
    );
    archiveData["run-windows.ps1"] = strToU8(
      `Write-Host "Starting A-OS Desktop System..." -ForegroundColor Cyan\r\nStart-Process "$PSScriptRoot\\index.html"\r\n`
    );
    archiveData["run-macos-linux.sh"] = strToU8(
      `#!/bin/bash\necho "Starting A-OS Desktop System..."\nopen index.html 2>/dev/null || xdg-open index.html 2>/dev/null || sensible-browser index.html\n`
    );

    // 5. System /OS Partition
    archiveData["OS/boot.sys"] = strToU8("boot_loader=A-OS\nkernel_version=1.2.1\nstatus=OK\n");
    archiveData["OS/system/kernel.sys"] = strToU8("// A-OS Microkernel Core v1.2.1\nexport const KERNEL_STATUS = 'ACTIVE';\n");
    archiveData["OS/system/config.json"] = strToU8(JSON.stringify(settingsBackup, null, 2));

    // 6. Add Virtual Filesystem files
    try {
      const parsedFiles = JSON.parse(filesRaw);
      if (Array.isArray(parsedFiles)) {
        parsedFiles.forEach((file: any) => {
          const folder = file.parent === "root" || !file.parent ? "" : `${file.parent}/`;
          const path = `Documents/${folder}${file.name || "untitled"}`;
          if (file.content) {
            if (typeof file.content === "string" && file.content.startsWith("data:")) {
              const base64Data = file.content.split(",")[1];
              if (base64Data) {
                try {
                  const binaryStr = atob(base64Data);
                  const len = binaryStr.length;
                  const bytes = new Uint8Array(len);
                  for (let j = 0; j < len; j++) bytes[j] = binaryStr.charCodeAt(j);
                  archiveData[path] = bytes;
                  return;
                } catch {}
              }
            }
            archiveData[path] = strToU8(String(file.content));
          } else {
            archiveData[path] = strToU8("");
          }
        });
      }
    } catch {}

    // Pack ZIP using fflate
    const zipped = zipSync(archiveData);
    const blob = new Blob([zipped as any], { type: "application/zip" });
    const url = URL.createObjectURL(blob);

    // Auto-save this exported archive also into the A-OS virtual filesystem with real data URI!
    try {
      let base64Str = "";
      for (let j = 0; j < zipped.length; j += 32768) {
        base64Str += String.fromCharCode(...zipped.subarray(j, j + 32768));
      }
      const existingFiles = JSON.parse(localStorage.getItem("aos-files") || "[]");
      const backupFile = {
        id: "sysbackup-" + Date.now(),
        name: filename,
        type: "file",
        parent: "downloads",
        content: `data:application/zip;base64,${btoa(base64Str)}`,
        icon: "zip.png",
        mime: "application/zip",
      };
      localStorage.setItem("aos-files", JSON.stringify([...existingFiles, backupFile]));
      window.dispatchEvent(new Event("storage"));
    } catch {}

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);

    return { success: true, filename };
  } catch (err) {
    console.error("Failed to export A-OS ZIP archive:", err);
    return { success: false, filename: "" };
  }
}
