'use client';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
}

const CafeFinder: FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [searchPlace, setSearchPlace] = useState<string>('');
  const [markers, setMarkers] = useState<Location[]>([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_APP_GOOGLE_API_KEY || '',
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const location: Location = {
        lat: coords.latitude,
        lng: coords.longitude,
      };

      setCurrentLocation(location);
    });
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchCafes();
  };

  const searchCafes = () => {
    if (!searchPlace) return;

    const request = {
      location: new window.google.maps.LatLng(
        currentLocation?.lat,
        currentLocation?.lng
      ),
      radius: 1000, // Adjust the radius as needed
      type: ['cafe'],
      keyword: searchPlace,
    };

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // Clear previous markers
        setMarkers([]);

        // Create new markers for each cafe result
        const markers = results.map((result) => ({
          lat: result.geometry?.location.lat(),
          lng: result.geometry?.location.lng(),
        }));

        setMarkers(markers);
      }
    });
  };

  const center = useMemo<Location>(
    () => ({
      lat: currentLocation?.lat || 18.52043,
      lng: currentLocation?.lng || 73.856743,
    }),
    [currentLocation]
  );

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchPlace}
          onChange={(event) => setSearchPlace(event.target.value)}
          placeholder="Enter a place"
        />
        <button type="submit">Search</button>
      </form>

      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container h-[500px] w-[500px]"
          center={center}
          zoom={15}>
          {currentLocation && <Marker position={currentLocation} />}
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default CafeFinder;
