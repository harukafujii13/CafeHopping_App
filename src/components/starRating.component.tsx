import React from 'react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? true : false;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex gap-[2px]">
      {[...Array(fullStars)].map((_, i) => (
        <p className="text-primary-yellow w-[1rem] h-auto">
          <BsStarFill />
        </p>
      ))}
      {halfStar && (
        <p className="text-primary-yellow">
          <BsStarHalf />
        </p>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <p className="text-primary-yellow">
          <BsStar />
        </p>
      ))}
    </div>
  );
};

export default StarRating;

//keys in React should be unique among their siblings,
//they don't have to be globally unique in the entire application.
//The key helps React identify which items have changed, are added,
//or are removed, and should be stable and not change over time.
