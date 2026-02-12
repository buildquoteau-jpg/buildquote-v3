// S5 — Scope of Works Input (with voice-to-text)
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DisclaimerBlock } from "../../components/DisclaimerBlock";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";

const STAGE_EXAMPLES: Record<string, string> = {
  Slab:
    "Example: Supply of reinforcement mesh, chairs, edge form timbers and concrete accessories for a 120m² residential slab.",
  Framing:
    "Example: Supply of treated pine wall frames, top and bottom plates, noggings and associated fasteners for single-storey residence.",
  Cladding:
    "Example: Supply of fibre cement cladding sheets, cavity battens, flashings, sealants and fixings.",
  Roofing:
    "Example: Supply of Colorbond roofing sheets, ridge capping, flashings, screws and accessories.",
  "Decking / Pergola / Outdoor":
    "Example: Supply of H4 structural posts, post stirrups, concrete and fixings for an external pergola structure.",
  Services:
    "Example: Supply of electrical conduit, switchboard components, cable trays and fittings.",
  "Builder Custom Stage": "",
};

function useSpeechRecognition(onResult: (text: string) => void) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);

  const supported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const start = useCallback(() => {
    if (!supported) return;
    const SpeechRecognitionClass = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-AU";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        onResult(transcript);
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [supported, onResult]);

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

  const suggestion = STAGE_EXAMPLES[stage] ?? "";

  const handleVoiceResult = useCallback((text: string) => {
    setScopeText((prev) => (prev ? `${prev} ${text}` : text));
  }, []);

  const { isListening, start, stop, supported } = useSpeechRecognition(handleVoiceResult);

  return (
    <div className="screen scope-input">
      <header>
        <Button
          variant="secondary"
          onClick={() => navigate(`/projects/${projectId}/stages`)}
        >
          ← Stages
        </Button>
        <h2>Scope of Works</h2>
      </header>

      <Card>
        <label>Provide a brief scope of works for this quote request.</label>
        <div className="scope-textarea-wrapper">
          <textarea
            className="bq-textarea"
            rows={3}
            value={scopeText}
            onChange={(e) => setScopeText(e.target.value)}
            placeholder={suggestion || "Describe the materials you need quoted..."}
          />
          {supported ? (
            <button
              type="button"
              className={`bq-icon-btn scope-mic-btn ${isListening ? "scope-mic-btn--active" : ""}`}
              onClick={isListening ? stop : start}
              title={isListening ? "Stop recording" : "Voice input"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          ) : null}
        </div>
        <p className="hint">1–2 sentences is usually enough.</p>
      </Card>

      <Card compact>
        <p className="hint">
          BuildQuote can structure materials based on your scope.
          Engineering and quantity decisions remain your responsibility.
        </p>
      </Card>

      <Card compact>
        <DisclaimerBlock />
      </Card>

      <StickyFooter>
        <Button
          disabled={!scopeText.trim()}
          onClick={() => navigate(`/projects/${projectId}/components?stage=${encodeURIComponent(stage)}`)}
        >
          Continue
        </Button>
      </StickyFooter>
    </div>
  );
}
