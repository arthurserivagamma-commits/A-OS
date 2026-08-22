import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import { DevApp, Language, OverpoweredConfig, UsbEntry, VFile } from "../types";
import { getSystemIcon } from "../icon-assets";
import {
  allWalls,
  catalog,
  languages,
  originalTones,
  originalToneNames,
  systemCopy,
  taskbarApps,
  hiddenApps,
  defaultOverpowered,
  bundledIconForName,
  aos3dIconForApp,
} from "../constants";
import { playToneSelection, conciseWikipediaAnswer } from "./AudioEngine";
import { SourceChooser } from "./Dialogs";
import { AVAILABLE_WIDGET_TYPES, findNextSafeSlot, calculateNonOverlappingGrid } from "./DesktopWidgets";

const base64 = (bytes: any) => {
  if (!bytes) return "";
  const u8 =
    bytes instanceof Uint8Array
      ? bytes
      : bytes instanceof ArrayBuffer
      ? new Uint8Array(bytes)
      : ArrayBuffer.isView(bytes)
      ? new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength)
      : typeof bytes === "string"
      ? new TextEncoder().encode(bytes)
      : new Uint8Array(bytes);
  let out = "";
  for (let i = 0; i < u8.length; i += 32768)
    out += String.fromCharCode(...u8.subarray(i, i + 32768));
  return btoa(out);
};

