import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; content: string } }
) {
  // Get the review ID from the provided params
  const reviewId = params.id;

  // Get data from request body
  let content;
  try {
    const body = await req.json();
    content = body.content;
  } catch (error) {
    console.error('Failed to parse request body.', error);
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: 'Invalid request body.',
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
    });

    return NextResponse.json({
      success: true,
      review: {
        id: updatedReview.id,
        userId: updatedReview.userId,
        cafeId: updatedReview.cafeId,
        content: updatedReview.content,
      },
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
