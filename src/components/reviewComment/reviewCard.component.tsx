import React, { useState } from 'react';
import EditReviewButton from './editReviewForm';
import EditReviewForm from './removeReviewButton.component';

interface ReviewProps {
  review: ReviewType;
  onDelete: () => void;
  onUpdate: (newText: string) => void;
}

const Review: React.FC<ReviewProps> = ({ review, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);

  const handleSave = (newText: string) => {
    onUpdate(newText);
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

  return (
    <div>
      {isEditing ? (
        <EditReviewForm
          initialText={review.text}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <p>{review.text}</p>
          <div className="flex">
            <EditReviewButton onEdit={handleEdit} />
            {/* ... other buttons, like the delete button ... */}
          </div>
        </>
      )}
    </div>
  );
};

export default Review;
