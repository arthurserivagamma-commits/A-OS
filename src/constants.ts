import { OverpoweredConfig, VFile } from "./types";

export const BUILD_ID = "aos-v1.2.1-2026.08.16-a-applications-sync-browser-emoji";
export const WEB_RUNTIME = "https://scramjet.mercurywork.shop/";

export const taskbarApps = [
  { id: "weba", name: "OSInternet", file: "Internet.png" },
  { id: "files", name: "Files", file: "Files.png" },
  { id: "store", name: "A-Store", file: "Downloads.png" },
  { id: "vscode", name: "File Assist", file: "Code.png" },
  { id: "codeviewer", name: "Code Viewer", file: "Text Editor.png" },
  { id: "settings", name: "Settings", file: "Settings.png" },
  { id: "keyboard", name: "On-Screen Keyboard", file: "Terminal.png" },
  { id: "terminalapp", name: "Terminal", file: "Terminal.png" },
  { id: "devstudio", name: "DevStudio", file: "Code.png" },
  { id: "storage", name: "Storage", file: "This PC.png" },
  { id: "mediaview", name: "MediaView", file: "Media Files.png" },
  { id: "devicesource", name: "DeviceSource", file: "Code.png" },
  { id: "pc", name: "A-OS PC", file: "PC.png" },
  { id: "trash", name: "Trash", file: "Trash.png" },
  { id: "clock", name: "Clock", file: "Clock.png" },
  { id: "calculator", name: "Calculator", file: "Calculator.png" },
  { id: "weather", name: "Weather", file: "Weather.png" },
  { id: "record", name: "Record", file: "Record.png" },
  { id: "camera", name: "Camera", file: "Image.png" },
] as const;

export const hiddenApps = [
  { id: "aiservices", name: "AI Services", file: "AI Services (Hidden App).png" },
  { id: "aosdevice", name: "A-OS Device", file: "This PC.png" },
  { id: "system", name: "System", file: "OS Logo.png" },
  { id: "systemservices", name: "System Services", file: "Settings.png" },
  { id: "languages", name: "Languages", file: "Text Editor.png" },
  { id: "languagecontrol", name: "LanguageControl", file: "Text Editor.png" },
  { id: "fileviewsource", name: "FileViewSource", file: "Code.png" },
  { id: "osegg", name: "OSegg", file: "Bug.png" },
  { id: "deviceoverpowered", name: "Device-OverPowered", file: "PC.png" },
] as const;

export const defaultOverpowered: OverpoweredConfig = {
  taskbarColour: "#e8f6fb",
  lockscreenImage: "Aqua A (Default).png",
  runningCode: "/* Live A-OS device CSS */\n.desktop { }",
  aiShortcut: "A-AI",
  iconPack: "Default",
  lockMode: "Secure countdown",
};

export const cloudKeys = [
  "aos-wallpaper", "aos-device", "aos-apps", "aos-note", "aos-profile", "aos-email",
  "aos-accounts", "aos-url-apps", "aos-dev-apps", "aos-icon-pack", "aos-files", "aos-dark",
  "aos-language", "aos-interface-size", "aos-notification-sounds", "aos-notification-volume",
  "aos-notification-tone", "aos-ringtone-tone", "aos-alarm-tone", "aos-window-resize",
  "aos-window-remember", "aos-custom-html", "aos-custom-name", "aos-current-rom", "aos-configured",
  "aos-browser-tabs", "aos-browser-active", "aos-browser-pins", "aos-pinned-folders",
  "aos-pointer-size", "aos-pointer-colour", "aos-pointer-speed", "aos-pointer-image",
  "aos-profiles", "aos-pinned-apps", "aos-accent-colour", "aos-shelf-style", "aos-shelf-position",
  "aos-app-overrides", "aos-disabled-apps", "aos-overpowered",
];

export const profileDataKeys = cloudKeys.filter(
  (key) => !["aos-profile", "aos-email", "aos-profiles"].includes(key)
);
export const aApplicationsSettingsKeys = cloudKeys.filter(
  (key) => !["aos-files", "aos-profile", "aos-email", "aos-profiles"].includes(key)
);

