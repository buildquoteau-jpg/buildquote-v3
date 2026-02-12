const GOOGLE_PLACES_SCRIPT_ID = "buildquote-google-places-script";

let loadPromise: Promise<void> | null = null;
let cachedError: Error | null = null;

export function getGooglePlacesApiKey(): string {
  const key =
    (import.meta.env.GOOGLE_PLACES_API_KEY as string | undefined) ??
    (import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined) ??
    "";
  return key.trim();
}

function isGooglePlacesReady(): boolean {
  return Boolean(window.google?.maps?.places?.Autocomplete);
}

function createScriptTag(apiKey: string): HTMLScriptElement {
  const script = document.createElement("script");
  script.id = GOOGLE_PLACES_SCRIPT_ID;
  script.async = true;
  script.defer = true;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
    apiKey
  )}&libraries=places&loading=async`;
  return script;
}

export function loadGooglePlacesScript(): Promise<void> {
  if (isGooglePlacesReady()) {
    return Promise.resolve();
  }

  if (cachedError) {
    return Promise.reject(cachedError);
  }

  if (loadPromise) {
    return loadPromise;
  }

  const apiKey = getGooglePlacesApiKey();
  if (!apiKey) {
    const error = new Error("GOOGLE_PLACES_API_KEY is not configured.");
    cachedError = error;
    return Promise.reject(error);
  }

  const existingScript = document.getElementById(
    GOOGLE_PLACES_SCRIPT_ID
  ) as HTMLScriptElement | null;

  loadPromise = new Promise<void>((resolve, reject) => {
    const onReady = () => {
      if (isGooglePlacesReady()) {
        resolve();
        return;
      }
      const error = new Error("Google Places loaded but Autocomplete is unavailable.");
      cachedError = error;
      reject(error);
    };

    const onError = () => {
      const error = new Error("Failed to load Google Places script.");
      cachedError = error;
      reject(error);
    };

    if (existingScript) {
      existingScript.addEventListener("load", onReady, { once: true });
      existingScript.addEventListener("error", onError, { once: true });
      return;
    }

    const script = createScriptTag(apiKey);
    script.addEventListener("load", onReady, { once: true });
    script.addEventListener("error", onError, { once: true });
    document.head.appendChild(script);
  }).finally(() => {
    if (!isGooglePlacesReady()) {
      loadPromise = null;
    }
  });

  return loadPromise;
}