export function Store(p: any) {
  const chat = catalog[0];
  const [showUrl, setShowUrl] = useState(false);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (p.addUrlApp(url, name)) {
      setUrl("");
      setName("");
      setShowUrl(false);
    }
  };

  return (
    <div className="store-modern">
      <header>
        <div>
          <span>A</span>
          <div>
            <h1>A-Store</h1>
            <p>Apps run in focused A-OS windows with WebA Engine</p>
          </div>
        </div>
        <label>
          <span className="search-symbol" />
          <input
            value={p.search}
            onChange={(e: any) => p.setSearch(e.target.value)}
            placeholder="Search apps and websites"
          />
        </label>
        <button className="url-install-trigger" onClick={() => setShowUrl((v) => !v)}>
          Install from URL
        </button>
      </header>
      {showUrl && (
        <form className="url-installer" onSubmit={add}>
          <div>
            <b>Install a website as an A-OS app</b>
            <small>The app opens inside WebA Engine.</small>
          </div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="App name (optional)" />
          <input required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
          <button>Install</button>
        </form>
      )}
      <div className="featured">
        <img src="https://image.thum.io/get/width/720/crop/400/noanimate/https://chatgpt.com" alt="ChatGPT preview" />
        <div>
          <small>FEATURED FOR A-OS</small>
          <h2>ChatGPT</h2>
          <p>Ideas, answers and creativity—installed as a focused A-OS app.</p>
          <button
            onClick={() => (p.installed.includes("ChatGPT") ? p.launch(chat) : p.install("ChatGPT"))}
            disabled={p.installing.ChatGPT}
          >
            {p.installing.ChatGPT ? (
              <>
                <i className="spinner" />
                Installing {p.installing.ChatGPT}%
              </>
            ) : p.installed.includes("ChatGPT") ? (
              "Open app"
            ) : (
              "Install app"
            )}
          </button>
        </div>
      </div>
      <h2 className="section-title">Popular on A-OS</h2>
      <div className="store-grid">
        {p.apps.map((a: any) => (
          <article key={a.url}>
            <div className="site-preview">
              {a.devCode ? (
                <iframe srcDoc={a.devCode} sandbox="" title={`${a.name} preview`} />
              ) : (
                <img
                  src={
                    a.url.startsWith("http")
                      ? `https://image.thum.io/get/width/720/crop/400/noanimate/${a.url}`
                      : getSystemIcon(a.name === "WebA" ? "Internet.png" : "Code.png")
                  }
                  alt={`${a.name} preview`}
                />
              )}
              <span>{a.category}</span>
            </div>
            <section>
              <img
                src={
                  a.devCode
                    ? getSystemIcon("Code.png")
                    : a.name === "WebA"
                    ? getSystemIcon("Internet.png")
                    : `https://www.google.com/s2/favicons?domain=${a.domain}&sz=128`
                }
                alt=""
              />
              <div>
                <b>{a.name}</b>
                <p>{a.description}</p>
              </div>
            </section>
            <button
              onClick={() => (p.installed.includes(a.name) ? p.launch(a) : p.install(a.name))}
              disabled={p.installing[a.name]}
            >
              {p.installing[a.name] ? (
                <>
                  <i className="spinner" />
                  Installing {p.installing[a.name]}%
                </>
              ) : p.installed.includes(a.name) ? (
                "Open"
              ) : (
                "Install"
              )}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export function FileManager(p: any) {
  const [folder, setFolder] = useState("root");
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [pinned, setPinned] = useState<string[]>([]);
  const [usbEntries, setUsbEntries] = useState<UsbEntry[]>([]);
  const [usbTrail, setUsbTrail] = useState<{ name: string; handle: any }[]>([]);
  const [dialog, setDialog] = useState<"file" | "folder" | "rename" | "delete" | null>(null);
  const [value, setValue] = useState("");
  const [sourceOpen, setSourceOpen] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);
  const packRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      setPinned(JSON.parse(localStorage.getItem("aos-pinned-folders") || "[]"));
    } catch {}
  }, []);

  useEffect(() => {
    if (!p.usbStorage) return;
    setUsbEntries(p.usbStorage.entries);
    setUsbTrail([{ name: p.usbStorage.name, handle: p.usbStorage.handle }]);
  }, [p.usbStorage]);

  const isUsb = folder === "usb";
  const visible = p.files.filter(
    (f: VFile) => !isUsb && f.parent === folder && f.name.toLowerCase().includes(query.toLowerCase())
  );
  const chosen = p.files.find((f: VFile) => f.id === selected);

  const savePinned = (next: string[]) => {
    setPinned(next);
    localStorage.setItem("aos-pinned-folders", JSON.stringify(next));
  };

  const togglePin = () => {
    if (!chosen || chosen.type !== "folder") return;
    savePinned(pinned.includes(chosen.id) ? pinned.filter((id) => id !== chosen.id) : [...pinned, chosen.id]);
  };

  const readUsbDirectory = async (handle: any, name: string, append = true) => {
    const entries: UsbEntry[] = [];
    for await (const [entryName, entryHandle] of handle.entries())
      entries.push({ name: entryName, kind: entryHandle.kind, handle: entryHandle });
    setUsbEntries(entries);
    setUsbTrail((current) => (append ? [...current, { name, handle }] : [{ name, handle }]));
    setSelected(null);
    setFolder("usb");
  };

  const openUsbEntry = async (entry: UsbEntry) => {
    if (entry.kind === "directory") {
      await readUsbDirectory(entry.handle, entry.name);
      return;
    }
    try {
      const source: File = await entry.handle.getFile();
      const textLike =
        source.type.startsWith("text/") ||
        /\.(js|ts|tsx|py|css|html|md|json|txt|csv|xml)$/i.test(source.name);
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        if (textLike) reader.readAsText(source);
        else reader.readAsDataURL(source);
      });
      const item: VFile = {
        id: crypto.randomUUID(),
        name: source.name,
        type: "file",
        parent: "downloads",
        content,
        mime: source.type,
        icon:
          p.iconForName(source.name) ||
          (source.type.startsWith("image/")
            ? "Image.png"
            : textLike
            ? "Text Editor.png"
            : "Media Files.png"),
      };
      p.updateFiles([...p.files, item]);
      p.setSelectedFile(item.id);
      const media =
        /^(image|video|audio)\//.test(source.type) ||
        /\.(png|jpe?g|gif|webp|svg|mp4|webm|mov|m4v|mpeg|mpg|ogv|3gp|avi|mkv|mp3|wav|wave|ogg|oga|m4a|aac|flac|opus|weba)$/i.test(
          source.name
        );
      p.open(
        source.name.toLowerCase().endsWith(".zip")
          ? "zipviewer"
          : media
          ? "mediaview"
          : textLike
          ? "vscode"
          : "codeviewer"
      );
    } catch {}
  };

  const moveItem = (id: string, parent: string) => {
    if (id === parent) return;
    let cursor = parent;
    while (cursor !== "root") {
      if (cursor === id) return;
      cursor = p.files.find((f: VFile) => f.id === cursor)?.parent || "root";
    }
    p.updateFiles(p.files.map((f: VFile) => (f.id === id ? { ...f, parent } : f)));
    setSelected(id);
  };

  const openDialog = (kind: any) => {
    setValue(
      kind === "rename" ? chosen?.name || "" : kind === "folder" ? "New folder" : "untitled.txt"
    );
    setDialog(kind);
  };

  const submitDialog = () => {
    if (dialog === "delete" && selected) {
      const ids = new Set([selected]);
      let changed = true;
      while (changed) {
        changed = false;
        p.files.forEach((f: VFile) => {
          if (ids.has(f.parent) && !ids.has(f.id)) {
            ids.add(f.id);
            changed = true;
          }
        });
      }
      p.updateFiles(p.files.filter((f: VFile) => !ids.has(f.id)));
      setSelected(null);
    } else if (dialog === "rename" && selected && value.trim()) {
      p.updateFiles(p.files.map((f: VFile) => (f.id === selected ? { ...f, name: value.trim() } : f)));
    } else if ((dialog === "file" || dialog === "folder") && value.trim()) {
      p.updateFiles([
        ...p.files,
        {
          id: crypto.randomUUID(),
          name: value.trim(),
          type: dialog,
          parent: folder,
          content: dialog === "file" ? "" : "",
          icon: dialog === "folder" ? "Files.png" : p.iconForName(value.trim()) || "Text Editor.png",
          mime: dialog === "file" ? "text/plain" : undefined,
        },
      ]);
    }
    setDialog(null);
  };

  const upload = async (list: FileList | null) => {
    if (!list) return;
    const added = await Promise.all(
      Array.from(list).map(
        (file) =>
          new Promise<VFile>((resolve) => {
            const r = new FileReader();
            r.onload = () =>
              resolve({
                id: crypto.randomUUID(),
                name: file.name,
                type: "file",
                parent: folder,
                content: String(r.result),
                mime: file.type,
                icon:
                  p.iconForName(file.name) ||
                  (file.type.startsWith("image/")
                    ? "Image.png"
                    : file.name.match(/\.(js|ts|tsx|py|css|html|md|json)$/i)
                    ? "Code.png"
                    : "Media Files.png"),
              });
            if (file.type.startsWith("text/") || file.name.match(/\.(js|ts|tsx|py|css|html|md|json)$/i))
              r.readAsText(file);
            else r.readAsDataURL(file);
          })
      )
    );
    p.updateFiles([...p.files, ...added]);
  };

  const openItem = (f: VFile) => {
    if (f.type === "folder") {
      setFolder(f.id);
      setSelected(null);
    } else {
      p.setSelectedFile(f.id);
      if (f.name.toLowerCase().endsWith(".zip")) p.open("zipviewer");
      else if (
        /^(image|video|audio)\//.test(f.mime || "") ||
        /\.(png|jpe?g|gif|webp|svg|mp4|webm|mov|m4v|mpeg|mpg|ogv|3gp|avi|mkv|mp3|wav|wave|ogg|oga|m4a|aac|flac|opus|weba)$/i.test(
          f.name
        )
      )
        p.open("mediaview");
      else
        p.open(
          f.name.match(/\.(js|ts|tsx|py|css|html|md|json|txt|png|jpe?g|webp|gif)$/i)
            ? "vscode"
            : "codeviewer"
        );
    }
  };

  return (
    <div className="chrome-app files-modern">
      <aside>
        <h2>Files</h2>
        <button className={folder === "root" ? "active" : ""} onClick={() => setFolder("root")}>
          <img src={getSystemIcon("This PC.png")} alt="" />
          My files
        </button>
        <button className={folder === "downloads" ? "active" : ""} onClick={() => setFolder("downloads")}>
          <img src={getSystemIcon("Downloads.png")} alt="" />
          Downloads
        </button>
        <button onClick={() => p.open("codeviewer")}>
          <img src={getSystemIcon("Text Editor.png")} alt="" />
          Code Viewer
        </button>
      </aside>
      <main
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (isUsb) return;
          const id = e.dataTransfer.getData("application/aos-file");
          if (id) moveItem(id, folder);
        }}
      >
        <div className="file-toolbar">
          <button
            onClick={() => {
              const f = p.files.find((x: VFile) => x.id === folder);
              setFolder(f?.parent || "root");
            }}
            aria-label="Back"
          >
            <img src={getSystemIcon("Arrow Left.png")} alt="" />
          </button>
          <b>
            {isUsb
              ? usbTrail.map((item) => item.name).join(" / ") || "USB disk"
              : folder === "root"
              ? "Local A-OS Device"
              : p.files.find((f: VFile) => f.id === folder)?.name}
          </b>
          <div className="file-actions">
            <button disabled={isUsb} onClick={() => openDialog("folder")}>
              New folder
            </button>
            <button disabled={isUsb} onClick={() => openDialog("file")}>
              New file
            </button>
            <button disabled={isUsb} onClick={() => setSourceOpen(true)}>
              Upload
            </button>
            <button disabled={isUsb || !selected} onClick={() => openDialog("rename")}>
              Rename
            </button>
            <button disabled={isUsb || !selected} onClick={() => iconRef.current?.click()}>
              Change icon
            </button>
            <button className="delete-file" disabled={isUsb || !selected} onClick={() => openDialog("delete")}>
              Delete
            </button>
            <button disabled={isUsb || chosen?.type !== "folder"} className="pin-folder" onClick={togglePin}>
              {chosen && pinned.includes(chosen.id) ? "Unpin folder" : "Pin folder"}
            </button>
          </div>
          <label className="settings-search">
            <span className="search-symbol" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files" />
          </label>
          <input ref={uploadRef} hidden multiple type="file" onChange={(e) => upload(e.target.files)} />
          <input
            ref={iconRef}
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file || !selected) return;
              const r = new FileReader();
              r.onload = () =>
                p.updateFiles(
                  p.files.map((f: VFile) => (f.id === selected ? { ...f, icon: String(r.result) } : f))
                );
              r.readAsDataURL(file);
            }}
          />
          <input
            ref={packRef}
            hidden
            multiple
            type="file"
            accept="image/*"
            {...({ webkitdirectory: "", directory: "" } as any)}
            onChange={(e) => p.uploadIconPack(e.target.files)}
          />
        </div>
        {visible.length ? (
          <div className="file-grid virtual-grid">
            {visible.map((f: VFile) => (
              <button
                className={selected === f.id ? "selected" : ""}
                draggable
                onClick={() => setSelected(f.id)}
                onDoubleClick={() => openItem(f)}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("application/aos-file", f.id);
                }}
                onDragOver={(e) => {
                  if (f.type === "folder") e.preventDefault();
                }}
                onDrop={(e) => {
                  if (f.type !== "folder") return;
                  e.preventDefault();
                  e.stopPropagation();
                  const id = e.dataTransfer.getData("application/aos-file");
                  if (id) moveItem(id, f.id);
                }}
                key={f.id}
              >
                <img
                  src={
                    f.icon?.startsWith("data:")
                      ? f.icon
                      : getSystemIcon(f.icon || "Unnamed app.png")
                  }
                  alt=""
                />
                <b>{f.name}</b>
                <small>
                  {f.type === "folder"
                    ? `${p.files.filter((x: VFile) => x.parent === f.id).length} items`
                    : f.mime || "File"}
                </small>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-folder">
            <img src={getSystemIcon("Files.png")} alt="" />
            <h3>This folder is empty</h3>
            <p>Create a file or upload something from your computer.</p>
          </div>
        )}
        <p className="file-tip">
          {isUsb
            ? "Double-click a USB folder to browse it, or a file to copy it into A-OS Downloads and open it."
            : "Double-click to open. Drag items onto folders—or onto this area—to move them."}
        </p>
      </main>
      {dialog && (
        <div className="file-dialog-backdrop">
          <form
            className="file-dialog"
            onSubmit={(e) => {
              e.preventDefault();
              submitDialog();
            }}
          >
            <img
              src={
                dialog === "delete"
                  ? getSystemIcon("Trash.png")
                  : dialog === "folder"
                  ? getSystemIcon("Files.png")
                  : getSystemIcon("Text Editor.png")
              }
              alt=""
            />
            <h3>
              {dialog === "delete"
                ? `Delete ${chosen?.name}?`
                : dialog === "rename"
                ? "Rename item"
                : dialog === "folder"
                ? "Create folder"
                : "Create file"}
            </h3>
            {dialog === "delete" ? (
              <p>This removes the item and everything inside it.</p>
            ) : (
              <input autoFocus value={value} onChange={(e) => setValue(e.target.value)} aria-label="Name" />
            )}
            <footer>
              <button type="button" onClick={() => setDialog(null)}>
                Cancel
              </button>
              <button className={dialog === "delete" ? "danger-confirm" : "primary"}>
                {dialog === "delete" ? "Delete" : "Save"}
              </button>
            </footer>
          </form>
        </div>
      )}
      {sourceOpen && (
        <SourceChooser
          title="Upload files"
          detail="Choose where you want to import files from."
          close={() => setSourceOpen(false)}
          local={() => {
            setSourceOpen(false);
            uploadRef.current?.click();
          }}
          drive={() => {
            setSourceOpen(false);
            p.launch(catalog.find((item) => item.name === "Google Drive"));
          }}
        />
      )}
    </div>
  );
}