export const terminalEmojiPack: Record<string, { symbol: string; tone: string; label: string }> = {
  aos: { symbol: "◆", tone: "navy", label: "A-OS" },
  secure: { symbol: "◈", tone: "white", label: "Secure" },
  cloud: { symbol: "◉", tone: "blue", label: "Cloud" },
  terminal: { symbol: "▣", tone: "white", label: "Terminal" },
  store: { symbol: "⬢", tone: "navy", label: "A-Store" },
  spark: { symbol: "✦", tone: "blue", label: "Spark" },
  file: { symbol: "▤", tone: "white", label: "File" },
  usb: { symbol: "⌁", tone: "blue", label: "USB" },
  wifi: { symbol: "◔", tone: "blue", label: "Wi-Fi" },
  battery: { symbol: "▰", tone: "white", label: "Battery" },
  warning: { symbol: "▲", tone: "navy", label: "Warning" },
  success: { symbol: "✓", tone: "blue", label: "Success" },
  error: { symbol: "×", tone: "white", label: "Error" },
  lock: { symbol: "◇", tone: "navy", label: "Lock" },
  download: { symbol: "⇩", tone: "blue", label: "Download" },
  upload: { symbol: "⇧", tone: "white", label: "Upload" },
  folder: { symbol: "◫", tone: "navy", label: "Folder" },
  code: { symbol: "⌘", tone: "blue", label: "Code" },
  web: { symbol: "◎", tone: "white", label: "Web" },
  settings: { symbol: "✣", tone: "navy", label: "Settings" },
  clock: { symbol: "◷", tone: "blue", label: "Clock" },
  user: { symbol: "●", tone: "white", label: "User" },
  search: { symbol: "⌕", tone: "navy", label: "Search" },
  mail: { symbol: "✉", tone: "blue", label: "Mail" },
  bug: { symbol: "🐛", tone: "blue", label: "Bug" },
  cable: { symbol: "🔌", tone: "white", label: "Cable" },
  tablet: { symbol: "▱", tone: "navy", label: "Tablet" },
  life: { symbol: "♥", tone: "blue", label: "Life" },
};

export const AOS_3D_EMOJI_ROOT = "/assets/emojis/aos-3d/";
export const aos3dEmojiPack = [
  ["smiling face", "😀"], ["laughing face", "😂"], ["heart eyes", "😍"], ["cool face", "😎"],
  ["thinking face", "🤔"], ["surprised face", "😮"], ["sad face", "😢"], ["angry face", "😠"],
  ["waving hand", "👋"], ["thumbs up", "👍"], ["red heart", "❤️"], ["blue sparkle", "✨"],
  ["party popper", "🎉"], ["blue folder", "📁"], ["cloud", "☁️"], ["shield", "🛡️"],
].map(([name, symbol], index) => ({
  name: `A-OS 3D ${name}`,
  symbol,
  image: `${AOS_3D_EMOJI_ROOT}emoji-${String(index).padStart(2, "0")}.png`,
  pack: "A-OS 3D",
}));

export const aos3dIconForApp = (id: string) => {
  const index: Record<string, number> = {
    weba: 11, files: 13, store: 12, vscode: 4, codeviewer: 4, settings: 15, security: 15,
    terminalapp: 3, storage: 13, mediaview: 3, devicesource: 4, camera: 3, record: 5,
    weather: 14, clock: 5, calculator: 9, pc: 13, trash: 7, aapplications: 14,
  };
  return `${AOS_3D_EMOJI_ROOT}emoji-${String(index[id] ?? 0).padStart(2, "0")}.png`;
};

export const languageCodes = [
  "af", "sq", "am", "ar", "hy", "as", "ay", "az", "bm", "eu", "be", "bn", "bho", "bs", "bg",
  "ca", "ceb", "zh-CN", "zh-TW", "co", "hr", "cs", "da", "dv", "doi", "nl", "en", "eo", "et",
  "ee", "fil", "fi", "fr", "fy", "gl", "ka", "de", "el", "gn", "gu", "ht", "ha", "haw", "he",
  "hi", "hmn", "hu", "is", "ig", "ilo", "id", "ga", "it", "ja", "jv", "kn", "kk", "km", "rw",
  "ko", "kri", "ku", "ckb", "ky", "lo", "la", "lv", "ln", "lt", "lg", "lb", "mk", "mai", "mg",
  "ms", "ml", "mt", "mi", "mr", "mni-Mtei", "lus", "mn", "my", "ne", "no", "ny", "or", "om",
  "ps", "fa", "pl", "pt-PT", "pt", "pa", "qu", "ro", "ru", "sm", "sa", "gd", "nso", "sr", "st",
  "sn", "sd", "si", "sk", "sl", "so", "es", "su", "sw", "sv", "tl", "tg", "ta", "tt", "te", "th",
  "ti", "ts", "tr", "tk", "ak", "uk", "ur", "ug", "uz", "vi", "cy", "xh", "yi", "yo", "zu",
];

