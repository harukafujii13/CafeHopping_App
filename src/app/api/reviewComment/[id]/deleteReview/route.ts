// delete review

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(req: Request) {
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

  try {
    // Find and delete the review by its ID
    const deletedReview = await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Review deleted successfully',
    });
  } catch (error: any) {
    console.log({ error });
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message || 'Failed to delete review.',
      }),
      { status: 500 }
    );
  }
}