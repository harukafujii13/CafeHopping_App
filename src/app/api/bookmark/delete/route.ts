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

  const { cafeId } = await req.json();

  try {
    await prisma.bookmark.delete({
      where: {
        userId_cafeId: {
          userId: userId,
          cafeId: cafeId,
        },
      },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Bookmark deleted successfully',
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
