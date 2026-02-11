import { useEffect, useRef } from "react";

interface AddressFinderProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface GoogleAutocompletePlace {
  formatted_address?: string;
}

interface GoogleAutocomplete {
  addListener: (event: "place_changed", callback: () => void) => void;
  getPlace: () => GoogleAutocompletePlace;
}

type GoogleAutocompleteCtor = new (
  input: HTMLInputElement,
  options: {
    types: string[];
    componentRestrictions: { country: string };
    fields: string[];
  }
) => GoogleAutocomplete;

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete?: GoogleAutocompleteCtor;
        };
      };
    };
  }
}

export function AddressFinder({ value, onChange, placeholder = "Start typing address..." }: AddressFinderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

  useEffect(() => {
    const Autocomplete = window.google?.maps?.places?.Autocomplete;
    if (!apiKey || !inputRef.current || !Autocomplete) return;

    const autocomplete = new Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "au" },
      fields: ["formatted_address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        onChange(place.formatted_address);
      }
    });
  }, [apiKey, onChange]);

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
          className="bq-input address-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {!apiKey && (
        <p className="address-hint hint">
          Add VITE_GOOGLE_PLACES_API_KEY to .env.local for address autocomplete
        </p>
      )}
    </div>
  );
}
