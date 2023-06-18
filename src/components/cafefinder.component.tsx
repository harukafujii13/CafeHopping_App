'use client';
import { FC, useEffect, useState, useMemo } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
  useLoadScript,
} from '@react-google-maps/api';
import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';

interface Location {
  lat: number;
  lng: number;
}

interface Place {
  geometry: {
    location: Location;
  };
  name: string;
  photos?: { getUrl: () => string }[];
  rating?: number;
}

// Define libraries outside the component
const libraries: Libraries = ['places'];

const CafeFinder: FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries,
  });

  const containerStyle = useMemo(
    () => ({ width: '50rem', height: '40rem' }),
    []
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const location: Location = {
        lat: coords.latitude,
        lng: coords.longitude,
      };

      setCurrentLocation(location);
    });
  }, []);

  useEffect(() => {
    if (isLoaded && currentLocation) {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      service.nearbySearch(
        {
          location: currentLocation,
          radius: 5000, // Change as per your requirements
          type: 'restaurant',
          keyword: 'cafe',
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setPlaces(
              results.map((result) => ({
                geometry: result.geometry,
                name: result.name,
                photos: result.photos,
                rating: result.rating,
              }))
            );
          }
        }
      );
    }
  }, [isLoaded, currentLocation]);

  return (
    <div>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation}
          zoom={15}>
          {places.map((place, index) => (
            <Marker
              key={index}
              position={place.geometry.location}
              onClick={() => setSelectedPlace(place)}
            />
          ))}
          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.geometry.location}
              onCloseClick={() => setSelectedPlace(null)}>
              <div>
                <h2>{selectedPlace.name}</h2>
                {selectedPlace.photos && selectedPlace.photos.length > 0 && (
                  <img
                    src={selectedPlace.photos[0].getUrl()}
                    alt={selectedPlace.name}
                  />
                )}
                {selectedPlace.rating && <p>Rating: {selectedPlace.rating}</p>}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default CafeFinder;
