import { FormEvent, useEffect, useRef, useState } from "react";
import { ProfileRecord, ScreenshotDraft, VFile } from "../types";
import { getSystemIcon, getSystemWallpaper } from "../icon-assets";
import { catalog, terminalEmojiPack, aos3dEmojiPack, taskbarApps } from "../constants";
import { AApplicationsAuthForm } from "./Auth";
import { AApplicationsSession } from "../a-applications";

export function SourceChooser({ title, detail, close, local, drive }: any) {
  return (
    <div className="source-chooser-backdrop" role="presentation">
      <section className="source-chooser" role="dialog" aria-modal="true" aria-label={title}>
        <button className="source-close" onClick={close} aria-label="Close">
          <img src={getSystemIcon("Cross.png")} alt="" />
        </button>
        <small>SELECT A SOURCE</small>
        <h2>{title}</h2>
        <p>{detail}</p>
        <div>
          <button onClick={local}>
            <img src={getSystemIcon("This PC.png")} alt="" />
            <span>
              <b>A-OS Local Cloud</b>
              <small>Choose a file stored on this device</small>
            </span>
            <img src={getSystemIcon("Arrow Right.png")} alt="" />
          </button>
          <button onClick={drive}>
            <img src="https://www.google.com/s2/favicons?domain=drive.google.com&sz=128" alt="" />
            <span>
              <b>Google Drive</b>
              <small>Open Drive in a focused A-OS window</small>
            </span>
            <img src={getSystemIcon("Arrow Right.png")} alt="" />
          </button>
        </div>
      </section>
    </div>
  );
}

export function ContextMenu({
  x,
  y,
  upload,
  createFolder,
  createFile,
  wallpaper,
  lock,
  iconPack,
  close,
}: any) {
  const actions = [
    ["Upload File", "Arrow Up.png", upload],
    ["Create Folder", "Files.png", createFolder],
    ["Create File", "Text Editor.png", createFile],
    ["Change Wallpaper", "Image.png", wallpaper],
    ["Lock", "Security Shield.png", lock],
    ["Upload Icon Pack", "Unnamed app.png", iconPack],
  ];
  return (
    <div
      className="desktop-context-menu"
      style={{ left: Math.max(10, x), top: Math.max(10, y) }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
      role="menu"
    >
      <header>
        <span>DESKTOP ACTIONS</span>
        <button onClick={close} aria-label="Close menu">
          <img src={getSystemIcon("Cross.png")} alt="" />
        </button>
      </header>
      {actions.map(([label, image, action]: any, index) => (
        <button
          className={index === 4 ? "menu-separator" : ""}
          onClick={() => {
            close();
            action();
          }}
          role="menuitem"
          key={label}
        >
          <span>
            <img src={getSystemIcon(image)} alt="" />
          </span>
          <b>{label}</b>
          <small>{index + 1}</small>
        </button>
      ))}
      <footer>Icon Packs use an IconPack folder with images named by extension.</footer>
    </div>
  );
}

export function ItemContextMenu({
  x,
  y,
  openItem,
  remove,
  rename,
  pin,
  changeIcon,
}: any) {
  return (
    <div className="item-context-menu" style={{ left: x, top: y }} onContextMenu={(e) => e.preventDefault()}>
      {[
        ["Open", openItem],
        ["Rename", rename],
        ["Pin to taskbar", pin],
        ["Change icon", changeIcon],
        ["Delete", remove],
      ].map(([label, action]: any) => (
        <button className={label === "Delete" ? "danger" : ""} onClick={action} key={label}>
          {label}
          <span>{label === "Open" ? "↗" : label === "Delete" ? "×" : "›"}</span>
        </button>
      ))}
    </div>
  );
}

export function EmojiPicker({ x, y, target, close }: any) {
  const [items, setItems] = useState<any[]>(aos3dEmojiPack);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/gh/aapps2025a-hue/emojis-symbols-online/emojis-symbols-online.json")
      .then((r) => r.json())
      .then((data) => {
        const flat: any[] = [];
        const walk = (value: any, name = "") => {
          if (Array.isArray(value)) value.forEach((v) => walk(v, name));
          else if (value && typeof value === "object") {
            const symbol = value.emoji || value.symbol || value.character || value.char || value.value;
            const image = value.image || value.url || value.src;
            if (symbol || image) flat.push({ symbol, image, name: value.name || value.label || name });
            else Object.entries(value).forEach(([k, v]) => walk(v, k));
          } else if (typeof value === "string" && value.length < 12) flat.push({ symbol: value, name });
        };
        walk(data);
        setItems([...aos3dEmojiPack, ...flat.slice(0, 1800)]);
      })
      .catch(() =>
        setItems([...aos3dEmojiPack, ...Object.entries(terminalEmojiPack).map(([name, v]) => ({ symbol: v.symbol, name }))])
      );
  }, []);

  const shown = items.filter((item) => (item.name || "").toLowerCase().includes(query.toLowerCase())).slice(0, 240);

  const insert = (item: any) => {
    const value = item.symbol || "";
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      const start = target.selectionStart ?? target.value.length;
      const end = target.selectionEnd ?? start;
      target.setRangeText(value, start, end, "end");
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.focus();
    } else if (target?.isContentEditable) {
      document.execCommand("insertText", false, value);
      target.focus();
    } else navigator.clipboard?.writeText(value);
    close();
  };

  return (
    <section className="emoji-picker" style={{ left: x, top: y }} data-no-translate>
      <header>
        <b>A-OS 3D Emojis & Symbols</b>
        <button onClick={close}>×</button>
      </header>
      <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search emojis and symbols" />
      <div>
        {shown.length ? (
          shown.map((item, index) => (
            <button
              className={item.pack ? "aos-3d-emoji" : ""}
              onClick={() => insert(item)}
              title={item.name || "symbol"}
              key={`${item.name}-${index}`}
            >
              {item.image ? <img src={item.image} alt={item.name || ""} /> : <span>{item.symbol}</span>}
            </button>
          ))
        ) : (
          <p>No emoji matches that search.</p>
        )}
      </div>
      <footer>Original A-OS 3D pack · {target ? "click to insert" : "click to copy"} · Shift + .</footer>
    </section>
  );
}

