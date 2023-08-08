import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

interface Bookmark {
  userId: string;
  cafeId: string;
}

export async function POST(req: Request) {
  const {
    user: { id: userId },
  } = await getServerSession(authOptions);

  try {
    const { cafeId } = (await req.json()) as Bookmark;

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        cafeId,
      },
    });

    return NextResponse.json({
      bookmark: {
        userId: bookmark.userId,
        cafeId: bookmark.cafeId,
      },
    });
  } catch (error: any) {
    console.log({ error });
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
