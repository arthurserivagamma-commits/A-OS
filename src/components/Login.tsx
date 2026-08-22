import { FormEvent } from "react";
import { ProfileRecord } from "../types";
import { getSystemIcon, getSystemWallpaper } from "../icon-assets";

export function Login({
  profile,
  deviceName,
  password,
  setPassword,
  submit,
  change,
  forgot,
  lockscreenImage,
  profiles = [],
  currentProfile,
  switchProfile,
}: {
  profile: string;
  deviceName: string;
  password: string;
  setPassword: (val: string) => void;
  submit: (e: FormEvent) => void;
  change: () => void;
  forgot: () => void;
  lockscreenImage?: string;
  profiles: ProfileRecord[];
  currentProfile?: ProfileRecord;
  switchProfile: (next: ProfileRecord) => void;
}) {
  const bg = lockscreenImage?.startsWith("data:")
    ? lockscreenImage
    : getSystemWallpaper(lockscreenImage || "Aqua A (Default).png");

  return (
    <main
      className="login-modern"
      style={{
        backgroundImage: `linear-gradient(120deg,#06183b55,#4ce0ff33),url("${bg}")`,
      }}
    >
      <div className="login-title">Login to A-OS Computer</div>
      <section className="signin-window local-signin">
        <div className="browser-top">
          <i />
          <i />
          <i />
          <span>a-os://local-profile</span>
        </div>
        <div className="provider-signin">
          <img src={getSystemIcon("Profile.png")} alt="" />
          <h1>{profile}</h1>
          <p>
            Sign in locally to <b>{deviceName}</b>
          </p>
          {currentProfile?.aApplicationsEmail && (
            <p className="a-applications-unlock">
              <span className="a-applications-mark">A</span> A-OS or A-Applications password accepted
            </p>
          )}
          <form onSubmit={submit}>
            <label>
              A-OS password
              <input
                autoFocus
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </label>
            <button>
              Continue
              <img src={getSystemIcon("Arrow Right.png")} alt="" />
            </button>
          </form>
          <button className="link" onClick={forgot}>
            Forgot password?
          </button>
        </div>
      </section>
      {profiles.length > 1 && (
        <nav className="lock-profile-switcher" aria-label="Switch profile">
          {profiles.map((item: ProfileRecord) => (
            <button
              className={item.name === profile ? "active" : ""}
              onClick={() => item.name !== profile && switchProfile(item)}
              key={item.name}
            >
              <img src={getSystemIcon("Profile.png")} alt="" />
              <span>
                <b>{item.name}</b>
                <small>{item.role === "administrator" ? "Administrator" : "User"}</small>
              </span>
            </button>
          ))}
        </nav>
      )}
      <button className="login-change" onClick={change}>
        <img src={getSystemIcon("Profile.png")} alt="" />
        Add or change profile
      </button>
    </main>
  );
}