export function WebWindowPanel({ url, title, close }: any) {
  return (
    <aside className="web-window-panel" aria-label={`Web Window · ${title}`}>
      <button onClick={close} aria-label="Close Web Window">
        ×
      </button>
      <iframe
        src={`https://scramjet.mercurywork.shop/?goto=${encodeURIComponent(url)}`}
        title={`Web Window · ${title}`}
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals allow-presentation allow-top-navigation-by-user-activation"
        allow="clipboard-read; clipboard-write; fullscreen; autoplay; encrypted-media; picture-in-picture; web-share"
        referrerPolicy="no-referrer"
      />
    </aside>
  );
}

export function ScreenshotSelector({
  draft,
  cancel,
  save,
}: {
  draft: ScreenshotDraft;
  cancel: () => void;
  save: (image: string) => void;
}) {
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [end, setEnd] = useState<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const box =
    start && end
      ? {
          left: Math.min(start.x, end.x),
          top: Math.min(start.y, end.y),
          width: Math.abs(end.x - start.x),
          height: Math.abs(end.y - start.y),
        }
      : null;

  const finish = () => {
    if (!box || box.width < 8 || box.height < 8 || !imageRef.current) return;
    const bounds = imageRef.current.getBoundingClientRect();
    const scaleX = draft.width / bounds.width;
    const scaleY = draft.height / bounds.height;
    const sx = Math.max(0, (box.left - bounds.left) * scaleX);
    const sy = Math.max(0, (box.top - bounds.top) * scaleY);
    const sw = Math.min(draft.width - sx, box.width * scaleX);
    const sh = Math.min(draft.height - sy, box.height * scaleY);
    const source = document.createElement("canvas");
    const output = document.createElement("canvas");
    const image = new Image();

    image.onload = () => {
      source.width = draft.width;
      source.height = draft.height;
      source.getContext("2d")?.drawImage(image, 0, 0);
      output.width = Math.max(1, Math.round(sw));
      output.height = Math.max(1, Math.round(sh));
      output.getContext("2d")?.drawImage(source, sx, sy, sw, sh, 0, 0, output.width, output.height);
      save(output.toDataURL("image/png"));
    };
    image.src = draft.image;
  };

  return (
    <div
      className="screenshot-selector"
      role="dialog"
      aria-label="Select screenshot area"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        setStart({ x: e.clientX, y: e.clientY });
        setEnd({ x: e.clientX, y: e.clientY });
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (start) setEnd({ x: e.clientX, y: e.clientY });
      }}
      onPointerUp={(e) => {
        if (start) {
          setEnd({ x: e.clientX, y: e.clientY });
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      }}
    >
      <img ref={imageRef} src={draft.image} alt="Screen ready to capture" draggable={false} />
      <div className="screenshot-shade" />
      {box && (
        <div className="screenshot-selection" style={box}>
          <span>
            {Math.round(box.width)} × {Math.round(box.height)}
          </span>
        </div>
      )}
      <header>
        <b>Area screenshot</b>
        <span>Drag the crosshair around the area you want to save</span>
      </header>
      <footer>
        <button onClick={cancel}>Cancel</button>
        <button className="primary" disabled={!box || box.width < 8 || box.height < 8} onClick={finish}>
          Save screenshot
        </button>
      </footer>
    </div>
  );
}

