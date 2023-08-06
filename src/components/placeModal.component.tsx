import { Place } from '@/components/cafefinder.component';
import StarRating from './starRating.component';
import { FC } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useContext } from 'react';
import { GoogleMapsContext } from '@/components/cafefinder.component';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  place: Place | null;
}

const PlaceModal: FC<ModalProps> = ({ isOpen, closeModal, place }) => {
  console.log(place);
  console.log(place?.geometry.location.lat);
  const isLoaded = useContext(GoogleMapsContext);

  return (
    <div
      className={`fixed z-50 inset-0 overflow-y-auto ${
        isOpen ? '' : 'hidden'
      }`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div
          className="fixed inset-0 bg-gray-800 opacity-50 transition-opacity"
          aria-hidden="true"></div>
        <div
          className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-4/5 sm:w-3/4 md:w-1/2 lg:w-2/5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start justify-center">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                {!isLoaded ? (
                  <h1>Loading...</h1>
                ) : (
                  <GoogleMap
                    mapContainerClassName="map-container h-[500px] w-[500px]"
                    zoom={15}
                    center={{
                      lat: place?.geometry.location.lat() || 0,
                      lng: place?.geometry.location.lng() || 0,
                    }}>
                    <Marker
                      position={{
                        lat: place?.geometry.location.lat() || 0,
                        lng: place?.geometry.location.lng() || 0,
                      }}
                      icon={{
                        url: '/images/cafe-icon.png',
                        scaledSize: new window.google.maps.Size(55, 55),
                      }}
                    />
                  </GoogleMap>
                )}
                <div
                  className="text-2xl leading-6 font-bold text-primary-gray font-inter mb-4"
                  id="modal-headline">
                  {place?.name}
                </div>

                <div>
                  {place?.rating && (
                    <div className="font-semibold font-inter text-base flex items-center mr-6">
                      <p className="mr-[0.3rem]">{place.rating}</p>
                      <StarRating rating={place.rating} />
                    </div>
                  )}
                </div>
                <div></div>

                {place?.opening_hours && (
                  <div className="text-left">
                    <h4 className="font-medium text-lg text-primary-yellow mb-2 font-inter ">
                      Opening Hours
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-primary-gray text-md font-inter">
                      {place.opening_hours.weekday_text.map((day, index) => (
                        <li key={index}>{day}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md px-4 py-2 bg-primary-coral text-base font-medium text-white font-inter hover:bg-primary-rose focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b9cbc6] sm:mt-0 sm:w-auto sm:text-sm"
              onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceModal;
