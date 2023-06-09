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
        <img
          key={`fullStar-${i}`}
          className="w-[1.2rem] h-[1.2rem]"
          src={'/images/full-star.png'}
          alt="star rating"
        />
      ))}
      {halfStar && (
        <img
          key="halfStar"
          className="w-[1.2rem] h-[1.2rem]"
          src={'/images/half-star.png'}
          alt="star rating"
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <img
          key={`emptyStar-${i}`}
          className="w-[1.2rem] h-[1.2rem]"
          src={'/images/empty-star.png'}
          alt="star rating"
        />
      ))}
    </div>
  );
};

export default StarRating;

//keys in React should be unique among their siblings,
//they don't have to be globally unique in the entire application.
//The key helps React identify which items have changed, are added,
//or are removed, and should be stable and not change over time.