export function Launcher({
  open,
  installed,
  launch,
  close,
  apps,
  disabledApps = [],
  appOverrides = {},
  iconPackName = "Default",
}: any) {
  const system = [
    ["OSInternet", "Internet.png", "weba"],
    ["Files", "Files.png", "files"],
    ["File Assist", "Code.png", "vscode"],
    ["Code Viewer", "Text Editor.png", "codeviewer"],
    ["Paint", "Draw.png", "paint"],
    ["Minesweeper", "Bug.png", "minesweeper"],
    ["Settings", "Settings.png", "settings"],
    ["A-Store", "Downloads.png", "store"],
    ["Versions", "Terminal.png", "versions"],
    ["Notes", "Notes.png", "notes"],
    ["Security", "Security Shield.png", "security"],
    ["Terminal", "Terminal.png", "terminalapp"],
    ["Storages", "This PC.png", "storage"],
    ...taskbarApps
      .filter(
        (item) =>
          ![
            "weba", "files", "vscode", "codeviewer", "settings", "store",
            "terminalapp", "storage", "devstudio", "mediaview", "devicesource",
          ].includes(item.id)
      )
      .map((item) => [item.name, item.file, item.id]),
    ["MediaView", "Media Files.png", "mediaview"],
    ["DeviceSource", "Code.png", "devicesource"],
  ];

  return (
    <section className="launcher">
      <header>
        <span className="search-symbol" />
        <input autoFocus placeholder="Search apps" />
        <button onClick={close}>
          <img src={getSystemIcon("Cross.png")} alt="Close" />
        </button>
      </header>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px 4px", gap: "6px" }}>
        <h3 style={{ margin: 0, fontSize: "12px" }}>System apps</h3>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("aos-open-widget-manager"));
              close();
            }}
            className="edit-widgets-btn"
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              padding: "4px 10px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, rgba(37, 99, 235, 0.4), rgba(6, 182, 212, 0.4))",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.5)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
            title="Open Desktop Widget Hub (Add up to 100 widgets)"
          >
            ✨ + Add Widgets
          </button>
        </div>
      </div>
      <div>
        {system
          .filter((x) => !disabledApps.includes(x[2]))
          .map((x) => (
            <button
              draggable
              onDragStart={(e) => e.dataTransfer.setData("application/aos-app", String(x[2]))}
              onClick={() => open(x[2])}
              key={x[0]}
            >
              <span data-symbol={String(appOverrides[x[2]]?.name || x[0]).slice(0, 2).toUpperCase()}>
                <img
                  src={
                    iconPackName === "Custom" && appOverrides[x[2]]?.icon?.startsWith("data:")
                      ? appOverrides[x[2]].icon
                      : getSystemIcon(iconPackName === "Custom" ? appOverrides[x[2]]?.icon || x[1] : x[1])
                  }
                  alt=""
                />
              </span>
              {appOverrides[x[2]]?.name || x[0]}
            </button>
          ))}
      </div>
      {installed.length > 1 && (
        <>
          <h3>Installed from A-Store</h3>
          <div>
            {installed
              .filter((x: string) => x !== "WebA")
              .map((name: string) => {
                const a = (apps || catalog).find((x: any) => x.name === name);
                return (
                  <button onClick={() => launch(a)} key={name}>
                    <span>
                      <img
                        src={
                          a?.devCode
                            ? getSystemIcon("Code.png")
                            : a
                            ? `https://www.google.com/s2/favicons?domain=${a.domain}&sz=128`
                            : getSystemIcon("Unnamed app.png")
                        }
                        alt=""
                      />
                    </span>
                    {name}
                  </button>
                );
              })}
          </div>
        </>
      )}
    </section>
  );
}