export function ZipViewer({ files, selectedFile, updateFiles }: any) {
  const file = files.find((item: VFile) => item.id === selectedFile);
  const [entries, setEntries] = useState<{ name: string; size: number; folder: boolean; data?: Uint8Array }[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [previewText, setPreviewText] = useState("");
  const [error, setError] = useState("");
  const archiveRef = useRef<Record<string, Uint8Array>>({});

  useEffect(() => {
    let live = true;
    setEntries([]);
    setError("");
    if (!file?.content) return;
    (async () => {
      try {
        const bytes = new Uint8Array(await (await fetch(file.content)).arrayBuffer());
        const archive = unzipSync(bytes);
        archiveRef.current = archive;
        if (!live) return;
        setEntries(
          Object.entries(archive).map(([name, data]) => ({
            name,
            size: data.length,
            folder: name.endsWith("/"),
            data,
          }))
        );
      } catch {
        if (live) setError("This ZIP archive could not be opened.");
      }
    })();
    return () => {
      live = false;
    };
  }, [file?.id, file?.content]);

  const inspect = (entry: { name: string; data?: Uint8Array; folder: boolean }) => {
    setSelected(entry.name);
    if (entry.folder || !entry.data) return setPreviewText("");
    if (/\.(txt|md|json|js|ts|tsx|css|html|xml|svg|py|csv)$/i.test(entry.name)) {
      try {
        setPreviewText(strFromU8(entry.data));
      } catch {
        setPreviewText("Preview unavailable");
      }
    } else setPreviewText("Binary file · preview unavailable");
  };

  const saveEntry = () => {
    if (!file || !selected || !/\.(txt|md|json|js|ts|tsx|css|html|xml|svg|py|csv)$/i.test(selected)) return;
    archiveRef.current[selected] = strToU8(previewText);
    const packed = zipSync(archiveRef.current);
    const content = `data:application/zip;base64,${base64(packed)}`;
    updateFiles(files.map((item: VFile) => (item.id === file.id ? { ...item, content } : item)));
    setEntries(
      Object.entries(archiveRef.current).map(([name, data]) => ({
        name,
        size: (data as Uint8Array).length,
        folder: name.endsWith("/"),
        data: data as Uint8Array,
      }))
    );
  };

  return (
    <div className="zip-viewer">
      <aside>
        <header>
          <img src={getSystemIcon("zip.png")} alt="" />
          <span>
            <b>{file?.name || "Archive.zip"}</b>
            <small>{entries.length} items</small>
          </span>
        </header>
        {error ? (
          <p>{error}</p>
        ) : (
          entries.map((entry) => (
            <button className={selected === entry.name ? "active" : ""} onClick={() => inspect(entry)} key={entry.name}>
              <img
                src={getSystemIcon(entry.folder ? "Files.png" : bundledIconForName(entry.name) || "Text Editor.png")}
                alt=""
              />
              <span>
                <b>{entry.name}</b>
                <small>{entry.folder ? "Folder" : `${Math.max(1, Math.round(entry.size / 1024))} KB`}</small>
              </span>
            </button>
          ))
        )}
      </aside>
      <main>
        {selected ? (
          <>
            <header>
              {selected}
              <button onClick={saveEntry}>Save inside ZIP</button>
            </header>
            {/\.(txt|md|json|js|ts|tsx|css|html|xml|svg|py|csv)$/i.test(selected) ? (
              <textarea value={previewText} onChange={(e) => setPreviewText(e.target.value)} />
            ) : (
              <pre>{previewText}</pre>
            )}
          </>
        ) : (
          <div className="zip-empty">
            <img src={getSystemIcon("zip.png")} alt="" />
            <h2>Browse inside this ZIP</h2>
            <p>Select an item to preview it without extracting the archive.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export function ImageAssist({ file, save }: { file: VFile; save: (content: string) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef<{ x: number; y: number; snapshot: ImageData } | null>(null);
  const [tool, setTool] = useState<"pen" | "text" | "rectangle" | "ellipse">("pen");
  const [colour, setColour] = useState("#1677d2");
  const [lineWidth, setLineWidth] = useState(5);
  const [text, setText] = useState("A-OS");

  useEffect(() => {
    const surface = canvas.current;
    if (!surface) return;
    const context = surface.getContext("2d");
    if (!context) return;
    const image = new Image();
    image.onload = () => {
      surface.width = Math.max(640, Math.min(1400, image.naturalWidth || 900));
      surface.height = Math.max(420, Math.min(900, image.naturalHeight || 560));
      context.fillStyle = "#fff";
      context.fillRect(0, 0, surface.width, surface.height);
      const scale = Math.min(surface.width / image.naturalWidth, surface.height / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.drawImage(image, (surface.width - width) / 2, (surface.height - height) / 2, width, height);
    };
    image.src = file.content || "";
  }, [file.id, file.content]);

  const point = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) * event.currentTarget.width) / bounds.width,
      y: ((event.clientY - bounds.top) * event.currentTarget.height) / bounds.height,
    };
  };

  const down = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const context = event.currentTarget.getContext("2d");
    const p = point(event);
    if (!context) return;
    if (tool === "text") {
      context.fillStyle = colour;
      context.font = `${Math.max(18, lineWidth * 5)}px Inter, sans-serif`;
      context.fillText(text || "Text", p.x, p.y);
      return;
    }
    drawing.current = {
      ...p,
      snapshot: context.getImageData(0, 0, event.currentTarget.width, event.currentTarget.height),
    };
    context.strokeStyle = colour;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    if (tool === "pen") {
      context.beginPath();
      context.moveTo(p.x, p.y);
    }
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const move = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const context = event.currentTarget.getContext("2d");
    const p = point(event);
    const origin = drawing.current;
    if (!context || !origin) return;
    context.strokeStyle = colour;
    context.lineWidth = lineWidth;
    if (tool === "pen") {
      context.lineTo(p.x, p.y);
      context.stroke();
      return;
    }
    context.putImageData(origin.snapshot, 0, 0);
    context.beginPath();
    if (tool === "rectangle") context.rect(origin.x, origin.y, p.x - origin.x, p.y - origin.y);
    else
      context.ellipse(
        (origin.x + p.x) / 2,
        (origin.y + p.y) / 2,
        Math.abs(p.x - origin.x) / 2,
        Math.abs(p.y - origin.y) / 2,
        0,
        0,
        Math.PI * 2
      );
    context.stroke();
  };

  const up = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (drawing.current) event.currentTarget.releasePointerCapture(event.pointerId);
    drawing.current = null;
  };

  return (
    <div className="image-assist">
      <div className="image-assist-tools">
        {(["pen", "text", "rectangle", "ellipse"] as const).map((name) => (
          <button className={tool === name ? "active" : ""} onClick={() => setTool(name)} key={name}>
            {name === "pen" ? "Draw" : name === "ellipse" ? "Circle" : name[0].toUpperCase() + name.slice(1)}
          </button>
        ))}
        <input type="color" value={colour} onChange={(e) => setColour(e.target.value)} aria-label="Annotation colour" />
        <label>
          Size{" "}
          <input
            type="range"
            min="2"
            max="18"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
          />
        </label>
        {tool === "text" && (
          <input
            className="image-text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Text to add"
          />
        )}
        <button className="image-save" onClick={() => canvas.current && save(canvas.current.toDataURL("image/png"))}>
          Save image
        </button>
      </div>
      <div className="image-assist-stage">
        <canvas ref={canvas} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
      </div>
    </div>
  );
}

export function FileAssist({ files, updateFiles, selectedFile, setSelectedFile }: any) {
  const editable = files.filter(
    (f: VFile) =>
      f.type === "file" && f.name.match(/\.(js|ts|tsx|py|css|html|md|json|txt|png|jpe?g|webp|gif)$/i)
  );
  const chosen = files.find((f: VFile) => f.id === (selectedFile || editable[0]?.id));
  const [draft, setDraft] = useState(chosen?.content || "");
  const isImage = !!chosen?.name.match(/\.(png|jpe?g|webp|gif)$/i);

  useEffect(() => {
    setDraft(chosen?.content || "");
  }, [chosen?.id, chosen?.content]);

  const save = () => {
    if (!chosen) return;
    updateFiles(files.map((f: VFile) => (f.id === chosen.id ? { ...f, content: draft } : f)));
  };

  return (
    <div className="vscode-app">
      <aside>
        <div className="vscode-brand">
          <img src={getSystemIcon("Code.png")} alt="" />
          <b>FILE ASSIST</b>
        </div>
        {editable.map((f: VFile) => (
          <button className={chosen?.id === f.id ? "active" : ""} onClick={() => setSelectedFile(f.id)} key={f.id}>
            <img src={getSystemIcon("Code.png")} alt="" />
            {f.name}
          </button>
        ))}
      </aside>
      <main>
        <header>
          <span>{chosen?.name || "No code file selected"}</span>
          <button onClick={save} disabled={!chosen}>
            Save
          </button>
        </header>
        {chosen && isImage ? (
          <ImageAssist
            file={chosen}
            save={(content: string) => {
              updateFiles(
                files.map((f: VFile) =>
                  f.id === chosen.id ? { ...f, content, mime: "image/png", icon: "Image.png" } : f
                )
              );
            }}
          />
        ) : chosen ? (
          <textarea spellCheck={false} value={draft} onChange={(e) => setDraft(e.target.value)} />
        ) : (
          <div className="editor-empty">
            <img src={getSystemIcon("Code.png")} alt="" />
            <p>Choose a text file or image in Files to start editing.</p>
          </div>
        )}
        <footer>
          <span>main</span>
          <span>UTF-8</span>
          <span>{isImage ? "Image tools" : chosen?.mime || "Plain Text"}</span>
        </footer>
      </main>
    </div>
  );
}

export function CodeViewer({ files, selectedFile, setSelectedFile }: any) {
  const items = files.filter((f: VFile) => f.type === "file");
  const chosen = files.find((f: VFile) => f.id === (selectedFile || items[0]?.id));
  return (
    <div className="code-viewer">
      <aside>
        <h2>Code Viewer</h2>
        {items.map((f: VFile) => (
          <button className={chosen?.id === f.id ? "active" : ""} onClick={() => setSelectedFile(f.id)} key={f.id}>
            <img src={getSystemIcon(f.icon || "Text Editor.png")} alt="" />
            <span>{f.name}</span>
          </button>
        ))}
      </aside>
      <main>
        <header>
          <b>{chosen?.name || "Select a file"}</b>
          <small>Read-only preview</small>
        </header>
        {chosen?.mime?.startsWith("image/") ? (
          <img className="viewer-image" src={chosen.content} alt={chosen.name} />
        ) : (
          <pre>{chosen?.content || "This file has no text preview."}</pre>
        )}
      </main>
    </div>
  );
}

export function Paint({ files, updateFiles }: any) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("#142033");
  const [size, setSize] = useState(8);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, []);

  const point = (e: any) => {
    const c = canvas.current!;
    const r = c.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * c.width,
      y: ((e.clientY - r.top) / r.height) * c.height,
    };
  };

  const down = (e: any) => {
    drawing.current = true;
    const ctx = canvas.current?.getContext("2d");
    const p = point(e);
    ctx?.beginPath();
    ctx?.moveTo(p.x, p.y);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const move = (e: any) => {
    if (!drawing.current) return;
    const ctx = canvas.current?.getContext("2d");
    const p = point(e);
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  };

  const clear = () => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (c && ctx) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, c.width, c.height);
    }
  };

  const save = () => {
    const content = canvas.current?.toDataURL("image/png");
    if (!content) return;
    updateFiles([
      ...files,
      {
        id: crypto.randomUUID(),
        name: `Painting ${new Date().toLocaleTimeString().replaceAll(":", "-")}.png`,
        type: "file",
        parent: "root",
        content,
        mime: "image/png",
        icon: "Image.png",
      },
    ]);
  };

  return (
    <div className="paint-app">
      <header>
        <b>Brush</b>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Brush color" />
        <label>
          Size
          <input type="range" min="1" max="40" value={size} onChange={(e) => setSize(Number(e.target.value))} />
        </label>
        <button onClick={clear}>Clear canvas</button>
        <button className="paint-save" onClick={save}>
          Save to Files
        </button>
      </header>
      <div>
        <canvas
          ref={canvas}
          width="1200"
          height="720"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={() => (drawing.current = false)}
          onPointerCancel={() => (drawing.current = false)}
        />
      </div>
    </div>
  );
}

