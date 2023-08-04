// http://localhost:3000/api/bookmark/[userId]

'use client';

import { useState, useEffect } from 'react';

function Bookmarks({ userId }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(`/api/bookmark/${userId}`);
        const data = await response.json();
        setBookmarks(data.bookmarks);
        console.log(data.bookmarks);
      } catch (error) {
        console.error('There was an error fetching the bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the async function
    fetchBookmarks();
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Bookmarks for User {userId}</h1>
      <ul>
        {bookmarks.map((bookmark, index) => (
          <li key={index}>
            {bookmark.cafeName} (ID: {bookmark.cafeId})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bookmarks;
