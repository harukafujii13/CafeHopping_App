import React, { useState, useEffect } from 'react';
import { Place } from '@/components/cafeFinder/cafefinder.component';

const PlacePhoto = ({ place }: { place: Place }) => {
  const [photoUrl, setPhotoUrl] = useState('/images/woody-bg.jpg');

  useEffect(() => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    service.findPlaceFromQuery(
      {
        query: place.name,
        fields: ['photos'],
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          if (results && results[0] && results[0].photos) {
            const url = results[0].photos[0].getUrl({
              maxWidth: 400,
              maxHeight: 400,
            });
            setPhotoUrl(url);
          }
        }
      }
    );
  }, [place.name]);

  return (
    <img
      className="w-full h-48 object-cover"
      src={photoUrl}
      alt={place.name}
    />
  );
};

export default PlacePhoto;
