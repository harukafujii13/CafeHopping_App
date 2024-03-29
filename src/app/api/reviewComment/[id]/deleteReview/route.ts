// delete review

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = params.id;
    // Find and delete the review by its ID
    await prisma.review.delete({
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
