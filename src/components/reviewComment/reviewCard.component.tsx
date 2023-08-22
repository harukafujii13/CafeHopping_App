import React, { useState, useContext, Dispatch } from 'react';
import { useSession } from 'next-auth/react';
import { GrFormClose } from 'react-icons/gr';
import { CafeContext } from '@/contexts/cafeContext';
import ReviewForm from '../../components/reviewComment/reviewInputForm.component';
import { User } from '@prisma/client';
interface ReviewProps {
  review: {
    id: string;
    content: string;
    createdAt: string;
    userId: string;
    cafeId: string; // ID from the Prisma schema
    user: User;
  };
  setIsUserEditing: Dispatch<React.SetStateAction<boolean>>;
}
const ReviewCard: React.FC<ReviewProps> = ({ review, setIsUserEditing }) => {
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const { isReviewed, fetchReviewsByCafeId, deleteReview } =
    useContext(CafeContext);
  const { data: session } = useSession();
  // Check if the cafe has already been reviewed by the user
  const alreadyReviewed = isReviewed();

  const handleOpenForm = () => {
    // setReviewFormOpen(true);
    setIsUserEditing(true);
  };
  const handleCloseForm = () => {
    // setReviewFormOpen(false);
    setIsUserEditing(false);
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
        body: JSON.stringify({ reviewId: review.id }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete review');
      }
      const data = await response.json();
      if (data.message === 'Review deleted successfully') {
        deleteReview(review.cafeId);
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
          <div className="text-xl font-bold">{review.user.name}</div>
          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="mt-2">{review.content}</p>
      </div>
      ​
      {/* {reviewFormOpen && (
        <div className="bg-white w-full h-[15rem] p-[1rem] rounded-lg">
          <div
            className="flex justify-end mb-3 text-xl font-bold"
            onClick={handleCloseForm}>
            <GrFormClose />
          </div>
          <ReviewForm
            placeId={placeId}
            initialReview={review.content}
          />
        </div>
      )} */}
      ​
      <div>
        {review.user.id === session?.user?.id ? (
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
