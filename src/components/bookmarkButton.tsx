import React from 'react';
import { useSession } from 'next-auth/react';
import { BsFillBookmarkDashFill } from 'react-icons/bs';
import { Place } from '@/components/cafefinder.component';

const BookmarkButton: React.FC<{ place: Place }> = ({ place }) => {
  const { data } = useSession();

  async function handleBookmarkClick() {
    const userId = 'replace-this-with-the-actual-user-id';

    const photosArray = place.photos?.map((photo) => photo.getUrl());

    const response = await fetch('/api/bookmark/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...place, photosArray }),
    });

    if (!response.ok) {
      // Error handling
      console.error('Failed to bookmark cafe');
    }
  }

  return (
    <div
      className="text-primary-gray text-[1.7rem]"
      onClick={handleBookmarkClick}>
      <BsFillBookmarkDashFill />
    </div>
  );
};

export default BookmarkButton;
