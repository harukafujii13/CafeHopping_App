//create a review
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface Review {
  userId: string;
  cafeId: string;
  content: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export async function POST(req: Request) {
  // Get user ID from session
  let userId;

  try {
    const session = await getServerSession(authOptions);
    if (session && session.user) {
      userId = session.user.id;
      // console.log('///////userId', userId);
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
  const { cafeId, content } = await req.json();

  try {
    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_cafeId: {
          userId: userId,
          cafeId: cafeId,
        },
      },
    });
    if (existingReview) {
      return NextResponse.json({
        status: 'warning',
        message: 'You have already reviewed this cafe.',
      });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId,
        cafeId,
        content,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({ review });
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
