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
          className="w-[1.2rem] h-[1.2rem]"
          src={'/images/full-star.png'}
          alt="star rating"
        />
      ))}
      {halfStar && (
        <img
          className="w-[1.2rem] h-[1.2rem]"
          src={'/images/half-star.png'}
          alt="star rating"
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <img
          className="w-[1.2rem] h-[1.2rem]"
          src={'/images/empty-star.png'}
          alt="star rating"
        />
      ))}
    </div>
  );
};

export default StarRating;
