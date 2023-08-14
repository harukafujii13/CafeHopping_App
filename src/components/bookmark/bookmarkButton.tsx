import React, { useContext } from 'react';
import { useSession } from 'next-auth/react';
import { BsFillBookmarkDashFill } from 'react-icons/bs';
import { Place } from '@/components/cafeFinder/cafefinder.component';
import { CafeContext } from '@/contexts/cafeContext';

const BookmarkButton: React.FC<{ place: Place }> = ({ place }) => {
  const { data: session } = useSession();

  const { isBookmarked, addToBookmarks, removeFromBookmarks } =
    useContext(CafeContext);

  const bookmarkColor = isBookmarked(place.place_id) ? '#F6BD60' : '#6b7280';

  async function handleBookmarkClick() {
    if (!session) {
      console.log('User not authenticated');
      //show a toast later
      return;
    }

    //Check if cafe is already bookmarked
    const alreadyBookmarked = isBookmarked(place.place_id);

    if (alreadyBookmarked) {
      removeFromBookmarks(place.place_id);
    } else {
      addToBookmarks(place);
    }

    const userId = session;

    // Send request to backend

    try {
      const apiEndpoint = alreadyBookmarked
        ? '//api/bookmark/delete'
        : '/api/bookmark/create';
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user?.id,
          place: {
            ...place,
            photos: place.photos![0].getUrl(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to modify bookmark');
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }
  return (
    <div
      className="text-primary-gray text-[1.7rem]"
      onClick={handleBookmarkClick}>
      <BsFillBookmarkDashFill style={{ color: bookmarkColor }} />
    </div>
  );
};
export default BookmarkButton;
