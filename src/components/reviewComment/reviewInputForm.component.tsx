'use client';
import React, { useState, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { Place } from '@/components/cafeFinder/cafefinder.component';
import { BookMarkPlace } from '@/app/bookmark/bookmarkCafe';
import { CafeContext } from '@/contexts/cafeContext';

const ReviewInputForm = ({
  place,
  setShowReviewFormOpen,
}: {
  place: Place | BookMarkPlace | null;
  setShowReviewFormOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: session } = useSession();
  // console.log('/////data', data);
  const [review, setReview] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { isReviewed, fetchReviewsByCafeId, addReview, updateReview } =
    useContext(CafeContext);

  // Check if cafe is already reviewed
  const alreadyReviewed = isReviewed();
  // console.log('/////alreadyReviewed', alreadyReviewed);

  async function handleReviewSubmit() {
    if (!session) {
      console.log('User not authenticated');
      return;
    }

    if (!review) {
      setErrorMessage("Review can't be empty!");
      // console.log(review);
      return;
    }

    setErrorMessage('');

    // Check if cafe has already been reviewed, then update, else add
    if (alreadyReviewed) {
      updateReview(place!.place_id, review);
    } else {
      addReview(place!.place_id, review);
    }

    if (setShowReviewFormOpen) {
      setShowReviewFormOpen(false);
    }
  }
  return (
    <div className="flex flex-col text-primary-gray gap-3 items-center justify-center">
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
      {errorMessage && (
        <p className="text-sm font-medium text-[#DE1A17]">{errorMessage}</p>
      )}
    </div>
  );
};
export default ReviewInputForm;
