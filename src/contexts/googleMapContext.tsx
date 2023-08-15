'use client';
import { createContext, useContext, useState } from 'react';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
interface GoogleMapsContextType {
  isLoaded: boolean;
}
export const GoogleMapsContext = createContext<
  GoogleMapsContextType | undefined
>(undefined);
export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};
interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider = ({ children }: GoogleMapsProviderProps) => {
  const [libraries] = useState<Libraries>(['places', 'geometry']);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries: libraries,
    language: 'en',
  });
  // console.log('Provider : ', isLoaded);
  return (
    <GoogleMapsContext.Provider value={{ isLoaded }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
