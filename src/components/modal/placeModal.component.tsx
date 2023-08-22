import { Place } from '@/components/cafeFinder/cafefinder.component';
import { BookMarkPlace } from '@/app/bookmark/bookmarkCafe';
import StarRating from '../rating/starRating.component';
import { FC, useMemo, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useContext, useCallback } from 'react';
import { GoogleMapsContext } from '@/contexts/googleMapContext';
import { AiFillCloseCircle } from 'react-icons/ai';
import ReviewForm from '../reviewComment/reviewInputForm.component';
import { GrFormClose } from 'react-icons/gr';
import { CafeContext } from '@/contexts/cafeContext';
import ReviewCard from '../../components/reviewComment/reviewCard.component';
interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  place: Place | BookMarkPlace | null;
  lat?: number;
  lng?: number;
  opening_hours?: string[];
}
const PlaceModal: FC<ModalProps> = ({
  isOpen,
  closeModal,
  place,
  lat,
  lng,
  opening_hours,
}) => {
  const contextValue = useContext(GoogleMapsContext);
  if (!contextValue) {
    throw new Error('PlaceModal must be used within a GoogleMapsProvider');
  }
  const { data: session } = useSession();
  const { fetchReviewsByCafeId, isReviewed, cafeReviews } =
    useContext(CafeContext);
  const { isLoaded } = contextValue;
  // console.log(lat, lng);
  const containerStyle = useMemo(() => {
    return {
      width: '100%',
      height: '100%',
    };
  }, []);
  const [ReviewFormOpen, setShowReviewFormOpen] = useState(false);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const handleOpenForm = () => {
    setShowReviewFormOpen(true);
  };
  const handleCloseForm = () => {
    setShowReviewFormOpen(false);
    setIsUserEditing(false);
  };
  useEffect(() => {
    if (place && place.place_id) {
      fetchReviewsByCafeId(place.place_id);
    }
  }, [place, fetchReviewsByCafeId]);
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
          className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all flex flex-col md:flex-row space-x-0  w-11/12 h-[45rem] md:w-[50rem] md:h-[30rem]  lg:w-[60rem] lg:h-[32rem]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline">
          <div className="w-full md:w-1/2 h-64 md:h-auto flex-shrink-0">
            {!isLoaded && <h1>Loading...</h1>}
            {isLoaded && !lat && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                mapContainerClassName="w-full h-full"
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
            {isLoaded && lat && lng && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                mapContainerClassName="w-full h-full"
                zoom={15}
                center={{
                  lat: lat,
                  lng: lng,
                }}>
                <Marker
                  position={{
                    lat: lat,
                    lng: lng,
                  }}
                  icon={{
                    url: '/images/cafe-icon.png',
                    scaledSize: new window.google.maps.Size(55, 55),
                  }}
                />
              </GoogleMap>
            )}
          </div>
          ​
          <div className="w-full md:w-1/2 p-[1.5rem] overflow-y-auto bg-[#F3F6F5]">
            <div className="flex justify-end items-center text-[1.7rem] text-primary-gray hover:text-primary-coral">
              <AiFillCloseCircle
                className="cursor-pointer"
                onClick={() => {
                  closeModal();
                  handleCloseForm();
                }}
              />
            </div>
            <div className="flex flex-col items-center">
              <div
                className="text-2xl leading-6 font-bold text-primary-gray font-inter my-[1rem]"
                id="modal-headline">
                {place?.name}
              </div>
              <div>
                <div className="mb-2">
                  {place?.rating && (
                    <div className="font-semibold font-inter text-base flex items-center mr-6">
                      <div className="mr-[0.3rem] text-primary-gray font-inter font-medium text-lg">
                        Rating: {place.rating}
                      </div>
                      <StarRating rating={place.rating} />
                    </div>
                  )}
                </div>
                {!opening_hours &&
                  place?.opening_hours &&
                  place.opening_hours.weekday_text && (
                    <div className="text-left">
                      <div className="font-medium text-lg text-primary-gray mb-2 font-inter ">
                        Opening Hours:
                      </div>
                      <ul className="list-disc list-inside space-y-2 text-primary-gray text-md font-inter">
                        {place.opening_hours.weekday_text.map((day, index) => (
                          <li key={index}>{day}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                {opening_hours && opening_hours.length > 0 && (
                  <div className="text-left">
                    <div className="font-medium text-lg text-primary-gray mb-2 font-inter ">
                      Opening Hours:
                    </div>
                    <ul className="list-disc list-inside space-y-2 text-primary-gray text-md font-inter">
                      {opening_hours.map((day, index) => (
                        <li key={index}>{day}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {opening_hours && opening_hours.length === 0 && (
                  <div>No opening hours provided</div>
                )}
              </div>
            </div>
            <div className="flex justify-end items-center my-[1rem]">
              {!ReviewFormOpen && (
                <button
                  onClick={handleOpenForm}
                  type="button"
                  className="inline-flex justify-center rounded-md px-4 py-2 bg-primary-coral text-base font-medium text-white font-inter hover:bg-primary-rose focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b9cbc6]">
                  Create Review
                </button>
              )}
              {ReviewFormOpen && (
                <div className="bg-white w-full h-[15rem] p-[1rem] rounded-lg">
                  <div
                    className="flex justify-end mb-4 text-xl font-bold"
                    onClick={handleCloseForm}>
                    <GrFormClose />
                  </div>
                  {!isReviewed() && <ReviewForm place={place} />}
                </div>
              )}
            </div>
            {cafeReviews.map((item, index) =>
              isUserEditing && item.user.id === session?.user?.id ? (
                <ReviewForm place={place} />
              ) : (
                <ReviewCard
                  review={item}
                  key={index}
                  setIsUserEditing={setIsUserEditing}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaceModal;
