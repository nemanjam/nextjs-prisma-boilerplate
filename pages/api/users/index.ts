import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import prisma from 'lib/prisma';

/**
 * POST /api/users
 * Required fields in body: name, username, email, password
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { method, body } = req;

  switch (method) {
    case 'GET':
      const users = await prisma.user.findMany();
      res.status(200).json({ users });

      break;
    case 'POST':
      try {
        const { name, username, email, password: _password } = body;

        // todo: validate...

        const _user = await prisma.user.findFirst({
          where: { email },
        });

        if (_user)
          throw new Error(`The user with email: ${email} already exists.`);

        const password = await hash(_password, 10);

        const user = await prisma.user.create({
          data: {
            name,
            username,
            email,
            password,
          },
        });

        res.status(201).json({ user });
      } catch (error) {
        res.status(500).json({ error });
      }

      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
