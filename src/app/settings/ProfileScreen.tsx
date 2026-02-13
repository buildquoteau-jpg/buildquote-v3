// S12 — Builder Profile
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useBuilderAccount } from "../hooks/useBuilderAccount";
import { ImageUploader } from "../../components/ImageUploader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";
import { TextField } from "../../components/ui/TextField";

export function ProfileScreen() {
  const navigate = useNavigate();
  const { builder, builderId, isUserLoaded } = useBuilderAccount();
  const updateBuilder = useMutation(api.builders.updateBuilder);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [abn, setAbn] = useState("");
  const [acn, setAcn] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isOnboarding = !builder?.profileComplete;

  // Pre-populate form once builder data loads
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!builder || initializedRef.current) return;
    initializedRef.current = true;

    // Skip auto-upsert defaults so the user fills real values
    const skipDefault = (val: string | undefined, fallback: string) =>
      val && val !== fallback ? val : "";

    setFirstName(skipDefault(builder.firstName, "Builder"));
    setLastName(skipDefault(builder.lastName, "User"));
    setCompanyName(skipDefault(builder.companyName, "BuildQuote Builder"));
    setAbn(builder.abn ?? "");
    setAcn(builder.acn ?? "");
    setBusinessEmail(builder.businessEmail ?? "");
    setPhone(builder.phone ?? "");
    setAddress(builder.address ?? "");
  }, [builder]);

  const canSave = firstName.trim().length > 0 && companyName.trim().length > 0;

  const handleSave = async () => {
    if (!builderId || !canSave) return;
    setIsSaving(true);
    await updateBuilder({
      builderId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      companyName: companyName.trim(),
      abn: abn.trim() || undefined,
      acn: acn.trim() || undefined,
      businessEmail: businessEmail.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      profileComplete: true,
    });
    setIsSaving(false);
    navigate("/dashboard");
  };

  const handleLogoSelected = (file: File) => {
    void file;
    // TODO: upload to R2
  };

  if (!isUserLoaded || builder === undefined) {
    return <div className="screen">Loading...</div>;
  }

  return (
    <div className="screen profile-screen">
      <header>
        {!isOnboarding && (
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            ← Dashboard
          </Button>
        )}
        <h2>{isOnboarding ? "Complete Your Profile" : "Builder Profile"}</h2>
      </header>

      <Card>
        <div className="field">
          <TextField label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required />
        </div>
        <div className="field">
          <TextField label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
        </div>
        <div className="field">
          <TextField label="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" required />
        </div>
        <div className="field">
          <TextField label="ABN" value={abn} onChange={(e) => setAbn(e.target.value)} placeholder="XX XXX XXX XXX" />
        </div>
        <div className="field">
          <TextField label="ACN" value={acn} onChange={(e) => setAcn(e.target.value)} placeholder="XXX XXX XXX" />
        </div>
        <div className="field">
          <TextField label="Business email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} placeholder="quotes@yourcompany.com.au" />
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
        <Button onClick={() => void handleSave()} disabled={isSaving || !canSave}>
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </StickyFooter>
    </div>
  );
}
