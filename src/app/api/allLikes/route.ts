import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: any) {
  try {
    const allLikes = await prisma.like.groupBy({
      by: ['cafeId'],
      _count: {
        cafeId: true,
      },
    });

    const likesCount = allLikes.map((group) => ({
      cafeId: group.cafeId,
      count: group._count.cafeId,
    }));

    return NextResponse.json(likesCount);
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

// import { prisma } from '@/lib/prisma';
// import { NextResponse } from 'next/server';

// export async function GET(req: Request, context: any) {
//   const cafeId: string = await context.params!.cafeId;

//   console.log(cafeId);
//   try {
//     const allLikes = await prisma.like.findMany();
//     return NextResponse.json({ count: allLikes });
//   } catch (error: any) {
//     return new NextResponse(
//       JSON.stringify({
//         status: 'error',
//         message: error.message,
//       }),
//       { status: 500 }
//     );
//   }
// }
