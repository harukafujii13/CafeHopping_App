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

  const body = await req.json();

  console.log('------body-----', body);
  const { cafeId } = body;
  console.log('------cafeId', cafeId);

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_cafeId: {
          userId: userId,
          cafeId: cafeId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({
        status: 'warning',
        message: 'You have already liked this cafe.',
      });
    }

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
