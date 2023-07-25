import { useEffect, useRef, useState } from 'react';

interface UsePlacesAutocompleteProps {
  input: HTMLInputElement | null;
  options?: google.maps.places.AutocompleteOptions;
  onPlaceChanged?: (location: { lat: number; lng: number }) => void;
}

function usePlacesAutocomplete({
  input,
  options,
  onPlaceChanged,
}: UsePlacesAutocompleteProps) {
  const autocomplete = useRef<google.maps.places.Autocomplete | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    if (!input) return;

    autocomplete.current = new google.maps.places.Autocomplete(input, options);

    const listener = google.maps.event.addListener(
      autocomplete.current,
      'place_changed',
      () => {
        const place = autocomplete.current?.getPlace();
        if (!place || !place.geometry || !place.geometry.location) return;

        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        setLocation(location);
        onPlaceChanged && onPlaceChanged(location);
      }
    );

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [input, options, onPlaceChanged]);

  return location;
}

export default usePlacesAutocomplete;
