interface ReviewProps {
  reviewId: string;
  content: string;
  createdAt: string; // or Date depending on how you handle dates in your frontend
  reviewerName: string; // This will come from the associated User model
}

const ReviewCard: React.FC<ReviewProps> = ({
  reviewId,
  content,
  createdAt,
  reviewerName,
}) => {
  return (
    <div className="p-4 border rounded shadow">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">{reviewerName}</h2>
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
      <p className="mt-2">{content}</p>
    </div>
  );
};

export default ReviewCard;
