'use client';
//to keep track of bookmarked cafes
import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@prisma/client';
import { Place } from '@/components/cafeFinder/cafefinder.component';

interface Cafe {
  id: string;
  cafe: Place;
  cafeId?: string;
  user: User;
  userId: string;
}

interface CafeContextProps {
  bookmarkedCafes: Cafe[];
  fetchBookmarks: () => void;
  removeFromBookmarks: (cafeId: string) => void;
  isBookmarked: (cafeId: string) => boolean;
}

export const CafeContext = createContext<CafeContextProps>({
  bookmarkedCafes: [],
  fetchBookmarks: () => {},
  removeFromBookmarks: () => {},
  isBookmarked: () => false,
});

interface CafeProviderProps {
  children: ReactNode;
}

export const CafeProvider: React.FC<CafeProviderProps> = ({ children }) => {
  const [bookmarkedCafes, setBookmarkedCafes] = useState<Cafe[]>([]);
  const { data: session } = useSession();

  const fetchBookmarks = useCallback(async () => {
    try {
      const user = session?.user?.id;
      const response = await fetch(`/api/bookmark/${user}`);
      const data = await response.json();
      setBookmarkedCafes(data.bookmarks);
    } catch (error) {
      console.error('Error fetching the bookmarked cafes:', error);
    }
  }, [session]);

  useEffect(() => {
    fetchBookmarks();
  }, [session]);
  //whenever the session object changes, effectively re-fetching the bookmarked cafes list
  //when the user logs in/out.

  const removeFromBookmarks = (cafeId: string) => {
    setBookmarkedCafes((prevCafes) =>
      prevCafes.filter((cafe) => cafe.cafeId !== cafeId)
    );
  };

  const isBookmarked = (cafeId: string) => {
    return bookmarkedCafes.some((cafe) => cafe.cafeId === cafeId);
  };

  return (
    <CafeContext.Provider
      value={{
        bookmarkedCafes,
        removeFromBookmarks,
        isBookmarked,
        fetchBookmarks,
      }}>
      {children}
    </CafeContext.Provider>
  );
};

//bookmarkedCafes: An array of Cafe objects representing the cafes that the user has bookmarked.
//fetchBookmarks: A function that fetches the user’s current bookmarks.
//removeFromBookmarks: A function that removes a cafe from the user's bookmarks.
//isBookmarked: A function that checks whether a cafe is bookmarked or not.

//useCallback
//It sends an API request to fetch the bookmarked cafes for the logged-in user
//and sets them in the bookmarkedCafes state. It depends on the session object,
//so it will be re-created whenever the session changes.
