import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

  const {
    place: { name, photos, rating, place_id: cafeId, geometry, opening_hours },
  } = await req.json();

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        cafeId: cafeId,
      },
    });

    if (existingLike) {
      return NextResponse.json({
        status: 'warning',
        message: 'You have already liked this cafe.',
      });
    }

    let cafe = await prisma.cafe.findUnique({
      where: {
        id: cafeId,
      },
    });

    // If cafe doesn't exist in the Prisma database, create it using data from Google Maps
    if (!cafe) {
      cafe = await prisma.cafe.create({
        data: {
          id: cafeId,
          name,
          rating,
          place_id: cafeId,
          photos,
          lat: geometry.location.lat,
          lng: geometry.location.lng,
          opening_hours: opening_hours.weekday_text,
        },
      });
    }

    console.log(cafe);

    //create Like
    const like = await prisma.like.create({
      data: {
        userId,
        cafeId,
      },
    });
    return NextResponse.json(like);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
