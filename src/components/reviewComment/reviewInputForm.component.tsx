import { GrFormClose } from 'react-icons/gr';

interface ReviewFormProps {
  onSubmit: (data: { reviewerName: string; content: string }) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      reviewerName: { value: string };
      content: { value: string };
    };
    const data = {
      reviewerName: target.reviewerName.value,
      content: target.content.value,
    };
    onSubmit(data);
  };

  return (
    <div className="bg-white w-full h-[15rem] p-[1rem] rounded-lg">
      <div className="flex justify-end mb-3 text-xl text-primary-gray hover:text-primary-coral">
        <GrFormClose />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-3  justify-center">
        <input
          type="text"
          className="w-full rounded-lg h-[2.5rem]"
          placeholder="Your name"
          required
        />

        <textarea
          className="w-full rounded-lg h-[4rem]"
          placeholder="Review"
          required></textarea>
        <button
          type="submit"
          className="inline-flex justify-center  rounded-md w-[10rem] px-4 py-2 bg-primary-coral text-base font-medium text-white font-inter hover:bg-primary-rose focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b9cbc6]">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
