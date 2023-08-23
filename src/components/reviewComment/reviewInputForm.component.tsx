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
  // console.log('/////data', data);
  const [review, setReview] = useState('');
  const { isReviewed, fetchReviewsByCafeId, addReview } =
    useContext(CafeContext);

  // Check if cafe is already reviewed
  const alreadyReviewed = isReviewed();
  // const alreadyReviewed = place?.place_id
  //   ? isReviewed(place.place_id)
  //   : undefined;

  // console.log('/////alreadyReviewed', alreadyReviewed);
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
      body: JSON.stringify({ userId, place: { ...place, content: review } }),
    };
    // console.log(body);

    try {
      const response = await fetch(apiEndpoint, body);
      if (!response.ok) {
        throw new Error('Failed to submit review'); //error
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
    <div className="flex flex-col text-primary-gray gap-4 items-center justify-center">
      <textarea
        className="rounded-lg text-sm w-full h-[6rem]"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review here..."
      />
      <button
        onClick={handleReviewSubmit}
        className="inline-flex justify-center rounded-md px-4 py-2 bg-primary-coral text-base font-medium text-white font-inter hover:bg-primary-rose focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b9cbc6]">
        {alreadyReviewed ? 'Update Review' : 'Submit Review'}
      </button>
    </div>
  );
};
export default ReviewInputForm;
