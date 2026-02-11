import { useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { Link } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

type SeedResult = {
  projectId: string;
  quoteRequestId: string;
  projectName: string;
  builderName: string;
  items: Array<{
    groupName: string;
    description: string;
    quantity: number;
    unit: string;
  }>;
};

const FALLBACK_ADMIN_EMAIL = "buildquoteau@gmail.com";

function createSimplePdfBlob(seed: SeedResult) {
  const lines = [
    "BuildQuote RFQ Preview",
    `Builder: ${seed.builderName}`,
    `Project: ${seed.projectName}`,
    `RFQ ID: ${seed.quoteRequestId}`,
    "",
    "Seeded line items:",
    ...seed.items.map(
      (item) =>
        `- [${item.groupName}] ${item.description}: ${item.quantity} ${item.unit}`
    ),
  ];

  const escapePdfText = (value: string) =>
    value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

  const content = [
    "BT",
    "/F1 12 Tf",
    "50 800 Td",
    ...lines.flatMap((line, index) =>
      index === 0
        ? [`(${escapePdfText(line)}) Tj`]
        : ["0 -18 Td", `(${escapePdfText(line)}) Tj`]
    ),
    "ET",
  ].join("\n");

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (const objectText of objects) {
    offsets.push(pdf.length);
    pdf += objectText;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${offsets[i].toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

export function DevPanelScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const seedDemoData = useMutation(
    (api as Record<string, Record<string, unknown>>).devPanel
      .seedDemoData as never
  );

  const [seed, setSeed] = useState<SeedResult | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adminEmails = useMemo(() => {
    const fromEnv = (import.meta.env.VITE_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email: string) => email.trim().toLowerCase())
      .filter(Boolean);
    return new Set([...fromEnv, FALLBACK_ADMIN_EMAIL]);
  }, []);

  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";
  const canAccess = !!userEmail && adminEmails.has(userEmail);

  const stageLinks = [
    {
      label: "New RFQ — Framing",
      path: `/project/${seed?.projectId ?? "p1"}/scope?stage=framing`,
    },
    {
      label: "New RFQ — Decking",
      path: `/project/${seed?.projectId ?? "p1"}/scope?stage=decking`,
    },
    {
      label: "New RFQ — Custom",
      path: `/project/${seed?.projectId ?? "p1"}/scope?stage=custom`,
    },
  ];

  const handleSeed = async () => {
    setError(null);
    setIsSeeding(true);
    try {
      const result = (await seedDemoData({})) as SeedResult;
      setSeed(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to seed demo data");
    } finally {
      setIsSeeding(false);
    }
  };

  const handlePreviewPdf = () => {
    if (!seed) return;
    const blob = createSimplePdfBlob(seed);
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  if (!isLoaded) {
    return <div className="screen">Loading dev panel…</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="screen">
        <Card>
          <h1>Dev Panel</h1>
          <p className="hint">Please sign in to continue.</p>
          <Button to="/sign-in">Go to sign in</Button>
        </Card>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="screen">
        <Card>
          <h1>Dev Panel</h1>
          <p className="hint">Access denied for {userEmail || "your account"}.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="screen">
      <Card>
        <h1>Dev Panel</h1>
        <p className="hint">Fast links + seed helpers for visual verification.</p>

        <h3>Navigation</h3>
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/project/new">New Project</Link>
          </li>
          <li>
            <Link to="/project/existing">Existing Project</Link>
          </li>
          {stageLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
          <li>
            <Link to={seed ? `/project/${seed.projectId}/review` : "/project/p1/review"}>
              Review/Send RFQ
            </Link>
          </li>
          <li>
            <Link to="/manufacturer">Manufacturer Portal</Link>
          </li>
        </ul>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <Button type="button" onClick={handleSeed} disabled={isSeeding}>
            {isSeeding ? "Seeding…" : "Seed Demo Data"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handlePreviewPdf}
            disabled={!seed}
          >
            Preview RFQ PDF
          </Button>
        </div>

        {seed && (
          <p className="hint" style={{ marginTop: 12 }}>
            Seeded {seed.projectName} ({seed.quoteRequestId}) with 2 groups and 6 line items.
          </p>
        )}
        {error && (
          <p className="hint" style={{ marginTop: 12, color: "#b42318" }}>
            {error}
          </p>
        )}
      </Card>
    </div>
  );
}
