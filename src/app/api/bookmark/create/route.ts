import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface Bookmark {
  userId: string;
  cafeId: string;
  name: string;
  photos: string;
  rating: number;
  place_id: string;
  lat: number;
  lng: number;
  opening_hours: string[];
}

export async function POST(req: Request) {
  // Get user ID from session
  let userId;
  try {
    const session = await getServerSession(authOptions);
    if (session && session.user) {
      userId = session.user.id;
    } else {
      throw new Error('Session or user not found.');
    }
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message || 'Failed to retrieve session.',
      }),
      { status: 500 }
    );
  }
  // Get data from request body
  const {
    place: { name, photos, rating, place_id: cafeId, geometry, opening_hours },
  } = await req.json();

  // const serializedOpeningHours = JSON.stringify(opening_hours.weekday_text);
  // const serializedOpeningHours = JSON.stringify(opening_hours.weekday_text);

  console.log(geometry);
  console.log(opening_hours);

  try {
    // Check if the cafe exists in Prisma database
    let cafe = await prisma.cafe.findUnique({
      where: {
        id: cafeId,
      },
    });

    // If cafe doesn't exist in the Prisma database, create it using data from Google Maps
    if (!cafe) {
      const existingBookmark = await prisma.cafe.create({
        data: {
          id: cafeId,
          name,
          rating, //doesn't show desimal number
          place_id: cafeId,
          photos,
          lat: geometry.location.lat,
          lng: geometry.location.lng,
          opening_hours: opening_hours.weekday_text,
        },
      });
    }

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        id: cafeId,
      },
    });
    if (existingBookmark) {
      return NextResponse.json({
        status: 'warning',
        message: 'You have already bookmarked this cafe.',
      });
    }

    // Create the bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        cafeId,
      },
    });

    return NextResponse.json({
      bookmark: {
        userId: bookmark.userId,
        cafeId: bookmark.cafeId,
      },
    });
  } catch (error: any) {
    console.log({ error });
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
