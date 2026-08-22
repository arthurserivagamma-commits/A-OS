import { FormEvent, useState } from "react";
import { authenticateAApplications, AApplicationsSession } from "../a-applications";

export function AApplicationsAuthForm({
  onSuccess,
  embedded = false,
  initialEmail = "",
}: {
  onSuccess: (session: AApplicationsSession) => void;
  embedded?: boolean;
  initialEmail?: string;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [connected, setConnected] = useState<AApplicationsSession | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const session = await authenticateAApplications(mode, email, password);
      setConnected(session);
      setPassword("");
      setMessage({
        ok: true,
        text: mode === "signup" ? "Account created and connected to A-OS." : "Logged in to A-OS.",
      });
      onSuccess(session);
    } catch (error: any) {
      setMessage({ ok: false, text: error?.message || "A-Applications could not connect." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className={`a-applications-auth${embedded ? " embedded" : ""}`} onSubmit={submit}>
      <header>
        <span className="a-applications-mark">A</span>
        <div>
          <small>A-APPLICATIONS</small>
          <h2>{connected ? "Connected to A-OS" : mode === "login" ? "Login to A-OS" : "Create A-Applications account"}</h2>
          <p>{connected ? connected.email : "One account for A-OS unlock and optional cross-device sync."}</p>
        </div>
      </header>
      {!connected && (
        <>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={mode === "signup" ? "At least 6 characters" : "A-Applications password"}
              minLength={mode === "signup" ? 6 : 1}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
            />
          </label>
          <button
            className="a-applications-submit"
            disabled={busy || !/^\S+@\S+\.\S+$/.test(email) || password.length < (mode === "signup" ? 6 : 1)}
          >
            {busy ? "Connecting…" : mode === "login" ? "Login" : "Sign up"}
          </button>
          <button
            type="button"
            className="a-applications-switch"
            onClick={() => {
              setMode((value) => (value === "login" ? "signup" : "login"));
              setMessage(null);
            }}
          >
            {mode === "login" ? "Don’t have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </>
      )}
      {message && <p className={`a-applications-message ${message.ok ? "success" : "error"}`}>{message.text}</p>}
      <footer>
        <span>✓ Passwords are checked by A-Applications</span>
        <span>✓ A-OS never stores your password</span>
      </footer>
    </form>
  );
}

export function AApplicationsLoginApp(p: any) {
  return (
    <div className="a-applications-login-app">
      <aside>
        <span className="a-applications-mark">A</span>
        <h2>Your A-OS follows you</h2>
        <p>
          Sign in to link this profile. The Settings window stays open behind this one and updates as soon as login succeeds.
        </p>
        <div>
          <b>Unlock A-OS</b>
          <span>Use your A-Applications password from the lock screen.</span>
          <b>Choose what syncs</b>
          <span>Files and device settings are separate opt-in controls.</span>
        </div>
      </aside>
      <main>
        <AApplicationsAuthForm
          initialEmail={p.currentProfile?.aApplicationsEmail || ""}
          onSuccess={(session) => {
            p.linkAApplicationsSession(session);
            setTimeout(() => p.closeSelf?.(), 350);
          }}
        />
      </main>
    </div>
  );
}