type MineCell = { mine: boolean; open: boolean; flag: boolean; near: number };
const newMineBoard = () => {
  const cells: MineCell[] = Array.from({ length: 81 }, () => ({
    mine: false,
    open: false,
    flag: false,
    near: 0,
  }));
  const spots = [...Array(81).keys()].sort(() => Math.random() - 0.5).slice(0, 10);
  spots.forEach((i) => (cells[i].mine = true));
  cells.forEach((c, i) => {
    const x = i % 9;
    const y = Math.floor(i / 9);
    c.near = cells.filter(
      (n, j) => n.mine && Math.abs((j % 9) - x) <= 1 && Math.abs(Math.floor(j / 9) - y) <= 1
    ).length;
  });
  return cells;
};

export function Minesweeper() {
  const [board, setBoard] = useState<MineCell[]>(newMineBoard);
  const [status, setStatus] = useState("Find all 10 mines");

  const reset = () => {
    setBoard(newMineBoard());
    setStatus("Find all 10 mines");
  };

  const reveal = (index: number) => {
    if (board[index].flag || board[index].open || status.includes("Boom")) return;
    const next = board.map((x) => ({ ...x }));
    if (next[index].mine) {
      next.forEach((c) => {
        if (c.mine) c.open = true;
      });
      setStatus("Boom — try a new board");
      setBoard(next);
      return;
    }
    const queue = [index];
    const seen = new Set<number>();
    while (queue.length) {
      const i = queue.pop()!;
      if (seen.has(i) || next[i].mine) continue;
      seen.add(i);
      next[i].open = true;
      if (next[i].near === 0) {
        const x = i % 9;
        const y = Math.floor(i / 9);
        next.forEach((_, j) => {
          if (!seen.has(j) && Math.abs((j % 9) - x) <= 1 && Math.abs(Math.floor(j / 9) - y) <= 1) queue.push(j);
        });
      }
    }
    if (next.filter((c) => !c.mine && c.open).length === 71) setStatus("Board cleared!");
    setBoard(next);
  };

  const flag = (e: any, index: number) => {
    e.preventDefault();
    setBoard((v) => v.map((c, i) => (i === index && !c.open ? { ...c, flag: !c.flag } : c)));
  };

  return (
    <div className="minesweeper-app">
      <header>
        <div>
          <h2>Minesweeper</h2>
          <p>{status}</p>
        </div>
        <span>{board.filter((c) => c.flag).length}/10 marked</span>
        <button onClick={reset}>New board</button>
      </header>
      <div className="mine-grid">
        {board.map((c, i) => (
          <button
            key={i}
            className={`${c.open ? "open" : ""}${c.mine && c.open ? " mine" : ""}`}
            onClick={() => reveal(i)}
            onContextMenu={(e) => flag(e, i)}
            aria-label={
              c.open ? (c.mine ? "Mine" : `${c.near} nearby`) : c.flag ? "Flagged" : "Hidden square"
            }
          >
            {c.open ? (c.mine ? "X" : c.near || "") : c.flag ? "F" : ""}
          </button>
        ))}
      </div>
      <small>Click to reveal. Right-click to mark a mine.</small>
    </div>
  );
}

