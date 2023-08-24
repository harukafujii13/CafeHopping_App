import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; content: string } }
) {
  // Get user ID from session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Get the review ID from the provided params
  const reviewId = params.id;

  const { content } = await req.json();

  if (!content) {
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: 'Content does not exist in request body.',
      }),
      { status: 400 }
    );
  }
  try {
    // Check if review exists and belongs to the current user
    const existingReview = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });
    if (!existingReview || existingReview.userId !== userId) {
      return NextResponse.json({
        status: 'error',
        message:
          'Review not found or you are not authorized to update this review.',
      });
    }
    // Update the review
    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        content,
      },
      include: {
        user: true,
      },
    });
    return NextResponse.json({
      success: true,
      review: updatedReview,
    });
  } catch (error: any) {
    console.error('Failed to update review.', error);
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message || 'Failed to update review.',
      }),
      { status: 500 }
    );
  }
}
