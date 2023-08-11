'use client';

import { createContext, useContext, useEffect } from 'react';

interface GoogleMapsContextType {
  isLoaded: boolean;
  // add more values here if needed, e.g., error state
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

import { useJsApiLoader } from '@react-google-maps/api';

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider = ({ children }: GoogleMapsProviderProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries: ['places', 'geometry'], // adjust as necessary
    language: 'en',
  });

  console.log('Provider : ', isLoaded);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
