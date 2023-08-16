import React, { useContext } from 'react';
import { MdFavorite } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import { CafeContext } from '@/contexts/cafeContext';
import { Place } from '../cafeFinder/cafefinder.component';
import { BookMarkPlace } from '@/app/bookmark/bookmarkCafe';

export const LikesButton = ({ cafeId }: { cafeId: Place | BookMarkPlace }) => {
  const { data: session } = useSession();
  // console.log(cafeId);

  const { likesCount, fetchLikesCount } = useContext(CafeContext);

  const isLiked =
    likesCount[cafeId.place_id] && likesCount[cafeId.place_id] > 0;
  console.log('cafeId.place_id', cafeId.place_id); //undifined

  const handleLikeClick = async () => {
    console.log({ isLiked, likesCount });
    if (!session) {
      console.log('User not authenticated');
      // Show a toast later
      return;
    }

    const { user } = session;

    const apiEndpoint = isLiked
      ? `/api/cafe/${cafeId}/unlike`
      : `/api/cafe/${cafeId}/like`;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cafeId }),
      });
      console.log('response', response);

      if (!response.ok) {
        throw new Error('Failed to modify like');
      }

      // Re-fetch the updated like count for this cafe from the server
      fetchLikesCount(cafeId.place_id);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const likeColor = isLiked ? '#DE1A17' : '#6b7280';

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
