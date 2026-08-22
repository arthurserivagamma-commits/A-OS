import { useEffect, useState } from "react";
import { engines } from "../constants";
import { getSystemIcon, getSystemWallpaper } from "../icon-assets";
import { AApplicationsSession } from "../a-applications";
import { AApplicationsAuthForm } from "./Auth";

export function Setup(p: any) {
  const [nearby, setNearby] = useState<{ ssid: string; secure: boolean; strength: number }[]>([]);
  const [useAApplications, setUseAApplications] = useState(true);
  const [linkedSession, setLinkedSession] = useState<AApplicationsSession | null>(null);

  useEffect(() => {
    const bridge = (window as any).aosNetworkBridge;
    if (bridge?.scan) {
      Promise.resolve(bridge.scan())
        .then((items: any[]) =>
          setNearby(
            items
              .filter((item) => item?.ssid)
              .map((item) => ({
                ssid: String(item.ssid),
                secure: item.secure !== false,
                strength: Number(item.strength) || 2,
              }))
          )
        )
        .catch(() => setNearby([]));
    }
  }, []);

  const chooseNetwork = async (item: { ssid: string; secure: boolean }) => {
    if (item.ssid === "A-OS Virtual") return p.setNetwork(item.ssid);
    const bridge = (window as any).aosNetworkBridge;
    if (!bridge?.connect) return;
    const password = item.secure ? window.prompt(`Password for ${item.ssid}`) : "";
    if (item.secure && !password) return;
    const ok = await Promise.resolve(bridge.connect(item.ssid, password));
    if (ok) p.setNetwork(item.ssid);
    else window.alert("Incorrect Wi-Fi password or the network could not be joined.");
  };

  const titles = [
    "Welcome to A-OS",
    "Choose your search engine",
    "Create your profile",
    "Connect to the internet",
    "Secure your computer",
    "You’re ready",
  ];

  return (
    <main className="setup">
      <aside>
        <img src={getSystemIcon("OS Logo.png")} alt="A-OS" />
        <b>A-OS</b>
        <ol>
          {titles.map((x: string, i: number) => (
            <li className={i === p.step ? "active" : i < p.step ? "done" : ""} key={x}>
              <span>{i < p.step ? <img src={getSystemIcon("Tick.png")} alt="" /> : i + 1}</span>
              {x}
            </li>
          ))}
        </ol>
      </aside>
      <section className="setup-content">
        <header>
          <small>STEP {p.step + 1} OF 6</small>
          <h1>{titles[p.step]}</h1>
          <p>
            {
              [
                "A faster, calmer computer built around you.",
                "This powers search in WebA and the A-OS launcher.",
                "An A-Applications account is recommended, with local-only setup still available.",
                "Select a network to finish setting up your computer.",
                "Create the password used on the lock screen.",
                "Your A-OS Computer is configured and ready.",
              ][p.step]
            }
          </p>
        </header>
        {p.step === 0 && (
          <div className="hero-setup">
            <img src={getSystemWallpaper("Aqua A (Default).png")} alt="A-OS desktop preview" />
            <div>
              <img src={getSystemIcon("Security Shield Assistant.png")} alt="" />
              <b>Private by design</b>
              <span>Your choices stay local unless you turn on A-Applications sync.</span>
            </div>
          </div>
        )}
        {p.step === 1 && (
          <div className="choice-grid">
            {engines.map((e) => (
              <button
                className={p.engine === e.name ? "selected" : ""}
                onClick={() => p.setEngine(e.name)}
                key={e.name}
              >
                <img src={`https://www.google.com/s2/favicons?domain=${e.domain}&sz=128`} alt="" />
                <span>
                  <b>{e.name}</b>
                  <small>{e.copy}</small>
                </span>
                <i />
              </button>
            ))}
          </div>
        )}
        {p.step === 2 && (
          <div className="setup-account-choice">
            <button
              className={`a-applications-option${useAApplications ? " selected" : ""}`}
              onClick={() => setUseAApplications(true)}
            >
              <span className="a-applications-mark">A</span>
              <span>
                <small>RECOMMENDED</small>
                <b>Sign in with A-Applications</b>
                <em>Use the same account password to unlock A-OS.</em>
              </span>
              <i />
            </button>
            {useAApplications && (
              <AApplicationsAuthForm
                embedded
                onSuccess={(session) => {
                  setLinkedSession(session);
                  p.onAApplicationsSignedIn(session);
                }}
              />
            )}
            <button
              className={`local-account-option${!useAApplications ? " selected" : ""}`}
              onClick={() => setUseAApplications(false)}
            >
              <img src={getSystemIcon("Profile.png")} alt="" />
              <span>
                <b>Use a local profile only</b>
                <small>You can link A-Applications when creating another profile later.</small>
              </span>
              <i />
            </button>
          </div>
        )}
        {p.step === 3 && (
          <div className="network-list">
            {[{ ssid: "A-OS Virtual", secure: false, strength: 3 }, ...nearby].map((item, i) => (
              <button
                className={p.network === item.ssid ? "selected" : ""}
                onClick={() => void chooseNetwork(item)}
                key={item.ssid}
              >
                <span className={`wifi-bars bars-${3 - i}`}>
                  <i />
                  <i />
                  <i />
                </span>
                <span>
                  <b>{item.ssid}</b>
                  <small>
                    {i === 0
                      ? "Connected · No password"
                      : item.secure
                      ? "Real nearby network · Password required"
                      : "Real nearby network · Open"}
                  </small>
                </span>
                <img src={getSystemIcon("Arrow Right.png")} alt="" />
              </button>
            ))}
          </div>
        )}
        {p.step === 4 && (
          <div className="password-panel">
            <img src={getSystemIcon("Security Shield.png")} alt="" />
            <label>
              Password
              <input
                type="password"
                value={p.password}
                onChange={(e: any) => p.setPassword(e.target.value)}
                placeholder="At least 4 characters"
              />
            </label>
            <label>
              Confirm password
              <input
                type="password"
                value={p.confirm}
                onChange={(e: any) => p.setConfirm(e.target.value)}
                placeholder="Type it again"
              />
            </label>
            {p.password && p.password !== p.confirm && <p>Passwords don’t match yet.</p>}
          </div>
        )}
        {p.step === 5 && (
          <div className="ready-card">
            <img src={getSystemIcon("Success.png")} alt="Ready" />
            <div>
              <h2>A-OS Computer</h2>
              <p>
                {linkedSession ? `A-Applications · ${linkedSession.email}` : "Local profile"} · {p.engine} search · {p.network}
              </p>
            </div>
          </div>
        )}
        <footer>
          {p.step > 0 && (
            <button className="text-button" onClick={() => p.setStep(p.step - 1)}>
              Back
            </button>
          )}
          <button
            className="primary"
            disabled={
              (p.step === 2 && useAApplications && !linkedSession) ||
              (p.step === 4 && (p.password.length < 4 || p.password !== p.confirm))
            }
            onClick={() =>
              p.step === 5
                ? p.finish(useAApplications && linkedSession ? { email: linkedSession.email } : undefined)
                : p.setStep(p.step + 1)
            }
          >
            {p.step === 5 ? "Finish setup" : "Continue"}
            <img src={getSystemIcon("Arrow Right.png")} alt="" />
          </button>
        </footer>
      </section>
    </main>
  );
}
