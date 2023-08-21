import React, { useState, useContext } from 'react';
import { GrFormClose } from 'react-icons/gr';
import { CafeContext } from '@/contexts/cafeContext';
import ReviewForm from '../../components/reviewComment/reviewInputForm.component';

interface ReviewProps {
  reviewId: string;
  content: string;
  createdAt: string;
  reviewerName: string;
  userName: string;
  cafeId: string; // ID from the Prisma schema
}

const ReviewCard: React.FC<ReviewProps> = ({ review }) => {
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const { isReviewed, fetchReviewsByCafeId, deleteReview } =
    useContext(CafeContext);

  // Check if the cafe has already been reviewed by the user
  const alreadyReviewed = isReviewed(cafeId);

  const handleOpenForm = () => {
    setReviewFormOpen(true);
  };

  const handleCloseForm = () => {
    setReviewFormOpen(false);
  };

  const handleRemove = async () => {
    if (!alreadyReviewed) {
      console.error("Review doesn't exist");
      return;
    }

    try {
      const response = await fetch('/api/reviewComment/[id]/deleteReview', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      const data = await response.json();

      if (data.message === 'Review deleted successfully') {
        deleteReview(cafeId);
      } else {
        console.error('Unexpected response:', data);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="p-4 border rounded shadow text-primary-gray font-inter">
        <div className="flex  justify-between">
          <div className="text-xl font-bold">{reviewerName}</div>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <p className="mt-2">{content}</p>
      </div>

      {reviewFormOpen && (
        <div className="bg-white w-full h-[15rem] p-[1rem] rounded-lg">
          <div
            className="flex justify-end mb-3 text-xl font-bold"
            onClick={handleCloseForm}>
            <GrFormClose />
          </div>
          <ReviewForm
            placeId={placeId}
            initialReview={content}
          />
        </div>
      )}

      <div>
        {userName === reviewerName ? (
          <>
            <button
              type="button"
              className="inline-flex justify-center rounded-md w-[10rem] px-4 py-2 bg-primary-coral text-base font-medium text-white font-inter hover:bg-primary-rose focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b9cbc6]"
              onClick={handleOpenForm}>
              Edit
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md w-[10rem] px-4 py-2 bg-primary-coral text-base font-medium text-white font-inter hover:bg-primary-rose focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b9cbc6]"
              onClick={handleRemove}>
              Remove
            </button>
          </>
        ) : null}
      </div>
    </>
  );
};

export default ReviewCard;
