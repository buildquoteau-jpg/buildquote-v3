// S5 — Scope of Works Input (with voice-to-text)
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DisclaimerBlock } from "../../components/DisclaimerBlock";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";

const STAGE_EXAMPLES: Record<string, string> = {
  "Slab / Footings":
    "Example: Supply of reinforcement mesh, chairs, edge form timbers and concrete accessories for a 120m² residential slab.",
  "Wall Framing":
    "Example: Supply of treated pine wall frames, top and bottom plates, noggings and associated fasteners for single-storey residence.",
  "Roof Framing":
    "Example: Supply of roof trusses, ridge board, rafters, battens and associated hardware for hip roof.",
  Roofing:
    "Example: Supply of Colorbond roofing sheets, ridge capping, flashings, gutters, downpipes, screws and accessories.",
  "External Cladding":
    "Example: Supply of fibre cement cladding sheets, cavity battens, flashings, sealants and fixings.",
  "Internal Linings":
    "Example: Supply of plasterboard sheets, cornices, jointing compounds, screws and finishing accessories.",
  Services:
    "Example: Supply of electrical conduit, switchboard components, cable trays and fittings.",
  "Decking / Pergola / Outdoor":
    "Example: Supply of H4 structural posts, bearers, joists, decking boards, post stirrups and fixings for an external deck.",
  "Windows & Doors":
    "Example: Supply of aluminium sliding windows, entry door, internal doors, hardware and weatherseals.",
  "Insulation / Sarking / Wraps":
    "Example: Supply of wall batts, ceiling batts, roof sarking and vapour barrier for residential dwelling.",
  "Builder Custom Stage": "",
};

function useSpeechRecognition(
  onResult: (text: string) => void,
  onInterim: (text: string) => void,
) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);

  const supported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const start = useCallback(() => {
    if (!supported) return;
    const SpeechRecognitionClass =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-AU";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result?.isFinal) {
          finalTranscript += result[0]?.transcript ?? "";
        } else {
          interimTranscript += result?.[0]?.transcript ?? "";
        }
      }
      if (finalTranscript) onResult(finalTranscript);
      if (interimTranscript) onInterim(interimTranscript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [supported, onResult, onInterim]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return { isListening, start, stop, supported };
}

export function ScopeInputScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const stage = searchParams.get("stage") ?? "";
  const [scopeText, setScopeText] = useState("");
  const [interimText, setInterimText] = useState("");

  const suggestion = STAGE_EXAMPLES[stage] ?? "";

  const handleVoiceResult = useCallback((text: string) => {
    setScopeText((prev) => (prev ? `${prev} ${text}` : text));
    setInterimText("");
  }, []);

  const handleInterim = useCallback((text: string) => {
    setInterimText(text);
  }, []);

  const { isListening, start, stop, supported } = useSpeechRecognition(
    handleVoiceResult,
    handleInterim,
  );

  // Display text includes interim transcription while recording
  const displayText = scopeText + (interimText ? ` ${interimText}` : "");

  return (
    <div className="screen scope-input">
      <header>
        <Button
          variant="secondary"
          onClick={() => navigate(`/projects/${projectId}/stages`)}
        >
          ← Back to Stages
        </Button>
        <h2>Scope of Works</h2>
      </header>

      <Card>
        <label>Provide a brief scope of works for this quote request.</label>
        <div className="scope-textarea-wrapper">
          <textarea
            className="bq-textarea"
            rows={4}
            value={displayText}
            onChange={(e) => {
              setScopeText(e.target.value);
              setInterimText("");
            }}
            placeholder={suggestion || "Describe the materials you need quoted..."}
          />
          {supported ? (
            <button
              type="button"
              className={`bq-icon-btn scope-mic-btn ${isListening ? "scope-mic-btn--active" : ""}`}
              onClick={isListening ? stop : start}
              title={isListening ? "Stop recording" : "Voice input"}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          ) : null}
        </div>
        {isListening ? (
          <p className="hint" style={{ color: "var(--bq-accent)" }}>
            Listening...
          </p>
        ) : (
          <p className="hint">1–2 sentences is usually enough.</p>
        )}
      </Card>

      <DisclaimerBlock />

      <StickyFooter>
        <Button
          disabled={!scopeText.trim()}
          onClick={() =>
            navigate(
              `/projects/${projectId}/components?stage=${encodeURIComponent(stage)}`,
            )
          }
        >
          Continue
        </Button>
      </StickyFooter>
    </div>
  );
}