export function Versions() {
  const readme =
    "# A-OS v1.2.1\n\nAdds real A-Applications login and opt-in sync, reliable local video playback, Camera recording, recoverable OSInternet pages, and an original 3D emoji pack.\n\nVersion: A-OS v1.2.1\nChannel: Stable";
  return (
    <div className="versions">
      <aside>
        <div>
          <img src={getSystemIcon("Code.png")} alt="" />
          <span>
            <b>A-OS O</b>
            <small>A-OS v1.2.1 · Stable</small>
          </span>
        </div>
        <button className="active">
          <img src={getSystemIcon("Text Editor.png")} alt="" />
          README.md
        </button>
      </aside>
      <main>
        <header>
          <span>A-OS v1.2.1</span>
          <b>README.md</b>
        </header>
        <pre>{readme}</pre>
        <section>
          <b>Version history</b>
          <article>
            <img src={getSystemIcon("Success.png")} alt="" />
            <div>
              <b>A-OS v1.2.1 · Current</b>
              <small>Modern setup, A-Store, WebA, Chromebook system apps, firmware controls.</small>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export function Security() {
  return (
    <div className="security">
      <img src={getSystemIcon("Security Shield Assistant.png")} alt="" />
      <h1>A-OS Security</h1>
      <p>Your computer is protected. Apps are isolated and system checks are active.</p>
      <div>
        <img src={getSystemIcon("Tick.png")} alt="" />
        <span>
          <b>No threats found</b>
          <small>Last checked just now</small>
        </span>
      </div>
    </div>
  );
}

export function WeatherApp() {
  return (
    <div className="weather-app">
      <iframe src="https://a-os--weather.oneapp.dev/" title="A-OS Weather" allow="geolocation" />
    </div>
  );
}

export function ClockApp({ files, defaultRingtone }: any) {
  const [now, setNow] = useState(new Date());
  const [seconds, setSeconds] = useState(300);
  const [running, setRunning] = useState(false);
  const [alarm, setAlarm] = useState("07:00");
  const [alarms, setAlarms] = useState<string[]>([]);
  const [ringtone, setRingtone] = useState(
    () =>
      (typeof window === "undefined" ? defaultRingtone || "Aurora" : localStorage.getItem("aos-alarm-tone")) ||
      defaultRingtone ||
      "Aurora"
  );
  const lastRing = useRef("");

  const ring = () => playToneSelection(ringtone, files, 75);

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      setNow(date);
      const hh = date.toTimeString().slice(0, 5);
      const key = `${date.toDateString()}-${hh}`;
      if (alarms.includes(hh) && lastRing.current !== key) {
        lastRing.current = key;
        ring();
      }
      setSeconds((val) => (running && val > 0 ? val - 1 : val));
    }, 1000);
    return () => clearInterval(timer);
  }, [running, alarms, ringtone, files]);

  useEffect(() => {
    if (running && seconds === 0) {
      setRunning(false);
      ring();
    }
  }, [seconds, running]);

  const chooseTone = (value: string) => {
    setRingtone(value);
    localStorage.setItem("aos-alarm-tone", value);
    playToneSelection(value, files, 70);
  };

  return (
    <div className="clock-app">
      <header>
        <img src={getSystemIcon("Clock.png")} alt="" />
        <div>
          <b>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</b>
          <span>{now.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}</span>
        </div>
      </header>
      <main>
        <section>
          <h3>Timer</h3>
          <strong>
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
          </strong>
          <input
            type="range"
            min="10"
            max="3600"
            step="10"
            value={seconds}
            disabled={running}
            onChange={(e) => setSeconds(Number(e.target.value))}
          />
          <div>
            <button onClick={() => setRunning((v) => !v)}>{running ? "Pause" : "Start"}</button>
            <button
              onClick={() => {
                setRunning(false);
                setSeconds(300);
              }}
            >
              Reset
            </button>
          </div>
        </section>
        <section>
          <h3>Alarms</h3>
          <div className="alarm-add">
            <input type="time" value={alarm} onChange={(e) => setAlarm(e.target.value)} />
            <button onClick={() => setAlarms((items) => [...new Set([...items, alarm])])}>Add alarm</button>
          </div>
          <label>
            Alarm ringtone
            <select value={ringtone} onChange={(e) => chooseTone(e.target.value)}>
              <optgroup label="A-OS Original tones">
                {originalTones.map((tone) => (
                  <option key={tone.name}>{tone.name}</option>
                ))}
              </optgroup>
            </select>
          </label>
          <div className="alarm-tone-chips">
            {originalToneNames.map((name) => (
              <button className={ringtone === name ? "active" : ""} onClick={() => chooseTone(name)} key={name}>
                {name}
              </button>
            ))}
          </div>
          <div className="alarm-list">
            {alarms.length ? (
              alarms.map((item) => (
                <button onClick={() => setAlarms((items) => items.filter((x) => x !== item))} key={item}>
                  <b>{item}</b>
                  <span>×</span>
                </button>
              ))
            ) : (
              <p>No alarms set</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [operator, setOperator] = useState("");

  const number = (val: string) => setDisplay((cur) => (cur === "0" ? val : cur + val));
  const operate = (op: string) => {
    setStored(Number(display));
    setOperator(op);
    setDisplay("0");
  };
  const equals = () => {
    if (stored === null) return;
    const value = Number(display);
    const result =
      operator === "+"
        ? stored + value
        : operator === "−"
        ? stored - value
        : operator === "×"
        ? stored * value
        : operator === "÷"
        ? value
          ? stored / value
          : 0
        : value;
    setDisplay(String(Number(result.toFixed(8))));
    setStored(null);
    setOperator("");
  };

  return (
    <div className="calculator-app">
      <output>{display}</output>
      <div>
        {["C", "±", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ".", "="].map((key) => (
          <button
            className={/[÷×−+=]/.test(key) ? "operation" : ""}
            style={key === "0" ? { gridColumn: "span 2" } : undefined}
            onClick={() =>
              key === "C"
                ? (setDisplay("0"), setStored(null))
                : key === "±"
                ? setDisplay(String(-Number(display)))
                : key === "%"
                ? setDisplay(String(Number(display) / 100))
                : key === "="
                ? equals()
                : /[÷×−+]/.test(key)
                ? operate(key)
                : number(key)
            }
            key={key}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RecordApp({ files, updateFiles }: any) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [message, setMessage] = useState("Ready to record into A-OS Storage");
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(timer);
  }, [recording]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      const media = new MediaRecorder(stream);
      recorder.current = media;
      media.ondataavailable = (e) => {
        if (e.data.size) chunks.current.push(e.data);
      };
      media.onstop = () => {
        const blob = new Blob(chunks.current, { type: media.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          const extension = blob.type.includes("ogg") ? "ogg" : "webm";
          const name = `Recording-${new Date().toISOString().replace(/[:.]/g, "-")}.${extension}`;
          updateFiles([
            ...files,
            {
              id: crypto.randomUUID(),
              name,
              type: "file",
              parent: "downloads",
              content: String(reader.result),
              mime: blob.type,
              icon: "Record.png",
            },
          ]);
          setMessage(`${name} saved in A-OS Downloads`);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      media.start();
      setElapsed(0);
      setRecording(true);
      setMessage("Recording…");
    } catch {
      setMessage("Microphone access is needed to record.");
    }
  };

  const stop = () => {
    recorder.current?.stop();
    setRecording(false);
  };

  return (
    <div className="record-app">
      <img src={getSystemIcon("Record.png")} alt="" />
      <h2>{recording ? "Recording" : "A-OS Record"}</h2>
      <strong>
        {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
      </strong>
      <button className={recording ? "stop" : ""} onClick={() => (recording ? stop() : void start())}>
        <i />
        {recording ? "Stop and save" : "Start recording"}
      </button>
      <p>{message}</p>
    </div>
  );
}

export function CameraApp({ files, updateFiles }: any) {
  const [mode, setMode] = useState<"photo" | "portrait" | "video">("photo");
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [ready, setReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState("Camera is off");
  const [lastCapture, setLastCapture] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stopCamera = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setReady(false);
  };

  const enableCamera = async (nextFacing = facing) => {
    try {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: nextFacing }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setReady(true);
      setStatus("Camera ready");
    } catch {
      setReady(false);
      setStatus("Camera permission is needed.");
    }
  };

  useEffect(() => () => stopCamera(), []);

  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(
      () =>
        setElapsed((val) => {
          if (val >= 29 && recorderRef.current?.state === "recording") recorderRef.current.stop();
          return val + 1;
        }),
      1000
    );
    return () => clearInterval(timer);
  }, [recording]);

  const saveBlob = (blob: Blob, name: string, iconName: string) => {
    const reader = new FileReader();
    reader.onload = () => {
      const item: VFile = {
        id: crypto.randomUUID(),
        name,
        type: "file",
        parent: "downloads",
        content: String(reader.result),
        mime: blob.type,
        icon: iconName,
      };
      updateFiles([...files, item]);
      setLastCapture(String(reader.result));
      setStatus(`${name} saved in A-OS Downloads`);
    };
    reader.readAsDataURL(blob);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || !ready || !video.videoWidth) {
      setStatus("Enable the camera before taking a photo");
      return;
    }
    const sourceW = video.videoWidth;
    const sourceH = video.videoHeight;
    const targetW = Math.min(1600, sourceW);
    const targetH = Math.round((targetW * sourceH) / sourceW);
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, targetW, targetH);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        saveBlob(blob, `Photo-${stamp}.jpg`, "Image.png");
      },
      "image/jpeg",
      0.9
    );
  };

  const startVideo = async () => {
    if (!ready || !streamRef.current) return;
    try {
      const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
      const tracks = [...streamRef.current.getVideoTracks().map((t) => t.clone()), ...audio.getAudioTracks()];
      const recordingStream = new MediaStream(tracks);
      const media = new MediaRecorder(recordingStream);
      chunksRef.current = [];
      recorderRef.current = media;
      media.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      media.onstop = () => {
        const type = media.mimeType || "video/webm";
        const blob = new Blob(chunksRef.current, { type });
        const name = `Video-${new Date().toISOString().replace(/[:.]/g, "-")}.webm`;
        saveBlob(blob, name, "Video.png");
        recordingStream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        setElapsed(0);
      };
      media.start(500);
      setRecording(true);
      setElapsed(0);
      setStatus("Recording video…");
    } catch {
      setStatus("Microphone permission needed for video");
    }
  };

  const stopVideo = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const flip = () => {
    const next = facing === "user" ? "environment" : "user";
    setFacing(next);
    if (ready) void enableCamera(next);
  };

  return (
    <div className="camera-app">
      <section className={`camera-stage mode-${mode}${recording ? " recording" : ""}`}>
        <video ref={videoRef} muted playsInline />
        <div className="camera-frame" />
        <span className="camera-status">
          {recording
            ? `REC ${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`
            : ready
            ? mode === "portrait"
              ? "PORTRAIT"
              : "LIVE"
            : "CAMERA OFF"}
        </span>
        {!ready && (
          <button className="camera-enable" onClick={() => void enableCamera()}>
            Enable camera
          </button>
        )}
      </section>
      <footer>
        <button className="camera-flip" onClick={flip} disabled={recording} aria-label="Switch camera">
          ↻
        </button>
        <div className="camera-modes">
          {(["photo", "portrait", "video"] as const).map((item) => (
            <button className={mode === item ? "active" : ""} disabled={recording} onClick={() => setMode(item)} key={item}>
              {item}
            </button>
          ))}
        </div>
        <button
          className={`camera-shutter${recording ? " stop" : ""}`}
          onClick={() => (mode === "video" ? (recording ? stopVideo() : void startVideo()) : takePhoto())}
          disabled={!ready}
        >
          <i />
        </button>
        <div className="camera-last">
          {lastCapture ? <img src={lastCapture} alt="Last capture" /> : <img src={getSystemIcon("Images.png")} alt="" />}
        </div>
        <button className="camera-power" onClick={() => (ready ? stopCamera() : void enableCamera())}>
          {ready ? "Turn off" : "Turn on"}
        </button>
      </footer>
      <p>{status}</p>
    </div>
  );
}

