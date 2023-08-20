//fetch a list of all reviews

import { prisma } from '@/lib/prisma';
import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cafeId = req.query.cafeId as string;

  // Ensure cafeId is provided
  if (!cafeId) {
    return res.status(400).json({ message: 'cafeId must be provided' });
  }

  try {
    const allReviewsByCafe = await prisma.review.findMany({
      where: {
        cafeId,
      },
    });

    return res.status(200).json(allReviewsByCafe);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}
