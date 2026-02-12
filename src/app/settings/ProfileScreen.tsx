// S12 — Builder Profile
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageUploader } from "../../components/ImageUploader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";
import { TextField } from "../../components/ui/TextField";

export function ProfileScreen() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [abn, setAbn] = useState("");
  const [acn, setAcn] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    // TODO: wire to Convex mutation
    await new Promise((r) => setTimeout(r, 400));
    setIsSaving(false);
    setSaved(true);
  };

  const handleLogoSelected = (file: File) => {
    void file;
    // TODO: upload to R2
  };

  return (
    <div className="screen profile-screen">
      <header>
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </Button>
        <h2>Builder Profile</h2>
      </header>

      {saved ? (
        <div className="settings-message">Profile saved.</div>
      ) : null}

      <Card>
        <div className="field">
          <TextField label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
        </div>
        <div className="field">
          <TextField label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
        </div>
        <div className="field">
          <TextField label="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" />
        </div>
        <div className="field">
          <TextField label="ABN" value={abn} onChange={(e) => setAbn(e.target.value)} placeholder="XX XXX XXX XXX" />
        </div>
        <div className="field">
          <TextField label="ACN" value={acn} onChange={(e) => setAcn(e.target.value)} placeholder="XXX XXX XXX" />
        </div>
        <div className="field">
          <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="04XX XXX XXX" />
        </div>
        <div className="field">
          <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Business address" />
        </div>
        <div className="field">
          <ImageUploader
            label="Upload logo"
            onFileSelected={handleLogoSelected}
          />
        </div>
      </Card>

      <StickyFooter>
        <Button onClick={() => void handleSave()} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </StickyFooter>
    </div>
  );
}
