export type AppId =
  | "store"
  | "files"
  | "settings"
  | "weba"
  | "versions"
  | "notes"
  | "security"
  | "webapp"
  | "vscode"
  | "codeviewer"
  | "paint"
  | "minesweeper"
  | "zipviewer"
  | "terminalapp"
  | "devstudio"
  | "storage"
  | "mediaview"
  | "devicesource"
  | "simulator"
  | "company"
  | "lucky"
  | "money"
  | "star"
  | "safe"
  | "unsafe"
  | "bugged"
  | "dead"
  | "pc"
  | "video"
  | "music"
  | "images"
  | "trash"
  | "clock"
  | "calculator"
  | "weather"
  | "record"
  | "camera"
  | "aiservices"
  | "aosdevice"
  | "system"
  | "systemservices"
  | "languages"
  | "languagecontrol"
  | "fileviewsource"
  | "osegg"
  | "deviceoverpowered"
  | "aapplications"
  | null;

export type WindowState = {
  id: string;
  app: Exclude<AppId, null>;
  webApp?: any;
  z: number;
  minimized?: boolean;
};

export type Language = string;

export type DevApp = {
  name: string;
  domain: string;
  url: string;
  category: string;
  description: string;
  devCode: string;
  createdAt: string;
};

export type ScreenshotDraft = {
  image: string;
  width: number;
  height: number;
};

export type ProfileRecord = {
  name: string;
  email: string;
  role: "administrator" | "standard";
  aApplicationsEmail?: string;
};

export type OverpoweredConfig = {
  taskbarColour: string;
  lockscreenImage: string;
  runningCode: string;
  aiShortcut: string;
  iconPack: string;
  lockMode: string;
};

export type VFile = {
  id: string;
  name: string;
  type: "file" | "folder";
  parent: string;
  content?: string;
  icon?: string;
  mime?: string;
  x?: number;
  y?: number;
};

export type UsbEntry = {
  name: string;
  kind: "file" | "directory";
  handle: any;
};

export type UsbStorage = {
  name: string;
  handle: any;
  entries: UsbEntry[];
};

export type Phase =
  | "boot"
  | "setup"
  | "provision"
  | "login"
  | "desktop"
  | "bios"
  | "terminal"
  | "fastboot"
  | "update"
  | "custom"
  | "off";

export type PopupId = "profile" | "forgot" | "account" | "permission" | "error" | null;
