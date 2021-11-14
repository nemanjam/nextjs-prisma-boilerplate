import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';

/**
 * POST /api/user/create
 * Required fields in body: name, email, password
 */

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const prisma = new PrismaClient({ log: ['query'] });

  try {
    const { name, email, password } = req.body;

    // todo: validate...

    const _user = await prisma.user.findFirst({
      where: { email },
    });

    if (_user) throw new Error(`The user with email: ${email} already exists.`);

    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    res.status(201);
    res.json({ user });
  } catch (error) {
    res.status(500);
    res.json({ error });
  } finally {
    await prisma.$disconnect();
  }
}
