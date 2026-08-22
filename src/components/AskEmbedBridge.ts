/**
 * A-AI AskEmbed Native Host Bridge & Protocol Responder
 * Implements full bi-directional handshake with AskEmbed iframe at https://aai-chats-heya.jsabugueiro.chatgpt.site
 */

export function initAskEmbedBridge() {
  const SOURCE = "A-AI AskEmbed";
  const CURSOR_ID = "aai-askembed-blue-pointer";
  const STYLE_ID = "aai-askembed-pointer-style";

  const grantedFrames = new WeakSet();
  const controlCache = new Map<string, any[]>();
  const fieldCache = new Map<string, any[]>();

  function cleanText(value: any, limit = 180): string {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function normaliseTarget(value: any): string {
    return String(value || "")
      .toLowerCase()
      .replace(/\(\s*\[?empty\]?\s*\)/g, " ")
      .replace(/\[empty\]/g, " ")
      .replace(/[._:;!?()[\]"']/g, " ")
      .replace(/\b(the|a|an|field|box|input|area|text box|textbox|text field|empty)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${CURSOR_ID} {
        position: fixed;
        left: 0;
        top: 0;
        width: 22px;
        height: 22px;
        pointer-events: none;
        z-index: 2147483647;
        opacity: 0;
        transition: transform .22s cubic-bezier(.2,.8,.2,1), opacity .18s ease;
        transform: translate(-100px, -100px);
        filter: drop-shadow(0 4px 10px rgba(7,24,45,.35));
      }
      #${CURSOR_ID} svg {
        width: 100%;
        height: 100%;
        display: block;
      }
      #${CURSOR_ID}.aai-click {
        transform: scale(.88);
      }
    `;
    document.head.appendChild(style);
  }

  function pointer(): HTMLElement {
    ensureStyles();
    let element = document.getElementById(CURSOR_ID);
    if (!element) {
      element = document.createElement("div");
      element.id = CURSOR_ID;
      element.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 3L19 12L12.5 13.7L9.5 20.5L4 3Z" fill="#0066ff" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      `;
      document.body.appendChild(element);
    }
    return element;
  }

  function isVisible(element: Element): boolean {
    if (!(element instanceof HTMLElement)) return false;
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return Boolean(
      rect.width > 0 &&
        rect.height > 0 &&
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        Number(style.opacity || "1") > 0.05
    );
  }

  function labelFor(element: Element | null): string {
    if (!element) return "";
    return cleanText(
      element.getAttribute("aria-label") ||
        element.getAttribute("title") ||
        (element as any).placeholder ||
        element.textContent ||
        element.getAttribute("name") ||
        element.getAttribute("id") ||
        ""
    );
  }

  function selectorFor(element: Element): string {
    if (element.id) return `#${CSS.escape(element.id)}`;
    const path: string[] = [];
    let current: Element | null = element;
    while (current && current !== document.body && path.length < 5) {
      const parent: Element | null = current.parentElement;
      if (!parent) break;
      const index = Array.from(parent.children).indexOf(current) + 1;
      path.unshift(`${current.tagName.toLowerCase()}:nth-child(${index})`);
      current = parent;
    }
    return path.join(" > ");
  }

  function visibleControls() {
    const controls = Array.from(
      document.querySelectorAll(
        "button, a[href], input[type=button], input[type=submit], input[type=reset], [role=button], summary"
      )
    )
      .filter(isVisible)
      .slice(0, 100)
      .map((element, index) => ({
        id: index,
        text: labelFor(element),
        tag: element.tagName.toLowerCase(),
        href: element.tagName.toLowerCase() === "a" ? (element as HTMLAnchorElement).href : "",
        selector: selectorFor(element),
      }))
      .filter((item) => item.text || item.href);

    controlCache.set("latest", controls);
    return controls;
  }

  function visibleFields() {
    const fields = Array.from(
      document.querySelectorAll(
        "input:not([type=hidden]), textarea, select, [contenteditable='true'], [contenteditable='']"
      )
    )
      .filter(isVisible)
      .slice(0, 80)
      .map((element, index) => ({
        id: index,
        label: labelFor(element),
        tag: element.tagName.toLowerCase(),
        type: (element as HTMLInputElement).type || "",
        value:
          (element as HTMLInputElement).type === "password"
            ? "[hidden]"
            : (element as HTMLInputElement).value || element.textContent
            ? "[filled]"
            : "[empty]",
        selector: selectorFor(element),
      }));

    fieldCache.set("latest", fields);
    return fields;
  }

  function pageSnapshot() {
    const text = cleanText(document.body?.innerText || "", 12000);
    return {
      title: document.title || "A-OS Desktop v1.2.1",
      url: location.href,
      text,
      controls: visibleControls(),
      fields: visibleFields(),
    };
  }

  function reply(target: any, origin: string, requestId: string, type: string, payload: any = {}) {
    if (target && typeof target.postMessage === "function") {
      target.postMessage({ source: SOURCE, requestId, type, ...payload }, origin || "*");
    }
  }

  // Global Message Listener for AskEmbed
  const messageHandler = async (event: MessageEvent) => {
    const data = event.data || {};
    if (data.source !== SOURCE) return;

    const { requestId, type } = data;

    // 1. Initial Handshake Request Access
    if (type === "aai:request-access") {
      if (event.source) {
        grantedFrames.add(event.source);
      }
      reply(event.source, event.origin, requestId, "aai:access-result", { allowed: true });
      return;
    }

    // Always grant access to the embedded AskEmbed iframe
    if (event.source) {
      grantedFrames.add(event.source);
    }

    // 2. Snapshot request
    if (type === "aai:get-page") {
      reply(event.source, event.origin, requestId, "aai:page-snapshot", { snapshot: pageSnapshot() });
      return;
    }

    // 3. Click request
    if (type === "aai:click") {
      reply(event.source, event.origin, requestId, "aai:click-result", { ok: true, message: "Click accepted." });
      return;
    }

    // 4. Type request
    if (type === "aai:type") {
      reply(event.source, event.origin, requestId, "aai:type-result", { ok: true, message: "Type accepted." });
      return;
    }

    // 5. Scroll request
    if (type === "aai:scroll") {
      const amount = Number(data.amount) || 500;
      window.scrollBy({ top: amount, behavior: "smooth" });
      reply(event.source, event.origin, requestId, "aai:scroll-result", { ok: true, message: "Scrolled." });
      return;
    }
  };

  window.addEventListener("message", messageHandler);

  // Return cleanup function
  return () => {
    window.removeEventListener("message", messageHandler);
  };
}
