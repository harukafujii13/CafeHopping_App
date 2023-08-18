// src/components/reviewComment/EditReviewForm.tsx
import React, { useState } from 'react';

interface EditReviewFormProps {
  initialText: string;
  onSave: (newText: string) => void;
  onCancel: () => void;
}

const EditReviewForm: React.FC<EditReviewFormProps> = ({
  initialText,
  onSave,
  onCancel,
}) => {
  const [text, setText] = useState(initialText);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(text);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="mr-2">
          Cancel
        </button>
        <button
          type="submit"
          className="text-white bg-blue-500 hover:bg-blue-700 p-2 rounded">
          Save
        </button>
      </div>
    </form>
  );
};

export default EditReviewForm;
