import React, { useCallback, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { BsFillBookmarkDashFill } from 'react-icons/bs';
import { Place } from '@/components/cafeFinder/cafefinder.component';
import { BookMarkPlace } from '@/app/bookmark/bookmarkCafe';
import { CafeContext } from '@/contexts/cafeContext';

const BookmarkButton = ({ place }: { place: Place | BookMarkPlace }) => {
  const { data: session } = useSession();

  const { isBookmarked, fetchBookmarks, removeFromBookmarks, bookmarkedCafes } =
    useContext(CafeContext);

  //Check if cafe is already bookmarked
  const alreadyBookmarked = isBookmarked(place.place_id);

  const bookmarkColor = alreadyBookmarked ? '#004346' : '#6b7280';

  async function handleBookmarkClick() {
    if (!session) {
      console.log('User not authenticated');
      //show a toast later
      return;
    }

    const userId = session;
    // Send request to backend
    try {
      const apiEndpoint = alreadyBookmarked
        ? '/api/bookmark/delete'
        : '/api/bookmark/create';

      const body = alreadyBookmarked
        ? {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookmarkId: getBookmarkId(place.place_id) }),
          }
        : null;
      const response = await fetch(
        apiEndpoint,
        body || {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, place }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to modify bookmark');
      }
      const data = await response.json();
      if (data.message === 'Bookmark deleted successfully') {
        //remove from context
        removeFromBookmarks(place.place_id);
      } else {
        fetchBookmarks();
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  const getBookmarkId = (placeId: string) => {
    const bookmark = bookmarkedCafes.find((cafe) => cafe.cafeId === placeId);
    return bookmark?.id;
  };
  return (
    <div
      className="text-primary-gray text-[1.7rem] cursor-pointer"
      onClick={handleBookmarkClick}>
      <BsFillBookmarkDashFill style={{ color: bookmarkColor }} />
    </div>
  );
};

export default BookmarkButton;
