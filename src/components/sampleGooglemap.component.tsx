'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
}

const Googlemap: FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

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

  const center = useMemo<Location>(
    () => ({
      lat: 18.52043,
      lng: 73.856743,
    }),
    []
  );

  return (
    <div>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container h-[500px] w-[500px]"
          center={currentLocation}
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
