// SVG Data URI generator for system icons and wallpapers
const svgToDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const iconCache: Record<string, string> = {};

export function getSystemIcon(name: string): string {
  if (!name) return "";
  if (name.startsWith("data:") || name.startsWith("blob:") || name.startsWith("http")) return name;

  const clean = name.replace(/^(\/assets\/icons\/|\/)/, "").trim();
  if (iconCache[clean]) return iconCache[clean];

  let svg = "";
  switch (clean.toLowerCase()) {
    case "os logo.png":
    case "system":
    case "aos":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#46d6e7"/>
            <stop offset="50%" stop-color="#1992df"/>
            <stop offset="100%" stop-color="#0a469a"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#g)"/>
        <path d="M50 18 L76 78 L60 78 L53 60 L47 60 L40 78 L24 78 Z M50 36 L43 51 L57 51 Z" fill="#ffffff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))"/>
      </svg>`;
      break;

    case "internet.png":
    case "browser":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gi" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#3dd5f3"/><stop offset="100%" stop-color="#0e67d2"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gi)"/>
        <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" stroke-width="4"/>
        <ellipse cx="50" cy="50" rx="14" ry="30" fill="none" stroke="#fff" stroke-width="3.5"/>
        <line x1="20" y1="50" x2="80" y2="50" stroke="#fff" stroke-width="3.5"/>
        <line x1="26" y1="35" x2="74" y2="35" stroke="#fff" stroke-width="3"/>
        <line x1="26" y1="65" x2="74" y2="65" stroke="#fff" stroke-width="3"/>
      </svg>`;
      break;

    case "files.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gf" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffd56b"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gf)"/>
        <path d="M22 34 L38 34 L46 42 L78 42 C82 42 85 45 85 49 L85 74 C85 78 82 81 78 81 L22 81 C18 81 15 78 15 74 L15 41 C15 37 18 34 22 34 Z" fill="#ffffff" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.18))"/>
        <path d="M15 48 L85 48 L85 74 C85 78 82 81 78 81 L22 81 C18 81 15 78 15 74 Z" fill="#fef3c7" opacity="0.9"/>
      </svg>`;
      break;

    case "downloads.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gd" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#059669"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gd)"/>
        <path d="M50 22 L50 60 M34 44 L50 60 L66 44" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M25 68 L25 78 L75 78 L75 68" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
      break;

    case "code.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gc" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gc)"/>
        <path d="M38 35 L22 50 L38 65 M62 35 L78 50 L62 65 M54 28 L46 72" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
      break;

    case "text editor.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gt" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#6d28d9"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gt)"/>
        <rect x="25" y="20" width="50" height="60" rx="6" fill="#fff"/>
        <line x1="33" y1="32" x2="67" y2="32" stroke="#6d28d9" stroke-width="4" stroke-linecap="round"/>
        <line x1="33" y1="44" x2="67" y2="44" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"/>
        <line x1="33" y1="54" x2="67" y2="54" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"/>
        <line x1="33" y1="64" x2="52" y2="64" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"/>
      </svg>`;
      break;

    case "settings.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gs" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#475569"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gs)"/>
        <circle cx="50" cy="50" r="14" fill="none" stroke="#fff" stroke-width="7"/>
        <path d="M50 18 L50 26 M50 74 L50 82 M18 50 L26 50 M74 50 L82 50 M27 27 L33 33 M67 67 L73 73 M27 73 L33 67 M67 33 L73 27" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      </svg>`;
      break;

    case "terminal.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="22" fill="#0f172a"/>
        <path d="M25 35 L45 50 L25 65" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="52" y1="65" x2="75" y2="65" stroke="#4ade80" stroke-width="6" stroke-linecap="round"/>
      </svg>`;
      break;

    case "this pc.png":
    case "pc.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gpc" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gpc)"/>
        <rect x="20" y="22" width="60" height="42" rx="4" fill="#fff"/>
        <rect x="24" y="26" width="52" height="34" rx="2" fill="#0f172a"/>
        <path d="M44 64 L38 78 L62 78 L56 64 Z" fill="#e2e8f0"/>
      </svg>`;
      break;

    case "clock.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gck" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gck)"/>
        <circle cx="50" cy="50" r="30" fill="#fff"/>
        <circle cx="50" cy="50" r="2.5" fill="#0369a1"/>
        <line x1="50" y1="50" x2="50" y2="30" stroke="#0369a1" stroke-width="4" stroke-linecap="round"/>
        <line x1="50" y1="50" x2="66" y2="50" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
      </svg>`;
      break;

    case "calculator.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gcal" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#ea580c"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gcal)"/>
        <rect x="24" y="20" width="52" height="60" rx="8" fill="#fff"/>
        <rect x="30" y="26" width="40" height="15" rx="3" fill="#1e293b"/>
        <circle cx="37" cy="52" r="3.5" fill="#ea580c"/>
        <circle cx="50" cy="52" r="3.5" fill="#ea580c"/>
        <circle cx="63" cy="52" r="3.5" fill="#ea580c"/>
        <circle cx="37" cy="65" r="3.5" fill="#ea580c"/>
        <circle cx="50" cy="65" r="3.5" fill="#ea580c"/>
        <circle cx="63" cy="65" r="3.5" fill="#ea580c"/>
      </svg>`;
      break;

    case "weather.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gw" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gw)"/>
        <circle cx="42" cy="42" r="16" fill="#facc15"/>
        <path d="M35 68 L68 68 C75 68 80 63 80 57 C80 51 75 46 69 46 C68 40 62 35 55 35 C48 35 43 39 41 45 C34 45 28 50 28 57 C28 63 31 68 35 68 Z" fill="#ffffff" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))"/>
      </svg>`;
      break;

    case "camera.png":
    case "image.png":
    case "images.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gcm" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#be123c"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gcm)"/>
        <path d="M22 36 L34 36 L38 28 L62 28 L66 36 L78 36 C82 36 85 39 85 43 L85 72 C85 76 82 79 78 79 L22 79 C18 79 15 76 15 72 L15 43 C15 39 18 36 22 36 Z" fill="#ffffff"/>
        <circle cx="50" cy="57" r="14" fill="#be123c"/>
        <circle cx="50" cy="57" r="6" fill="#ffffff"/>
      </svg>`;
      break;

    case "record.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="grec" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#991b1b"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#grec)"/>
        <circle cx="50" cy="50" r="22" fill="#fff"/>
        <circle cx="50" cy="50" r="14" fill="#ef4444"/>
      </svg>`;
      break;

    case "trash.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gtr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#334155"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gtr)"/>
        <path d="M30 35 L70 35 L65 78 C65 80 63 82 61 82 L39 82 C37 82 35 80 35 78 Z" fill="#fff"/>
        <rect x="25" y="26" width="50" height="6" rx="3" fill="#fff"/>
        <rect x="42" y="19" width="16" height="7" rx="3" fill="#fff"/>
      </svg>`;
      break;

    case "security shield.png":
    case "security shield assistant.png":
    case "safe.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gsec" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#047857"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gsec)"/>
        <path d="M50 20 L76 30 C76 56 64 72 50 80 C36 72 24 56 24 30 Z" fill="#ffffff"/>
        <path d="M43 48 L48 53 L59 40" fill="none" stroke="#047857" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
      break;

    case "media files.png":
    case "music.png":
    case "video.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gmf" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#be185d"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gmf)"/>
        <polygon points="40,30 72,50 40,70" fill="#ffffff"/>
      </svg>`;
      break;

    case "notes.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gnt" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gnt)"/>
        <rect x="25" y="20" width="50" height="60" rx="6" fill="#fff"/>
        <line x1="34" y1="35" x2="66" y2="35" stroke="#d97706" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="34" y1="48" x2="66" y2="48" stroke="#d97706" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="34" y1="61" x2="55" y2="61" stroke="#d97706" stroke-width="3.5" stroke-linecap="round"/>
      </svg>`;
      break;

    case "draw.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gdr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#6b21a8"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gdr)"/>
        <path d="M28 72 L62 38 L68 44 L34 78 Z M64 36 L70 30 L76 36 L70 42 Z" fill="#ffffff"/>
        <circle cx="28" cy="72" r="3" fill="#6b21a8"/>
      </svg>`;
      break;

    case "bug.png":
    case "bugged.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gbg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#b91c1c"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gbg)"/>
        <ellipse cx="50" cy="56" rx="18" ry="22" fill="#fff"/>
        <circle cx="50" cy="32" r="10" fill="#fff"/>
        <line x1="22" y1="46" x2="36" y2="52" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
        <line x1="78" y1="46" x2="64" y2="52" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
        <line x1="20" y1="64" x2="35" y2="60" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
        <line x1="80" y1="64" x2="65" y2="60" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      </svg>`;
      break;

    case "zip.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gzip" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ca8a04"/><stop offset="100%" stop-color="#854d0e"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gzip)"/>
        <rect x="22" y="24" width="56" height="56" rx="8" fill="#fff"/>
        <rect x="44" y="24" width="12" height="34" fill="#ca8a04"/>
        <rect x="47" y="58" width="6" height="12" rx="3" fill="#854d0e"/>
      </svg>`;
      break;

    case "reboot.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="grb" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#grb)"/>
        <path d="M50 24 A26 26 0 1 1 26 50 M26 30 L26 50 L46 50" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
      break;

    case "shutdown.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gsd" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#9f1239"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gsd)"/>
        <path d="M34 32 A24 24 0 1 0 66 32" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
        <line x1="50" y1="20" x2="50" y2="46" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      </svg>`;
      break;

    case "success.png":
    case "tick.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gsuc" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#15803d"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gsuc)"/>
        <path d="M30 52 L44 66 L72 36" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
      break;

    case "cross.png":
    case "error.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gerr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#991b1b"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gerr)"/>
        <line x1="32" y1="32" x2="68" y2="68" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
        <line x1="68" y1="32" x2="32" y2="68" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
      </svg>`;
      break;

    case "arrow left.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#1e293b"/><path d="M58 30 L38 50 L58 70" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      break;

    case "arrow right.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#1e293b"/><path d="M42 30 L62 50 L42 70" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      break;

    case "arrow up.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#1e293b"/><path d="M30 58 L50 38 L70 58" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      break;

    case "profile.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="gpr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#1e40af"/></linearGradient></defs>
        <rect width="100" height="100" rx="22" fill="url(#gpr)"/>
        <circle cx="50" cy="38" r="16" fill="#fff"/>
        <path d="M24 82 C24 64 36 58 50 58 C64 58 76 64 76 82 Z" fill="#fff"/>
      </svg>`;
      break;

    case "38.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="g38" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient></defs>
        <circle cx="50" cy="50" r="46" fill="url(#g38)"/>
        <circle cx="50" cy="50" r="14" fill="#ffffff"/>
        <circle cx="50" cy="50" r="7" fill="#0284c7"/>
      </svg>`;
      break;

    case "less.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#64748b"/><line x1="30" y1="50" x2="70" y2="50" stroke="#fff" stroke-width="8" stroke-linecap="round"/></svg>`;
      break;

    case "more.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#64748b"/><line x1="30" y1="50" x2="70" y2="50" stroke="#fff" stroke-width="8" stroke-linecap="round"/><line x1="50" y1="30" x2="50" y2="70" stroke="#fff" stroke-width="8" stroke-linecap="round"/></svg>`;
      break;

    case "company.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="gco" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#4338ca"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(#gco)"/><rect x="25" y="30" width="50" height="52" rx="4" fill="#fff"/><rect x="33" y="38" width="8" height="8" fill="#4338ca"/><rect x="46" y="38" width="8" height="8" fill="#4338ca"/><rect x="59" y="38" width="8" height="8" fill="#4338ca"/><rect x="33" y="52" width="8" height="8" fill="#4338ca"/><rect x="46" y="52" width="8" height="8" fill="#4338ca"/><rect x="59" y="52" width="8" height="8" fill="#4338ca"/><rect x="44" y="66" width="12" height="16" fill="#4338ca"/></svg>`;
      break;

    case "lucky.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="glk" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#047857"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(#glk)"/><circle cx="38" cy="38" r="14" fill="#fff"/><circle cx="62" cy="38" r="14" fill="#fff"/><circle cx="38" cy="62" r="14" fill="#fff"/><circle cx="62" cy="62" r="14" fill="#fff"/><path d="M50 50 Q50 78 40 84" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
      break;

    case "money.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="gmn" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#065f46"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(#gmn)"/><rect x="20" y="30" width="60" height="40" rx="6" fill="#fff"/><circle cx="50" cy="50" r="10" fill="#10b981"/></svg>`;
      break;

    case "star.png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="gst" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#b45309"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(#gst)"/><polygon points="50,18 59,38 81,39 64,53 70,75 50,62 30,75 36,53 19,39 41,38" fill="#fff"/></svg>`;
      break;

    case "cloud.png":
    case "ai services (hidden app).png":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="gcld" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(#gcld)"/><path d="M32 68 L68 68 C76 68 82 62 82 55 C82 48 76 43 69 43 C67 36 60 30 52 30 C44 30 38 35 36 41 C28 42 22 48 22 55 C22 62 26 68 32 68 Z" fill="#ffffff"/></svg>`;
      break;

    default:
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="gun" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(#gun)"/><text x="50" y="62" font-size="34" font-weight="900" font-family="system-ui, sans-serif" fill="#fff" text-anchor="middle">${clean.slice(0, 2).toUpperCase() || "A"}</text></svg>`;
      break;
  }

  const result = svgToDataUri(svg);
  iconCache[clean] = result;
  return result;
}

export function getSystemWallpaper(name: string): string {
  if (!name || name === "Default A.gif" || name === "Default A" || name === "Aqua A (Default).png") {
    return "https://uploads.onecompiler.io/44b3qq4ay/1787343717297/Default%20A.gif";
  }
  if (name.startsWith("http://") || name.startsWith("https://") || name.startsWith("data:")) {
    return name;
  }
  const clean = name.replace(/^(\/assets\/backgrounds\/|\/)/, "").trim().toLowerCase();
  
  if (clean.includes("a-os, it is it") || clean.includes("it is it")) {
    return "https://uploads.onecompiler.io/44b3qq4ay/1787343722165/A-OS,%20it%20is%20it.gif";
  }
  if (clean.includes("flower") || clean.includes("a-os 1.0")) {
    return "https://archive.org/download/a-os-1.0-a-os-flower/A-OS%201.0%20%28A-OS%20Flower%29.gif";
  }
  if (clean.includes("default a")) {
    return "https://uploads.onecompiler.io/44b3qq4ay/1787343717297/Default%20A.gif";
  }

  switch (clean) {
    case "dark blue.png":
      return svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><radialGradient id="wdb" cx="50%" cy="40%" r="70%"><stop offset="0%" stop-color="#132b4f"/><stop offset="60%" stop-color="#091322"/><stop offset="100%" stop-color="#03060a"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#wdb)"/></svg>`);
    case "light blue.png":
      return svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="wlb" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#dff3ff"/><stop offset="50%" stop-color="#9bd7fa"/><stop offset="100%" stop-color="#56b4f7"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#wlb)"/></svg>`);
    case "blackish blue.png":
      return svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><radialGradient id="wbb" cx="30%" cy="30%" r="80%"><stop offset="0%" stop-color="#141f2e"/><stop offset="100%" stop-color="#04070c"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#wbb)"/></svg>`);
    case "orange shapes.png":
      return svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="wos" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fdba74"/><stop offset="50%" stop-color="#f97316"/><stop offset="100%" stop-color="#c2410c"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#wos)"/><circle cx="400" cy="300" r="320" fill="#ffffff18"/><circle cx="1500" cy="800" r="450" fill="#ffffff12"/></svg>`);
    case "flowers.png":
      return svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="wfl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fbcfe8"/><stop offset="50%" stop-color="#f472b6"/><stop offset="100%" stop-color="#db2777"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#wfl)"/><circle cx="300" cy="400" r="160" fill="#ffffff22"/><circle cx="1600" cy="500" r="220" fill="#ffffff18"/></svg>`);
    case "leafs.png":
      return svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="wlf" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#86efac"/><stop offset="50%" stop-color="#22c55e"/><stop offset="100%" stop-color="#15803d"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#wlf)"/><ellipse cx="800" cy="500" rx="350" ry="200" fill="#ffffff18" transform="rotate(-30 800 500)"/></svg>`);
    case "sun.png":
    case "sunny day.png":
      return svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="wsun" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="60%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#fbbf24"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#wsun)"/><circle cx="1500" cy="280" r="180" fill="#fef08a" filter="drop-shadow(0 0 80px #fde047)"/></svg>`);
    case "rain.png":
    case "rainy day.png":
      return svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="wrn" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#475569"/><stop offset="50%" stop-color="#334155"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#wrn)"/><line x1="200" y1="100" x2="160" y2="280" stroke="#94a3b833" stroke-width="4"/><line x1="600" y1="300" x2="560" y2="480" stroke="#94a3b833" stroke-width="4"/><line x1="1200" y1="200" x2="1160" y2="380" stroke="#94a3b833" stroke-width="4"/><line x1="1600" y1="500" x2="1560" y2="680" stroke="#94a3b833" stroke-width="4"/></svg>`);
    case "aqua a (remix).png":
    case "aqua a (no a).png":
      return svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><radialGradient id="waq" cx="60%" cy="35%" r="75%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="35%" stop-color="#0284c7"/><stop offset="70%" stop-color="#033d73"/><stop offset="100%" stop-color="#041830"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#waq)"/><circle cx="1200" cy="400" r="350" fill="#67e8f9" opacity="0.25" filter="blur(60px)"/><circle cx="600" cy="700" r="420" fill="#3b82f6" opacity="0.25" filter="blur(70px)"/></svg>`);
    default:
      return "https://uploads.onecompiler.io/44b3qq4ay/1787343717297/Default%20A.gif";
  }
}