export function MediaView(p: any) {
  const media = p.files.filter(
    (file: VFile) =>
      file.type === "file" &&
      (/^(image|video|audio)\//.test(file.mime || "") ||
        /\.(png|jpe?g|gif|webp|svg|mp4|webm|mov|m4v|mpeg|mpg|ogv|3gp|avi|mkv|mp3|wav|wave|ogg|oga|m4a|aac|flac|opus|weba)$/i.test(
          file.name
        ))
  );
  const [selected, setSelected] = useState(
    media.some((item: VFile) => item.id === p.selectedFile) ? p.selectedFile : media[0]?.id || ""
  );
  const [filter, setFilter] = useState("none");
  const [speed, setSpeed] = useState(1);
  const [trim, setTrim] = useState({ start: 0, end: 100 });
  const [playbackError, setPlaybackError] = useState("");

  const file = media.find((item: VFile) => item.id === selected) || media[0];
  const source = file?.content || "";

  const isImage = !!file && (file.mime?.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name));
  const isAudio =
    !!file &&
    (file.mime?.startsWith("audio/") || /\.(mp3|wav|wave|ogg|oga|m4a|aac|flac|opus|weba)$/i.test(file.name));

  return (
    <div className="media-view">
      <aside>
        <h2>Media</h2>
        {media.map((item: VFile) => (
          <button
            className={item.id === file?.id ? "active" : ""}
            onClick={() => setSelected(item.id)}
            key={item.id}
          >
            <img
              src={getSystemIcon(
                item.mime?.startsWith("image/") ? "Image.png" : item.mime?.startsWith("video/") ? "Video.png" : "Music.png"
              )}
              alt=""
            />
            <span>{item.name}</span>
          </button>
        ))}
      </aside>
      <main>
        {!file ? (
          <div className="media-empty">
            <h2>No media yet</h2>
            <p>Add images, videos or sounds in A-OS Files.</p>
          </div>
        ) : (
          <>
            <section className="media-stage" style={{ filter }}>
              {isImage ? (
                <img src={source} alt={file.name} />
              ) : isAudio ? (
                <audio src={source} controls preload="metadata" />
              ) : (
                <video src={source} controls playsInline preload="metadata" />
              )}
              {playbackError && (
                <div className="media-playback-error">
                  <img src={getSystemIcon("Error.png")} alt="" />
                  <b>Video could not start</b>
                  <span>{playbackError}</span>
                </div>
              )}
            </section>
            <footer>
              <label>
                Look{" "}
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="none">Original</option>
                  <option value="grayscale(1)">Black & white</option>
                  <option value="sepia(.85)">Warm</option>
                  <option value="contrast(1.25) saturate(1.2)">Vivid</option>
                </select>
              </label>
              <label>
                Speed{" "}
                <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
                  <option>.5</option>
                  <option>1</option>
                  <option>1.5</option>
                  <option>2</option>
                </select>
              </label>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

export function SystemTerminal(p: any) {
  const [lines, setLines] = useState<string[]>([
    "A-OS Terminal 1.0",
    "System commands are ready. Type /help.",
  ]);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const write = (...next: string[]) => setLines((current) => [...current, ...next]);

  const run = async (raw: string) => {
    const command = raw.trim();
    if (!command || busy) return;
    setValue("");
    write(`A-OS> ${command}`);
    if (command === "/help") {
      write(
        "/open-appname · /view-filename · /shutdown",
        "/language-set-languagename · /popup-message · /ask-question",
        "/clear"
      );
      return;
    }
    if (command === "/clear") {
      setLines([]);
      return;
    }
    if (command === "/pc-deviceoverpowered") {
      p.open("deviceoverpowered");
      write("Device-OverPowered opened.");
      return;
    }
    if (/^\/open-devstudio$/i.test(command)) {
      p.open("devstudio");
      write("DevStudio opened.");
      return;
    }
    if (/^\/open-/i.test(command)) {
      const requested = command.replace(/^\/open-/i, "").toLowerCase();
      const app = taskbarApps.find((t) => t.name.toLowerCase() === requested || t.id === requested);
      if (app) {
        p.open(app.id);
        write(`Opened ${app.name}.`);
      } else {
        write(`App not found: ${requested}`);
      }
      return;
    }
    if (/^\/ask-/i.test(command)) {
      const question = command.replace(/^\/ask-/i, "").replace(/-/g, " ").trim();
      setBusy(true);
      write("Researching Wikipedia…");
      try {
        const answer = await conciseWikipediaAnswer(question, 70);
        write(`${answer.title}: ${answer.answer}`, `Source: ${answer.sourceUrl}`);
      } catch (err: any) {
        write(`Research error: ${err?.message || "Error"}`);
      } finally {
        setBusy(false);
      }
      return;
    }
    if (command === "/shutdown") {
      p.shutdown();
      return;
    }
    write("Unknown command. Type /help.");
  };

  return (
    <div className="system-terminal" onClick={() => inputRef.current?.focus()}>
      <header>
        <span>◆</span>
        <b>A-OS Terminal</b>
      </header>
      <main>
        {lines.map((line, i) => (
          <div key={`${i}-${line}`}>{line}</div>
        ))}
      </main>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(value);
        }}
      >
        <b>A-OS&gt;</b>
        <input
          ref={inputRef}
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          aria-label="Terminal command"
        />
      </form>
    </div>
  );
}

export function DevStudio(p: any) {
  const [name, setName] = useState("My A-OS App");
  const [html, setHtml] = useState(
    '<main><h1>Hello, A-OS!</h1><p>Built in DevStudio.</p><button id="hello">Try it</button></main>'
  );
  const [css, setCss] = useState(
    "body{margin:0;font-family:system-ui;background:#eef7ff;color:#102239}main{padding:42px}button{border:0;border-radius:12px;background:#126fc9;color:white;padding:12px 18px;cursor:pointer}"
  );
  const [js, setJs] = useState('document.querySelector("#hello").onclick=()=>alert("Hello from DevStudio!");');
  const [tab, setTab] = useState<"html" | "css" | "js">("html");
  const [revision, setRevision] = useState(0);

  const source = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;

  const publish = () => {
    p.publishDevApp({ name, html, css, js });
  };

  const current = tab === "html" ? html : tab === "css" ? css : js;
  const update = tab === "html" ? setHtml : tab === "css" ? setCss : setJs;

  return (
    <div className="devstudio-app">
      <header>
        <div>
          <span>DS</span>
          <input value={name} onChange={(e) => setName(e.target.value)} aria-label="App name" />
        </div>
        <button onClick={() => setRevision((v) => v + 1)}>Run preview</button>
        <button className="dev-publish" onClick={publish}>
          Send to A-Store
        </button>
      </header>
      <main>
        <section className="dev-editor">
          <nav>
            {(["html", "css", "js"] as const).map((item) => (
              <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
                {item.toUpperCase()}
              </button>
            ))}
          </nav>
          <textarea value={current} onChange={(e) => update(e.target.value)} spellCheck={false} />
        </section>
        <section className="dev-preview">
          <header>Preview</header>
          <iframe key={revision} srcDoc={source} sandbox="allow-scripts allow-modals allow-forms" title="App preview" />
        </section>
      </main>
    </div>
  );
}

export function StorageApp(p: any) {
  const [estimate, setEstimate] = useState({ usage: 0, quota: 0 });

  useEffect(() => {
    navigator.storage?.estimate?.().then((result) => setEstimate({ usage: result.usage || 0, quota: result.quota || 0 })).catch(() => {});
  }, []);

  const mb = (value: number) => (value ? `${(value / 1024 / 1024).toFixed(1)} MB` : "Not reported");
  const percent = estimate.quota ? Math.min(100, (estimate.usage / estimate.quota) * 100) : 0;

  return (
    <div className="storage-app">
      <header>
        <div>
          <img src={getSystemIcon("This PC.png")} alt="" />
          <span>
            <h1>Storages</h1>
            <p>A-OS and connected locations</p>
          </span>
        </div>
      </header>
      <main>
        <article className="storage-card">
          <div className="storage-card-title">
            <img src={getSystemIcon("PC.png")} alt="" />
            <span>
              <b>Local Device Storage</b>
              <small>{p.files.length} A-OS files and folders</small>
            </span>
          </div>
          <div className="storage-meter">
            <i style={{ width: `${percent}%` }} />
          </div>
          <p>
            {mb(estimate.usage)} used · {mb(estimate.quota)} available quota
          </p>
          <button onClick={() => p.open("files")}>View A-OS files</button>
        </article>
      </main>
    </div>
  );
}

export function DeviceSource(p: any) {
  const device = localStorage.getItem("aos-device") || "A-OS Computer";
  const key = `aos-device-source-${device}`;
  const [code, setCode] = useState(() => localStorage.getItem(key) || ".desktop { }");
  const [message, setMessage] = useState("");

  const apply = () => {
    localStorage.setItem(key, code);
    let style = document.getElementById("aos-device-source") as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = "aos-device-source";
      document.head.appendChild(style);
    }
    style.textContent = code;
    setMessage(`Applied to ${device}.`);
  };

  return (
    <div className="device-source">
      <header>
        <span>DS</span>
        <div>
          <h2>DeviceSource</h2>
          <p>Current device: {device}</p>
        </div>
        <button onClick={apply}>Apply to this device</button>
      </header>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} />
      <footer>{message || "Edit A-OS interface CSS."}</footer>
    </div>
  );
}

