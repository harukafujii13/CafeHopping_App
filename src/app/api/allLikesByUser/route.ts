import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, context: any) {
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
  try {
    const allLikesByUser = await prisma.like.findMany({
      where: {
        userId,
      },
    });
    return NextResponse.json(allLikesByUser);
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
