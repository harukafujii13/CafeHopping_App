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
import DistanceToCafe from './distanceToCafe.component';
import PlaceModal from './placeModal.component';
import { useWindowWidth } from '@react-hook/window-size';

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
  place_id: string; // Add place_id to use in Place Details request
  opening_hours?: { weekday_text: string[] }; // Add opening_hours to store fetched opening hours
}

const libraries: Libraries = ['places'];

const getPlaceDetails = (placeId: string | undefined) => {
  return new Promise<string[]>((resolve, reject) => {
    if (!placeId) return resolve([] as string[]);
    let placeOpeningHours: string[] = [];
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );
    const request = { placeId, fields: ['opening_hours'] };
    service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        placeOpeningHours = place?.opening_hours?.weekday_text || [];
      }
      resolve(placeOpeningHours);
    });
  });
};
const CafeFinder: FC = () => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries,
    language: 'en', // language as English.
  });

  const breakpoints = {
    xs: 480,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  };

  const onlyWidth = useWindowWidth();

  const containerStyle = useMemo(() => {
    let width;
    if (onlyWidth < breakpoints.xs) {
      width = '100%';
    } else if (onlyWidth < breakpoints.sm) {
      width = '480px';
    } else if (onlyWidth < breakpoints.md) {
      width = '640px';
    } else if (onlyWidth < breakpoints.lg) {
      width = '768px';
    } else if (onlyWidth < breakpoints.xl) {
      width = '1024px';
    } else {
      width = '1280px';
    }

    return {
      width,
      height: '30rem',
      margin: '0 auto',
    };
  }, [onlyWidth]);

  useEffect(() => {
    console.log('places UE --->', places);
  }, [places]);

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
        async (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const renderedPlace = results.map((result) => ({
              geometry: result.geometry,
              name: result.name,
              photos: result.photos,
              rating: result.rating,
              place_id: result.place_id, // Store place_id from results to use in Place Details request
            }));
            renderedPlace.forEach(async (place) => {
              const placeDetails = await getPlaceDetails(place.place_id);
              place.opening_hours = { weekday_text: placeDetails };
            });
            setPlaces(renderedPlace);
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
  const handleMarkerClick = (place: Place) => {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );
    service.getDetails(
      {
        placeId: place.place_id,
        fields: ['opening_hours'],
      },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setSelectedPlace({ ...place, opening_hours: result.opening_hours });
        }
      }
    );
  };
  const handleMoreInfo = (place) => {
    console.log('handleMoreInfo', place);
    setSelectedPlace(place);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <div className="flex m-[2rem] items-center justify-center ">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Enter location"
          className="border border-primary-gray rounded-lg px-4 py-1 w-[22rem] h-[3rem] font-inter"
        />
        <button
          onClick={handleSearch}
          className="bg-primary-yellow hover:bg-[#F9D79F] text-white rounded-lg px-4 py-1 h-[3rem] ml-[0.3rem] font-inter">
          Search
        </button>
      </div>
      {!isLoaded ? (
        <div className="flex flex-col items-center">
          <h1 className="text-primary-yellow text-4xl md:text-5xl lg:text-6xl mt-8 md:mt-16 text-center font-bold font-rubik">
            But first coffee...
          </h1>
          <img
            className="w-80 lg:w-[20rem] mx-auto mt-[1rem]"
            src={'/images/roundCoffee-img 1.png'}
            alt="logo"
          />
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle} //avoid unnecessary re-renders
          center={currentLocation}
          zoom={15}>
          {places.map((place, index) => (
            <Marker
              key={index}
              position={place.geometry.location}
              onClick={() => handleMarkerClick(place)}
              icon={{
                url: '/images/cafe-icon.png',
                scaledSize: new window.google.maps.Size(45, 45),
              }}
            />
          ))}
          {currentLocation && (
            <Marker
              position={currentLocation}
              icon={{
                url: '/images/current-location.png',
                scaledSize: new window.google.maps.Size(50, 50),
              }}
            />
          )}
          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.geometry.location}
              onCloseClick={() => setSelectedPlace(null)}>
              <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-lg text-primary-gray">
                <h2 className="text-base font-bold mb-2 font-inter">
                  {selectedPlace.name}
                </h2>
                {selectedPlace.photos && selectedPlace.photos.length > 0 && (
                  <img
                    className="w-40 h-40 object-cover mb-2"
                    src={selectedPlace.photos[0].getUrl({ maxWidth: 200 })}
                    alt={selectedPlace.name}
                  />
                )}
                {selectedPlace.rating && (
                  <div className="flex items-center">
                    <p className="mr-[0.3rem] font-normal font-inter">
                      Rating: {selectedPlace.rating}
                    </p>
                    <StarRating rating={selectedPlace.rating} />
                  </div>
                )}
                {/* {selectedPlace.opening_hours && (
                  <div>
                    <h4>Opening Hours:</h4>
                    <ul>
                      {selectedPlace.opening_hours.weekday_text.map(
                        (day, index) => (
                          <li key={index}>{day}</li>
                        )
                      )}
                    </ul>
                  </div>
                )} */}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[2rem] mt-[2rem] mx-[2.5rem] text-primary-gray pb-[3rem]">
          {places.map((place, index) => (
            <div
              key={index}
              className="bg-white shadow-md max-w-sm">
              {place.photos && place.photos.length > 0 && (
                <img
                  className=" w-full h-48 object-cover"
                  src={place.photos[0].getUrl({ maxWidth: 500 })}
                  alt={place.name}
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-xl font-inter">{place.name}</h3>
                <div className="flex flex-col xl:flex-row py-2">
                  {place.rating && (
                    <div className="font-semibold font-inter text-base flex items-center mr-6">
                      <p className="mr-[0.3rem]">{place.rating}</p>
                      <StarRating rating={place.rating} />
                    </div>
                  )}
                  {currentLocation && (
                    <DistanceToCafe
                      currentLocation={currentLocation}
                      cafeLocation={{
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                      }}
                    />
                  )}
                </div>
                {/* Add any additional information about the place here */}
                <button
                  onClick={() => handleMoreInfo(place)}
                  className="inline-flex items-center px-3 py-2 text-x font-inter font-bold text-center text-white bg-primary-coral rounded-lg hover:bg-primary-rose focus:ring-4 focus:outline-none focus:ring-[#b9cbc6] dark:bg-[#95b1a8] dark:hover:bg-primary-green dark:focus:ring-[#688d81]">
                  More info
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 ml-2 -mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PlaceModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        place={selectedPlace}
      />
    </div>
  );
};
export default CafeFinder;
