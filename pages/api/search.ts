import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from './prisma-client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const query = req.query.query as string;

    const searches = await prisma.search.findMany({
      where: {
        query,
      },
      orderBy: [
        {
          hits: 'desc',
        },
      ],
      include: {
        Emoji: true,
      },
    });

    return res.status(200).json(searches.map(({ Emoji }) => Emoji));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'server error' });
  }
}
