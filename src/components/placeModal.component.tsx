import React, { FC } from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  place: Place | null;
}

const PlaceModal: FC<ModalProps> = ({ isOpen, closeModal, place }) => {
  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${
        isOpen ? '' : 'hidden'
      }`}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full text-primary-gray"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start  justify-center">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-2xl leading-6 font-bold text-primary-gray flex justify-center text-primary-green"
                  id="modal-headline">
                  {place?.name}
                </h3>
                <div className="mt-2">
                  {place?.opening_hours && (
                    <div>
                      <h4 className="font-bold text-base text-primary-yellow">
                        Opening Hours:
                      </h4>
                      <ul>
                        {place.opening_hours.weekday_text.map((day, index) => (
                          <li key={index}>{day}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-coral text-x font-bold text-white hover:bg-primary-rose focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#95b1a8] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceModal;
