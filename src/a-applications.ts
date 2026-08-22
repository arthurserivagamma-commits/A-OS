export const A_APPLICATIONS_SYNC_OPTIONS_KEY = "aos-aapplications-sync-options";

export type AApplicationsSession = {
  uid: string;
  email: string;
  token: string;
  name?: string;
  createdAt?: number;
};

export type AApplicationsSyncOptions = {
  files: boolean;
  settings: boolean;
};

const SESSION_KEY = "aos-aapplications-session";
const ACCOUNTS_KEY = "aos-aapplications-registered-accounts";
const CLOUD_BACKUPS_KEY = "aos-aapplications-cloud-storage-";

export function loadAApplicationsSession(): AApplicationsSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAApplicationsSession(session: AApplicationsSession | null): void {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {}
}

export async function authenticateAApplications(
  mode: "login" | "signup",
  email: string,
  password: string
): Promise<AApplicationsSession> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    throw new Error("Please enter a valid email address.");
  }
  if (!password || password.length < (mode === "signup" ? 6 : 1)) {
    throw new Error(
      mode === "signup"
        ? "Password must be at least 6 characters."
        : "Please enter your password."
    );
  }

  // Simulate network delay for realism
  await new Promise((r) => setTimeout(r, 450));

  let accounts: Record<string, { uid: string; email: string; passHash: string }> = {};
  try {
    accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
  } catch {}

  const passHash = btoa(password);

  if (mode === "signup") {
    if (accounts[normalizedEmail]) {
      // If account exists and password matches, allow login
      if (accounts[normalizedEmail].passHash === passHash) {
        const session: AApplicationsSession = {
          uid: accounts[normalizedEmail].uid,
          email: normalizedEmail,
          token: `aatok_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          createdAt: Date.now(),
        };
        saveAApplicationsSession(session);
        return session;
      }
      throw new Error("An A-Applications account with this email already exists. Please log in.");
    }

    const uid = `aauid_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    accounts[normalizedEmail] = {
      uid,
      email: normalizedEmail,
      passHash,
    };
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch {}

    const session: AApplicationsSession = {
      uid,
      email: normalizedEmail,
      token: `aatok_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: Date.now(),
    };
    saveAApplicationsSession(session);
    return session;
  } else {
    // login mode
    const existing = accounts[normalizedEmail];
    if (!existing) {
      // Auto-register convenience or verify password
      const uid = `aauid_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      accounts[normalizedEmail] = {
        uid,
        email: normalizedEmail,
        passHash,
      };
      try {
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      } catch {}

      const session: AApplicationsSession = {
        uid,
        email: normalizedEmail,
        token: `aatok_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        createdAt: Date.now(),
      };
      saveAApplicationsSession(session);
      return session;
    }

    if (existing.passHash !== passHash) {
      throw new Error("Incorrect A-Applications password.");
    }

    const session: AApplicationsSession = {
      uid: existing.uid,
      email: normalizedEmail,
      token: `aatok_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: Date.now(),
    };
    saveAApplicationsSession(session);
    return session;
  }
}

export function getAApplicationsAccount(email: string): { uid: string; email: string; password?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
    const item = accounts[email.trim().toLowerCase()];
    if (!item) return null;
    return {
      uid: item.uid,
      email: item.email,
      password: atob(item.passHash || ""),
    };
  } catch {
    return null;
  }
}

export function saveAApplicationsAccount(email: string, password: string): void {
  if (typeof window === "undefined") return;
  try {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
    const normalizedEmail = email.trim().toLowerCase();
    accounts[normalizedEmail] = {
      uid: `aauid_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      email: normalizedEmail,
      passHash: btoa(password),
    };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {}
}

export function getAApplicationsSession(): AApplicationsSession | null {
  return loadAApplicationsSession();
}

export function setAApplicationsSession(session: AApplicationsSession | null): void {
  saveAApplicationsSession(session);
}

export function removeAApplicationsSession(): void {
  saveAApplicationsSession(null);
}

export function loadAApplicationsSetting(key: string): any {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`aos-aapp-${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAApplicationsSetting(key: string, value: any): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`aos-aapp-${key}`, JSON.stringify(value));
  } catch {}
}

export function saveAApplicationsSyncItem(key: string, value: any): void {
  saveAApplicationsSetting(key, value);
}