export function Quick({
  time,
  network,
  profile,
  profilePopup,
  lock,
  restart,
  shutdown,
  settings,
}: any) {
  return (
    <section className="quick">
      <header>
        <button className="quick-profile" onClick={profilePopup}>
          <img src={getSystemIcon("Profile.png")} alt="Profile" />
        </button>
        <div>
          <b>{profile}</b>
          <span>{network}</span>
        </div>
        <button onClick={settings}>
          <img src={getSystemIcon("Settings.png")} alt="Settings" />
        </button>
        <button onClick={lock}>
          <img src={getSystemIcon("Security Shield.png")} alt="Lock" />
        </button>
        <button onClick={restart}>
          <img src={getSystemIcon("Reboot.png")} alt="Restart" />
        </button>
        <button onClick={shutdown}>
          <img src={getSystemIcon("Shutdown.png")} alt="Shut down" />
        </button>
      </header>
      <div className="quick-tiles">
        <button className="on">
          <span className="wifi-icon" />
          <b>Wi-Fi</b>
          <small>{network}</small>
        </button>
        <button className="on">
          <span className="bluetooth">B</span>
          <b>Bluetooth</b>
          <small>On</small>
        </button>
      </div>
      <label className="slider">
        <img src={getSystemIcon("Less.png")} alt="Volume" />
        <input type="range" defaultValue="65" />
        <img src={getSystemIcon("More.png")} alt="" />
      </label>
      <footer>
        <span>{time}</span>
        <span>A-OS v1.2.1 · ATMOpenSource</span>
      </footer>
    </section>
  );
}

export function ShelfIcon({ name, file, onClick, state = "closed" }: any) {
  const src = file?.startsWith("data:") || file?.startsWith("/") ? file : getSystemIcon(file);
  return (
    <button
      className={`shelf-icon state-${state}`}
      data-symbol={String(name).slice(0, 2).toUpperCase()}
      onClick={onClick}
      aria-label={name}
    >
      <img src={src} alt="" />
      {state !== "closed" && <span />}
    </button>
  );
}

