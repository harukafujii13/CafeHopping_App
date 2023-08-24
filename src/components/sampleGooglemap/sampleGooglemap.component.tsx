'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
}

const centerLocation: Location = {
  lat: 18.52043,
  lng: 73.856743,
};

const Googlemap: FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  const mapCenter = currentLocation ?? centerLocation;

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

  return (
    <div>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container h-[500px] w-[500px]"
          center={mapCenter}
          zoom={15}>
          <Marker position={{ lat: 18.52043, lng: 73.856743 }} />
          <Marker position={{ lat: 19.52043, lng: 73.856743 }} />
          <Marker position={{ lat: 20.52043, lng: 73.856743 }} />
        </GoogleMap>
      )}
    </div>
  );
};

export default Googlemap;
