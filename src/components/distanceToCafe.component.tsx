import React from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface DistanceToCafeProps {
  currentLocation: Location;
  cafeLocation: Location;
}

const DistanceToCafe: React.FC<DistanceToCafeProps> = ({
  currentLocation,
  cafeLocation,
}) => {
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(2);
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  // Extract latitude and longitude from the cafe's location object.
  const cafeLat = cafeLocation.lat;
  const cafeLng = cafeLocation.lng;

  return (
    <p className="font-bold text-x">
      Distance:{' '}
      {calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        cafeLat,
        cafeLng
      )}{' '}
      km
    </p>
  );
};

export default DistanceToCafe;
