// src/components/reviewComment/createReviewForm.component.tsx
import React, { useState } from 'react';

interface CreateReviewFormProps {
  cafeId: string;
}

const CreateReviewForm: React.FC<CreateReviewFormProps> = ({ cafeId }) => {
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    const review = {
      cafeId,
      username,
      rating,
      comment,
    };

    try {
      // Replace '/api/reviews' with your API endpoint to create a review
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });

      if (response.ok) {
        setSubmitStatus('Review submitted successfully!');
        setUsername('');
        setRating(5);
        setComment('');
      } else {
        setSubmitStatus('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('There was a problem submitting the review:', error);
      setSubmitStatus('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium">
          Your Name
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 p-2 w-full border rounded"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="rating"
          className="block text-sm font-medium">
          Rating
        </label>
        <input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 p-2 w-full border rounded"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="comment"
          className="block text-sm font-medium">
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 p-2 w-full border rounded"
          rows={4}
        />
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="py-2 px-4 bg-primary-coral text-white rounded"
          disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>

      {submitStatus && (
        <div className="mt-4 text-sm text-primary-coral">{submitStatus}</div>
      )}
    </form>
  );
};

export default CreateReviewForm;
