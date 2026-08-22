import { FormEvent, useEffect, useRef, useState } from "react";
import { WEB_RUNTIME } from "../constants";
import { getSystemIcon } from "../icon-assets";

type BrowserTab = {
  id: string;
  url: string;
  title: string;
  trail: string[];
  cursor: number;
  revision: number;
  wiki?: {
    query: string;
    title: string;
    answer: string;
    sourceUrl: string;
    words: number;
    loading: boolean;
    error?: string;
  };
};

const BROWSER_HOME = "https://newtabosinternet.oneapp.dev/";

const addressToUrl = (value: string) => {
  const clean = value.trim();
  if (!clean) return BROWSER_HOME;
  if (/^https?:\/\//i.test(clean)) return clean;
  if (/^[\w.-]+\.[a-z]{2,}(?:[/:?#]|$)/i.test(clean)) return `https://${clean}`;
  return `https://www.google.com/search?q=${encodeURIComponent(clean)}`;
};

const pageTitle = (value: string) => {
  if (value === BROWSER_HOME) return "New Tab";
  try {
    return new URL(value).hostname.replace(/^www\./, "") || "Website";
  } catch {
    return "Website";
  }
};

export function BrowserRuntime({
  url,
  title,
  chrome = false,
  onDownload,
  onOpenWebWindow,
}: {
  url: string;
  title: string;
  chrome?: boolean;
  onDownload?: (url: string, name?: string) => void;
  onOpenWebWindow?: (url: string, title: string) => void;
}) {
  const firstId = useRef(`tab-${Date.now()}`);
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: firstId.current,
      url,
      title: pageTitle(url),
      trail: [url],
      cursor: 0,
      revision: 0,
    },
  ]);
  const [activeId, setActiveId] = useState(firstId.current);
  const [address, setAddress] = useState(url);
  const [ready, setReady] = useState<Record<string, boolean>>({});
  const [showPins, setShowPins] = useState(true);
  const [tabStoreReady, setTabStoreReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [failure, setFailure] = useState<Record<string, string>>({});
  const [online, setOnline] = useState(true);

  const active = tabs.find((tab) => tab.id === activeId) || tabs[0];
  const currentUrl = chrome && /^https?:/i.test(active.url) ? active.url : url;
  const source = `${WEB_RUNTIME}?goto=${encodeURIComponent(currentUrl)}&aos=${active?.revision || 0}`;

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    const key = chrome ? active.id : "simple";
    const done = chrome ? ready[active.id] : loaded;
    if (done || failure[key] || !online) return;
    const timer = setTimeout(
      () =>
        setFailure((value) => ({
          ...value,
          [key]: "The website is taking longer than expected. OSInternet kept your tab and is ready to retry.",
        })),
      12000
    );
    return () => clearTimeout(timer);
  }, [chrome, active.id, active.revision, attempt, ready, loaded, online, failure]);

  useEffect(() => {
    if (!chrome) return;
    try {
      const saved = JSON.parse(localStorage.getItem("aos-browser-tabs") || "[]") as BrowserTab[];
      if (Array.isArray(saved) && saved.length) {
        const restored = saved.slice(0, 12).map((tab) => {
          const nextUrl = tab.wiki ? addressToUrl(tab.wiki.query) : tab.url;
          return {
            ...tab,
            url: nextUrl,
            title: pageTitle(nextUrl),
            trail: tab.wiki ? [nextUrl] : tab.trail,
            cursor: tab.wiki ? 0 : tab.cursor,
            revision: Number(tab.revision || 0) + 1,
            wiki: undefined,
          };
        });
        const savedActive = localStorage.getItem("aos-browser-active");
        const selected = restored.find((tab) => tab.id === savedActive) || restored[0];
        setTabs(restored);
        setActiveId(selected.id);
        setAddress(selected.url);
      }
      setShowPins(localStorage.getItem("aos-browser-pins") !== "false");
    } catch {}
    setTabStoreReady(true);
  }, [chrome]);

  useEffect(() => {
    if (!chrome || !tabStoreReady) return;
    localStorage.setItem("aos-browser-tabs", JSON.stringify(tabs));
    localStorage.setItem("aos-browser-active", activeId);
    localStorage.setItem("aos-browser-pins", String(showPins));
  }, [chrome, tabStoreReady, tabs, activeId, showPins]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object" || !["aos-download", "aos:download"].includes(data.type) || !onDownload)
        return;
      onDownload(String(data.url || active?.url || url), data.name ? String(data.name) : undefined);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [onDownload, active?.url, url]);

  const navigate = (value: string) => {
    const clean = value.trim();
    const nextUrl = addressToUrl(clean);
    setAddress(nextUrl);
    setReady((val) => ({ ...val, [active.id]: false }));
    setFailure((val) => ({ ...val, [active.id]: "" }));
    setTabs((val) =>
      val.map((tab) => {
        if (tab.id !== active.id) return tab;
        const trail = [...tab.trail.slice(0, tab.cursor + 1), nextUrl];
        return {
          ...tab,
          url: nextUrl,
          title: pageTitle(nextUrl),
          trail,
          cursor: trail.length - 1,
          revision: tab.revision + 1,
          wiki: undefined,
        };
      })
    );
  };

  const moveHistory = (amount: number) => {
    const cursor = Math.max(0, Math.min(active.trail.length - 1, active.cursor + amount));
    if (cursor === active.cursor) return;
    const nextUrl = active.trail[cursor];
    setAddress(nextUrl);
    setReady((val) => ({ ...val, [active.id]: false }));
    setTabs((val) =>
      val.map((tab) =>
        tab.id === active.id
          ? {
              ...tab,
              cursor,
              url: nextUrl,
              title: pageTitle(nextUrl),
              revision: tab.revision + 1,
              wiki: undefined,
            }
          : tab
      )
    );
  };

  const addTab = () => {
    const id = `tab-${Date.now()}-${tabs.length}`;
    setTabs((val) => [
      ...val,
      { id, url: BROWSER_HOME, title: "New Tab", trail: [BROWSER_HOME], cursor: 0, revision: 0 },
    ]);
    setActiveId(id);
    setAddress(BROWSER_HOME);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) {
      navigate(BROWSER_HOME);
      return;
    }
    const index = tabs.findIndex((tab) => tab.id === id);
    const remaining = tabs.filter((tab) => tab.id !== id);
    setTabs(remaining);
    if (id === activeId) {
      const next = remaining[Math.min(index, remaining.length - 1)];
      setActiveId(next.id);
      setAddress(next.url);
    }
  };

  const reload = () => {
    setReady((val) => ({ ...val, [active.id]: false }));
    setFailure((val) => ({ ...val, [active.id]: "" }));
    setTabs((val) =>
      val.map((tab) => (tab.id === active.id ? { ...tab, revision: tab.revision + 1 } : tab))
    );
  };

  if (chrome) {
    return (
      <div className="aos-browser">
        <div className="browser-tabs" role="tablist" aria-label="Browser tabs">
          <div className="browser-tab-scroll">
            {tabs.map((tab) => (
              <button
                className={`browser-tab${tab.id === activeId ? " active" : ""}`}
                key={tab.id}
                onClick={() => {
                  setActiveId(tab.id);
                  setAddress(tab.url);
                }}
                role="tab"
                aria-selected={tab.id === activeId}
              >
                <img src={getSystemIcon("Internet.png")} alt="" />
                <span>{tab.title}</span>
                <i
                  role="button"
                  aria-label={`Close ${tab.title}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  ×
                </i>
              </button>
            ))}
          </div>
          <button className="browser-new-tab" onClick={addTab} aria-label="New tab">
            +
          </button>
        </div>
        <form
          className="browser-toolbar"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            navigate(address);
          }}
        >
          <div className="browser-nav">
            <button type="button" onClick={() => moveHistory(-1)} disabled={active.cursor === 0} aria-label="Back">
              ←
            </button>
            <button
              type="button"
              onClick={() => moveHistory(1)}
              disabled={active.cursor === active.trail.length - 1}
              aria-label="Forward"
            >
              →
            </button>
            <button type="button" onClick={reload} aria-label="Reload">
              ↻
            </button>
            <button type="button" onClick={() => navigate(BROWSER_HOME)} aria-label="Home">
              ⌂
            </button>
          </div>
          <button type="button" className="browser-text-button" onClick={() => setShowPins((val) => !val)}>
            Ext
          </button>
          <button
            type="button"
            className="browser-text-button browser-new-window"
            onClick={() => onOpenWebWindow?.(active.url, active.title)}
          >
            Web Window
          </button>
          <button
            type="button"
            className="browser-text-button browser-download"
            onClick={() => onDownload?.(active.url, active.title)}
          >
            ↓ A-OS
          </button>
          <label className="browser-address">
            <span>◉</span>
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              onFocus={(event) => event.currentTarget.select()}
              aria-label="Address and search bar"
              placeholder="Search the web or type a URL"
              spellCheck={false}
            />
          </label>
          <button type="button" className="browser-globe" onClick={() => navigate(active.url)} aria-label="Open address">
            ◎
          </button>
          <button type="button" className="browser-text-button" onClick={() => setShowPins((val) => !val)}>
            Pins
          </button>
          <button type="button" className="browser-toolbar-plus" onClick={addTab} aria-label="New tab">
            +
          </button>
        </form>
        {showPins && (
          <nav className="browser-bookmarks" aria-label="Bookmarks">
            <button onClick={() => navigate("https://www.google.com/")}>Google</button>
            <button onClick={() => navigate("https://chatgpt.com/")}>A-AI</button>
            <button onClick={() => navigate("https://www.youtube.com/")}>YouTube</button>
            <button onClick={() => navigate("https://mail.google.com/")}>Gmail</button>
          </nav>
        )}
        <div
          className={`browser-viewport${active.url === BROWSER_HOME ? " browser-home-target" : ""}${
            ready[active.id] ? " runtime-ready" : ""
          }`}
        >
          {!ready[active.id] && (
            <div className="runtime-loading" aria-live="polite">
              <img src={getSystemIcon("Internet.png")} alt="" />
              <span>
                <b>Opening {active.title}</b>
                <small>Preparing the website…</small>
              </span>
              <i />
            </div>
          )}
          <iframe
            key={`${active.id}-${active.revision}`}
            src={source}
            loading="eager"
            title={active.title}
            onLoad={() => {
              setReady((val) => ({ ...val, [active.id]: true }));
              setFailure((val) => ({ ...val, [active.id]: "" }));
            }}
            onError={() => {
              setReady((val) => ({ ...val, [active.id]: false }));
              setFailure((val) => ({ ...val, [active.id]: "OSInternet could not reach this page." }));
            }}
            allow="clipboard-read; clipboard-write; fullscreen; autoplay; encrypted-media; picture-in-picture; web-share"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals allow-presentation allow-top-navigation-by-user-activation"
            referrerPolicy="no-referrer"
          />
          {(!online || failure[active.id]) && (
            <section className="browser-recovery" role="alert">
              <img src={getSystemIcon(online ? "Reboot.png" : "Internet.png")} alt="" />
              <h2>{online ? "This page needs another try" : "You’re offline"}</h2>
              <p>
                {online
                  ? failure[active.id]
                  : "OSInternet kept every tab. Reconnect and retry without losing your place."}
              </p>
              <div>
                <button onClick={reload}>Retry in OSInternet</button>
                {online && (
                  <a href={active.url} target="_blank" rel="noreferrer">
                    Open source website
                  </a>
                )}
              </div>
            </section>
          )}
          <button className="runtime-retry" onClick={reload} aria-label={`Reload ${active.title}`}>
            <img src={getSystemIcon("Reboot.png")} alt="" />
          </button>
        </div>
      </div>
    );
  }

  const simpleSource = `${WEB_RUNTIME}?goto=${encodeURIComponent(url)}&aos=${attempt}`;
  return (
    <div className={`webapp web-runtime${loaded ? " runtime-ready" : ""}`}>
      {!loaded && (
        <div className="runtime-loading" aria-live="polite">
          <img src={getSystemIcon("Internet.png")} alt="" />
          <span>
            <b>Opening {title}</b>
            <small>Preparing the website…</small>
          </span>
          <i />
        </div>
      )}
      <iframe
        key={attempt}
        src={simpleSource}
        title={title}
        onLoad={() => {
          setLoaded(true);
          setFailure((val) => ({ ...val, simple: "" }));
        }}
        onError={() => {
          setLoaded(false);
          setFailure((val) => ({ ...val, simple: "OSInternet could not reach this page." }));
        }}
        allow="clipboard-read; clipboard-write; fullscreen; autoplay; encrypted-media; picture-in-picture; web-share"
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals allow-presentation allow-top-navigation-by-user-activation"
        referrerPolicy="no-referrer"
      />
      {(!online || failure.simple) && (
        <section className="browser-recovery" role="alert">
          <img src={getSystemIcon(online ? "Reboot.png" : "Internet.png")} alt="" />
          <h2>{online ? "This app needs another try" : "You’re offline"}</h2>
          <p>{online ? failure.simple : "Reconnect and A-OS will keep this window ready."}</p>
          <div>
            <button
              onClick={() => {
                setLoaded(false);
                setFailure((val) => ({ ...val, simple: "" }));
                setAttempt((val) => val + 1);
              }}
            >
              Retry
            </button>
            {online && (
              <a href={url} target="_blank" rel="noreferrer">
                Open source website
              </a>
            )}
          </div>
        </section>
      )}
      <button
        className="runtime-retry"
        onClick={() => {
          setLoaded(false);
          setFailure((val) => ({ ...val, simple: "" }));
          setAttempt((val) => val + 1);
        }}
        aria-label={`Reload ${title}`}
      >
        <img src={getSystemIcon("Reboot.png")} alt="" />
      </button>
    </div>
  );
}
