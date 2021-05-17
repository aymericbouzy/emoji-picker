import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from './prisma-client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      choice: { character, unicodeName },
      queries,
    } = req.body;

    await prisma.emoji.upsert({
      where: {
        character,
      },
      update: {
        unicodeName,
      },
      create: {
        character,
        unicodeName,
      },
    });

    await Promise.all(
      queries.map((query) =>
        prisma.search.upsert({
          where: {
            query_choice: {
              query,
              choice: character,
            },
          },
          create: {
            query,
            choice: character,
            hits: 1,
          },
          update: {
            hits: {
              increment: 1,
            },
          },
        }),
      ),
    );

    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'server error' });
  }
}
