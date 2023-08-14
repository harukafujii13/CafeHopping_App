'use client';
//to keep track of bookmarked cafes

import { createContext, useState, ReactNode, useEffect } from 'react';

interface Cafe {
  id: string;
}

interface Place {
  place_id: string;
}

interface CafeContextProps {
  bookmarkedCafes: Cafe[];
  addToBookmarks: (place: Place) => void;
  removeFromBookmarks: (cafeId: string) => void;
  isBookmarked: (cafeId: string) => boolean;
}

export const CafeContext = createContext<CafeContextProps>({
  bookmarkedCafes: [],
  addToBookmarks: () => {},
  removeFromBookmarks: () => {},
  isBookmarked: () => false,
});

interface CafeProviderProps {
  children: ReactNode;
}

export const CafeProvider: React.FC<CafeProviderProps> = ({ children }) => {
  const [bookmarkedCafes, setBookmarkedCafes] = useState<Cafe[]>([]);

  ///useEffect

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('/api/bookmark/create');
        const data = await response.json();
        setBookmarkedCafes(data);
      } catch (error) {
        console.error('Error fetching the bookmarked cafes:', error);
      }
    };

    fetchBookmarks();
  }, []);

  const addToBookmarks = (place: Place) => {
    const cafe: Cafe = {
      id: place.place_id,
    };

    setBookmarkedCafes((prevCafes) => {
      if (prevCafes.some((c) => c.id === cafe.id)) {
        return prevCafes;
      }
      return [...prevCafes, cafe];
    });
  };

  const removeFromBookmarks = (cafeId: string) => {
    setBookmarkedCafes((prevCafes) =>
      prevCafes.filter((cafe) => cafe.id !== cafeId)
    );
  };

  const isBookmarked = (cafeId: string) => {
    //fetch all bookmarks
    //save to variable

    return bookmarkedCafes.some((cafe) => cafe.id === cafeId);
  };

  return (
    <CafeContext.Provider
      value={{
        bookmarkedCafes,
        addToBookmarks,
        removeFromBookmarks,
        isBookmarked,
      }}>
      {children}
    </CafeContext.Provider>
  );
};
