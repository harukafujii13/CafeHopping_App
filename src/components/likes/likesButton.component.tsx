import React, { useContext } from 'react';
import { MdFavorite } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import { CafeContext } from '@/contexts/cafeContext';
import { Place } from '../cafeFinder/cafefinder.component';
import { BookMarkPlace } from '@/app/bookmark/bookmarkCafe';

export const LikesButton = ({ cafeId }: { cafeId: Place | BookMarkPlace }) => {
  const { data: session } = useSession();

  const {
    likesCount,
    fetchLikesCount,
    isLiked,
    isLikedByUser,
    removeFromLikes,
    likedCafes,
  } = useContext(CafeContext);

  const alreadyLiked = isLiked(cafeId.place_id);
  const alreadyLikedByUser = isLikedByUser(cafeId.place_id);
  const likeColor = alreadyLiked ? '#DE1A17' : '#6b7280';

  async function handleLikeClick() {
    if (!session) {
      console.log('User not authenticated');
      return;
    }

    const userId = session.user?.id;

    const apiEndpoint =
      alreadyLiked && alreadyLikedByUser
        ? `/api/cafe/${cafeId.place_id}/unlike`
        : `/api/cafe/${cafeId.place_id}/like`;

    const bodyData = {
      cafeId: cafeId.place_id,
      place: {
        name: cafeId.name,
        photos: cafeId.photos,
        rating: cafeId.rating,
        place_id: cafeId.place_id,
        geometry: cafeId.geometry,
        opening_hours: cafeId.opening_hours,
      },
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (!response) {
        throw new Error('Failed to modify liked');
      }

      const data = await response.json();
      if (data.message === 'Like removed successfully') {
        removeFromLikes(cafeId.place_id);
      } else {
        fetchLikesCount(cafeId.place_id);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <div
      className={`text-primary-gray text-[1.8rem] cursor-pointer flex gap-1 items-center justify-center`}
      style={{ color: likeColor }}
      onClick={handleLikeClick}>
      <MdFavorite />
      {likesCount[cafeId.place_id] > 0 && (
        <span className="text-[1.3rem] font-medium text-primary-gray">
          {likesCount[cafeId.place_id]}
        </span>
      )}
    </div>
  );
};
export default LikesButton;
