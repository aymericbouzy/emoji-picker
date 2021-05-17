import { PrismaClient } from '@prisma/client';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = new PrismaClient();

  try {
    const {
      choice: { character, unicodeName },
      queryStrings,
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
      queryStrings.map((query) =>
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
            count: 1,
          },
          update: {
            count: {
              increment: 1,
            },
          },
        }),
      ),
    );

    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500);
  } finally {
    await prisma.$disconnect();
  }
}
