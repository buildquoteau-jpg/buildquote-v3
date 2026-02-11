import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button, Card } from "../../components/ui";

function markdownToPlainHtml(markdown: string) {
  return markdown
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n\n/g, "<br/><br/>");
}

export function DevChecklistScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [markdown, setMarkdown] = useState("Loading checklist...");
  const adminEmails = useMemo(
    () =>
      (import.meta.env.VITE_ADMIN_EMAILS as string | undefined)?.split(",").map((s) => s.trim().toLowerCase()) ?? [],
    []
  );

  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";
  const isAdmin = !!userEmail && adminEmails.includes(userEmail);

  useEffect(() => {
    fetch("/dev-checklist.md")
      .then((res) => res.text())
      .then((text) => setMarkdown(text))
      .catch(() => setMarkdown("Failed to load checklist."));
  }, []);

  return (
    <div className="screen">
      <header className="dashboard-header">
        <Button variant="ghost" onClick={() => navigate("/")}>← Dashboard</Button>
        <h2>Dev Checklist</h2>
      </header>

      {!isAdmin ? (
        <Card>
          <p>This page is available to admin emails only.</p>
        </Card>
      ) : (
        <Card>
          <div dangerouslySetInnerHTML={{ __html: markdownToPlainHtml(markdown) }} />
        </Card>
      )}
    </div>
  );
}
