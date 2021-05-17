import { PrismaClient } from '.prisma/client';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = new PrismaClient();

  try {
    const query = req.query.query as string;

    const searches = await prisma.search.findMany({
      where: {
        query,
      },
      orderBy: {
        count: 'desc',
      },
      include: {
        Emoji: true,
      },
    });

    res.status(200).json(searches.map(({ Emoji }) => Emoji));
  } catch (error) {
    console.error(error);
    res.status(500);
  } finally {
    await prisma.$disconnect();
  }
}