export const displayLanguage = (code: string, locale: string) => {
  try {
    return new Intl.DisplayNames([locale], { type: "language" }).of(code) || code;
  } catch {
    return code;
  }
};

export const languages = languageCodes
  .map((code) => ({
    code,
    label: displayLanguage(code, "en"),
    native: displayLanguage(code, code),
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const copy: Record<string, Record<string, string>> = {
  en: { start: "Start A-OS", ready: "A-OS Computer is ready", language: "Language", settings: "Settings", files: "Files", welcome: "Welcome back" },
  pt: { start: "Iniciar A-OS", ready: "O computador A-OS está pronto", language: "Idioma", settings: "Definições", files: "Ficheiros", welcome: "Bem-vindo de volta" },
  "pt-PT": { start: "Iniciar A-OS", ready: "O computador A-OS está pronto", language: "Idioma", settings: "Definições", files: "Ficheiros", welcome: "Bem-vindo de volta" },
  es: { start: "Iniciar A-OS", ready: "El ordenador A-OS está listo", language: "Idioma", settings: "Ajustes", files: "Archivos", welcome: "Bienvenido de nuevo" },
  fr: { start: "Démarrer A-OS", ready: "L’ordinateur A-OS est prêt", language: "Langue", settings: "Paramètres", files: "Fichiers", welcome: "Bon retour" },
};

export const systemCopy = (language: string) => copy[language] || copy.en;

export const engines = [
  { name: "Google", domain: "google.com", copy: "Fast, familiar search" },
  { name: "Bing", domain: "bing.com", copy: "Search powered by Microsoft" },
  { name: "DuckDuckGo", domain: "duckduckgo.com", copy: "Private search by default" },
];

export const catalog = [
  { name: "ChatGPT", domain: "chatgpt.com", url: "https://chatgpt.com", category: "AI", description: "Create, learn and get things done." },
  { name: "YouTube", domain: "youtube.com", url: "https://youtube.com", category: "Video", description: "Watch, share and discover video." },
  { name: "Google", domain: "google.com", url: "https://google.com", category: "Search", description: "Search the world’s information." },
  { name: "Bing", domain: "bing.com", url: "https://bing.com", category: "Search", description: "Search, discover and create." },
  { name: "Gmail", domain: "gmail.com", url: "https://gmail.com", category: "Work", description: "Fast, organized email." },
  { name: "Google Drive", domain: "drive.google.com", url: "https://drive.google.com/drive/my-drive", category: "Work", description: "Choose files from your Google Drive." },
  { name: "Spotify", domain: "spotify.com", url: "https://spotify.com", category: "Music", description: "Music and podcasts for every moment." },
  { name: "Discord", domain: "discord.com", url: "https://discord.com", category: "Social", description: "Talk, play and spend time together." },
  { name: "Wikipedia", domain: "wikipedia.org", url: "https://wikipedia.org", category: "Learn", description: "The free encyclopedia." },
  { name: "GitHub", domain: "github.com", url: "https://github.com", category: "Developer", description: "Build and ship software together." },
  { name: "Canva", domain: "canva.com", url: "https://canva.com", category: "Design", description: "Create visual content online." },
  { name: "WebA", domain: "a-os.dev", url: "/downloads/WebASetup.exe", category: "System", description: "The native browser made for A-OS." },
];

export const bootLines = [
  "A-OS firmware initialized",
  "Verifying system image",
  "Loading device services",
  "Starting A-OS Computer",
];

export const allWalls = [
  "Default A.gif",
  "A-OS, it is it.gif",
  "A-OS 1.0 (A-OS Flower).gif",
  "Aqua A (Default).png",
  "Aqua A (Remix).png",
  "Aqua A (No A).png",
  "Dark Blue.png",
  "Light Blue.png",
  "Blackish Blue.png",
  "Orange Shapes.png",
  "Flowers.png",
  "Leafs.png",
  "Sun.png",
  "Rain.png",
  "Sunny Day.png",
  "Rainy Day.png",
  "Portugual.png",
  "Scotland.png",
];

export const originalTones = [
  { name: "Aurora", detail: "Warm rising glass chords", notes: [392, 523, 659, 784], wave: "sine" as OscillatorType, gap: 0.13 },
  { name: "Blueglass", detail: "Clear double chime", notes: [740, 988, 740, 1175], wave: "triangle" as OscillatorType, gap: 0.12 },
  { name: "Orbit", detail: "Rounded futuristic pulse", notes: [330, 494, 659, 494], wave: "sine" as OscillatorType, gap: 0.16 },
  { name: "Pulsewave", detail: "Bright rhythmic signal", notes: [440, 440, 660, 880], wave: "square" as OscillatorType, gap: 0.11 },
  { name: "Skylight", detail: "Soft spacious bells", notes: [523, 659, 880, 1047], wave: "triangle" as OscillatorType, gap: 0.18 },
] as const;

export const originalToneNames = originalTones.map((tone) => tone.name);

export const fileExtension = (name: string) => {
  const match = name.toLowerCase().match(/\.([^.]+)$/);
  return match?.[1] || "";
};

export const bundledExtensionIcons: Record<string, string> = {
  aos: "aos.png",
  css: "css.png",
  html: "html.png",
  htm: "html.png",
  js: "js.png",
  mjs: "js.png",
  cjs: "js.png",
  zip: "zip.png",
  cmd: "terminalcmd.png",
  bat: "terminalcmd.png",
  sh: "terminalcmd.png",
};

export const bundledNamedIcons: Record<string, string> = {
  company: "Company.png",
  lucky: "Lucky.png",
  money: "Money.png",
  pc: "PC.png",
  safe: "Safe.png",
  star: "STAR.png",
  terminalcmd: "terminalcmd.png",
  unsafe: "UnSafe.png",
};

export const bundledIconForName = (name: string) => {
  const base = name.replace(/\.[^.]+$/, "").toLowerCase();
  return bundledNamedIcons[base] || bundledExtensionIcons[fileExtension(name)];
};

export const defaultFiles: VFile[] = [
  { id: "hello-app", name: "Hello.app", type: "folder", parent: "root", icon: "Unnamed app.png" },
  { id: "hello-app-html", name: "index.html.app", type: "file", parent: "hello-app", mime: "text/html", icon: "html.png", content: `<!doctype html><html><style>body{font-family:system-ui;background:#07152e;color:white;display:grid;place-items:center;height:100vh;margin:0}main{text-align:center}button{padding:12px 18px;border:0;border-radius:12px;background:#52d9e8;color:#000;font-weight:bold;cursor:pointer}</style><main><h1>Hello from A-OS</h1><p>This app runs from a .app folder.</p><button onclick="document.querySelector('p').textContent='It works!'">Try it</button></main></html>` },
  { id: "documents", name: "Documents", type: "folder", parent: "root", icon: "Files.png" },
  { id: "downloads", name: "Downloads", type: "folder", parent: "root", icon: "Downloads.png" },
  { id: "welcome", name: "welcome.txt", type: "file", parent: "documents", content: "Welcome to A-OS v1.2.1.\n\nCreate, rename, edit, upload and delete files from the Files app.", icon: "Text Editor.png", mime: "text/plain" },
  { id: "hello", name: "hello.py", type: "file", parent: "documents", content: 'print("Hello from A-OS")', icon: "Code.png", mime: "text/x-python" },
  { id: "rom-aos-basic", name: "A-OS Basic.aos", type: "file", parent: "documents", content: "/assets/roms/A-OS-Basic.aos", icon: "aos.png", mime: "application/zip" },
  { id: "rom-bos", name: "bos.aos", type: "file", parent: "documents", content: "/assets/roms/bos.aos", icon: "aos.png", mime: "application/zip" },
  { id: "rom-devterminal", name: "DevTerminalOS.aos", type: "file", parent: "documents", content: "/assets/roms/DevTerminalOS.aos", icon: "aos.png", mime: "application/zip" },
  { id: "rom-nexos", name: "NexOS(WEB).aos", type: "file", parent: "documents", content: "/assets/roms/NexOS-WEB.aos", icon: "aos.png", mime: "application/zip" },
];

export const systemStoreApps = [
  { name: "DevStudio", domain: "devstudio.a-os.local", url: "aos://system/devstudio", category: "Developer", description: "Build, test and publish A-OS apps." },
];
