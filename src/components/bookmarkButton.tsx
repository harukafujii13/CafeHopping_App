import React from 'react';
import { useSession } from 'next-auth/react';
import { BsFillBookmarkDashFill } from 'react-icons/bs';
import { Place } from '@/components/cafefinder.component';

const BookmarkButton: React.FC<{ place: Place }> = ({ place }) => {
  const { data: session } = useSession();

  async function handleBookmarkClick() {
    if (!session) {
      console.log('User not authenticated');
      //show a toast later
      return;
    }

    const userId = session;

    // const photosArray = place.photos?.map((photo) => photo.getUrl());

    const response = await fetch('/api/bookmark/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...place }),
    });

    if (!response.ok) {
      // Error handling
      console.error('Failed to bookmark cafe');
    } else {
      //show a toast
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
