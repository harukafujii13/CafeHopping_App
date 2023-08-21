import React, { useState, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { Place } from '@/components/cafeFinder/cafefinder.component';
import { BookMarkPlace } from '@/app/bookmark/bookmarkCafe';
import { CafeContext } from '@/contexts/cafeContext';

const ReviewInputForm = ({
  place,
}: {
  place: Place | BookMarkPlace | null;
}) => {
  const { data: session } = useSession();
  const [review, setReview] = useState('');

  const { isReviewed, fetchReviewsByCafeId, userReviews, addReview } =
    useContext(CafeContext);

  // Check if cafe is already reviewed
  const alreadyReviewed = isReviewed();

  async function handleReviewSubmit() {
    if (!session) {
      console.log('User not authenticated');
      return;
    }

    const userId = session.user?.id;

    const apiEndpoint = alreadyReviewed
      ? `/api/reviewComment/${alreadyReviewed.id}/updateReview`
      : '/api/reviewComment/createReview';

    const body = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, place, review }),
    };

    try {
      const response = await fetch(apiEndpoint, body);
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      const data = await response.json();
      if (
        data.message === 'Review updated successfully' ||
        data.message === 'Review created successfully'
      ) {
        fetchReviewsByCafeId(place!.place_id); // Fetch reviews by cafe ID after updating or creating
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  return (
    <div>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review here..."
      />
      <button onClick={handleReviewSubmit}>
        {alreadyReviewed ? 'Update Review' : 'Submit Review'}
      </button>
    </div>
  );
};

export default ReviewInputForm;
