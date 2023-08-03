import { prisma } from '@/lib/prisma';
import { useParams } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context) {
  const queryUserId: string = context.params?.userId;
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: queryUserId,
      },
      include: {
        cafe: true,
        user: true,
      },
    });

    console.log(bookmarks);

    const response = bookmarks.map((bookmark) => ({
      cafeName: bookmark.cafe.name,
      cafeId: bookmark.cafe.id,
    }));

    return NextResponse.json({ bookmarks: response });
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
