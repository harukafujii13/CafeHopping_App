import { prisma } from '@/lib/prisma';
import { useParams } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: any) {
  const queryUserId: string = context.params?.userId; //queryUserId doesn't return anything
  console.log(queryUserId);

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: 'e9fcf7fc-29b3-4c5d-9f39-c442f8cae7fe',
      },
      include: {
        user: true,
        cafe: true,
      },
    });

    console.log('bookmarks -->', bookmarks);

    const response = bookmarks;
    // const response = bookmarks.map((bookmark) => ({
    //   cafeName: bookmark.cafe.name,
    //   cafeId: bookmark.cafe.id,
    // }));

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

// import { prisma } from '@/lib/prisma';
// import { useParams } from 'next/navigation';
// import { NextRequest, NextResponse } from 'next/server';

// // export async function GET(req: NextRequest, res: NextResponse) {
// //   const queryUserId = req?.query.userId as string | undefined;

// export async function GET(request: NextRequest, response: NextResponse) {
//   console.log('hihihihihih', request.nextUrl.searchParams.get('userId'));
//   const queryUserId = request.nextUrl.searchParams.get('userId');
//   try {
//     const bookmarks = await prisma.bookmark.findMany({
//       //paramsが機能してない
//       //hardcoding データ返ってこない
//       where: {
//         userId: '9b6d3e23-a515-4ddd-81b8-ee123bf6c9f0',
//       },
//       include: {
//         cafe: true,
//         user: true,
//       },
//     });

//     console.log(bookmarks);

//     const response = bookmarks.map((bookmark) => ({
//       cafeName: bookmark.cafe.name,
//       cafeId: bookmark.cafe.id,
//     }));

//     return NextResponse.json({ bookmarks: response });
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
