import { useEffect, useRef } from 'react';

interface UsePlacesAutocompleteProps {
  input: HTMLInputElement | null;
  options?: google.maps.places.AutocompleteOptions;
}

function usePlacesAutocomplete({ input, options }: UsePlacesAutocompleteProps) {
  const autocomplete = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!input) return;

    autocomplete.current = new google.maps.places.Autocomplete(input, options);

    const listener = google.maps.event.addListener(
      autocomplete.current,
      'place_changed',
      () => {
        const place = autocomplete.current?.getPlace();
        if (!place || !place.geometry) return;

        const location = place.geometry.location;

        return {
          lat: location.lat(),
          lng: location.lng(),
        };
      }
    );

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [input, options]);
}

export default usePlacesAutocomplete;
