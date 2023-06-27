import { FC } from 'react';
import Modal from 'react';

interface PlaceModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  content: Place;
}

const PlaceModal: FC<PlaceModalProps> = ({
  isOpen,
  onRequestClose,
  content,
}) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={{
      overlay: { backgroundColor: 'grey' },
      content: { color: 'lightsteelblue' },
    }} // Add your own styles
    contentLabel="Place Details Modal">
    <h2>{content?.name}</h2>
    {content?.photos && content?.photos.length > 0 && (
      <img
        className="w-40 h-40 object-cover mb-2"
        src={content.photos[0].getUrl({ maxWidth: 200 })}
        alt={content.name}
      />
    )}
    {content?.rating && (
      <div className="flex items-center">
        <p className="mr-[0.3rem] font-normal">Rating: {content.rating}</p>
        <StarRating rating={content.rating} />
      </div>
    )}
    {content?.opening_hours && (
      <div>
        <h4>Opening Hours:</h4>
        <ul>
          {content.opening_hours.weekday_text.map((day, index) => (
            <li key={index}>{day}</li>
          ))}
        </ul>
      </div>
    )}
    <button onClick={onRequestClose}>Close</button>
  </Modal>
);

export default PlaceModal;
