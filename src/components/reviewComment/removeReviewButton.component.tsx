// src/components/reviewComment/deleteReviewButton.component.tsx
import React, { useState } from 'react';

interface DeleteReviewButtonProps {
  reviewId: string;
  onDelete: () => void; // Callback to notify parent component of a successful delete
}

const DeleteReviewButton: React.FC<DeleteReviewButtonProps> = ({
  reviewId,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteStatus('');

    try {
      // Replace '/api/reviews' with your API endpoint to delete a review
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteStatus('Review deleted successfully.');
        onDelete(); // Notify parent component of the deletion
      } else {
        setDeleteStatus('Failed to delete review. Please try again.');
      }
    } catch (error) {
      console.error('There was a problem deleting the review:', error);
      setDeleteStatus('An error occurred. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-500 hover:text-red-700">
        {isDeleting ? 'Deleting...' : 'Delete Review'}
      </button>
      {deleteStatus && (
        <div className="mt-2 text-sm text-red-500">{deleteStatus}</div>
      )}
    </div>
  );
};

export default DeleteReviewButton;
