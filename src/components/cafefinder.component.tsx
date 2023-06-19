'use client';

import { FC, useEffect, useState, useMemo } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
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
  const [searchInput, setSearchInput] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries,
  });

  const containerStyle = useMemo(
    () => ({ width: '60rem', height: '33rem', margin: '0 auto' }),
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

  const handleSearch = () => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;

        setCurrentLocation({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  return (
    <div>
      <div className="flex m-[2rem] items-center justify-center">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter location"
          className="border border-primary-gray rounded-lg px-4 py-1 w-[22rem] h-[3rem]"
        />
        <button
          onClick={handleSearch}
          className="bg-primary-yellow hover:bg-[#F9D79F] text-white rounded-lg px-4 py-1 h-[3rem] ml-[0.3rem]">
          Search
        </button>
      </div>
      {!isLoaded ? (
        <h1 className="text-primary-yellow text-[5rem] mt-[10rem] text-center font-bold">
          Loading...
        </h1>
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
              <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-lg text-primary-gray">
                <h2 className="text-lg font-bold mb-2">{selectedPlace.name}</h2>
                {selectedPlace.photos && selectedPlace.photos.length > 0 && (
                  <img
                    className="w-40 h-40 object-cover rounded-lg mb-2"
                    src={selectedPlace.photos[0].getUrl({ maxWidth: 200 })}
                    alt={selectedPlace.name}
                  />
                )}
                {selectedPlace.rating && (
                  <p className="font-semibold">
                    Rating: {selectedPlace.rating}
                  </p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default CafeFinder;
