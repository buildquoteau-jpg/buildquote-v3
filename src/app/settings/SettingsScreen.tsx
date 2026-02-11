// Builder Settings Screen
// Manages: passkey preference, logo upload, newsletter opt-in
// READS: builders (own)
// WRITES: builders (authPreference, logo, marketingOptIn)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ImageUploader } from "../../components/ImageUploader";
import { NewsletterOptIn } from "../../components/NewsletterOptIn";
import {
  builderLogoR2Key,
  uploadImage,
  getR2PublicUrl,
} from "../../lib/r2ImageUpload";
import "./settings.css";

export function SettingsScreen() {
  const navigate = useNavigate();

  // TODO: get builderId from auth context once Clerk is wired
  const builderId = null as any;
  const builder = useQuery(
    api.builders.getBuilder,
    builderId ? { builderId } : "skip"
  );

  const updateAuthPref = useMutation(
    api.builderPreferences.updateAuthPreference
  );
  const saveLogo = useMutation(api.builderPreferences.saveBuilderLogo);
  const removeLogo = useMutation(api.builderPreferences.removeBuilderLogo);
  const updateMarketing = useMutation(
    api.builderPreferences.updateMarketingOptIn
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!builderId) {
    return (
      <div className="screen settings-screen">
        <header>
          <button className="btn secondary" onClick={() => navigate("/")}>
            ← Dashboard
          </button>
          <h2>Settings</h2>
        </header>
        <p className="hint">Sign in to access settings.</p>
      </div>
    );
  }

  if (builder === undefined) {
    return <div className="screen settings-screen">Loading…</div>;
  }

  const passkeyEnabled = builder?.authPreference?.passkeyEnabled ?? false;
  const marketingOptIn = builder?.marketingOptIn ?? false;

  const handlePasskeyToggle = async () => {
    setSaving(true);
    try {
      await updateAuthPref({
        builderId,
        passkeyEnabled: !passkeyEnabled,
      });
      setMessage(
        !passkeyEnabled
          ? "Face ID / Passkey enabled."
          : "Face ID / Passkey disabled."
      );
    } catch {
      setMessage("Failed to update preference.");
    }
    setSaving(false);
  };

  const handleLogoUpload = async (file: File) => {
    setSaving(true);
    setMessage(null);
    try {
      const key = builderLogoR2Key(builderId, file.name);
      const result = await uploadImage(file, key);
      const finalKey = result?.r2Key ?? key;
      const finalUrl = result?.publicUrl ?? getR2PublicUrl(key);
      await saveLogo({ builderId, logoR2Key: finalKey, logoUrl: finalUrl });
      setMessage("Logo saved.");
    } catch {
      setMessage("Logo upload failed.");
    }
    setSaving(false);
  };

  const handleLogoRemove = async () => {
    setSaving(true);
    try {
      await removeLogo({ builderId });
      setMessage("Logo removed.");
    } catch {
      setMessage("Failed to remove logo.");
    }
    setSaving(false);
  };

  const handleNewsletterToggle = async (optIn: boolean) => {
    setSaving(true);
    try {
      await updateMarketing({ builderId, optIn });
      setMessage(optIn ? "Subscribed to updates." : "Unsubscribed.");
    } catch {
      setMessage("Failed to update preference.");
    }
    setSaving(false);
  };

  return (
    <div className="screen settings-screen">
      <header>
        <button className="btn secondary" onClick={() => navigate("/")}>
          ← Dashboard
        </button>
        <h2>Settings</h2>
      </header>

      {message && <div className="settings-message">{message}</div>}

      {/* ── Feature 1: Passkey ── */}
      <section className="settings-section">
        <h3>Sign-in</h3>
        <div className="settings-row">
          <div>
            <strong>Face ID / Passkey</strong>
            <p className="hint">
              Use Face ID, Touch ID, or your device PIN for faster sign-in.
            </p>
          </div>
          <button
            className={`btn ${passkeyEnabled ? "primary" : "secondary"} btn-sm`}
            onClick={handlePasskeyToggle}
            disabled={saving}
          >
            {passkeyEnabled ? "Enabled" : "Enable"}
          </button>
        </div>
      </section>

      {/* ── Feature 2: Logo ── */}
      <section className="settings-section">
        <h3>Business logo</h3>
        <ImageUploader
          label="Your logo appears on your dashboard and future RFQ exports."
          currentUrl={builder?.logoUrl}
          onFileSelected={handleLogoUpload}
          onRemove={handleLogoRemove}
          disabled={saving}
        />
      </section>

      {/* ── Feature 4: Newsletter ── */}
      <section className="settings-section">
        <h3>Communication</h3>
        <NewsletterOptIn
          checked={marketingOptIn}
          onChange={handleNewsletterToggle}
          disabled={saving}
        />
      </section>
    </div>
  );
}
