//update review

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: Request) {
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

  // Get the review ID from the request URL parameter
  const reviewId = req.url?.split('/').slice(-3)[0];

  // Get data from request body (i.e., the updated review content)
  const { content } = await req.json();

  try {
    // Find the review by its ID and update the content
    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        content,
      },
    });

    return NextResponse.json({
      review: {
        id: updatedReview.id,
        userId: updatedReview.userId,
        cafeId: updatedReview.cafeId,
        content: updatedReview.content,
      },
    });
  } catch (error: any) {
    console.log({ error });
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message || 'Failed to update review.',
      }),
      { status: 500 }
    );
  }
}
