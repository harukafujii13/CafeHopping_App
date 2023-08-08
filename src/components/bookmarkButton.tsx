import React from 'react';
import { useSession } from 'next-auth/react';
import { BsFillBookmarkDashFill } from 'react-icons/bs';

interface BookmarkProps {
  placeId: string;
}

const BookmarkButton: React.FC<BookmarkProps> = ({ placeId }) => {
  const { data } = useSession();
  // console.log('usesession ===', data);

  async function handleBookmarkClick(cafeId: string) {
    const userId = 'replace-this-with-the-actual-user-id';
    const response = await fetch('/api/bookmark/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, cafeId }),
    });

    if (!response.ok) {
      // Error handling
      console.error('Failed to bookmark cafe');
    }
  }

  return (
    <div
      className="text-primary-gray text-[1.7rem]"
      onClick={() => handleBookmarkClick(placeId)}>
      <BsFillBookmarkDashFill />
    </div>
  );
};

export default BookmarkButton;
