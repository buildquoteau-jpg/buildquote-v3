import { useEffect, useRef, useState } from "react";
import { loadGooglePlacesScript, getGooglePlacesApiKey } from "../lib/googlePlaces";
import type { ProjectAddress } from "../types/project";

interface AddressFinderProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: ProjectAddress) => void;
  placeholder?: string;
}

type AddressFinderMode = "loading" | "ready" | "fallback";

export function AddressFinder({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Start typing address...",
}: AddressFinderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const apiKey = getGooglePlacesApiKey();
  const [mode, setMode] = useState<AddressFinderMode>(() =>
    apiKey ? "loading" : "fallback"
  );

  useEffect(() => {
    let cancelled = false;

    if (!apiKey) {
      listenerRef.current?.remove();
      listenerRef.current = null;
      return () => undefined;
    }

    void loadGooglePlacesScript()
      .then(() => {
        if (cancelled || !inputRef.current) return;

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          fields: ["formatted_address", "geometry.location", "place_id"],
        });

        listenerRef.current?.remove();
        listenerRef.current = autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const formattedAddress = place.formatted_address?.trim();
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();
          const placeId = place.place_id?.trim();

          if (!formattedAddress || lat === undefined || lng === undefined || !placeId) {
            return;
          }

          onChange(formattedAddress);
          onAddressSelect({
            formattedAddress,
            lat,
            lng,
            placeId,
          });
        });

        setMode("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setMode("fallback");
        }
      });

    return () => {
      cancelled = true;
      listenerRef.current?.remove();
      listenerRef.current = null;
    };
  }, [apiKey, onAddressSelect, onChange]);

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
          onChange={(event) => onChange(event.target.value)}
        />
      </div>

      {mode === "loading" ? (
        <p className="address-hint hint">Loading address autocomplete...</p>
      ) : null}
      {mode === "fallback" ? (
        <p className="address-hint hint">
          Address autocomplete unavailable. Manual entry is still saved.
        </p>
      ) : null}
    </div>
  );
}
