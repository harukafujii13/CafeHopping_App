import React, { useContext } from 'react';
import { MdFavorite } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import { CafeContext } from '@/contexts/cafeContext';
import { Place } from '../cafeFinder/cafefinder.component';
import { BookMarkPlace } from '@/app/bookmark/bookmarkCafe';

export const LikesButton = ({ cafeId }: { cafeId: Place | BookMarkPlace }) => {
  const { data: session } = useSession();

  const { likesCount, fetchLikesCount, isLiked, removeFromLikes, likedCafes } =
    useContext(CafeContext);

  const alreadyLiked = isLiked(cafeId.place_id);
  // console.log('cafeId.place_id', cafeId.place_id);
  const likeColor = alreadyLiked ? '#DE1A17' : '#6b7280';

  async function handleLikeClick() {
    if (!session) {
      console.log('User not authenticated');
      return;
    }

    const userId = session;

    try {
      const apiEndpoint = alreadyLiked
        ? `/api/cafe/${cafeId.place_id}/unlike`
        : `/api/cafe/${cafeId.place_id}/like`;

      const body = alreadyLiked
        ? {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cafeId: getLikeId }),
          }
        : null;

      const response = await fetch(
        apiEndpoint,
        body || {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cafeId.place_id),
        }
      );
      if (!response) {
        throw new Error('Failed to modify liked');
      }

      const data = await response.json();
      if (data.message === 'Liked deleted successfully') {
        removeFromLikes(cafeId.place_id);
      } else {
        fetchLikesCount(cafeId.place_id);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  const getLikeId = (cafeId: string) => {
    const like = likedCafes.find((cafe) => cafe.cafeId === cafeId);
    return like?.id;
  };

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
