import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, context: any) {
  const queryUserId: string = await context.params!.userId;

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: queryUserId,
      },
      include: {
        user: true,
        cafe: true,
      },
    });
    return NextResponse.json({ bookmarks });
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
