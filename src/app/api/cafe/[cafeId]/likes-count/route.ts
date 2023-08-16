import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: any) {
  const cafeId: string = await context.params!.cafeId;
  try {
    const likesCount = await prisma.like.count({
      where: { cafeId },
    });

    return NextResponse.json({ count: likesCount });
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

// Allow the user to get the total number of likes that a specific cafe has received.
// handle requests to /api/cafe/1/likes-count, /api/cafe/2/likes-count, etc.,
//where 1 and 2 are examples of cafeIds.
