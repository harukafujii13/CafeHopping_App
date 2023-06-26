'use client';

import { FC, useEffect, useState, useMemo, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api';
import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';
import usePlacesAutocomplete from '@/hooks/autocomplete';
import StarRating from './starRating.component';

interface Location {
  lat: number;
  lng: number;
}

interface Place {
  geometry: {
    location: Location;
  };
  name: string; //name of the place ex)"New York City"
  photos?: { getUrl: () => string }[];
  rating?: number;
}

//memo1
//geometry: This is an object that includes the geographic location of the place.

//memo2
//The location property is an object of the Location interface,
//which includes lat and lng properties to specify the latitude and longitude coordinates of the place.

//memo3
//photos: This is an optional property, represented by the ? symbol.
//It is an array of objects, where each object should have a getUrl method that returns a string.
//This could be used to store a collection of photos related to the place, with each photo represented by a URL.

//memo4
//rating: This is another optional property that, if present, should be a number.
//It could be used to store a rating score for the place.

// Define libraries outside the component
const libraries: Libraries = ['places'];
//By including 'places' in the libraries array, you are ensuring
//that the Places library is loaded when the Google Maps API is loaded in your application.

const CafeFinder: FC = () => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  //places is an array of Place objects, representing places of interest returned from the Google Maps API.

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  //selectedPlace is a Place object that stores the place currently selected by the user on the map.

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries,
    language: 'en', // This specifies the language as English.
  });

  const containerStyle = useMemo(
    () => ({ width: '60rem', height: '30rem', margin: '0 auto' }),
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
  //retrieves the user's current location when the component mounts

  useEffect(() => {
    if (isLoaded && currentLocation) {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      service.nearbySearch(
        {
          location: currentLocation,
          radius: 5000, // Change as per your requirements
          type: 'cafe',
          // keyword: 'cafe',
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

  // runs a nearbySearch using the PlacesService from the Google Maps Places library
  //whenever isLoaded or currentLocation changes. It sets the returned places into the places state.

  const handleSearch = () => {
    const geocoder = new google.maps.Geocoder();
    //It first creates a new instance of google.maps.Geocoder().
    //The Geocoder class provides geocoding and reverse geocoding of addresses.

    geocoder.geocode(
      { address: searchInputRef.current?.value },
      (results, status) => {
        if (status === 'OK') {
          //the geocoding was successful
          const location = results[0].geometry.location;

          setCurrentLocation({
            lat: location.lat(),
            lng: location.lng(),
            //called with the latitude (lat) and longitude (lng) of the location.
            //This updates the current location, which is stored in the state.
          });
        } else {
          alert(
            'Geocode was not successful for the following reason: ' + status
          );
        }
      }
    );
  };

  usePlacesAutocomplete({ input: searchInputRef.current });

  return (
    <div>
      <div className="flex m-[2rem] items-center justify-center">
        <input
          ref={searchInputRef}
          type="text"
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
          mapContainerStyle={containerStyle} //avoid unnecessary re-renders
          center={currentLocation}
          zoom={15}>
          {places.map((place, index) => (
            <Marker
              key={index}
              position={place.geometry.location}
              onClick={() => setSelectedPlace(place)}
              icon={{
                url: '/images/cafe-icon.png',
                scaledSize: new window.google.maps.Size(45, 45),
              }}
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
                    className="w-40 h-40 object-cover mb-2"
                    src={selectedPlace.photos[0].getUrl({ maxWidth: 200 })}
                    alt={selectedPlace.name}
                  />
                )}
                {selectedPlace.rating && (
                  <div className="flex items-center">
                    <p className="mr-[0.3rem] font-normal">
                      Rating: {selectedPlace.rating}
                    </p>
                    <StarRating rating={selectedPlace.rating} />
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[3rem] mt-[2rem] mx-[2.5rem] text-primary-gray pb-[3rem]">
        {places.map((place, index) => (
          <div
            key={index}
            className="bg-white shadow-md">
            {place.photos && place.photos.length > 0 && (
              <img
                className="w-full h-48 object-cover "
                src={place.photos[0].getUrl({ maxWidth: 500 })}
                alt={place.name}
              />
              //If the place has photos, the first photo's URL is retrieved using place.photos[0].getUrl({ maxWidth: 500 }) and is displayed in an img tag.
            )}
            <div className="p-4">
              <h3 className="font-bold text-xl">{place.name}</h3>
              {place.rating && (
                <div className="font-semibold flex items-center ">
                  <p className="mr-[0.3rem]">{place.rating}</p>{' '}
                  <StarRating rating={place.rating} />
                </div>
              )}
              {/* Add any additional information about the place here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CafeFinder;

//For each place in the places array, a Marker component is rendered on the map at the place's location.
//Each marker's position prop is set to the location of the place it represents,
//and onClick event is set to a function that updates the selectedPlace state
//to the current place when the marker is clicked.

//If a place is selected (i.e., selectedPlace is not null), an InfoWindow component is rendered.
//This component displays more information about the selected place in a popup window.

//The InfoWindow is positioned at the location of the selected place.
//When it's closed (by clicking the 'x' button),
//the onCloseClick prop sets selectedPlace back to null, effectively hiding the info window.
