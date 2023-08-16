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

  fetchAllLikes: (cafeId: string) => void;

  likedCafes: Cafe[];
  removeFromLikes: (cafeId: string) => void;
  fetchLikesCount: (cafeId: string) => void;
  isLiked: (cafeId: string) => boolean;
  likesCount: { [cafeId: string]: number };
}

export const CafeContext = createContext<CafeContextProps>({
  bookmarkedCafes: [],
  fetchBookmarks: () => {},
  removeFromBookmarks: () => {},
  isBookmarked: () => false,

  fetchAllLikes: () => {},

  likedCafes: [],
  likesCount: {},
  fetchLikesCount: () => {},
  removeFromLikes: () => {},
  isLiked: () => false,
});

interface CafeProviderProps {
  children: ReactNode;
}

export const CafeProvider: React.FC<CafeProviderProps> = ({ children }) => {
  const [bookmarkedCafes, setBookmarkedCafes] = useState<Cafe[]>([]);
  const [likedCafes, setLikedCafes] = useState<Cafe[]>([]);

  const [likesCount, setLikesCount] = useState<{ [cafeId: string]: number }>(
    {}
  );

  const { data: session } = useSession();

  //bookmark
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

  //likes

  // const fetchLikesCount = async (cafeId: string) => {
  //   try {
  //     const response = await fetch(`/api/cafe/${cafeId}/likes-count`);
  //     const data = await response.json();
  //     setLikesCount((prevCounts) => ({ ...prevCounts, [cafeId]: data.count }));
  //   } catch (error) {
  //     console.error('Error fetching the likes count:', error);
  //   }
  // };

  const fetchLikesCount = useCallback(async (cafeId: string) => {
    try {
      const response = await fetch(`/api/cafe/${cafeId}/likes-count`);
      const data = await response.json();
      setLikesCount((prevCounts) => ({ ...prevCounts, [cafeId]: data.count }));
    } catch (error) {
      console.error('Error fetching the likes count:', error);
    }
  }, []);

  //ALL likes
  const fetchAllLikes = useCallback(async () => {
    try {
      const response = await fetch(`/api/allLikes`);

      if (!response.ok) {
        throw new Error('Failed to fetch all likes');
      }

      const likes = await response.json();

      const newLikesCount: { [cafeId: string]: number } = {};
      likes.forEach((like: { cafeId: string; count: number }) => {
        newLikesCount[like.cafeId] = like.count;
      });

      setLikesCount(newLikesCount);
    } catch (error) {
      console.error('Error fetching the all Likes:', error);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
    fetchAllLikes();
  }, [session, fetchAllLikes, fetchBookmarks]);
  //whenever the session object changes, effectively re-fetching the bookmarked cafes list
  //when the user logs in/out.

  const removeFromBookmarks = (cafeId: string) => {
    setBookmarkedCafes((prevCafes) =>
      prevCafes.filter((cafe) => cafe.cafeId !== cafeId)
    );
  };

  const removeFromLikes = (cafeId: string) => {
    setLikedCafes((prevCafes) =>
      prevCafes.filter((cafe) => cafe.cafeId !== cafeId)
    );
  };

  const isBookmarked = (cafeId: string) => {
    return bookmarkedCafes.some((cafe) => cafe.cafeId === cafeId);
  };

  const isLiked = (cafeId: string) => {
    return likedCafes.some((cafe) => cafe.cafeId === cafeId);
  };

  return (
    <CafeContext.Provider
      value={{
        bookmarkedCafes,
        removeFromBookmarks,
        isBookmarked,
        fetchBookmarks,
        likedCafes,
        likesCount,
        fetchLikesCount,
        fetchAllLikes,
        removeFromLikes,
        isLiked,
      }}>
      {children}
    </CafeContext.Provider>
  );
};

export default CafeProvider;

//bookmarkedCafes: An array of Cafe objects representing the cafes that the user has bookmarked.
//fetchBookmarks: A function that fetches the user’s current bookmarks.
//removeFromBookmarks: A function that removes a cafe from the user's bookmarks.
//isBookmarked: A function that checks whether a cafe is bookmarked or not.

//useCallback
//It sends an API request to fetch the bookmarked cafes for the logged-in user
//and sets them in the bookmarkedCafes state. It depends on the session object,
//so it will be re-created whenever the session changes.
