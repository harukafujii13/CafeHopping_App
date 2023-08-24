'use client';
import { useEffect, useState, useContext } from 'react';
import { useSession } from 'next-auth/react';
import PlaceModal from '@/components/modal/placeModal.component';
import BookmarkButton from '@/components/bookmark/bookmarkButton';
import StarRating from '@/components/rating/starRating.component';
import { CafeContext } from '@/contexts/cafeContext';
import LikesButton from '@/components/likes/likesButton.component';

interface Location {
  lat: number;
  lng: number;
}

interface LocationWithFunction {
  lat: () => number;
  lng: () => number;
}

interface Place {
  lng?: any;
  lat?: any;
  geometry: {
    location: Location & Pick<LocationWithFunction, 'lat' | 'lng'>;
  };
  id: string;
  name: string;
  photos?: string;
  rating?: number;
  place_id: string;
  opening_hours?: { weekday_text: string[] };
}

export interface BookMarkPlace extends Place {}

interface CafeDetails {
  id: string;
  cafe: Place;
}

const BookmarkPage = () => {
  const session = useSession();
  const [bookmarkedCafes, setBookmarkedCafes] = useState<CafeDetails[] | null>(
    null
  ); //stores an array of bookmarked cafes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const { bookmarkedCafes: bookmarkedCafesState } = useContext(CafeContext);

  useEffect(() => {
    async function fetchBookmarkedCafes() {
      const userId = session.data?.user?.id;
      const response = await fetch(`api/bookmark/${userId}`);
      const data = await response.json();
      setBookmarkedCafes(data.bookmarks);
    }
    fetchBookmarkedCafes();
  }, [session, bookmarkedCafesState]);
  //re-run whenever session or bookmarkedCafesState changes.

  const handleMoreInfo = ({ cafe }: CafeDetails) => {
    // console.log('handleMoreInfo called with:', cafe);
    setSelectedPlace({ ...cafe, lat: cafe.lat, lng: cafe.lng });
    setIsModalOpen(true);
    // console.log(selectedPlace);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  return (
    <div className="flex justify-center bg-light-green">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[2rem] mt-[2rem] mx-[2.5rem] text-primary-gray pb-[3rem]">
        {bookmarkedCafes?.map((bookmarkedCafe) => (
          <div
            key={bookmarkedCafe.cafe.id}
            className="bg-white shadow-md max-w-sm">
            <img
              className="w-full h-48 object-cover"
              src={bookmarkedCafe.cafe.photos}
              alt={bookmarkedCafe.cafe.name}
            />
            ​
            <div className="p-4">
              <h3 className="font-bold text-xl font-inter">
                {bookmarkedCafe.cafe.name}
              </h3>
              <div className="flex flex-col xl:flex-row py-2">
                {bookmarkedCafe.cafe.rating && (
                  <div className="font-semibold font-inter text-base flex items-center mr-6">
                    <p className="mr-[0.3rem]">{bookmarkedCafe.cafe.rating}</p>
                    <StarRating rating={bookmarkedCafe.cafe.rating} />
                  </div>
                )}
              </div>
              <div className="flex flex-row gap-3 items-center">
                <BookmarkButton place={bookmarkedCafe.cafe} />
                <LikesButton cafeId={bookmarkedCafe.cafe} />​
                <button
                  onClick={() => handleMoreInfo(bookmarkedCafe)}
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
          </div>
        ))}
      </div>
      <PlaceModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        place={selectedPlace}
        lat={selectedPlace?.lat}
        lng={selectedPlace?.lng}
        // opening_hours={selectedPlace?.opening_hours?.weekday_text}
        opening_hours={selectedPlace?.opening_hours as unknown as string[]}
      />
    </div>
  );
};
export default BookmarkPage;
