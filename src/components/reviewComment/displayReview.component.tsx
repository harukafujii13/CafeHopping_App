// src/components/reviewComment/review.component.tsx
import React, { useState, useEffect } from 'react';

interface ReviewProps {
  cafeId: string;
}

interface ReviewData {
  username: string;
  rating: number;
  comment: string;
}

const DisplayReview: React.FC<ReviewProps> = ({ cafeId }) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Replace '/api/reviews' with your API endpoint
    fetch(`/api/reviews/${cafeId}`)
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
        setIsLoading(false);
      });
  }, [cafeId]);

  if (isLoading) {
    return <p>Loading reviews...</p>;
  }

  if (reviews.length === 0) {
    return <p>No reviews yet for this cafe.</p>;
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Reviews:</h2>
      <ul>
        {reviews.map((review, index) => (
          <li
            key={index}
            className="mb-4">
            <p className="font-semibold">{review.username}</p>
            <p className="text-gray-600">Rating: {review.rating}</p>
            <p>{review.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayReview;
