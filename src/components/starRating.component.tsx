import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

interface StarRatingProps {
  rating: number;
}

const StarRating: FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? true : false;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex ">
      {[...Array(fullStars)].map((_, i) => (
        <FontAwesomeIcon
          className="text-primary-yellow w-[1rem] h-[1rem]"
          key={`full-${i}`}
          icon={faStar}
        />
      ))}
      {halfStar && (
        <FontAwesomeIcon
          icon={faStarHalfAlt}
          className="text-primary-yellow w-[1.2rem] h-[1.2rem]"
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <img
          className="w-[1.2rem] h-[1.2rem]"
          src={'/images/star.png'}
          alt="star rating"
        />
      ))}
    </div>
  );
};

export default StarRating;