export function DeviceOverPowered(p: any) {
  const [draft, setDraft] = useState<OverpoweredConfig>(p.overpowered || defaultOverpowered);
  const [section, setSection] = useState("Account & security");
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [securityMessage, setSecurityMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const patch = (next: Partial<OverpoweredConfig>) => {
    setDraft((cur) => ({ ...cur, ...next }));
    setSaved(false);
  };
  const apply = () => {
    p.setOverpowered(draft);
    setSaved(true);
  };

  const changePassword = () => {
    if (newPassword !== confirmPassword) {
      setSecurityMessage({ ok: false, text: "The new passwords do not match." });
      return;
    }
    const result = p.changePassword(currentPassword, newPassword);
    setSecurityMessage({ ok: result.ok, text: result.message });
    if (result.ok) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const factoryReset = () => {
    if (!window.confirm("Factory reset this A-OS device?")) return;
    const result = p.factoryReset(resetPassword);
    setSecurityMessage({ ok: result.ok, text: result.message });
  };

  const packs = [
    { name: "Default", symbol: "A", detail: "Original A-OS colour icons" },
    { name: "High Contrast", symbol: "◉", detail: "Default icons with a bright white glow" },
    { name: "Symbols", symbol: "⌘", detail: "Text symbols instead of image icons" },
    { name: "Fabric", symbol: "F", detail: "Square, flat surfaces without gradients" },
    { name: "A-Emoji 3D", symbol: "✨", detail: "Original soft 3D A-OS emojis" },
  ];

  return (
    <div className="overpowered-app" data-no-translate>
      <aside>
        <header>
          <img src={getSystemIcon("PC.png")} alt="" />
          <span>
            <b>Device-OverPowered</b>
            <small>Advanced profile controls</small>
          </span>
        </header>
        <h3>Functions</h3>
        {["Account & security", "Personalise", "Icon packs", "Running code"].map((item) => (
          <button className={section === item ? "active" : ""} onClick={() => setSection(item)} key={item}>
            {item}
            <span>›</span>
          </button>
        ))}
      </aside>
      <main>
        <header>
          <div>
            <small>POWER USER CONTROL</small>
            <h2>{section}</h2>
          </div>
          {section !== "Account & security" && (
            <button onClick={apply}>{saved ? "Applied ✓" : "Apply to profile"}</button>
          )}
        </header>
        {section === "Account & security" ? (
          <div className="account-security-panel">
            <section className="security-identity">
              <img src={getSystemIcon("Security Shield.png")} alt="" />
              <div>
                <small>CURRENT PROFILE</small>
                <h3>{p.profile}</h3>
                <span className={p.isAdmin ? "admin" : "standard"}>
                  {p.isAdmin ? "Device administrator" : "Standard user"}
                </span>
              </div>
            </section>
            <section className="password-change-card">
              <h3>Change A-OS password</h3>
              <div>
                <label>
                  Current password
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </label>
                <label>
                  New password
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </label>
                <label>
                  Confirm new password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>
              </div>
              <button
                onClick={changePassword}
                disabled={!currentPassword || newPassword.length < 4 || newPassword !== confirmPassword}
              >
                Change password
              </button>
            </section>
            <section className={`factory-reset-card${p.isAdmin ? "" : " locked"}`}>
              <img src={getSystemIcon(p.isAdmin ? "Error.png" : "Security Shield.png")} alt="" />
              <div>
                <h3>Factory reset</h3>
                <p>Erases every A-OS profile, app, file and setting on this device.</p>
                {p.isAdmin && (
                  <input
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="Current administrator password"
                  />
                )}
              </div>
              <button className="danger-action" disabled={!p.isAdmin || !resetPassword} onClick={factoryReset}>
                {p.isAdmin ? "Factory reset device" : "Administrator only"}
              </button>
            </section>
            {securityMessage && (
              <p className={`security-result ${securityMessage.ok ? "success" : "error"}`}>
                {securityMessage.text}
              </p>
            )}
          </div>
        ) : section === "Icon packs" ? (
          <div className="power-icon-packs">
            <div>
              {packs.map((pack) => (
                <button
                  className={draft.iconPack === pack.name ? "selected" : ""}
                  onClick={() => patch({ iconPack: pack.name })}
                  key={pack.name}
                >
                  <i>{pack.symbol}</i>
                  <span>
                    <b>{pack.name}</b>
                    <small>{pack.detail}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : section === "Personalise" ? (
          <div className="power-controls">
            <label>
              <span>
                <b>Taskbar colour</b>
              </span>
              <input type="color" value={draft.taskbarColour} onChange={(e) => patch({ taskbarColour: e.target.value })} />
            </label>
            <label>
              <span>
                <b>Lock-screen image</b>
              </span>
              <select value={draft.lockscreenImage} onChange={(e) => patch({ lockscreenImage: e.target.value })}>
                {allWalls.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <div className="power-code">
            <textarea value={draft.runningCode} onChange={(e) => patch({ runningCode: e.target.value })} />
            <button onClick={apply}>Apply running code</button>
          </div>
        )}
      </main>
    </div>
  );
}

export function AGame() {
  const [y, setY] = useState(0);
  const [bugs, setBugs] = useState([
    { x: 82, s: 1 },
    { x: 145, s: 0.65 },
    { x: 215, s: 1.25 },
  ]);
  const [cables, setCables] = useState([{ x: 120 }, { x: 260 }]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setBugs((items) =>
        items.map((b) => ({ ...b, x: b.x - 2 * b.s })).map((b) => (b.x < -8 ? { ...b, x: 108 + Math.random() * 80 } : b))
      );
      setCables((items) => items.map((c) => ({ ...c, x: c.x - 1.5 })).map((c) => (c.x < -5 ? { x: 150 + Math.random() * 120 } : c)));
      setScore((s) => s + 1);
    }, 35);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!y) return;
    const t = setTimeout(() => setY(0), 520);
    return () => clearTimeout(t);
  }, [y]);

  useEffect(() => {
    const hit = bugs.some((b) => b.x > 15 && b.x < 27 && y === 0);
    if (hit) {
      setLives((v) => {
        const n = v - 1;
        if (n <= 0) setRunning(false);
        return Math.max(0, n);
      });
      setBugs((items) => items.map((b) => (b.x > 15 && b.x < 27 ? { ...b, x: 120 } : b)));
    }
  }, [bugs, y]);

  const jump = () => {
    if (running && y === 0) setY(38);
  };

  return (
    <div
      className="agame"
      tabIndex={0}
      onClick={jump}
      onKeyDown={(e) => {
        if (e.code === "Space" || e.code === "ArrowUp") jump();
      }}
    >
      <header>
        <b>AGame</b>
        <span>{"♥".repeat(lives) || "No lives"}</span>
        <strong>{score} m</strong>
      </header>
      <main>
        <div className="agame-player" style={{ transform: `translateY(-${y}px)` }}>
          🧑‍💻
        </div>
        {bugs.map((b, i) => (
          <div className="agame-bug" style={{ left: `${b.x}%` }} key={i}>
            🐛
          </div>
        ))}
        {cables.map((c, i) => (
          <div className="agame-cable" style={{ left: `${c.x}%` }} key={i}>
            🔌
          </div>
        ))}
        <i />
      </main>
      <footer>{running ? "Tap or Space to jump" : "Game over"}</footer>
    </div>
  );
}

export function IconApp({ app, open }: any) {
  return (
    <div className="icon-app">
      <img src={getSystemIcon(`${app}.png`)} alt="" />
      <h2>{app}</h2>
      <p>A-OS System Component</p>
      {["video", "music", "images"].includes(app) && (
        <button onClick={() => open("mediaview")}>Open MediaView</button>
      )}
    </div>
  );
}

export function Simulator() {
  return (
    <div className="os-simulator">
      <header>
        <b>A-OS simulator</b>
      </header>
      <iframe src="/?simulator=1" title="A-OS simulator" />
    </div>
  );
}

export function AppManagerRow({ item, override, disabled, manage, toggle }: any) {
  const upload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => manage(item.id, { icon: String(reader.result) });
    reader.readAsDataURL(file);
  };
  return (
    <article className="app-manager-row">
      <img src={override?.icon?.startsWith("data:") ? override.icon : getSystemIcon(override?.icon || item.file)} alt="" />
      <input value={override?.name ?? item.name} onChange={(e) => manage(item.id, { name: e.target.value })} />
      <label>
        Change icon
        <input hidden type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0])} />
      </label>
      {toggle ? (
        <button onClick={() => toggle(item.id)}>{disabled ? "Reinstall" : "Uninstall"}</button>
      ) : (
        <small>System protected</small>
      )}
    </article>
  );
}

