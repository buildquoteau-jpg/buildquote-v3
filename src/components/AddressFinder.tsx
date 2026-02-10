import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    google?: typeof google;
    _googleMapsCallback?: () => void;
  }
}

interface AddressFinderProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
}

let googleMapsLoading = false;
let googleMapsLoaded = false;
const loadCallbacks: Array<() => void> = [];

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (googleMapsLoaded && window.google?.maps?.places) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    loadCallbacks.push(resolve);

    if (googleMapsLoading) return;
    googleMapsLoading = true;

    window._googleMapsCallback = () => {
      googleMapsLoaded = true;
      googleMapsLoading = false;
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=_googleMapsCallback`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
}

export function AddressFinder({
  value,
  onChange,
  placeholder = "Start typing an address…",
}: AddressFinderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(googleMapsLoaded);
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string;

  useEffect(() => {
    if (!apiKey) return;

    loadGoogleMaps(apiKey).then(() => {
      setIsLoaded(true);
    });
  }, [apiKey]);

  const initAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;
    if (autocompleteRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "au" },
        fields: ["formatted_address", "address_components"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        onChange(place.formatted_address);
      }
    });

    autocompleteRef.current = autocomplete;
  }, [onChange]);

  useEffect(() => {
    if (isLoaded) {
      initAutocomplete();
    }
  }, [isLoaded, initAutocomplete]);

  return (
    <div className="address-finder">
      <div className="address-input-wrapper">
        <svg
          className="address-search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="address-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {!apiKey && (
        <p className="address-hint">
          Add VITE_GOOGLE_PLACES_API_KEY to .env.local for address autocomplete
        </p>
      )}
    </div>
  );
}