export function Popup({
  type,
  close,
  profile,
  email,
  saveProfile,
  pending,
  connect,
  openBios,
  profiles = [],
  switchProfile,
  createProfile,
  currentRole = "standard",
  onAApplicationsSignedIn,
}: any) {
  const [name, setName] = useState(profile || "Person");
  const [mail, setMail] = useState(email || "");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [making, setMaking] = useState(false);
  const [linkAApplications, setLinkAApplications] = useState(true);
  const [linkedAApplications, setLinkedAApplications] = useState<AApplicationsSession | null>(null);

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="aos-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={
          type === "profile"
            ? "Add or change profile"
            : type === "forgot"
            ? "Reset A-OS password"
            : "Connect account"
        }
      >
        <button className="dialog-close" onClick={close} aria-label="Close dialog">
          <img src={getSystemIcon("Cross.png")} alt="" />
        </button>
        {type === "profile" ? (
          <>
            <img className="dialog-icon" src={getSystemIcon("Profile.png")} alt="" />
            <h2>Profiles</h2>
            <div className="profile-groups">
              <b>CURRENT USER</b>
              <button className="profile-chip active">
                {profile} · {currentRole === "administrator" ? "Administrator" : "User"}
              </button>
              <b>OTHER USERS</b>
              <div>
                {profiles
                  .filter((item: ProfileRecord) => item.name !== profile)
                  .map((item: ProfileRecord) => (
                    <button className="profile-chip" onClick={() => switchProfile(item)} key={item.name}>
                      {item.name} · {item.role === "administrator" ? "Admin" : "User"}
                    </button>
                  ))}
                {createProfile && (
                  <button
                    className="profile-chip make-user"
                    onClick={() => {
                      setMaking(true);
                      setName("");
                      setMail("");
                    }}
                  >
                    Make User +
                  </button>
                )}
              </div>
            </div>
            {making && (
              <div className="new-profile-fields">
                <label>
                  Profile name
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Person" />
                </label>
                <label>
                  Recovery email (optional)
                  <input value={mail} onChange={(e) => setMail(e.target.value)} placeholder="name@example.com" />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 4 characters"
                  />
                </label>
                <label>
                  Confirm password
                  <input
                    type="password"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    placeholder="Type it again"
                  />
                </label>
                {newPasswordConfirm && newPassword !== newPasswordConfirm && (
                  <small className="profile-password-error">Passwords do not match.</small>
                )}
                <section className={`profile-a-applications${linkAApplications ? " selected" : ""}`}>
                  <button onClick={() => setLinkAApplications((val) => !val)}>
                    <span className="a-applications-mark">A</span>
                    <span>
                      <small>RECOMMENDED</small>
                      <b>Sign in with A-Applications</b>
                      <em>Unlock this profile with the account password and choose cloud sync later.</em>
                    </span>
                    <i />
                  </button>
                  {linkAApplications && (
                    <AApplicationsAuthForm
                      embedded
                      onSuccess={(session) => {
                        setLinkedAApplications(session);
                        onAApplicationsSignedIn?.(session);
                      }}
                    />
                  )}
                </section>
              </div>
            )}
            <footer>
              <button onClick={close}>Cancel</button>
              <button
                className="primary"
                disabled={
                  making &&
                  (newPassword.length < 4 ||
                    newPassword !== newPasswordConfirm ||
                    (linkAApplications && !linkedAApplications))
                }
                onClick={() =>
                  making
                    ? createProfile({
                        name: name || "Person",
                        email: mail,
                        password: newPassword,
                        ...(linkAApplications && linkedAApplications
                          ? { aApplicationsEmail: linkedAApplications.email }
                          : {}),
                      })
                    : saveProfile(name, mail)
                }
              >
                {making ? "Create profile" : "Save profile"}
              </button>
            </footer>
          </>
        ) : type === "forgot" ? (
          <>
            <img className="dialog-icon" src={getSystemIcon("Security Shield Assistant.png")} alt="" />
            <h2>Reset your device password</h2>
            <p>
              A-OS passwords are stored only on this device. Try your linked A-Applications password, or switch profiles.
              Factory reset is available only after the current device administrator verifies their password.
            </p>
            <div className="dialog-warning">
              <img src={getSystemIcon("Error.png")} alt="" />
              <span>
                {currentRole === "administrator"
                  ? "Firmware Recovery still requires this administrator’s current local A-OS password. A-Applications credentials stay separate."
                  : "This is a standard profile. Switch to the administrator profile before using Factory Reset."}
              </span>
            </div>
            <footer>
              <button onClick={close}>Go back</button>
              <button className="danger-action" onClick={openBios}>
                Open BIOS recovery
              </button>
            </footer>
          </>
        ) : (
          <>
            <img
              className="dialog-icon"
              src={`https://www.google.com/s2/favicons?domain=${(pending?.provider || "google").toLowerCase()}.com&sz=128`}
              alt=""
            />
            <h2>
              Add {pending?.provider} for {pending?.name}
            </h2>
            <p>
              This app uses a {pending?.provider} account. A-OS will connect it only for apps that request it—not for your
              device login.
            </p>
            <div className="account-permissions">
              <b>{pending?.name} can request</b>
              <span>Basic account identity</span>
              <span>Sign-in session inside its web view</span>
            </div>
            <footer>
              <button onClick={close}>Not now</button>
              <button className="primary" onClick={connect}>
                Add account and open
              </button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}

export function LegacyTerminal({
  title,
  lines,
  value,
  setValue,
  submit,
  fastboot = false,
}: any) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [lines]);
  return (
    <main className={`legacy-terminal${fastboot ? " fastboot-terminal" : ""}`}>
      <header>
        <b>{title}</b>
        <span>{fastboot ? "A-OS USB BOOT PROTOCOL" : "UEFI SHELL · x86_64"}</span>
      </header>
      {fastboot && <h1>FASTBOOT</h1>}
      <pre>{lines.join("\n")}</pre>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
      >
        <span>{fastboot ? ">" : "aos@firmware:~$"}</span>
        <input
          autoFocus
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit(value);
            }
          }}
          aria-label={`${title} command`}
        />
        <button type="submit">ENTER</button>
      </form>
      <div ref={end} />
    </main>
  );
}
