import { prisma } from '@/lib/prisma';
import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
export async function GET(req: Request, context: any) {
  const cafeId: string = await context.params!.id;
  if (!cafeId) {
    return new NextResponse(
      JSON.stringify({
        message: 'cafeId must be provided',
      }),
      { status: 400 }
    );
  }
  try {
    const allReviewsByCafe = await prisma.review.findMany({
      where: {
        cafeId,
      },
      include: {
        user: true,
      },
    });
    return NextResponse.json({
      status: 'success',
      allReviewsByCafe,
    });
  } catch (error: any) {
    console.log({ error });
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message || 'Failed to fetch reviews.',
      }),
      { status: 500 }
    );
  }
}