export function Settings(p: any) {
  const [section, setSection] = useState("Device");
  const [languageQuery, setLanguageQuery] = useState("");
  const wallUpload = useRef<HTMLInputElement>(null);

  const shownLanguages = languages.filter((item) =>
    `${item.label} ${item.native} ${item.code}`.toLowerCase().includes(languageQuery.toLowerCase())
  );

  const uploadWall = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => p.setWallpaper(String(r.result));
    r.readAsDataURL(file);
  };

  return (
    <div className="chrome-app">
      <aside>
        <h2>Settings</h2>
        {[
          ["Network", "Internet.png"],
          ["Users", "Profile.png"],
          ["Appearance", "Image.png"],
          ["Desktop", "PC.png"],
          ["Language", "Company.png"],
          ["Notifications", "Music.png"],
          ["Windows", "This PC.png"],
          ["Apps", "Downloads.png"],
          ["Security", "Security Shield.png"],
          ["Device", "This PC.png"],
          ["About", "OS Logo.png"],
        ].map((x) => (
          <button className={section === x[0] ? "active" : ""} onClick={() => setSection(x[0])} key={x[0]}>
            <img src={getSystemIcon(x[1])} alt="" />
            {x[0]}
          </button>
        ))}
      </aside>
      <main>
        <div className="settings-search">
          <span className="search-symbol" />
          Search settings
        </div>
        <h1>{section}</h1>
        {section === "Language" ? (
          <div className="language-settings">
            <section>
              <img src={getSystemIcon("Company.png")} alt="" />
              <div>
                <h2>{systemCopy(p.language as Language).language}</h2>
                <p>Choose from {languages.length} languages.</p>
              </div>
            </section>
            <label className="language-filter">
              <span className="search-symbol" />
              <input value={languageQuery} onChange={(e) => setLanguageQuery(e.target.value)} placeholder="Search languages" />
              <b>{shownLanguages.length}</b>
            </label>
            <div>
              {shownLanguages.map((item) => (
                <button
                  className={p.language === item.code ? "selected" : ""}
                  onClick={() => p.setLanguage(item.code)}
                  key={item.code}
                >
                  <span>
                    <b>{item.native}</b>
                    <small>{item.label}</small>
                  </span>
                  <i />
                </button>
              ))}
            </div>
          </div>
        ) : section === "Notifications" ? (
          <div className="preference-settings">
            <label className="toggle-row">
              <span>
                <b>Play notification sounds</b>
              </span>
              <input
                type="checkbox"
                checked={p.notificationSounds}
                onChange={(e) => p.setNotificationSounds(e.target.checked)}
              />
              <i />
            </label>
            <label className="range-setting">
              <span>
                <b>Notification volume</b>
                <small>{p.notificationVolume}%</small>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={p.notificationVolume}
                onChange={(e) => p.setNotificationVolume(Number(e.target.value))}
              />
            </label>
            <button className="test-notification" onClick={p.testNotification}>
              <img src={getSystemIcon("Music.png")} alt="" /> Test notification sound
            </button>
          </div>
        ) : section === "Windows" ? (
          <div className="preference-settings">
            <label className="toggle-row">
              <span>
                <b>Allow window resizing</b>
              </span>
              <input
                type="checkbox"
                checked={p.allowWindowResize}
                onChange={(e) => p.setAllowWindowResize(e.target.checked)}
              />
              <i />
            </label>
            <label className="toggle-row">
              <span>
                <b>Remember each app’s size</b>
              </span>
              <input
                type="checkbox"
                checked={p.rememberWindowSize}
                onChange={(e) => p.setRememberWindowSize(e.target.checked)}
              />
              <i />
            </label>
          </div>
        ) : section === "Desktop" ? (
          <div className="preference-settings">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 gap-3 mb-4">
              <div>
                <b className="text-white text-sm block flex items-center gap-1.5">
                  ✨ Desktop Widgets Hub
                </b>
                <span className="text-xs text-slate-400">
                  Add up to 100+ non-overlapping desktop widgets, auto-arrange grid, or drag anywhere
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("aos-open-widget-manager"))}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg transition cursor-pointer"
                >
                  ✨ Open Full Manager
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  let wList: any[] = [];
                  try {
                    wList = JSON.parse(localStorage.getItem("aos-desktop-widgets") || "[]");
                  } catch {}
                  const arranged = calculateNonOverlappingGrid(wList);
                  localStorage.setItem("aos-desktop-widgets", JSON.stringify(arranged));
                  window.dispatchEvent(new Event("aos-widgets-changed"));
                  p.testNotification?.();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 cursor-pointer"
              >
                📐 Auto-Arrange (Tidy Grid)
              </button>
            </div>

            <label className="toggle-row">
              <span>
                <b>Big OS Center Logo</b>
                <small>Display the large A-OS logo watermark in the center of the desktop</small>
              </span>
              <input
                type="checkbox"
                checked={localStorage.getItem("aos-show-center-logo") === "true"}
                onChange={(e) => {
                  localStorage.setItem("aos-show-center-logo", String(e.target.checked));
                  window.dispatchEvent(new Event("aos-center-logo-changed"));
                  // trigger local re-render
                  p.testNotification?.();
                }}
              />
              <i />
            </label>

            <div className="pt-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Quick Widget Library ({AVAILABLE_WIDGET_TYPES.length} Types)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {AVAILABLE_WIDGET_TYPES.map((item) => {
                  let currentWidgets: any[] = [];
                  try {
                    currentWidgets = JSON.parse(localStorage.getItem("aos-desktop-widgets") || "[]");
                  } catch {}
                  const count = currentWidgets.filter((w: any) => w.type === item.type).length;

                  return (
                    <div
                      key={item.type}
                      className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between"
                    >
                      <div className="mb-2">
                        <div className="flex items-center justify-between">
                          <b className="text-xs text-white">{item.name}</b>
                          {count > 0 && (
                            <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded-full border border-cyan-800">
                              {count} active
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{item.desc}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            let wList: any[] = [];
                            try {
                              wList = JSON.parse(localStorage.getItem("aos-desktop-widgets") || "[]");
                            } catch {}
                            const pos = findNextSafeSlot(wList, item.defaultWidth, item.defaultHeight);
                            wList.push({
                              id: `widget-${item.type}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                              type: item.type,
                              title: item.name,
                              x: pos.x,
                              y: pos.y,
                              width: item.defaultWidth,
                              height: item.defaultHeight,
                            });
                            localStorage.setItem("aos-desktop-widgets", JSON.stringify(wList));
                            window.dispatchEvent(new Event("aos-widgets-changed"));
                            p.testNotification?.();
                          }}
                          className="flex-1 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20"
                        >
                          + Add to Desktop
                        </button>
                        {count > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              let wList: any[] = [];
                              try {
                                wList = JSON.parse(localStorage.getItem("aos-desktop-widgets") || "[]");
                              } catch {}
                              wList = wList.filter((w: any) => w.type !== item.type);
                              localStorage.setItem("aos-desktop-widgets", JSON.stringify(wList));
                              window.dispatchEvent(new Event("aos-widgets-changed"));
                              p.testNotification?.();
                            }}
                            className="px-3 py-1.5 rounded-xl font-bold text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : section === "Appearance" ? (
          <>
            <div className="appearance-actions">
              <label>
                Dark mode
                <input type="checkbox" checked={p.darkMode} onChange={(e) => p.setDarkMode(e.target.checked)} />
                <i />
              </label>
              <button onClick={() => wallUpload.current?.click()}>
                <img src={getSystemIcon("Image.png")} alt="" />
                Upload background
              </button>
              <input ref={wallUpload} hidden type="file" accept="image/*" onChange={(e) => uploadWall(e.target.files?.[0])} />
            </div>
            <div className="wall-grid">
              {allWalls.map((w) => (
                <button className={p.wallpaper === w ? "selected" : ""} onClick={() => p.setWallpaper(w)} key={w}>
                  <span>{w.replace(".png", "")}</span>
                </button>
              ))}
            </div>
          </>
        ) : section === "Apps" ? (
          <div className="taskbar-editor">
            <section className="app-management">
              <h2>Installed apps</h2>
              {taskbarApps.map((item) => (
                <AppManagerRow
                  key={item.id}
                  item={item}
                  override={p.appOverrides?.[item.id]}
                  disabled={p.disabledApps?.includes(item.id)}
                  manage={p.manageApp}
                  toggle={p.toggleApp}
                />
              ))}
            </section>
          </div>
        ) : section === "Users" ? (
          <div className="settings-cards">
            <section>
              <img src={getSystemIcon("Profile.png")} alt="" />
              <div>
                <b>{p.profile}</b>
                <span>{p.email || "Local A-OS profile"}</span>
              </div>
            </section>
            <button className="setting-row" onClick={p.profilePopup}>
              <span>
                <b>Add or change profile</b>
                <small>Manage user profile</small>
              </span>
              <img src={getSystemIcon("Arrow Right.png")} alt="" />
            </button>
          </div>
        ) : section === "Device" ? (
          <div className="settings-cards">
            <section>
              <img src={getSystemIcon("This PC.png")} alt="" />
              <div>
                <b>{p.deviceName}</b>
                <span>Fast, secure and up to date</span>
              </div>
            </section>
            <button className="setting-row" onClick={p.versionTap}>
              <span>
                <b>Device version</b>
                <small>A-OS v1.2.1 · Stable</small>
              </span>
              <img src={getSystemIcon("Arrow Right.png")} alt="" />
            </button>
            <button className="setting-row overpowered-setting" onClick={() => p.open("deviceoverpowered")}>
              <span>
                <b>OverPowered</b>
                <small>Account security and advanced controls</small>
              </span>
              <img src={getSystemIcon("Arrow Right.png")} alt="" />
            </button>
          </div>
        ) : (
          <div className="settings-cards">
            <section>
              <img src={getSystemIcon("Security Shield.png")} alt="" />
              <div>
                <b>{section} is ready</b>
                <span>Recommended settings are active.</span>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
