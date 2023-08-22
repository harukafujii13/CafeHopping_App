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
  content?: string;
  userName?: string;
}

interface CafeContextProps {
  bookmarkedCafes: Cafe[];
  fetchBookmarks: () => void;
  removeFromBookmarks: (cafeId: string) => void;
  isBookmarked: (cafeId: string) => boolean;

  fetchAllLikes: (cafeId: string) => void;
  fetchAllLikesByUser: () => void;
  likedCafes: Cafe[];
  removeFromLikes: (cafeId: string) => void;
  fetchLikesCount: (cafeId: string) => void;
  isLiked: (cafeId: string) => boolean;
  isLikedByUser: (cafeId: string) => boolean;
  likesCount: { [cafeId: string]: number };

  userReviews: Cafe[];
  fetchReviewsByCafeId: (cafeId: string) => void;
  addReview: (cafeId: string, content: string) => void;
  updateReview: (reviewId: string, content: string) => void;
  deleteReview: (reviewId: string) => void;
  isReviewed: () => Cafe | undefined;
}

export const CafeContext = createContext<CafeContextProps>({
  bookmarkedCafes: [],
  fetchBookmarks: () => {},
  removeFromBookmarks: () => {},
  isBookmarked: () => false,

  fetchAllLikes: () => {},
  fetchAllLikesByUser: () => {},
  likedCafes: [],
  likesCount: {},
  fetchLikesCount: () => {},
  removeFromLikes: () => {},
  isLiked: () => false,
  isLikedByUser: () => false,

  isReviewed: () => undefined,
  userReviews: [],
  fetchReviewsByCafeId: () => {},
  addReview: () => {},
  updateReview: () => {},
  deleteReview: () => {},
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
  const [userReviews, setUserReviews] = useState<Cafe[]>([]);

  const { data: session } = useSession();

  //Fetch bookmark
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

  //Fetch Likes count
  const fetchLikesCount = useCallback(async (cafeId: string) => {
    try {
      const response = await fetch(`/api/cafe/${cafeId}/likes-count`);
      const data = await response.json();
      setLikesCount((prevCounts) => ({ ...prevCounts, [cafeId]: data.count }));
    } catch (error) {
      console.error('Error fetching the likes count:', error);
    }
  }, []);

  //Fetch all Likes
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

  //Fetch Likes by user
  const fetchAllLikesByUser = useCallback(async () => {
    try {
      const response = await fetch(`/api/allLikesByUser`);
      if (!response.ok) {
        throw new Error('Failed to fetch all likes by user');
      }
      const likesByUser = await response.json();
      setLikedCafes(likesByUser);
    } catch (error) {
      console.error('Error fetching the all Likes by user:', error);
    }
  }, [session]);

  //Fetch Reviews
  const fetchReviewsByCafeId = useCallback(
    async (cafeId: string) => {
      try {
        const response = await fetch(
          `/api/reviewComment/${cafeId}/allReviewsByCafeId`
        );
        if (!response.ok) {
          if (!response.ok) {
            throw new Error('Failed to fetch all reviews by cafeId');
          }
          const reviewsByCafeId = await response.json();
          setUserReviews(reviewsByCafeId);
        }
      } catch (error) {
        console.error('Error fetching the all reviews by cafeId:', error);
      }
    },
    [session]
  );

  useEffect(() => {
    // console.log(likedCafes);
  }, [likedCafes]);
  useEffect(() => {
    if (session) {
      fetchBookmarks();
      fetchAllLikes();
      fetchAllLikesByUser();
    }
  }, [
    session,
    fetchAllLikes,
    fetchBookmarks,
    fetchAllLikesByUser,
    fetchReviewsByCafeId,
  ]);

  //whenever the session object changes, effectively re-fetching the bookmarked cafes list
  //when the user logs in/out.

  //Remove bookmarks
  const removeFromBookmarks = (cafeId: string) => {
    setBookmarkedCafes((prevCafes) =>
      prevCafes.filter((cafe) => cafe.cafeId !== cafeId)
    );
  };

  //Remove Likes
  const removeFromLikes = (cafeId: string) => {
    const currentLikesCount = likesCount[cafeId];
    if (currentLikesCount === 1) {
      setLikesCount((prevCounts) => {
        const newCounts = { ...prevCounts };
        delete newCounts[cafeId];
        return newCounts;
      });
    } else {
      setLikesCount((prevCounts) => ({
        ...prevCounts,
        [cafeId]: currentLikesCount - 1,
      }));
    }
    // setLikedCafes((prevCafes) =>
    //   prevCafes.filter((cafe) => cafe.cafeId !== cafeId)
    // );
  };

  //Delete Reviews
  const deleteReview = async (id: string) => {
    try {
      const response = await fetch(`/api/reviewComment/${id}/deleteReview`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUserReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== id)
        );
      }
    } catch (error) {
      console.error('Error deleting the review:', error);
    }
  };

  //Reviews create
  const addReview = async (cafeId: string, content: string) => {
    try {
      const response = await fetch(`/api/allReviewsByCafeId/createReview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cafeId,
          content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUserReviews((prevReviews) => [...prevReviews, data.review]);
      }
    } catch (error) {
      console.error('Error adding the review:', error);
    }
  };

  //Reviews update
  const updateReview = async (id: string, content: string) => {
    try {
      const response = await fetch(`/api/reviewComment/${id}/updateReview`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUserReviews((prevReviews) =>
          prevReviews.map((review) => (review.id === id ? data.review : review))
        );
      }
    } catch (error) {
      console.error('Error updating the review:', error);
    }
  };

  //Bookmarked
  const isBookmarked = (cafeId: string) => {
    //some error
    return bookmarkedCafes.some((cafe) => cafe.cafeId === cafeId);
  };

  //Liked
  const isLiked = (cafeId: string) => {
    return likesCount[cafeId] > 0;
  };

  //Liked by user
  const isLikedByUser = (cafeId: string) => {
    return likedCafes.some((cafe) => cafe.cafeId === cafeId);
  };

  // Reviewed by user
  // const isReviewed = () => {
  //   const user = session?.user?.id;
  //   return userReviews.find((cafe) => cafe.userId === user);
  // };

  const isReviewed = (cafeId: string) => {
    const user = session?.user?.id;
    return userReviews.find(
      (cafe) => cafe.userId === user && cafe.cafeId === cafeId
    );
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
        fetchAllLikesByUser,
        removeFromLikes,
        isLiked,
        isLikedByUser,

        userReviews,
        fetchReviewsByCafeId,
        addReview,
        updateReview,
        isReviewed,
        deleteReview,
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
