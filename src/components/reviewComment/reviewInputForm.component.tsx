import React, { useState, useContext, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Place } from '@/components/cafeFinder/cafefinder.component';
import { BookMarkPlace } from '@/app/bookmark/bookmarkCafe';
import { CafeContext, CafeReview } from '@/contexts/cafeContext';
const ReviewInputForm = ({
  place,
  editingReview,
  setIsUserEditing,
  setShowReviewFormOpen,
}: {
  place: Place | BookMarkPlace | null;
  editingReview?: CafeReview;
  setIsUserEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowReviewFormOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: session } = useSession();
  const [review, setReview] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { isReviewed, addReview, updateReview } = useContext(CafeContext);

  const alreadyReviewed = isReviewed();

  useEffect(() => {
    async function fetchPreviousReview() {
      if (place) {
        setIsLoading(true);
        try {
          if (editingReview) {
            setReview(editingReview.content);
          }
        } catch (error) {
          console.error('Failed to fetch the review:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchPreviousReview();
  }, [place]);

  async function handleReviewSubmit() {
    if (!session) {
      console.log('User not authenticated');
      return;
    }
    if (!review) {
      setErrorMessage("Review can't be empty!");
      return;
    }
    setErrorMessage('');
    if (alreadyReviewed) {
      updateReview(editingReview!.id, review);
      setIsUserEditing && setIsUserEditing(false);
    } else {
      addReview(place!.place_id, review);
    }
    if (setShowReviewFormOpen) {
      setShowReviewFormOpen(false);
    }
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col text-primary-gray  items-center justify-center font-inter">
      <textarea
        className="rounded-lg text-sm w-full h-[6rem]"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review here..."
      />
      ​
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
