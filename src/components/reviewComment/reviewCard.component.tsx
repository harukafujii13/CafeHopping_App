import React, { useState, useContext, Dispatch } from 'react';
import { useSession } from 'next-auth/react';
import { CafeContext } from '@/contexts/cafeContext';
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
  const { isReviewed, fetchReviewsByCafeId, deleteReview } =
    useContext(CafeContext);
  const { data: session } = useSession();

  // Check if the cafe has already been reviewed by the user
  const alreadyReviewed = isReviewed();

  const handleOpenForm = () => {
    setIsUserEditing(true);
  };

  const handleCloseForm = () => {
    setIsUserEditing(false);
  };

  async function handleRemove() {
    if (!session) {
      console.log('User not authenticated');
      return;
    }

    if (!alreadyReviewed) {
      console.error("Review doesn't exist");
      return;
    }

    deleteReview(review.id);
  }
  return (
    <>
      <div className="p-4 border rounded-lg shadow text-primary-gray font-inter flex flex-col gap-2 mb-2 bg-[#F3F6F5]">
        <div className="flex  justify-between items-center">
          <div className="text-base font-normal">{review.user.name}</div>
          <span className="text-base font-normal">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-center">
          <p className="text-base font-normal">{review.content}</p>
        </div>

        <div>
          {review.user.id === session?.user?.id ? (
            <div className="flex flex-row justify-center gap-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md w-[5rem] px-1 py-1 bg-primary-coral text-base font-medium text-white font-inter hover:bg-primary-rose focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b9cbc6]"
                onClick={handleOpenForm}>
                Edit
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md w-[5rem] px-1 py-1 bg-primary-coral text-base font-medium text-white font-inter hover:bg-primary-rose focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b9cbc6]"
                onClick={handleRemove}>
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
export default ReviewCard;
