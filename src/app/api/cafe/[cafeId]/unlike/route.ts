import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
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
  const { cafeId } = await req.json(); //make it unLike

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        cafeId: cafeId,
      },
    });

    await prisma.like.delete({
      where: {
        id: existingLike?.id,
      },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Like removed successfully',
    });
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
