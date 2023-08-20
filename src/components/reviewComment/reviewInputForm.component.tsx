import React, { useState } from 'react';

interface ReviewFormProps {
  onSubmit: (data: { content: string }) => void;
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
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 text-primary-gray">
        <div className="flex jusify-start text-primary-gray text-base">
          User Name
        </div>
        <div className="flex flex-col justify-center items-center gap-3 justify-center">
          <textarea
            className="w-full rounded-lg h-[5rem]"
            placeholder="Your Review"
            required></textarea>
          <button
            type="submit"
            className="inline-flex justify-center  rounded-md w-[10rem] px-4 py-2 bg-primary-coral text-base font-medium text-white font-inter hover:bg-primary-rose focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b9cbc6]">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
